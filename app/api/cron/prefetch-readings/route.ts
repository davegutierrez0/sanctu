import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';
import { gzipSync } from 'zlib';

/**
 * Cron Job: Prefetch Daily Readings
 * Runs at 12:01 AM EST daily to prefetch both English and Spanish readings
 *
 * This ensures:
 * - USCCB servers receive exactly 2 requests per day (EN + ES)
 * - All users get instant cache hits throughout the day
 */

const USCCB_URLS = {
  en: 'https://bible.usccb.org/bible/readings',
  es: 'https://bible.usccb.org/es/bible/lecturas',
};

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
type ReadingType = 'first' | 'psalm' | 'second' | 'gospel' | 'alleluia';

interface Reading {
  citation: string;
  label: string;
  content: string;
  type: ReadingType;
}

interface CachedReadings {
  readings: Reading[];
  liturgicalColor: string;
  season: string;
  cachedAt: number;
  language: string;
  saint?: string;
}

export const runtime = 'nodejs';

// Lazy Redis client
let redisClient: ReturnType<typeof createClient> | null = null;

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

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function compressPayload(payload: CachedReadings): string {
  try {
    return gzipSync(JSON.stringify(payload)).toString('base64');
  } catch (err) {
    console.error('Failed to compress payload; storing uncompressed', err);
    return JSON.stringify(payload);
  }
}

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: { date: string; lang: string; status: string }[] = [];

  try {
    const redis = await getRedis();

    // Get today's date in EST
    const now = new Date();
    const estOffset = -5 * 60; // EST is UTC-5
    const estDate = new Date(now.getTime() + estOffset * 60 * 1000);
    const targetOffsets = [0, 1]; // Today + tomorrow

    // Prefetch for both languages
    for (const lang of ['en', 'es'] as const) {
      for (const offset of targetOffsets) {
        const targetDate = new Date(estDate);
        targetDate.setDate(estDate.getDate() + offset);
        const targetIso = toISODate(targetDate);
        const targetUsccb = formatUSCCBDate(targetDate);
        const cacheKey = `readings:${lang}:${targetIso}`;

        // Check if already cached
        if (redis) {
          const existing = await redis.get(cacheKey);
          if (existing) {
            results.push({ date: targetIso, lang, status: 'already_cached' });
            continue;
          }
        }

        // Fetch from USCCB
        const baseUrl = USCCB_URLS[lang];
        const url = `${baseUrl}/${targetUsccb}.cfm`;

        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'SanctusApp/1.0 (Catholic Prayer App; scheduled-prefetch)',
            },
          });

          if (!response.ok) {
            results.push({ date: targetIso, lang, status: `fetch_error_${response.status}` });
            continue;
          }

          const html = await response.text();
          const parsed = parseUSCCBHTML(html, lang);

          if (!parsed.readings.length) {
            results.push({ date: targetIso, lang, status: 'parse_error_no_readings' });
            continue;
          }

          // Cache the result
          const dataToCache = {
            ...parsed,
            cachedAt: Date.now(),
            language: lang,
          };

          if (redis) {
            await redis.setEx(cacheKey, CACHE_TTL_SECONDS, compressPayload(dataToCache));
            results.push({ date: targetIso, lang, status: 'cached' });
          } else {
            results.push({ date: targetIso, lang, status: 'cached_in_memory_only' });
          }
        } catch (err) {
          console.error('Prefetch fetch exception', { lang, date: targetIso, error: err });
          results.push({ date: targetIso, lang, status: 'fetch_exception' });
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error('Cron prefetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal error', results },
      { status: 500 }
    );
  }
}

// Simplified parser (same as main route)
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
    const citation = citationMatch ? citationMatch[1].trim() : '';

    const content = cleanHTML(body);
    if (!content) return;

    readings.push({
      citation: citation || rawLabel,
      label: rawLabel,
      content,
      type: mapLabelToType(rawLabel, lang),
    });
  });

  const titleMatch = html.match(/<div class="wr-block b-lectionary[\s\S]*?<h2>([\s\S]*?)<\/h2>/i);
  const title = titleMatch ? cleanHTML(titleMatch[1]) : '';

  return {
    readings,
    liturgicalColor: 'green',
    season: title || (lang === 'es' ? 'Tiempo Ordinario' : 'Ordinary Time'),
  };
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

function mapLabelToType(label: string, lang: 'en' | 'es'): ReadingType {
  const lower = label.toLowerCase();
  if (lang === 'es') {
    if (lower.includes('salmo')) return 'psalm';
    if (lower.includes('evangelio')) return 'gospel';
    if (lower.includes('aleluya')) return 'alleluia';
    if (lower.includes('segunda')) return 'second';
    return 'first';
  }
  if (lower.includes('psalm')) return 'psalm';
  if (lower.includes('gospel')) return 'gospel';
  if (lower.includes('alleluia')) return 'alleluia';
  if (lower.includes('second')) return 'second';
  return 'first';
}
