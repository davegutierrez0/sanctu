'use client';

import { COMMON_PRAYERS, PRAYER_UI } from '@/lib/data/prayers';
import { useLanguage } from '@/components/ThemeProvider';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrayersIndexPage() {
  const { language } = useLanguage();
  const ui = PRAYER_UI[language];

  const essentialPrayers = COMMON_PRAYERS.filter((p) => p.category === 'essential');
  const marianPrayers = COMMON_PRAYERS.filter((p) => p.category === 'marian');
  const devotionalPrayers = COMMON_PRAYERS.filter((p) => p.category === 'devotional');

  const PrayerLink = ({ prayer }: { prayer: (typeof COMMON_PRAYERS)[0] }) => (
    <Link
      href={`/prayers/${prayer.id}`}
              className="block p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-stone-100 dark:hover:bg-gray-800/60 transition-colors"
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium text-lg">{prayer.title[language]}</div>
          {prayer.latin && (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
              {prayer.latin}
            </div>
          )}
        </div>
        <svg
          className="w-5 h-5 text-gray-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="no-print sticky top-0 z-50 border-b border-[color:color-mix(in_srgb,var(--foreground) 12%,transparent)] bg-[var(--background)] bg-opacity-90 backdrop-blur-md">
        <div className="max-w-3xl w-full mx-auto px-6 h-16 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
            {ui.backToHome}
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl w-full mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-3">{ui.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{ui.subtitle}</p>
        </header>

        {/* Essential Prayers */}
        <section className="mb-12">
          <h2 className="text-2xl font-light mb-6 tracking-tight">
            {ui.categories.essential}
          </h2>
          <div className="space-y-4">
            {essentialPrayers.map((prayer) => (
              <PrayerLink key={prayer.id} prayer={prayer} />
            ))}
          </div>
        </section>

        {/* Marian Prayers */}
        <section className="mb-12">
          <h2 className="text-2xl font-light mb-6 tracking-tight">{ui.categories.marian}</h2>
          <div className="space-y-4">
            {marianPrayers.map((prayer) => (
              <PrayerLink key={prayer.id} prayer={prayer} />
            ))}
          </div>
        </section>

        {/* Devotional Prayers */}
        <section>
          <h2 className="text-2xl font-light mb-6 tracking-tight">
            {ui.categories.devotional}
          </h2>
          <div className="space-y-4">
            {devotionalPrayers.map((prayer) => (
              <PrayerLink key={prayer.id} prayer={prayer} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
