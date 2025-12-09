import { DailyReadings } from '../db';

/**
 * Lightweight helper to fetch USCCB readings via our API route.
 * Kept minimal to avoid unused code/warnings.
 */
export async function fetchUSCCBReadings(date: Date): Promise<DailyReadings> {
  const isoDate = date.toISOString().split('T')[0];

  try {
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

    return {
      date: isoDate,
      readings: [
        {
          date: isoDate,
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
}
