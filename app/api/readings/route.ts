import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';
import { fromLocalISODate, toLocalISODate } from '@/lib/date';

/**
 * API Route: /api/readings
 * Fetches daily Mass readings from USCCB with server-side caching
 *
 * Cache Strategy (USCCB-friendly):
 * - First request for a date: fetch from USCCB, store in Redis
 * - All subsequent requests: served from Redis cache
 * - TTL: 7 days (readings for a date never change)
 * - Result: Only 1 request to USCCB per day, regardless of user count
 */

const USCCB_BASE_URL = 'https://bible.usccb.org/bible/readings';
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

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
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateParam = searchParams.get('date');

  const date = fromLocalISODate(dateParam);
  const isoDate = toLocalISODate(date);
  const cacheKey = `readings:${isoDate}`;

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
    const url = `${USCCB_BASE_URL}/${usccbDate}.cfm`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SanctusApp/1.0 (Catholic Prayer App; polite-caching)',
      },
    });

    if (!response.ok) {
      throw new Error(`USCCB returned ${response.status}`);
    }

    const html = await response.text();
    const parsed = parseUSCCBHTML(html);

    if (!parsed.readings.length) {
      throw new Error('Parsed zero readings from USCCB');
    }

    // 3. Store in cache
    const dataToCache: CachedReadings = {
      ...parsed,
      cachedAt: Date.now(),
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
    return NextResponse.json(
      {
        readings: [
          {
            date: isoDate,
            citation: 'Psalm 23:1-6',
            label: 'Responsorial Psalm',
            content:
              'The Lord is my shepherd; there is nothing I shall want. In green pastures he makes me lie down; to still waters he leads me; he restores my soul.',
            type: 'psalm',
          },
        ],
        liturgicalColor: 'green',
        season: 'Ordinary Time',
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
function parseUSCCBHTML(html: string) {
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

    const label = normalizeLabel(rawLabel);
    readings.push({
      citation: citation || rawLabel,
      label,
      content,
      type: mapLabelToType(rawLabel),
    });
  });

  const titleMatch = html.match(/<div class="wr-block b-lectionary[\s\S]*?<h2>([\s\S]*?)<\/h2>/i);
  const title = titleMatch ? cleanHTML(titleMatch[1]) : '';

  const liturgicalColor = determineLiturgicalColor(title);

  return {
    readings,
    liturgicalColor,
    season: title || 'Ordinary Time',
  };
}

function determineLiturgicalColor(title: string): string {
  const lower = title.toLowerCase();

  if (lower.includes('christmas') || lower.includes('easter') ||
      lower.includes('mary') || lower.includes('immaculate') ||
      lower.includes('assumption') || lower.includes('nativity') ||
      lower.includes('epiphany') || lower.includes('ascension') ||
      lower.includes('corpus christi') || lower.includes('sacred heart')) {
    return 'white';
  }

  if (lower.includes('pentecost') || lower.includes('palm sunday') ||
      lower.includes('good friday') || lower.includes('passion') ||
      lower.includes('martyr')) {
    return 'red';
  }

  if (lower.includes('advent') || lower.includes('lent')) {
    return 'violet';
  }

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

function normalizeLabel(label: string): string {
  const lower = label.toLowerCase();
  if (lower.includes('psalm')) return 'Responsorial Psalm';
  if (lower.includes('gospel')) return 'Gospel';
  if (lower.includes('alleluia')) return 'Alleluia';
  if (lower.includes('second') || lower.includes('reading 2')) return 'Second Reading';
  if (lower.includes('reading 1')) return 'First Reading';
  return label.trim() || 'Reading';
}

function mapLabelToType(label: string): 'first' | 'psalm' | 'second' | 'gospel' | 'alleluia' {
  const lower = label.toLowerCase();
  if (lower.includes('psalm')) return 'psalm';
  if (lower.includes('gospel')) return 'gospel';
  if (lower.includes('alleluia')) return 'alleluia';
  if (lower.includes('second') || lower.includes('reading 2')) return 'second';
  return 'first';
}
