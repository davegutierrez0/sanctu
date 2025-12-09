import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';
import { gzipSync, gunzipSync } from 'zlib';
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
 * - TTL: 30 days (readings for a date never change)
 * - Result: Only 1 request to USCCB per day per language
 */

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const NON_CACHED_LIMIT_PER_USER = 7;
const NON_CACHED_WINDOW_SECONDS = 60 * 60 * 24; // per-day limit

// URL patterns for each language
const USCCB_URLS = {
  en: 'https://bible.usccb.org/bible/readings',
  es: 'https://bible.usccb.org/es/bible/lecturas',
};

type ReadingType = 'first' | 'psalm' | 'second' | 'gospel' | 'alleluia';

interface Reading {
  citation: string;
  label: string;
  content: string;
  type: ReadingType;
}

// Note: Using Node.js runtime (not Edge) because redis client uses TCP
export const runtime = 'nodejs';

// Lazy-initialize Redis client
let redisClient: ReturnType<typeof createClient> | null = null;
const inMemoryMissTracker = new Map<string, { count: number; resetAt: number }>();

function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ip = forwardedFor.split(',')[0]?.trim();
    if (ip) return ip;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  // Next.js exposes request.ip when available (may be undefined in dev)
  if ((request as { ip?: string }).ip) {
    return (request as { ip?: string }).ip as string;
  }

  return 'anonymous';
}

async function trackNonCachedMiss(
  request: NextRequest,
  lang: 'en' | 'es',
  redis: ReturnType<typeof createClient> | null
): Promise<{ count: number }> {
  const clientId = getClientIdentifier(request);
  const windowKey = `readings:misses:${clientId}:${lang}:${toLocalISODate()}`;

  if (redis) {
    const count = await redis.incr(windowKey);
    if (count === 1) {
      await redis.expire(windowKey, NON_CACHED_WINDOW_SECONDS);
    }
    return { count };
  }

  const now = Date.now();
  const existing = inMemoryMissTracker.get(windowKey);

  if (!existing || existing.resetAt <= now) {
    inMemoryMissTracker.set(windowKey, { count: 1, resetAt: now + NON_CACHED_WINDOW_SECONDS * 1000 });
    return { count: 1 };
  }

  const updatedCount = existing.count + 1;
  inMemoryMissTracker.set(windowKey, { count: updatedCount, resetAt: existing.resetAt });
  return { count: updatedCount };
}

async function getRedis() {
  if (!process.env.REDIS_URL) return null;

  if (!redisClient) {
    try {
      redisClient = createClient({ url: process.env.REDIS_URL });
      redisClient.on('error', (err: Error) => console.error('Redis Client Error', err));
      await redisClient.connect();
    } catch (err) {
      console.error('Redis connection failed, continuing without cache:', err);
      redisClient = null;
    }
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
  readings: Reading[];
  liturgicalColor: string;
  season: string;
  cachedAt: number;
  language: string;
}

function compressPayload(payload: CachedReadings): string {
  try {
    return gzipSync(JSON.stringify(payload)).toString('base64');
  } catch (err) {
    console.error('Failed to compress payload; storing uncompressed', err);
    return JSON.stringify(payload);
  }
}

function decompressPayload(serialized: string): CachedReadings {
  try {
    const buffer = Buffer.from(serialized, 'base64');
    const json = gunzipSync(buffer).toString();
    return JSON.parse(json) as CachedReadings;
  } catch {
    // Fallback for legacy uncompressed entries
    return JSON.parse(serialized) as CachedReadings;
  }
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

    // 1. Check cache first (if redis available)
    if (redis) {
      const cachedStr = await redis.get(cacheKey);

      if (cachedStr) {
        // Cache hit - return immediately
        const cached: CachedReadings = decompressPayload(cachedStr);
        return NextResponse.json(cached, {
          headers: {
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
            'X-Cache': 'HIT',
          },
        });
      }
    }

    // 2. Cache miss - fetch from USCCB
    const { count } = await trackNonCachedMiss(request, lang, redis);
    if (count > NON_CACHED_LIMIT_PER_USER) {
      return NextResponse.json(
        {
          error: 'Rate limit reached for uncached readings. Please try a cached day or come back tomorrow.',
        },
        {
          status: 429,
          headers: {
            'Cache-Control': 'no-store',
            'X-Cache': 'RATE_LIMIT',
          },
        }
      );
    }

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

    if (redis) {
      await redis.setEx(cacheKey, CACHE_TTL_SECONDS, compressPayload(dataToCache));
    }

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
  const readings: Reading[] = [];

  const blockRegex = /<div class="innerblock">\s*<div class="content-header">([\s\S]*?)<\/div>\s*<div class="content-body">([\s\S]*?)<\/div>/gi;
  const blocks = Array.from(html.matchAll(blockRegex));

  blocks.forEach((match) => {
    const header = match[1];
    const body = match[2];

    const labelMatch = header.match(/<h3 class="name">\s*(.*?)\s*<\/h3>/i);
    const rawLabel = labelMatch ? labelMatch[1].trim() : '';

    const citationMatch = header.match(/<div class="address">[\s\S]*?<a[^>]*>(.*?)<\/a>/i);
    const rawCitation = citationMatch ? citationMatch[1].trim() : '';

    const content = cleanHTML(body);

    if (!content) return;

    const label = normalizeLabel(rawLabel, lang);
    // Clean the citation as well to remove HTML entities and unwanted characters
    const citation = cleanHTML(rawCitation || rawLabel)
      .replace(/^[>"'""\s>]+/, '')  // Remove leading quotes and >
      .replace(/[>"'""\s>]+$/, '')  // Remove trailing quotes and >
      .trim();

    readings.push({
      citation: citation || label,
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
  const withBreaks = str
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/p\s*>/gi, '\n\n')
    .replace(/<\/div\s*>/gi, '\n')
    .replace(/<\/h\d\s*>/gi, '\n');

  return withBreaks
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function normalizeLabel(label: string, lang: 'en' | 'es'): string {
  const lower = label.toLowerCase();

  if (lang === 'es') {
    if (lower.includes('salmo')) return 'Salmo Responsorial';
    if (lower.includes('aleluya') || lower.includes('aclamacion') || lower.includes('aclamación')) {
      return 'Aleluya';
    }
    if (lower.includes('evangelio')) return 'Evangelio';
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

function mapLabelToType(label: string, lang: 'en' | 'es'): ReadingType {
  const lower = label.toLowerCase();

  if (lang === 'es') {
    if (lower.includes('salmo')) return 'psalm';
    if (lower.includes('aleluya') || lower.includes('aclamacion') || lower.includes('aclamación')) {
      return 'alleluia';
    }
    if (lower.includes('evangelio')) return 'gospel';
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
