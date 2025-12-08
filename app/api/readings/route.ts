import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';
import { fromLocalISODate, toLocalISODate } from '@/lib/date';

/**
 * API Route: /api/readings
 * Fetches daily Mass readings from USCCB with server-side caching
 *
 * Query params:
 * - date: YYYY-MM-DD (defaults to today)
 * - lang: 'en' | 'es' (defaults to 'en')
 *
 * Cache Strategy (USCCB-friendly):
 * - First request for a date+lang: fetch from USCCB, store in Redis
 * - All subsequent requests: served from Redis cache
 * - TTL: 7 days (readings for a date never change)
 * - Result: Only 1 request to USCCB per day per language
 */

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

// URL patterns for each language
const USCCB_URLS = {
  en: 'https://bible.usccb.org/bible/readings',
  es: 'https://bible.usccb.org/es/bible/lecturas',
};

// Note: Using Node.js runtime (not Edge) because redis client uses TCP
export const runtime = 'nodejs';

// Lazy-initialize Redis client
let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedis() {
  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (err: Error) => console.error('Redis Client Error', err));
    await redisClient.connect();
  }
  return redisClient;
}

function formatUSCCBDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}${day}${year}`;
}

interface CachedReadings {
  readings: any[];
  liturgicalColor: string;
  season: string;
  cachedAt: number;
  language: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateParam = searchParams.get('date');
  const lang = (searchParams.get('lang') || 'en') as 'en' | 'es';

  const date = fromLocalISODate(dateParam);
  const isoDate = toLocalISODate(date);
  const cacheKey = `readings:${lang}:${isoDate}`;

  try {
    const redis = await getRedis();

    // 1. Check cache first
    const cachedStr = await redis.get(cacheKey);

    if (cachedStr) {
      // Cache hit - return immediately
      const cached: CachedReadings = JSON.parse(cachedStr);
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
          'X-Cache': 'HIT',
        },
      });
    }

    // 2. Cache miss - fetch from USCCB
    const usccbDate = formatUSCCBDate(date);
    const baseUrl = USCCB_URLS[lang];
    const url = `${baseUrl}/${usccbDate}.cfm`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SanctusApp/1.0 (Catholic Prayer App; polite-caching)',
      },
    });

    if (!response.ok) {
      throw new Error(`USCCB returned ${response.status}`);
    }

    const html = await response.text();
    const parsed = parseUSCCBHTML(html, lang);

    if (!parsed.readings.length) {
      throw new Error('Parsed zero readings from USCCB');
    }

    // 3. Store in cache
    const dataToCache: CachedReadings = {
      ...parsed,
      cachedAt: Date.now(),
      language: lang,
    };

    await redis.setEx(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(dataToCache));

    return NextResponse.json(dataToCache, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Error fetching readings:', error);

    // Return fallback (don't cache failures)
    const fallbackContent = lang === 'es'
      ? 'El Señor es mi pastor; nada me falta. En verdes praderas me hace descansar; junto a aguas tranquilas me conduce; me restaura el alma.'
      : 'The Lord is my shepherd; there is nothing I shall want. In green pastures he makes me lie down; to still waters he leads me; he restores my soul.';

    const fallbackLabel = lang === 'es' ? 'Salmo Responsorial' : 'Responsorial Psalm';
    const fallbackSeason = lang === 'es' ? 'Tiempo Ordinario' : 'Ordinary Time';

    return NextResponse.json(
      {
        readings: [
          {
            date: isoDate,
            citation: 'Salmo 23:1-6',
            label: fallbackLabel,
            content: fallbackContent,
            type: 'psalm',
          },
        ],
        liturgicalColor: 'green',
        season: fallbackSeason,
        language: lang,
        error: 'Failed to fetch readings',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300', // Short cache for errors
          'X-Cache': 'ERROR',
        },
      }
    );
  }
}

/**
 * Parse USCCB HTML structure
 */
function parseUSCCBHTML(html: string, lang: 'en' | 'es') {
  const readings: any[] = [];

  const blockRegex = /<div class="innerblock">\s*<div class="content-header">([\s\S]*?)<\/div>\s*<div class="content-body">([\s\S]*?)<\/div>/gi;
  const blocks = Array.from(html.matchAll(blockRegex));

  blocks.forEach((match) => {
    const header = match[1];
    const body = match[2];

    const labelMatch = header.match(/<h3 class="name">\s*(.*?)\s*<\/h3>/i);
    const rawLabel = labelMatch ? labelMatch[1].trim() : '';

    const citationMatch = header.match(/<div class="address">[\s\S]*?<a[^>]*>(.*?)<\/a>/i);
    const citation = citationMatch ? citationMatch[1].trim() : '';

    const content = cleanHTML(body);

    if (!content) return;

    const label = normalizeLabel(rawLabel, lang);
    readings.push({
      citation: citation || rawLabel,
      label,
      content,
      type: mapLabelToType(rawLabel, lang),
    });
  });

  const titleMatch = html.match(/<div class="wr-block b-lectionary[\s\S]*?<h2>([\s\S]*?)<\/h2>/i);
  const title = titleMatch ? cleanHTML(titleMatch[1]) : '';

  const liturgicalColor = determineLiturgicalColor(title, lang);

  return {
    readings,
    liturgicalColor,
    season: title || (lang === 'es' ? 'Tiempo Ordinario' : 'Ordinary Time'),
  };
}

function determineLiturgicalColor(title: string, lang: 'en' | 'es'): string {
  const lower = title.toLowerCase();

  // White: Christmas, Easter, feasts of Mary, etc.
  const whiteKeywords = lang === 'es'
    ? ['navidad', 'pascua', 'maría', 'inmaculada', 'asunción', 'natividad', 'epifanía', 'ascensión', 'corpus christi', 'sagrado corazón']
    : ['christmas', 'easter', 'mary', 'immaculate', 'assumption', 'nativity', 'epiphany', 'ascension', 'corpus christi', 'sacred heart'];

  if (whiteKeywords.some(kw => lower.includes(kw))) {
    return 'white';
  }

  // Red: Pentecost, Palm Sunday, martyrs
  const redKeywords = lang === 'es'
    ? ['pentecostés', 'domingo de ramos', 'viernes santo', 'pasión', 'mártir']
    : ['pentecost', 'palm sunday', 'good friday', 'passion', 'martyr'];

  if (redKeywords.some(kw => lower.includes(kw))) {
    return 'red';
  }

  // Violet: Advent, Lent
  const violetKeywords = lang === 'es'
    ? ['adviento', 'cuaresma']
    : ['advent', 'lent'];

  if (violetKeywords.some(kw => lower.includes(kw))) {
    return 'violet';
  }

  // Rose: Gaudete, Laetare
  if (lower.includes('gaudete') || lower.includes('laetare')) {
    return 'rose';
  }

  return 'green';
}

function cleanHTML(str: string): string {
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeLabel(label: string, lang: 'en' | 'es'): string {
  const lower = label.toLowerCase();

  if (lang === 'es') {
    if (lower.includes('salmo')) return 'Salmo Responsorial';
    if (lower.includes('evangelio')) return 'Evangelio';
    if (lower.includes('aleluya')) return 'Aleluya';
    if (lower.includes('segunda') || lower.includes('lectura 2')) return 'Segunda Lectura';
    if (lower.includes('primera') || lower.includes('lectura 1')) return 'Primera Lectura';
    return label.trim() || 'Lectura';
  }

  // English
  if (lower.includes('psalm')) return 'Responsorial Psalm';
  if (lower.includes('gospel')) return 'Gospel';
  if (lower.includes('alleluia')) return 'Alleluia';
  if (lower.includes('second') || lower.includes('reading 2')) return 'Second Reading';
  if (lower.includes('reading 1')) return 'First Reading';
  return label.trim() || 'Reading';
}

function mapLabelToType(label: string, lang: 'en' | 'es'): 'first' | 'psalm' | 'second' | 'gospel' | 'alleluia' {
  const lower = label.toLowerCase();

  if (lang === 'es') {
    if (lower.includes('salmo')) return 'psalm';
    if (lower.includes('evangelio')) return 'gospel';
    if (lower.includes('aleluya')) return 'alleluia';
    if (lower.includes('segunda') || lower.includes('lectura 2')) return 'second';
    return 'first';
  }

  // English
  if (lower.includes('psalm')) return 'psalm';
  if (lower.includes('gospel')) return 'gospel';
  if (lower.includes('alleluia')) return 'alleluia';
  if (lower.includes('second') || lower.includes('reading 2')) return 'second';
  return 'first';
}
