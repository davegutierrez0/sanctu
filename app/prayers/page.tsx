'use client';

import { PRAYER_UI } from '@/lib/data/prayers';
import { useLanguage } from '@/components/ThemeProvider';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePageEngagement } from '@/hooks/usePageEngagement';
import { PrayerLibrary } from '@/components/PrayerLibrary';

export default function PrayersIndexPage() {
  const { language } = useLanguage();
  const ui = PRAYER_UI[language];
  usePageEngagement('prayers');

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

        <PrayerLibrary />
      </main>
    </div>
  );
}
