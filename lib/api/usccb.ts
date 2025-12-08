import { DailyReadings, DailyReading } from '../db';

/**
 * USCCB API Integration
 *
 * Strategy: BE GENTLE
 * - Only fetch if not in cache
 * - Cache for 7 days
 * - Prefetch next 3 days during idle time
 * - Parse HTML from USCCB readings endpoint
 */

const USCCB_BASE_URL = 'https://bible.usccb.org/bible/readings';

export interface USCCBReadingsResponse {
  readings: DailyReading[];
  liturgicalColor: string;
  season: string;
  saint?: string;
}

/**
 * Format date for USCCB URL: MMDDYY
 */
function formatUSCCBDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}${day}${year}`;
}

/**
 * Get ISO date string (YYYY-MM-DD)
 */
function getISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parse USCCB HTML response
 * This is a simplified parser - you may need to adjust based on actual HTML structure
 */
function parseUSCCBHTML(html: string): USCCBReadingsResponse {
  const readings: DailyReading[] = [];

  // This is a placeholder parser - we'll need to inspect actual USCCB HTML
  // USCCB structure typically has sections for each reading

  // Extract readings (simplified - adjust based on actual HTML)
  const readingSections = html.match(/<div class="bible-reading">[\s\S]*?<\/div>/g) || [];

  let readingIndex = 0;
  const readingTypes: Array<DailyReading['type']> = ['first', 'psalm', 'second', 'gospel'];

  readingSections.forEach((section) => {
    // Extract citation (e.g., "John 3:16-21")
    const citationMatch = section.match(/<h3.*?>(.*?)<\/h3>/);
    const citation = citationMatch ? citationMatch[1].trim() : '';

    // Extract content
    const contentMatch = section.match(/<div class="content.*?">([\s\S]*?)<\/div>/);
    const content = contentMatch ? contentMatch[1].replace(/<[^>]*>/g, '').trim() : '';

    if (citation && content) {
      readings.push({
        date: '', // Will be set by caller
        citation,
        label: readingTypes[readingIndex] || 'reading',
        content,
        type: readingTypes[readingIndex] || 'first',
      });
      readingIndex++;
    }
  });

  // Default liturgical info (would need more parsing for accuracy)
  return {
    readings,
    liturgicalColor: 'green',
    season: 'Ordinary Time',
  };
}

/**
 * Fetch readings from USCCB
 * Uses Next.js API route to avoid CORS issues
 */
export async function fetchUSCCBReadings(date: Date): Promise<DailyReadings> {
  const isoDate = getISODate(date);
  const usccbDate = formatUSCCBDate(date);

  try {
    // Call our API route instead of USCCB directly
    const response = await fetch(`/api/readings?date=${isoDate}`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch readings: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      date: isoDate,
      readings: data.readings,
      liturgicalColor: data.liturgicalColor || 'green',
      season: data.season || 'Ordinary Time',
      saint: data.saint,
      fetchedAt: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching USCCB readings:', error);

    // Return fallback readings
    return getFallbackReadings(isoDate);
  }
}

/**
 * Fallback readings when API fails
 */
function getFallbackReadings(date: string): DailyReadings {
  return {
    date,
    readings: [
      {
        date,
        citation: 'Psalm 23',
        label: 'Responsorial Psalm',
        content: 'The Lord is my shepherd; there is nothing I shall want.',
        type: 'psalm',
      },
    ],
    liturgicalColor: 'green',
    season: 'Ordinary Time',
    fetchedAt: Date.now(),
  };
}

/**
 * Prefetch upcoming readings (call during idle time)
 */
export async function prefetchUpcomingReadings(days: number = 3): Promise<void> {
  const promises = [];

  for (let i = 1; i <= days; i++) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + i);
    promises.push(fetchUSCCBReadings(futureDate));
  }

  // Fire and forget - don't await
  Promise.all(promises).catch(console.error);
}
