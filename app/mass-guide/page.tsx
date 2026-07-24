'use client';

import { BookOpen, ChevronRight, ExternalLink, Printer } from 'lucide-react';
import Link from 'next/link';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/components/ThemeProvider';
import { ReadingContent } from '@/components/ReadingContent';
import { getMassGuide, MassGuideLineType, type MassGuideReadingSlot } from '@/lib/data/mass-guide';
import { getUI } from '@/lib/data/ui';
import { toLocalISODate } from '@/lib/date';
import type { DailyReading } from '@/lib/db';
import { usePageEngagement } from '@/hooks/usePageEngagement';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';

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

const READING_SLOT_LABELS: Record<MassGuideReadingSlot, { en: string; es: string }> = {
  first: {
    en: "Today's First Reading",
    es: 'Primera lectura de hoy',
  },
  psalm: {
    en: "Today's Responsorial Psalm",
    es: 'Salmo responsorial de hoy',
  },
  second: {
    en: "Today's Second Reading",
    es: 'Segunda lectura de hoy',
  },
  alleluia: {
    en: "Today's Gospel Acclamation",
    es: 'Aclamación del Evangelio de hoy',
  },
  gospel: {
    en: "Today's Gospel",
    es: 'Evangelio de hoy',
  },
};

interface ReadingsResponse {
  readings?: DailyReading[];
  error?: string;
}

export default function MassGuidePage() {
  const { language } = useLanguage();
  const ui = getUI(language);
  usePageEngagement('mass-guide');
  const guide = getMassGuide(language);
  const [dailyReadings, setDailyReadings] = useState<DailyReading[]>([]);
  const [readingsLoading, setReadingsLoading] = useState(true);
  const [readingsError, setReadingsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchDailyReadings = async () => {
      try {
        setReadingsLoading(true);
        setReadingsError(null);

        const response = await fetch(`/api/readings?date=${toLocalISODate()}&lang=${language}`);
        const data = (await response.json()) as ReadingsResponse;

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch daily readings');
        }

        if (!cancelled) {
          setDailyReadings(Array.isArray(data.readings) ? data.readings : []);
        }
      } catch (error) {
        if (!cancelled) {
          setDailyReadings([]);
          setReadingsError(
            error instanceof Error ? error.message : 'Unable to load daily readings'
          );
        }
      } finally {
        if (!cancelled) {
          setReadingsLoading(false);
        }
      }
    };

    fetchDailyReadings();

    return () => {
      cancelled = true;
    };
  }, [language]);

  const readingsByType = useMemo(
    () =>
      dailyReadings.reduce<Partial<Record<MassGuideReadingSlot, DailyReading>>>((acc, reading) => {
        if (!acc[reading.type]) {
          acc[reading.type] = reading;
        }
        return acc;
      }, {}),
    [dailyReadings]
  );

  const renderLine = (lineType: MassGuideLineType, text: string, index: number) => {
    const styles = LINE_STYLES[lineType];

    if (lineType === 'text') {
      return (
        <p
          key={`line-${index}`}
          className="whitespace-pre-line leading-relaxed text-gray-800 dark:text-gray-200"
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
          <p className="flex-1 whitespace-pre-line leading-relaxed text-gray-800 dark:text-gray-200">{text}</p>
        </div>
      </div>
    );
  };

  const renderReadingSlot = (slot: MassGuideReadingSlot) => {
    const reading = readingsByType[slot];

    if (readingsLoading && slot === 'first') {
      return (
        <div className="rounded-xl border border-sky-200 dark:border-sky-900/70 bg-sky-50/70 dark:bg-sky-950/20 p-4 text-sm text-sky-800 dark:text-sky-200">
          {language === 'es' ? 'Cargando las lecturas de hoy...' : "Loading today's readings..."}
        </div>
      );
    }

    if (readingsError && slot === 'first') {
      return (
        <div className="rounded-xl border border-red-200 dark:border-red-900/70 bg-red-50/70 dark:bg-red-950/20 p-4 text-sm text-red-800 dark:text-red-200">
          {readingsError}
        </div>
      );
    }

    if (!reading) return null;

    return (
      <details
        open
        className="group rounded-xl border border-sky-200 dark:border-sky-900/70 bg-white/70 dark:bg-gray-950/30 p-4"
      >
        <summary className="list-none cursor-pointer space-y-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <span className="font-semibold text-sky-700 dark:text-sky-300">
              {READING_SLOT_LABELS[slot][language]}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{reading.label}</span>
          </div>
          <p className="text-lg font-light text-gray-900 dark:text-gray-100">{reading.citation}</p>
        </summary>
        <div className="prayer-text mt-4 border-t border-gray-200 dark:border-gray-800 pt-4 text-gray-800 dark:text-gray-200">
          <ReadingContent reading={reading} />
        </div>
      </details>
    );
  };

  return (
    <div className="sanctu-page">
      <AppHeader
        backHref="/"
        backLabel={ui.back || 'Back'}
        action={(
          <button
            onClick={() => window.print()}
            className="header-control"
            title={language === 'es' ? 'Imprimir' : 'Print'}
            aria-label={language === 'es' ? 'Imprimir' : 'Print'}
          >
            <Printer size={18} />
          </button>
        )}
      />

      <main className="sanctu-content content-page mass-guide-page">
        <header className="page-heading centered">
          <p className="eyebrow">{guide.version}</p>
          <h1>{guide.title}</h1>
          <p>{guide.subtitle}</p>
        </header>

        <Link href="/readings" className="mass-readings-action stone-card no-print">
          <span className="feature-icon sapphire"><BookOpen aria-hidden="true" size={21} /></span>
          <span>
            <strong>{language === 'es' ? 'Lecturas de hoy' : "Today's readings"}</strong>
            <small>{language === 'es' ? 'Abre la página de lecturas para navegar por fecha.' : 'Open the reading companion to move between dates.'}</small>
          </span>
          <ChevronRight aria-hidden="true" size={20} />
        </Link>

        <section className="space-y-6">
          {guide.sections.map((section) => (
            <article
              key={section.id}
              className="mass-section stone-card"
            >
              <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-5">{section.title}</h2>
              <div className="space-y-3">
                {section.lines.map((line, index) => (
                  <Fragment key={`${section.id}-${index}`}>
                    {renderLine(line.type, language === 'en' ? line.en : line.es, index)}
                    {line.readingSlot ? renderReadingSlot(line.readingSlot) : null}
                  </Fragment>
                ))}
              </div>
            </article>
          ))}
        </section>

        {guide.sources.length > 0 && (
          <section className="sources-card stone-card">
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
                      <span className="sr-only">
                        {language === 'es' ? ' (se abre en una pestaña nueva)' : ' (opens in a new tab)'}
                      </span>
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
      <BottomNav />
    </div>
  );
}
