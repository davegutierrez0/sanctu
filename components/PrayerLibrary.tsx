'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ChevronRight, Search, Star } from 'lucide-react';

import { useLanguage } from '@/components/ThemeProvider';
import { COMMON_PRAYERS, PRAYER_UI, type Prayer } from '@/lib/data/prayers';
import { filterPrayers } from '@/lib/prayer-search';

const FAVORITES_KEY = 'sanctus:favorites';
const CATEGORY_ORDER: NonNullable<Prayer['category']>[] = [
  'essential',
  'marian',
  'devotional',
  'mass',
];

type LibraryFilter = 'all' | 'favorites' | NonNullable<Prayer['category']>;

function parseFavorites(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function getFavoritesSnapshot(): string {
  try {
    return localStorage.getItem(FAVORITES_KEY) ?? '[]';
  } catch {
    return '[]';
  }
}

function subscribeToFavorites(onStoreChange: () => void): () => void {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener('sanctus:favorites', onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener('sanctus:favorites', onStoreChange);
  };
}

export function PrayerLibrary() {
  const { language } = useLanguage();
  const ui = PRAYER_UI[language];
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<LibraryFilter>('all');
  const favoritesSnapshot = useSyncExternalStore(
    subscribeToFavorites,
    getFavoritesSnapshot,
    () => '[]',
  );
  const favoriteIds = useMemo(() => parseFavorites(favoritesSnapshot), [favoritesSnapshot]);

  const matchingPrayers = useMemo(() => {
    const category = filter === 'favorites' ? 'all' : filter;
    const matches = filterPrayers(COMMON_PRAYERS, language, query, category);
    return filter === 'favorites'
      ? matches.filter((prayer) => favoriteIds.includes(prayer.id))
      : matches;
  }, [favoriteIds, filter, language, query]);

  const toggleFavorite = (id: string) => {
    const next = favoriteIds.includes(id)
      ? favoriteIds.filter((favoriteId) => favoriteId !== id)
      : [...favoriteIds, id];

    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event('sanctus:favorites'));
    } catch {
      // Browsing still works when private storage is unavailable.
    }
  };

  const filters: { id: LibraryFilter; label: string }[] = [
    { id: 'all', label: ui.all },
    { id: 'favorites', label: ui.favorites },
    ...CATEGORY_ORDER.map((category) => ({ id: category, label: ui.categories[category] })),
  ];

  return (
    <div className="prayer-library">
      <label className="prayer-search">
        <span className="sr-only">{ui.searchPlaceholder}</span>
        <Search aria-hidden="true" size={19} />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={ui.searchPlaceholder}
        />
      </label>

      <div className="filter-chips" aria-label={ui.title}>
        {filters.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={filter === id ? 'filter-chip is-active' : 'filter-chip'}
            onClick={() => setFilter(id)}
            aria-pressed={filter === id}
          >
            {label}
          </button>
        ))}
      </div>

      {matchingPrayers.length === 0 ? (
        <div className="stone-card empty-state">{ui.noResults}</div>
      ) : (
        <div className="prayer-library-list">
          {matchingPrayers.map((prayer) => {
            const isFavorite = favoriteIds.includes(prayer.id);

            return (
              <article key={prayer.id} className="prayer-library-card">
                <Link href={`/prayers/${prayer.id}`} className="prayer-library-link">
                  <span>
                    <strong>{prayer.title[language]}</strong>
                    {prayer.latin && <em>{prayer.latin}</em>}
                  </span>
                  <ChevronRight aria-hidden="true" size={20} />
                </Link>
                <button
                  type="button"
                  className={isFavorite ? 'favorite-button is-favorite' : 'favorite-button'}
                  onClick={() => toggleFavorite(prayer.id)}
                  aria-label={isFavorite ? ui.unfavorite : ui.favorite}
                  title={isFavorite ? ui.unfavorite : ui.favorite}
                >
                  <Star aria-hidden="true" size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
