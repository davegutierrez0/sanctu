'use client';

import { Printer, ExternalLink } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { useLanguage } from '@/components/ThemeProvider';
import { getUI } from '@/lib/data/ui';
import { analytics } from '@/lib/analytics';
import { usePageEngagement } from '@/hooks/usePageEngagement';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';

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
  usePageEngagement('morning-prayer');

  const today = new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    let cancelled = false;

    const fetchMorningPrayer = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/morning-prayer');

        if (!response.ok) {
          throw new Error('Failed to fetch morning prayer');
        }

        const result = await response.json();
        if (cancelled) return;

        setData(result);
        analytics.morningPrayerViewed(new Date().toISOString().split('T')[0], language);
      } catch (err) {
        if (cancelled) return;

        const message = err instanceof Error ? err.message : 'Unable to load morning prayer';
        setError(message);
        analytics.apiError('/api/morning-prayer', 0, message);
        console.error(err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMorningPrayer();

    return () => {
      cancelled = true;
    };
  }, [language]);

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
            className={section.isResponse ? 'office-dialogue is-response' : 'office-dialogue'}
          >
            {section.isResponse && (
              <span className="office-marker" aria-hidden="true">℟.</span>
            )}
            <p>{section.content}</p>
          </div>
        );

      case 'antiphon':
        return (
          <div key={index} className="office-antiphon">
            <span className="office-marker" aria-hidden="true">Ant.</span>
            <p>
              {section.content}
            </p>
          </div>
        );

      case 'psalm-header':
        return (
          <h3
            key={index}
            className="office-psalm-heading"
          >
            {section.content}
          </h3>
        );

      case 'verses':
        // Group verse lines - pairs of lines that belong together
        const lines = section.content.split('\n').filter(l => l.trim());
        return (
          <div key={index} className="office-verses">
            {lines.map((line, lineIdx) => (
              <p key={lineIdx}>
                {line}
              </p>
            ))}
          </div>
        );

      case 'doxology':
        return (
          <div key={index} className="office-doxology">
            <p>
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
          <p key={index} className="office-rubric">
            {section.content}
          </p>
        );

      case 'heading':
        return (
          <h3
            key={index}
            className="office-section-heading"
          >
            {section.content}
          </h3>
        );

      case 'hymn-title':
        return (
          <p key={index} className="office-hymn-title">
            {section.content}
          </p>
        );

      case 'prayer':
        return (
          <div key={index} className="office-prayer">
            <p>
              {section.content}
            </p>
          </div>
        );

      case 'reading-ref':
        return (
          <p key={index} className="office-reference">
            {section.content}
          </p>
        );

      default:
        return (
          <p key={index} className="office-paragraph">
            {section.content}
          </p>
        );
    }
  };

  const renderPart = (part: PrayerPart, partIndex: number): ReactNode => {
    return (
      <article
        key={partIndex}
        className="prayer-part stone-card office-part reveal-up"
      >
        <header className="office-part-header">
          <h2>
            {part.title}
          </h2>
        </header>
        <div className="prayer-text office-body">
          {part.sections.map((section, idx) => renderSection(section, idx))}
        </div>

        {part.link && (
          <footer className="office-part-footer">
            <a
              href={part.link}
              target="_blank"
              rel="noopener noreferrer"
              className="office-source-link"
            >
              <ExternalLink aria-hidden="true" size={15} />
              {language === 'es' ? 'Ver en Divine Office' : 'View on Divine Office'}
              <span className="sr-only">
                {language === 'es' ? ' (se abre en una pestaña nueva)' : ' (opens in a new tab)'}
              </span>
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

      <div className="sanctus-page">
        <AppHeader
          backHref="/"
          backLabel={language === 'es' ? 'Inicio' : 'Home'}
          action={(
            <button
              type="button"
              onClick={() => { analytics.printClicked('morning-prayer'); window.print(); }}
              className="header-control"
              aria-label={language === 'es' ? 'Imprimir' : 'Print'}
            >
              <Printer size={18} />
            </button>
          )}
        />

        <main className="sanctus-content content-page morning-prayer-page">
          <header className="page-heading centered">
            <p className="eyebrow">
              {today}
            </p>
            <h1>{ui.morningPrayer}</h1>
            <p>{ui.morningPrayerDesc}</p>
          </header>

          {/* Loading State */}
          {loading && (
            <div className="office-loading" role="status" aria-live="polite">
              <div className="office-loading-mark animate-spin" aria-hidden="true" />
              <p>{ui.loading}</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="office-error stone-card" role="alert">
              <p>{error}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="office-retry-button"
              >
                {ui.tryAgain}
              </button>
            </div>
          )}

          {/* Prayer Content */}
          {data && data.parts && !loading && (
            <div className="office-parts">
              {data.parts.map((part, idx) => renderPart(part, idx))}
            </div>
          )}
        </main>
        <BottomNav />
      </div>

      {/* Print Footer */}
      <div className="print-footer" data-date={today} style={{ display: 'none' }}>
        Printed from Sanctus App - {today}
      </div>
    </>
  );
}
