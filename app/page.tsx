'use client';

import { Book, Coffee, Heart, Moon, Sun, RefreshCw, Sunrise } from 'lucide-react';
import Link from 'next/link';
import { useTheme, useLanguage } from '@/components/ThemeProvider';
import { LanguageToggleCompact } from '@/components/LanguageToggle';
import { getUI, ESSENTIAL_PRAYER_IDS } from '@/lib/data/ui';
import { COMMON_PRAYERS } from '@/lib/data/prayers';
import { clearAllData } from '@/lib/db';
import { useState } from 'react';

export default function HomePage() {
  const { isDark, setTheme } = useTheme();
  const { language } = useLanguage();
  const ui = getUI(language);
  const [isClearing, setIsClearing] = useState(false);

  const toggleDarkMode = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const clearAllCaches = async () => {
    if (!confirm(language === 'es'
      ? '¿Borrar todos los datos y caché? Esto restablecerá la aplicación.'
      : 'Clear all data and caches? This will reset the app.')) {
      return;
    }

    setIsClearing(true);

    try {
      // Clear IndexedDB (readings, preferences, rosary progress)
      await clearAllData();

      // Clear localStorage
      localStorage.clear();

      // Clear all service worker caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Unregister service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }

      // Force hard reload
      window.location.reload();
    } catch (error) {
      console.error('Error clearing caches:', error);
      setIsClearing(false);
      alert(language === 'es'
        ? 'Error al borrar el caché. Por favor, intenta borrar el caché del navegador manualmente.'
        : 'Error clearing cache. Please try clearing your browser cache manually.');
    }
  };

  const today = new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get essential prayers with translations
  const essentialPrayers = ESSENTIAL_PRAYER_IDS.map((id) => {
    const prayer = COMMON_PRAYERS.find((p) => p.id === id);
    return prayer
      ? {
          id: prayer.id,
          title: prayer.title[language],
          latin: prayer.latin,
        }
      : null;
  }).filter(Boolean);

  return (
    <>
      {/* Print-only header */}
      <div className="print-header">
        <h1>Sanctus</h1>
        <p>{today}</p>
      </div>

      {/* Top Navigation */}
      <nav className="no-print sticky top-0 z-50 border-b border-[color:color-mix(in_srgb,var(--foreground) 12%,transparent)] bg-[var(--background)] bg-opacity-90 backdrop-blur-md">
        <div className="max-w-3xl w-full mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-xl tracking-tight small-caps">
            Sanctus
          </Link>

          <div className="flex items-center gap-3">
            <LanguageToggleCompact />

            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <a
              href="https://buymeacoffee.com/davegutierrez0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-black transition-colors text-sm font-medium shadow-sm"
            >
              <Coffee size={16} />
              {ui.support}
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl w-full mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center space-y-3">
          <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 small-caps">
            {today}
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">{ui.tagline}</h1>
        </div>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Link
            href="/readings"
            className="group block p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xl transition-all duration-200"
          >
            <Book className="text-purple-600 dark:text-purple-400 mb-4" size={28} />
            <h2 className="text-2xl font-medium mb-2">{ui.todaysReadings}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {ui.todaysReadingsDesc}
            </p>
          </Link>

          <Link
            href="/rosary"
            className="group block p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xl transition-all duration-200"
          >
            <Heart className="text-rose-600 dark:text-rose-400 mb-4" size={28} />
            <h2 className="text-2xl font-medium mb-2">{ui.prayRosary}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {ui.prayRosaryDesc}
            </p>
          </Link>

          <Link
            href="/morning-prayer"
            className="group block p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xl transition-all duration-200"
          >
            <Sunrise className="text-amber-600 dark:text-amber-400 mb-4" size={28} />
            <h2 className="text-2xl font-medium mb-2">{ui.morningPrayer}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {ui.morningPrayerDesc}
            </p>
          </Link>
        </div>

        {/* Essential Prayers */}
        <section className="mb-16">
          <h2 className="text-3xl font-light mb-8 tracking-tight">{ui.essentialPrayers}</h2>
          <div className="space-y-4">
            {essentialPrayers.map(
              (prayer) =>
                prayer && (
                  <Link
                    key={prayer.id}
                    href={`/prayers/${prayer.id}`}
                  className="block p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-stone-100 dark:hover:bg-gray-800/60 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-lg">{prayer.title}</div>
                        {prayer.latin && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                            {prayer.latin}
                          </div>
                        )}
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                )
            )}

            <Link
              href="/prayers"
              className="block p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-stone-100 dark:hover:bg-gray-800/60 transition-colors text-center text-gray-600 dark:text-gray-400"
            >
              {ui.viewAllPrayers} →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="no-print text-center text-sm text-gray-500 dark:text-gray-400 pt-12 border-t border-gray-200 dark:border-gray-800 space-y-3">
          <p>{ui.footer}</p>
          <p>
            <a
              href="https://buymeacoffee.com/davegutierrez0"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              {ui.supportApp}
            </a>
          </p>

          {/* Clear Cache Button */}
          <div className="pt-4">
            <button
              onClick={clearAllCaches}
              disabled={isClearing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={language === 'es' ? 'Borrar todos los datos y caché' : 'Clear all data and cache'}
            >
              <RefreshCw size={14} className={isClearing ? 'animate-spin' : ''} />
              {isClearing
                ? (language === 'es' ? 'Borrando...' : 'Clearing...')
                : (language === 'es' ? 'Borrar caché' : 'Clear cache')}
            </button>
          </div>
        </footer>
      </main>

      {/* Print-only footer */}
      <div className="print-footer" data-date={today} style={{ display: 'none' }}>
        Printed from Sanctus App - {today}
      </div>
    </>
  );
}
