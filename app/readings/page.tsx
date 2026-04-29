'use client';

import { ArrowLeft, ChevronLeft, ChevronRight, Printer } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { toLocalISODate } from '@/lib/date';
import { useLanguage } from '@/components/ThemeProvider';
import { LanguageToggleCompact } from '@/components/LanguageToggle';
import { ReadingContent } from '@/components/ReadingContent';
import { cacheReadings, getCachedReadings, DailyReadings, DailyReading } from '@/lib/db';
import { analytics } from '@/lib/analytics';
import { usePageEngagement } from '@/hooks/usePageEngagement';

interface ReadingsData {
  readings: DailyReading[];
  liturgicalColor: string;
  season: string;
  saint?: string;
  language?: 'en' | 'es';
  cacheState?: 'HIT' | 'MISS' | 'ERROR' | 'FETCH' | 'RATE_LIMIT';
}

const READINGS_UI = {
  en: {
    title: 'Daily Mass Readings',
    home: 'Home',
    previousDay: 'Previous day',
    nextDay: 'Next day',
    cached: 'Cached',
    fetch: 'Fetch',
    jumpBetweenDays: 'Jump between days',
    loading: 'Loading readings...',
    fetchError: 'Failed to fetch readings',
    errorFallback: 'Unable to load readings for this day. Please try again later.',
    tryAgain: 'Try Again',
    empty: 'No readings available for this day.',
    printFooter: 'Printed from Sanctus App',
  },
  es: {
    title: 'Lecturas de la Misa',
    home: 'Inicio',
    previousDay: 'Día anterior',
    nextDay: 'Día siguiente',
    cached: 'En caché',
    fetch: 'Cargar',
    jumpBetweenDays: 'Cambiar de día',
    loading: 'Cargando lecturas...',
    fetchError: 'No se pudieron cargar las lecturas',
    errorFallback: 'No se pudieron cargar las lecturas de este día. Inténtalo de nuevo más tarde.',
    tryAgain: 'Intentar de nuevo',
    empty: 'No hay lecturas disponibles para este día.',
    printFooter: 'Impreso desde Sanctus App',
  },
} as const;

