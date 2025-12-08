'use client';

import { COMMON_PRAYERS, PRAYER_UI, getLocalizedPrayer } from '@/lib/data/prayers';
import { useLanguage } from '@/components/ThemeProvider';
import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use } from 'react';

export default function PrayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { language } = useLanguage();
  const ui = PRAYER_UI[language];
  const basePrayer = COMMON_PRAYERS.find((p) => p.id === id);

  if (!basePrayer) {
    return notFound();
  }

  const prayer = getLocalizedPrayer(basePrayer, language);
  const title = prayer.title;
  const text = prayer.text;

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
        <h1>{title}</h1>
        {prayer.latin && <p className="italic">{prayer.latin}</p>}
        <p>{today}</p>
      </div>

      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Navigation */}
        <nav className="no-print sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md">
          <div className="max-w-3xl w-full mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              href="/prayers"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft size={20} />
              {ui.backToPrayers}
            </Link>

            <button
              onClick={() => window.print()}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={ui.print}
            >
              <Printer size={20} />
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-2xl mx-auto px-6 py-16">
          {/* Prayer Header */}
          <header className="mb-12 text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">{title}</h1>
            {prayer.latin && (
              <p className="text-lg text-gray-500 dark:text-gray-400 italic">{prayer.latin}</p>
            )}
          </header>

          {/* Prayer Text */}
          <div className="prayer-text text-gray-800 dark:text-gray-200 leading-relaxed space-y-6 max-w-xl mx-auto">
            {text.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-justify">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Back Button */}
          <div className="no-print mt-16 text-center">
            <Link
              href="/prayers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <ArrowLeft size={18} />
              {ui.backToPrayers}
            </Link>
          </div>
        </main>
      </div>

      {/* Print Footer */}
      <div className="print-footer" data-date={today} style={{ display: 'none' }}>
        Printed from Sanctu App - {today}
      </div>
    </>
  );
}
