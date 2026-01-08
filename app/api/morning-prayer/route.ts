import { NextResponse } from 'next/server';
import { createClient } from 'redis';
import { gzipSync, gunzipSync } from 'zlib';
import { toLocalISODate } from '@/lib/date';

/**
 * API Route: /api/morning-prayer
 * Fetches Morning Prayer (Lauds) from Divine Office RSS feed with server-side caching
 *
 * Structure of Morning Prayer (Lauds):
 * 1. Invitatory (separate item in feed)
 *    - Opening dialogue (Lord, open my lips...)
 *    - Invitatory Psalm with antiphon
 * 2. Morning Prayer (separate item in feed)
 *    - Opening (God, come to my assistance...)
 *    - Hymn
 *    - Psalmody (3 psalms/canticles with antiphons)
 *    - Scripture Reading
 *    - Responsory
 *    - Canticle of Zechariah
 *    - Intercessions
 *    - Lord's Prayer
 *    - Concluding Prayer
 *    - Dismissal
 */

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const LAUDS_FEED_URL = 'https://divineoffice.org/category/morning-prayer-lauds/feed/';

// Section types for structured rendering
type SectionType = 'dialogue' | 'antiphon' | 'psalm-header' | 'verses' | 'doxology' | 'rubric' | 'heading' | 'hymn-title' | 'reading-ref' | 'prayer';

interface PrayerSection {
  type: SectionType;
  content: string;
  isResponse?: boolean;
}

interface PrayerPart {
  title: string;
  sections: PrayerSection[];
  link: string;
}

interface CachedMorningPrayer {
  parts: PrayerPart[];
  cachedAt: number;
}

export const runtime = 'nodejs';

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

function compressPayload(payload: CachedMorningPrayer): string {
  try {
    return gzipSync(JSON.stringify(payload)).toString('base64');
  } catch (err) {
    console.error('Failed to compress payload; storing uncompressed', err);
    return JSON.stringify(payload);
  }
}

function decompressPayload(serialized: string): CachedMorningPrayer {
  try {
    const buffer = Buffer.from(serialized, 'base64');
    const json = gunzipSync(buffer).toString();
    return JSON.parse(json) as CachedMorningPrayer;
  } catch {
    return JSON.parse(serialized) as CachedMorningPrayer;
  }
}

function decodeEntities(str: string): string {
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#160;/g, ' ')
    .trim();
}

interface RSSItem {
  title: string;
  content: string;
  link: string;
}

function parseAllRSSItems(xml: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];

    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i) ||
                       item.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? decodeEntities(titleMatch[1]) : '';

    const linkMatch = item.match(/<link>(.*?)<\/link>/i);
    const link = linkMatch ? linkMatch[1].trim() : '';

    const contentMatch = item.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/i);
    const content = contentMatch ? contentMatch[1] : '';

    if (title && content) {
      items.push({ title, content, link });
    }
  }

  return items;
}

function getTodayDatePatterns(): string[] {
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'short' });
  const day = now.getDate();

  // Return patterns like "Jan 8" or "Jan 08"
  return [
    `${month} ${day}`,
    `${month} ${day.toString().padStart(2, '0')}`,
  ];
}