export default function ReadingsPage() {
  const { language } = useLanguage();
  const text = READINGS_UI[language];
  const [currentDate, setCurrentDate] = useState<string>(toLocalISODate());
  const [readingsByDate, setReadingsByDate] = useState<Record<string, ReadingsData>>({});
  const [loadingDate, setLoadingDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const showCacheHints = process.env.NODE_ENV !== 'production';
  usePageEngagement('readings');

  const formatDisplayDate = useCallback(
    (isoDate: string) => {
      const [year, month, day] = isoDate.split('-').map(Number);
      const dateObj = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
      return dateObj.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    [language]
  );

  const getOffsetDate = useCallback((isoDate: string, offset: number) => {
    const [year, month, day] = isoDate.split('-').map(Number);
    const base = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
    base.setDate(base.getDate() + offset);
    return toLocalISODate(base);
  }, []);

  const hydrateFromCache = useCallback(async (date: string, lang: 'en' | 'es' = language) => {
    try {
      const cached = await getCachedReadings(date, lang);
      if (cached) {
        setReadingsByDate((prev) => ({
          ...prev,
          [date]: {
            readings: cached.readings,
            liturgicalColor: cached.liturgicalColor,
            season: cached.season,
            saint: cached.saint,
            language: cached.language,
            cacheState: cached.cacheState || 'HIT',
          },
        }));
        return cached;
      }
    } catch (err) {
      console.error('Failed to read cached readings', err);
    }
    return undefined;
  }, [language]);

  const fetchReadingsForDate = useCallback(
    async (date: string, lang: 'en' | 'es' = language, options: { silent?: boolean } = {}) => {
      const { silent = false } = options;

      try {
        if (!silent) {
          setLoadingDate(date);
          setError(null);
        }

        const response = await fetch(`/api/readings?date=${date}&lang=${lang}`);

        if (!response.ok) {
          let errorMessage = text.fetchError;
          try {
            const errorBody = await response.json();
            if (errorBody?.error) {
              errorMessage = errorBody.error;
            }
          } catch {
            // Ignore JSON parse errors and keep default message
          }
          throw new Error(errorMessage);
        }

        const data = (await response.json()) as ReadingsData;
        const cacheState = (response.headers.get('X-Cache') as ReadingsData['cacheState']) || 'FETCH';
        const hydrated: ReadingsData = { ...data, cacheState };
        setReadingsByDate((prev) => ({ ...prev, [date]: hydrated }));
        if (!silent) analytics.readingsViewed(date, lang, cacheState);

        const payload: DailyReadings = {
          date,
          language: lang,
          readings: data.readings,
          liturgicalColor: data.liturgicalColor,
          season: data.season,
          saint: data.saint,
          fetchedAt: Date.now(),
          cacheState,
        };

        cacheReadings(payload).catch((err) =>
          console.error('Failed to persist readings cache', err)
        );
        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : text.errorFallback;

        if (!silent) {
          setError(message);
          analytics.apiError('/api/readings', 0, message);
        }
        console.error(err);
        throw err;
      } finally {
        if (!silent) {
          setLoadingDate(null);
        }
      }
    },
    [language, text.errorFallback, text.fetchError]
  );

  useEffect(() => {
    const todayIso = toLocalISODate();
    setCurrentDate(todayIso);
    setReadingsByDate({});
    setError(null);

    const loadReadings = async () => {
      await hydrateFromCache(todayIso, language);
      await fetchReadingsForDate(todayIso, language);

      const tomorrowIso = getOffsetDate(todayIso, 1);
      await hydrateFromCache(tomorrowIso, language);
      fetchReadingsForDate(tomorrowIso, language, { silent: true }).catch(console.error);
    };

    loadReadings();
  }, [language, fetchReadingsForDate, getOffsetDate, hydrateFromCache]);

  const currentReadings = readingsByDate[currentDate] || null;
  const loading = loadingDate === currentDate;
  const todayLabel = formatDisplayDate(currentDate);
  const previousDate = getOffsetDate(currentDate, -1);
  const nextDate = getOffsetDate(currentDate, 1);
  const previousLabel = formatDisplayDate(previousDate);
  const nextLabel = formatDisplayDate(nextDate);
  const hasPrevCached = Boolean(readingsByDate[previousDate]);
  const hasNextCached = Boolean(readingsByDate[nextDate]);

  const handleNavigate = async (offset: number) => {
    const targetDate = getOffsetDate(currentDate, offset);
    analytics.readingsNavigated(offset > 0 ? 'next' : 'prev', targetDate);

    try {
      setCurrentDate(targetDate);

      const cached = readingsByDate[targetDate] || (await hydrateFromCache(targetDate, language));

      if (!cached) {
        await fetchReadingsForDate(targetDate, language);
      } else {
        setError(null);
      }

      const prefetchDate = getOffsetDate(targetDate, offset > 0 ? 1 : -1);
      if (!readingsByDate[prefetchDate]) {
        hydrateFromCache(prefetchDate, language).catch(console.error);
        fetchReadingsForDate(prefetchDate, language, { silent: true }).catch(console.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRetry = () => fetchReadingsForDate(currentDate, language);

  return (
    <>
      {/* Print Header */}
      <div className="print-header">
        <h1>{text.title}</h1>
        <p>{todayLabel}</p>
      </div>

      <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
        {/* Navigation */}
        <nav className="no-print sticky top-0 z-50 border-b border-[color:color-mix(in_srgb,var(--foreground) 12%,transparent)] bg-[var(--background)] bg-opacity-90 backdrop-blur-md">
        <div className="max-w-3xl w-full mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
            {text.home}
          </Link>

          <div className="flex items-center gap-3">
            <LanguageToggleCompact />
            <button
              onClick={() => { analytics.printClicked('readings'); window.print(); }}
              className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              <Printer size={18} />
            </button>
          </div>
        </div>
      </nav>

        {/* Main Content */}
        <main className="max-w-3xl w-full mx-auto px-6 py-12">
          {/* Header */}
          <header className="mb-12 text-center space-y-3">
            <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {todayLabel}
            </p>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">
              {text.title}
            </h1>
            {currentReadings?.season && (
              <p className="text-gray-600 dark:text-gray-400">{currentReadings.season}</p>
            )}
            {currentReadings?.saint && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                {currentReadings.saint}
              </p>
            )}

            <div className="no-print flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => handleNavigate(-1)}
                disabled={loading}
                title={
                  showCacheHints
                    ? hasPrevCached
                      ? `${text.cached}: ${previousLabel}`
                      : `${text.fetch}: ${previousLabel}`
                    : undefined
                }
                aria-label={`${text.previousDay}: ${previousLabel}`}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
                {text.previousDay}
                {showCacheHints && (
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {hasPrevCached ? text.cached : text.fetch}
                  </span>
                )}
              </button>
              {showCacheHints && (
                <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                  {text.jumpBetweenDays}
                </div>
              )}
              <button
                onClick={() => handleNavigate(1)}
                disabled={loading}
                title={
                  showCacheHints
                    ? hasNextCached
                      ? `${text.cached}: ${nextLabel}`
                      : `${text.fetch}: ${nextLabel}`
                    : undefined
                }
                aria-label={`${text.nextDay}: ${nextLabel}`}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {text.nextDay}
                <ChevronRight size={16} />
                {showCacheHints && (
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {hasNextCached ? text.cached : text.fetch}
                  </span>
                )}
              </button>
            </div>
          </header>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-gray-100 rounded-full animate-spin" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">{text.loading}</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-6 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-center">
              <p className="text-red-800 dark:text-red-200">{error}</p>
              <button
                onClick={handleRetry}
                className="mt-4 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                {text.tryAgain}
              </button>
            </div>
          )}

          {/* Readings */}
          {currentReadings && currentReadings.readings.length > 0 && (
            <div className="space-y-12">
              {currentReadings.readings.map((reading, index) => (
                <article
                  key={index}
                  className="reading p-8 rounded-2xl bg-stone-100 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800"
                >
                  <header className="mb-6">
                    <div className="text-sm font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
                      {reading.label}
                    </div>
                    <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100">
                      {reading.citation}
                    </h2>
                  </header>
                  <div className="prayer-text text-gray-800 dark:text-gray-200 leading-relaxed">
                    <ReadingContent reading={reading} />
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Empty State */}
          {currentReadings && currentReadings.readings.length === 0 && !loading && !error && (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              <p>{text.empty}</p>
            </div>
          )}
        </main>
      </div>

      {/* Print Footer */}
      <div className="print-footer" data-date={todayLabel} style={{ display: 'none' }}>
        {text.printFooter} - {todayLabel}
      </div>
    </>
  );
}
