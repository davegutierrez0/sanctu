'use client';

import { COMMON_PRAYERS } from '@/lib/data/prayers';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrayersIndexPage() {
  const essentialPrayers = COMMON_PRAYERS.filter((p) => p.category === 'essential');
  const marianPrayers = COMMON_PRAYERS.filter((p) => p.category === 'marian');
  const devotionalPrayers = COMMON_PRAYERS.filter((p) => p.category === 'devotional');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="no-print sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md">
        <div className="max-w-3xl w-full mx-auto px-6 h-16 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
            Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl w-full mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-3">
            Catholic Prayers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            A collection of essential prayers for daily devotion
          </p>
        </header>

        {/* Essential Prayers */}
        <section className="mb-12">
          <h2 className="text-2xl font-light mb-6 tracking-tight">Essential Prayers</h2>
          <div className="space-y-4">
            {essentialPrayers.map((prayer) => (
              <Link
                key={prayer.id}
                href={`/prayers/${prayer.id}`}
                className="block p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-lg">{prayer.title}</div>
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Marian Prayers */}
        <section className="mb-12">
          <h2 className="text-2xl font-light mb-6 tracking-tight">Marian Devotions</h2>
          <div className="space-y-4">
            {marianPrayers.map((prayer) => (
              <Link
                key={prayer.id}
                href={`/prayers/${prayer.id}`}
                className="block p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-lg">{prayer.title}</div>
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Devotional Prayers */}
        <section>
          <h2 className="text-2xl font-light mb-6 tracking-tight">Daily Devotions</h2>
          <div className="space-y-4">
            {devotionalPrayers.map((prayer) => (
              <Link
                key={prayer.id}
                href={`/prayers/${prayer.id}`}
                className="block p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-lg">{prayer.title}</div>
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