function parseHTMLToSections(html: string): PrayerSection[] {
  const sections: PrayerSection[] = [];

  // Remove audio/video/script elements and ribbon placement instructions
  let cleaned = html
    .replace(/<audio[\s\S]*?<\/audio>/gi, '')
    .replace(/<video[\s\S]*?<\/video>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    // Remove ribbon placement paragraphs
    .replace(/<p[^>]*>[\s\S]*?ribbon[\s\S]*?<\/p>/gi, '')
    // Remove purchase/download links
    .replace(/<p[^>]*>[\s\S]*?(purchase|download|click here|itunes|amazon)[\s\S]*?<\/p>/gi, '');

  // Split by paragraphs
  const paragraphs = cleaned.split(/<\/p>/i);

  for (const para of paragraphs) {
    let text = para
      .replace(/<p[^>]*>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .trim();

    if (!text) continue;

    // Skip empty or very short non-content paragraphs
    const cleanedCheck = decodeEntities(text.replace(/<[^>]+>/g, '')).trim();
    if (!cleanedCheck || cleanedCheck.length < 2) continue;

    // Skip navigation/purchase links
    if (/<a[^>]*>/i.test(text) && (
      /purchase|download|itunes|amazon|score|click/i.test(text) ||
      text.replace(/<[^>]+>/g, '').trim().length < 20
    )) continue;

    // Check for red-colored spans which indicate liturgical markers
    const hasRedSpan = /<span[^>]*color:\s*#ff0000[^>]*>/i.test(text);

    // Check for section headers (HYMN, PSALMODY, READING, etc.)
    const sectionHeaderMatch = text.match(/<span[^>]*color:\s*#ff0000[^>]*>\s*(HYMN|PSALMODY|READING|RESPONSORY|CANTICLE OF ZECHARIAH|INTERCESSIONS|LORD'S PRAYER|CONCLUDING PRAYER|DISMISSAL|SACRED SILENCE)[^<]*<\/span>/i);
    if (sectionHeaderMatch) {
      const headerText = decodeEntities(sectionHeaderMatch[0].replace(/<[^>]+>/g, ''));
      sections.push({ type: 'heading', content: headerText });
      // Remove the header from text and continue processing the rest
      text = text.replace(sectionHeaderMatch[0], '').trim();
      if (!text || text.replace(/<[^>]+>/g, '').trim().length < 2) continue;
    }

    // Extract psalm/canticle header
    const psalmHeaderMatch = text.match(/<span[^>]*color:\s*#ff0000[^>]*>(Psalm\s+\d+[^<]*|Canticle[^<]*|Isaiah[^<]*|Daniel[^<]*|Exodus[^<]*|Luke[^<]*|1\s*Samuel[^<]*|Judith[^<]*|Tobit[^<]*|Wisdom[^<]*|Sirach[^<]*|Habakkuk[^<]*|Ezekiel[^<]*|Jeremiah[^<]*|Romans[^<]*)<\/span>/i);
    if (psalmHeaderMatch) {
      const headerText = decodeEntities(psalmHeaderMatch[0].replace(/<[^>]+>/g, ''));
      sections.push({ type: 'psalm-header', content: headerText });
      text = text.replace(psalmHeaderMatch[0], '').trim();
      if (!text || text.replace(/<[^>]+>/g, '').trim().length < 2) continue;
    }

    // Check for "Psalm-prayer" label
    if (/<span[^>]*color:\s*#ff0000[^>]*>Psalm-prayer<\/span>/i.test(text)) {
      const prayerText = decodeEntities(text.replace(/<[^>]+>/g, '').replace(/Psalm-prayer\s*/i, '').trim());
      if (prayerText) {
        sections.push({ type: 'prayer', content: prayerText });
      }
      continue;
    }

    // Check for antiphon marker
    const antiphonMatch = text.match(/<span[^>]*color:\s*#ff0000[^>]*>Ant\.?\s*<\/span>\s*([\s\S]*)/i);
    if (antiphonMatch) {
      const antiphonText = decodeEntities(antiphonMatch[1].replace(/<[^>]+>/g, '').trim());
      if (antiphonText) {
        sections.push({ type: 'antiphon', content: antiphonText });
      }
      continue;
    }

    // Check for response marker (red dash or R. at start)
    const responseMatch = text.match(/<span[^>]*color:\s*#ff0000[^>]*>([—–-]|R\.?|℟\.?)\s*<\/span>\s*([\s\S]*)/i);
    if (responseMatch) {
      const responseText = decodeEntities(responseMatch[2].replace(/<[^>]+>/g, '').trim());
      if (responseText) {
        sections.push({ type: 'dialogue', content: responseText, isResponse: true });
      }
      continue;
    }

    // Check for versicle marker (V.)
    const versicleMatch = text.match(/<span[^>]*color:\s*#ff0000[^>]*>V\.?\s*<\/span>\s*([\s\S]*)/i);
    if (versicleMatch) {
      const versicleText = decodeEntities(versicleMatch[1].replace(/<[^>]+>/g, '').trim());
      if (versicleText) {
        sections.push({ type: 'dialogue', content: versicleText, isResponse: false });
      }
      continue;
    }

    // Check for Glory be / Doxology
    const cleanedText = decodeEntities(text.replace(/<[^>]+>/g, ''));
    if (/^Glory\s+to\s+the\s+Father/i.test(cleanedText) ||
        /^as\s+it\s+was\s+in\s+the\s+beginning/i.test(cleanedText)) {
      sections.push({ type: 'doxology', content: cleanedText });
      continue;
    }

    // Check for opening dialogues
    if (/^(Lord,\s+open\s+my\s+lips|God,\s+come\s+to\s+my\s+assistance|O\s+God,\s+come)/i.test(cleanedText)) {
      const lines = cleanedText.split('\n').filter(l => l.trim());
      for (const line of lines) {
        const isResp = /^[—–-]\s*/.test(line) || /^And\s+my\s+mouth/i.test(line) || /^Lord,\s+make\s+haste/i.test(line);
        sections.push({
          type: 'dialogue',
          content: line.replace(/^[—–-]\s*/, '').trim(),
          isResponse: isResp
        });
      }
      continue;
    }

    // Check for hymn title (usually in bold/strong after HYMN header)
    if (/<strong[^>]*>|<b[^>]*>/i.test(text) && sections.length > 0 && sections[sections.length - 1]?.type === 'heading' && sections[sections.length - 1]?.content === 'HYMN') {
      const hymnTitle = decodeEntities(text.replace(/<[^>]+>/g, '').trim());
      if (hymnTitle && !hymnTitle.includes('purchase') && !hymnTitle.includes('download')) {
        sections.push({ type: 'hymn-title', content: hymnTitle });
        continue;
      }
    }

    // Check for rubrics (instructions, usually short and in red)
    if (hasRedSpan && cleanedText.length < 150 && !cleanedText.includes('\n')) {
      const rubricText = cleanedText;
      if (rubricText && !/^(Psalm|Ant|Glory|—|V\.|R\.)/i.test(rubricText) &&
          !rubricText.includes('purchase') && !rubricText.includes('download')) {
        sections.push({ type: 'rubric', content: rubricText });
        continue;
      }
    }

    // Regular verses or prayer text
    if (cleanedText && cleanedText.length > 2) {
      const lines = cleanedText.split('\n').filter(l => l.trim());
      if (lines.length > 0) {
        sections.push({ type: 'verses', content: lines.join('\n') });
      }
    }
  }

  // Post-process: merge consecutive verse sections
  const merged: PrayerSection[] = [];
  for (const section of sections) {
    const last = merged[merged.length - 1];
    if (section.type === 'verses' && last?.type === 'verses') {
      last.content += '\n' + section.content;
    } else {
      merged.push(section);
    }
  }

  return merged;
}

export async function GET() {
  const isoDate = toLocalISODate();
  const cacheKey = `morning-prayer:v3:${isoDate}`;

  try {
    const redis = await getRedis();

    // Check cache first
    if (redis) {
      const cachedStr = await redis.get(cacheKey);
      if (cachedStr) {
        const cached = decompressPayload(cachedStr);
        return NextResponse.json(cached, {
          headers: {
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
            'X-Cache': 'HIT',
          },
        });
      }
    }

    // Fetch the RSS feed
    const response = await fetch(LAUDS_FEED_URL, {
      headers: {
        'User-Agent': 'SanctusApp/1.0 (Catholic Prayer App; polite-caching)',
      },
    });

    if (!response.ok) {
      throw new Error(`Divine Office RSS returned ${response.status}`);
    }

    const xml = await response.text();
    const allItems = parseAllRSSItems(xml);

    // Find items for today
    const datePatterns = getTodayDatePatterns();

    // Find Invitatory for today
    const invitatory = allItems.find(item =>
      datePatterns.some(pattern => item.title.startsWith(pattern)) &&
      item.title.toLowerCase().includes('invitatory')
    );

    // Find Morning Prayer for today
    const morningPrayer = allItems.find(item =>
      datePatterns.some(pattern => item.title.startsWith(pattern)) &&
      item.title.toLowerCase().includes('morning prayer')
    );

    const parts: PrayerPart[] = [];

    // Add invitatory if found
    if (invitatory) {
      const sections = parseHTMLToSections(invitatory.content);
      if (sections.length > 0) {
        parts.push({
          title: invitatory.title,
          sections,
          link: invitatory.link,
        });
      }
    }

    // Add morning prayer if found
    if (morningPrayer) {
      const sections = parseHTMLToSections(morningPrayer.content);
      if (sections.length > 0) {
        parts.push({
          title: morningPrayer.title,
          sections,
          link: morningPrayer.link,
        });
      }
    }

    // If no items for today, use the most recent ones
    if (parts.length === 0 && allItems.length > 0) {
      // Try to get the most recent invitatory and morning prayer
      const recentInvitatory = allItems.find(item => item.title.toLowerCase().includes('invitatory'));
      const recentMorningPrayer = allItems.find(item => item.title.toLowerCase().includes('morning prayer'));

      if (recentInvitatory) {
        const sections = parseHTMLToSections(recentInvitatory.content);
        if (sections.length > 0) {
          parts.push({
            title: recentInvitatory.title,
            sections,
            link: recentInvitatory.link,
          });
        }
      }

      if (recentMorningPrayer) {
        const sections = parseHTMLToSections(recentMorningPrayer.content);
        if (sections.length > 0) {
          parts.push({
            title: recentMorningPrayer.title,
            sections,
            link: recentMorningPrayer.link,
          });
        }
      }
    }

    if (parts.length === 0) {
      throw new Error('No morning prayer content available');
    }

    const dataToCache: CachedMorningPrayer = {
      parts,
      cachedAt: Date.now(),
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
    console.error('Error fetching morning prayer:', error);

    // Return fallback
    const fallback: CachedMorningPrayer = {
      parts: [{
        title: 'Morning Prayer',
        sections: [
          { type: 'dialogue', content: 'God, come to my assistance.', isResponse: false },
          { type: 'dialogue', content: 'Lord, make haste to help me.', isResponse: true },
          { type: 'doxology', content: 'Glory to the Father, and to the Son, and to the Holy Spirit:\nas it was in the beginning, is now, and will be forever. Amen.' },
        ],
        link: 'https://divineoffice.org/category/morning-prayer-lauds/',
      }],
      cachedAt: Date.now(),
    };

    return NextResponse.json(
      { ...fallback, error: 'Failed to fetch morning prayer' },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300',
          'X-Cache': 'ERROR',
        },
      }
    );
  }
}
