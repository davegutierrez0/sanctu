'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { toLocalISODate } from '@/lib/date';
import { useLanguage } from '@/components/ThemeProvider';
import { LanguageToggleCompact } from '@/components/LanguageToggle';

interface Reading {
  citation: string;
  label: string;
  content: string;
  type: string;
}

interface ReadingsData {
  readings: Reading[];
  liturgicalColor: string;
  season: string;
  saint?: string;
}

export default function ReadingsPage() {
  const { language } = useLanguage();
  const [readings, setReadings] = useState<ReadingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodaysReadings = useCallback(
    async (lang: 'en' | 'es' = language) => {
      try {
        setLoading(true);
        setError(null);

        const requestedDate = toLocalISODate();
        const response = await fetch(`/api/readings?date=${requestedDate}&lang=${lang}`);

        if (!response.ok) {
          throw new Error('Failed to fetch readings');
        }

        const data = await response.json();
        setReadings(data);
      } catch (err) {
        setError("Unable to load today's readings. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [language]
  );

  useEffect(() => {
    fetchTodaysReadings(language);
  }, [language, fetchTodaysReadings]);

  const today = new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Print Header */}
      <div className="print-header">
        <h1>Daily Mass Readings</h1>
        <p>{today}</p>
      </div>

      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Navigation */}
        <nav className="no-print sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md">
        <div className="max-w-3xl w-full mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
            Home
          </Link>

          <div className="flex items-center gap-3">
            <LanguageToggleCompact />
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              Print
            </button>
          </div>
        </div>
      </nav>

        {/* Main Content */}
        <main className="max-w-3xl w-full mx-auto px-6 py-12">
          {/* Header */}
          <header className="mb-12 text-center space-y-3">
            <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {today}
            </p>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">
              Daily Mass Readings
            </h1>
            {readings?.season && (
              <p className="text-gray-600 dark:text-gray-400">{readings.season}</p>
            )}
            {readings?.saint && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                {readings.saint}
              </p>
            )}
          </header>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-gray-100 rounded-full animate-spin" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading readings...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-6 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-center">
              <p className="text-red-800 dark:text-red-200">{error}</p>
              <button
                onClick={() => fetchTodaysReadings()}
                className="mt-4 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Readings */}
          {readings && readings.readings.length > 0 && (
            <div className="space-y-12">
              {readings.readings.map((reading, index) => (
                <article
                  key={index}
                  className="reading p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
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
                    {reading.content.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Empty State */}
          {readings && readings.readings.length === 0 && !loading && !error && (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              <p>No readings available for today.</p>
            </div>
          )}
        </main>
      </div>

      {/* Print Footer */}
      <div className="print-footer" data-date={today} style={{ display: 'none' }}>
        Printed from Sanctu App - {today}
      </div>
    </>
  );
}
