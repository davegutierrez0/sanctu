'use client';

import { ArrowLeft, Printer, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { useLanguage } from '@/components/ThemeProvider';
import { LanguageToggleCompact } from '@/components/LanguageToggle';
import { getUI } from '@/lib/data/ui';

type SectionType = 'dialogue' | 'antiphon' | 'psalm-header' | 'verses' | 'doxology' | 'rubric' | 'heading' | 'hymn-title' | 'reading-ref' | 'prayer';

interface PrayerSection {
  type: SectionType;
  content: string;
  isResponse?: boolean;
}

interface PrayerPart {
  title: string;
  sections: PrayerSection[];
  link: string;
}

interface MorningPrayerData {
  parts: PrayerPart[];
  cachedAt: number;
  error?: string;
}

export default function MorningPrayerPage() {
  const { language } = useLanguage();
  const ui = getUI(language);
  const [data, setData] = useState<MorningPrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    const fetchMorningPrayer = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/morning-prayer');

        if (!response.ok) {
          throw new Error('Failed to fetch morning prayer');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load morning prayer');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMorningPrayer();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetch('/api/morning-prayer')
      .then(res => res.json())
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const renderSection = (section: PrayerSection, index: number): ReactNode => {
    switch (section.type) {
      case 'dialogue':
        return (
          <div
            key={index}
            className={`flex gap-3 ${section.isResponse ? 'ml-6' : ''}`}
          >
            {section.isResponse && (
              <span className="text-purple-600 dark:text-purple-400 font-bold flex-shrink-0">℟.</span>
            )}
            <p className={`${section.isResponse ? 'font-semibold text-gray-900 dark:text-gray-100' : ''}`}>
              {section.content}
            </p>
          </div>
        );

      case 'antiphon':
        return (
          <div key={index} className="flex gap-3 my-4 py-3 px-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border-l-4 border-purple-500">
            <span className="text-purple-600 dark:text-purple-400 font-bold flex-shrink-0">Ant.</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 italic">
              {section.content}
            </p>
          </div>
        );

      case 'psalm-header':
        return (
          <h3
            key={index}
            className="font-semibold text-lg mt-8 mb-3 text-purple-700 dark:text-purple-300 border-b border-purple-200 dark:border-purple-800 pb-2"
          >
            {section.content}
          </h3>
        );

      case 'verses':
        // Group verse lines - pairs of lines that belong together
        const lines = section.content.split('\n').filter(l => l.trim());
        return (
          <div key={index} className="space-y-2 my-3">
            {lines.map((line, lineIdx) => (
              <p key={lineIdx} className="leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        );

      case 'doxology':
        return (
          <div key={index} className="my-6 py-4 border-t border-b border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
              {section.content.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < section.content.split('\n').length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
        );

      case 'rubric':
        return (
          <p key={index} className="text-sm text-red-600 dark:text-red-400 italic my-2">
            {section.content}
          </p>
        );

      case 'heading':
        return (
          <h3
            key={index}
            className="font-bold text-sm uppercase tracking-wider mt-10 mb-4 text-purple-600 dark:text-purple-400 border-b-2 border-purple-200 dark:border-purple-800 pb-2"
          >
            {section.content}
          </h3>
        );

      case 'hymn-title':
        return (
          <p key={index} className="font-semibold text-lg italic mb-4 text-gray-800 dark:text-gray-200">
            {section.content}
          </p>
        );

      case 'prayer':
        return (
          <div key={index} className="my-4 pl-4 border-l-2 border-gray-300 dark:border-gray-600 italic">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {section.content}
            </p>
          </div>
        );

      case 'reading-ref':
        return (
          <p key={index} className="font-medium text-purple-700 dark:text-purple-300 mb-2">
            {section.content}
          </p>
        );

      default:
        return (
          <p key={index} className="my-2">
            {section.content}
          </p>
        );
    }
  };

  const renderPart = (part: PrayerPart, partIndex: number): ReactNode => {
    return (
      <article
        key={partIndex}
        className="p-8 rounded-2xl bg-stone-100 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 mb-8"
      >
        <header className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100">
            {part.title}
          </h2>
        </header>
        <div className="prayer-text text-gray-800 dark:text-gray-200 leading-relaxed">
          {part.sections.map((section, idx) => renderSection(section, idx))}
        </div>

        {part.link && (
          <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <a
              href={part.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              <ExternalLink size={14} />
              {language === 'es' ? 'Ver en Divine Office' : 'View on Divine Office'}
            </a>
          </footer>
        )}
      </article>
    );
  };

  return (
    <>
      {/* Print Header */}
      <div className="print-header">
        <h1>{ui.morningPrayer}</h1>
        <p>{today}</p>
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
              Home
            </Link>

            <div className="flex items-center gap-3">
              <LanguageToggleCompact />
              <button
                onClick={() => window.print()}
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
              {today}
            </p>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">
              {ui.morningPrayer}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {ui.morningPrayerDesc}
            </p>
          </header>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-gray-100 rounded-full animate-spin" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">{ui.loading}</p>
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
                {ui.tryAgain}
              </button>
            </div>
          )}

          {/* Prayer Content */}
          {data && data.parts && !loading && (
            <div>
              {data.parts.map((part, idx) => renderPart(part, idx))}
            </div>
          )}
        </main>
      </div>

      {/* Print Footer */}
      <div className="print-footer" data-date={today} style={{ display: 'none' }}>
        Printed from Sanctus App - {today}
      </div>
    </>
  );
}
