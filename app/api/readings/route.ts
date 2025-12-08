import { NextRequest, NextResponse } from 'next/server';
import { fromLocalISODate, toLocalISODate } from '@/lib/date';

/**
 * API Route: /api/readings
 * Fetches daily Mass readings from USCCB
 *
 * This runs on the server, avoiding CORS issues
 * and allowing Next.js to cache responses
 */

const USCCB_BASE_URL = 'https://bible.usccb.org/bible/readings';

export const runtime = 'edge'; // Use edge runtime for faster response
export const revalidate = 86400; // Cache for 24 hours

function formatUSCCBDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}${day}${year}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateParam = searchParams.get('date');

  // Parse date in local time to avoid UTC off-by-one errors
  const date = fromLocalISODate(dateParam);
  const usccbDate = formatUSCCBDate(date);
  const url = `${USCCB_BASE_URL}/${usccbDate}.cfm`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SanctusApp/1.0 (Catholic Prayer App)',
      },
      next: { revalidate: 86400 }, // 24 hour cache
    });

    if (!response.ok) {
      throw new Error(`USCCB returned ${response.status}`);
    }

    const html = await response.text();

    // Parse the HTML to extract readings
    const readings = parseUSCCBHTML(html);

    if (!readings.readings.length) {
      throw new Error('Parsed zero readings from USCCB');
    }

    return NextResponse.json(readings, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
      },
    });
  } catch (error) {
    console.error('Error fetching from USCCB:', error);

    // Return fallback
    return NextResponse.json(
      {
        readings: [
          {
            date: toLocalISODate(date),
            citation: 'Psalm 23:1-6',
            label: 'Responsorial Psalm',
            content:
              'The Lord is my shepherd; there is nothing I shall want. In green pastures he makes me lie down; to still waters he leads me; he restores my soul.',
            type: 'psalm',
          },
        ],
        liturgicalColor: 'green',
        season: 'Ordinary Time',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600',
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

  const blocks = Array.from(html.matchAll(/<div class="content-body">([\s\S]*?)<\/div>/gi));

  blocks.forEach((match) => {
    const block = match[1];
    const rawLabel = block.match(/<h4[^>]*>(.*?)<\/h4>/i)?.[1] || '';
    const citation = block.match(/<h3[^>]*>(.*?)<\/h3>/i)?.[1] || '';
    const content = block.match(/<div class="content[^"]*">([\s\S]*?)<\/div>/i)?.[1] || '';

    if (!citation || !content) return;

    const label = normalizeLabel(rawLabel);
    readings.push({
      citation: cleanHTML(citation),
      label,
      content: cleanHTML(content),
      type: mapLabelToType(label),
    });
  });

  // Extract liturgical color (optional, might not be in HTML)
  const colorMatch = html.match(/liturgical-color[^>]*>(.*?)</i);
  const liturgicalColor = colorMatch ? colorMatch[1].toLowerCase() : 'green';

  return {
    readings,
    liturgicalColor,
    season: 'Ordinary Time', // Would need calendar logic for accurate season
  };
}

/**
 * Clean HTML tags and entities
 */
function cleanHTML(str: string): string {
  return str
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

function normalizeLabel(label: string): string {
  const lower = label.toLowerCase();
  if (lower.includes('psalm')) return 'Responsorial Psalm';
  if (lower.includes('gospel')) return 'Gospel';
  if (lower.includes('second') || lower.includes('ii') || lower.includes('2')) return 'Second Reading';
  return 'First Reading';
}

function mapLabelToType(label: string): 'first' | 'psalm' | 'second' | 'gospel' {
  const lower = label.toLowerCase();
  if (lower.includes('psalm')) return 'psalm';
  if (lower.includes('gospel')) return 'gospel';
  if (lower.includes('second')) return 'second';
  return 'first';
}
