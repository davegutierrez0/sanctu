'use client';

import { ArrowLeft, ExternalLink, Printer } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/ThemeProvider';
import { LanguageToggleCompact } from '@/components/LanguageToggle';
import { getMassGuide, MassGuideLineType } from '@/lib/data/mass-guide';
import { getUI } from '@/lib/data/ui';
import { usePageEngagement } from '@/hooks/usePageEngagement';

const LINE_STYLES: Record<MassGuideLineType, { wrapper: string; markerClass: string }> = {
  action: {
    markerClass: 'text-amber-600 dark:text-amber-400',
    wrapper: 'pl-5 border-l-4 border-amber-400/70 dark:border-amber-500/70',
  },
  response: {
    markerClass: 'text-sky-600 dark:text-sky-300',
    wrapper: 'pl-5 border-l-4 border-sky-400/70 dark:border-sky-500/70',
  },
  text: {
    markerClass: '',
    wrapper: '',
  },
  note: {
    markerClass: 'text-emerald-600 dark:text-emerald-300',
    wrapper: 'pl-5 border-l-4 border-emerald-300 dark:border-emerald-600',
  },
};

const MARKERS: Record<MassGuideLineType, { en: string; es: string }> = {
  action: {
    en: 'Action',
    es: 'Acción',
  },
  response: {
    en: 'Response',
    es: 'Respuesta',
  },
  text: {
    en: '',
    es: '',
  },
  note: {
    en: 'Note',
    es: 'Nota',
  },
};

export default function MassGuidePage() {
  const { language } = useLanguage();
  const ui = getUI(language);
  usePageEngagement('mass-guide');
  const guide = getMassGuide(language);

  const renderLine = (lineType: MassGuideLineType, text: string, index: number) => {
    const styles = LINE_STYLES[lineType];

    if (lineType === 'text') {
      return (
        <p
          key={`line-${index}`}
          className="leading-relaxed text-gray-800 dark:text-gray-200"
        >
          {text}
        </p>
      );
    }

    return (
      <div
        key={`line-${index}`}
        className={`py-2 ${styles.wrapper}`}
      >
        <div className="flex items-start gap-2">
          <span className={`font-semibold ${styles.markerClass}`}>
            {`${MARKERS[lineType][language]}: `}
          </span>
          <p className="flex-1 leading-relaxed text-gray-800 dark:text-gray-200">{text}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      <nav className="no-print sticky top-0 z-50 border-b border-[color:color-mix(in_srgb,var(--foreground) 12%,transparent)] bg-[var(--background)] bg-opacity-90 backdrop-blur-md">
        <div className="max-w-3xl w-full mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
            {ui.back || 'Back'}
          </Link>

          <div className="flex items-center gap-3">
            <LanguageToggleCompact />
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
              title={language === 'es' ? 'Imprimir' : 'Print'}
            >
              <Printer size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl w-full mx-auto px-6 py-10 space-y-8">
        <header className="text-center space-y-2">
          <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 small-caps">{guide.version}</p>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight">{guide.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{guide.subtitle}</p>
        </header>

        <section className="space-y-6">
          {guide.sections.map((section) => (
            <article
              key={section.id}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-stone-100 dark:bg-gray-900/70 p-6"
            >
              <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-5">{section.title}</h2>
              <div className="space-y-3">
                {section.lines.map((line, index) =>
                  renderLine(line.type, language === 'en' ? line.en : line.es, index)
                )}
              </div>
            </article>
          ))}
        </section>

        {guide.sources.length > 0 && (
          <section className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/40 p-6">
            <h2 className="text-xl font-medium mb-4">{language === 'es' ? 'Fuentes' : 'Sources'}</h2>
            <ul className="space-y-2 text-sm">
              {guide.sources.map((source) => (
                <li key={source.en}>
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sky-700 dark:text-sky-300 hover:underline"
                    >
                      <ExternalLink size={14} />
                      {language === 'en' ? source.en : source.es}
                    </a>
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">
                      {language === 'en' ? source.en : source.es}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          {ui.footer}
        </footer>
      </main>
    </div>
  );
}
