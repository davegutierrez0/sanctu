import Dexie, { Table } from 'dexie';

// Types for our cached data
export interface DailyReading {
  date?: string; // YYYY-MM-DD (optional; stored alongside parent date)
  citation: string;
  label: string;
  content: string;
  type: 'first' | 'psalm' | 'second' | 'gospel' | 'alleluia';
}

export interface DailyReadings {
  date: string; // YYYY-MM-DD (primary key)
  readings: DailyReading[];
  liturgicalColor: string;
  season: string;
  saint?: string;
  fetchedAt: number; // timestamp
  cacheState?: 'HIT' | 'MISS' | 'ERROR' | 'FETCH' | 'RATE_LIMIT';
}

export interface UserPreferences {
  id: string; // 'current'
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  notifications: boolean;
  lastVisit: number;
}

export interface RosaryProgress {
  date: string; // YYYY-MM-DD
  mystery: 'joyful' | 'sorrowful' | 'glorious' | 'luminous';
  decade: number; // 0-4
  completed: boolean;
  intentions?: string;
}

// Dexie database class
export class SanctuDB extends Dexie {
  dailyReadings!: Table<DailyReadings>;
  preferences!: Table<UserPreferences>;
  rosaryProgress!: Table<RosaryProgress>;

  constructor() {
    super('SanctuDB');

    this.version(1).stores({
      dailyReadings: 'date, fetchedAt',
      preferences: 'id',
      rosaryProgress: 'date',
    });
  }
}

// Singleton instance
export const db = new SanctuDB();

// Helper functions
export async function getCachedReadings(date: string): Promise<DailyReadings | undefined> {
  return await db.dailyReadings.get(date);
}

export async function cacheReadings(readings: DailyReadings): Promise<void> {
  await db.dailyReadings.put(readings);

  // Clean up old cached readings (keep last 30 days only)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoffTimestamp = thirtyDaysAgo.getTime();

  await db.dailyReadings
    .where('fetchedAt')
    .below(cutoffTimestamp)
    .delete();
}

export async function getPreferences(): Promise<UserPreferences> {
  const prefs = await db.preferences.get('current');

  // Return defaults if none exist
  return prefs || {
    id: 'current',
    darkMode: false,
    fontSize: 'medium',
    notifications: false,
    lastVisit: Date.now(),
  };
}

export async function updatePreferences(updates: Partial<UserPreferences>): Promise<void> {
  const current = await getPreferences();
  await db.preferences.put({ ...current, ...updates });
}

export async function getTodayRosary(): Promise<RosaryProgress | undefined> {
  const today = new Date().toISOString().split('T')[0];
  return await db.rosaryProgress.get(today);
}

export async function updateRosaryProgress(progress: RosaryProgress): Promise<void> {
  await db.rosaryProgress.put(progress);
}

export async function clearAllReadings(): Promise<void> {
  await db.dailyReadings.clear();
}

export async function clearAllData(): Promise<void> {
  await db.dailyReadings.clear();
  await db.preferences.clear();
  await db.rosaryProgress.clear();
}
