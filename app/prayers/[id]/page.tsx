'use client';

import { COMMON_PRAYERS, PRAYER_UI, getLocalizedPrayer } from '@/lib/data/prayers';
import { useLanguage } from '@/components/ThemeProvider';
import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use, useEffect } from 'react';
import { analytics } from '@/lib/analytics';
import { usePageEngagement } from '@/hooks/usePageEngagement';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';

export default function PrayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { language } = useLanguage();
  const ui = PRAYER_UI[language];
  const basePrayer = COMMON_PRAYERS.find((p) => p.id === id);
  const prayerExists = Boolean(basePrayer);

  usePageEngagement(`prayer-${id}`);

  useEffect(() => {
    if (prayerExists) {
      analytics.prayerViewed(id, language);
    }
  }, [id, language, prayerExists]);

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

      <div className="sanctus-page">
        <AppHeader
          backHref="/prayers"
          backLabel={ui.backToPrayers}
          action={(
            <button
              onClick={() => { analytics.printClicked(`prayer-${id}`); window.print(); }}
              className="header-control"
              aria-label={ui.print}
            >
              <Printer size={18} />
            </button>
          )}
        />

        <main className="sanctus-content content-page narrow-page">
          <header className="page-heading centered">
            <p className="eyebrow">Sanctus</p>
            <h1>{title}</h1>
            {prayer.latin && (
              <p className="latin-subtitle">{prayer.latin}</p>
            )}
          </header>

          <article className="prayer-reading stone-card prayer-text">
            {text.split('\n\n').map((paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}
          </article>

          {/* Back Button */}
          <div className="no-print mt-16 text-center">
            <Link
              href="/prayers"
              className="secondary-button px-6"
            >
              <ArrowLeft size={18} />
              {ui.backToPrayers}
            </Link>
          </div>
        </main>
        <BottomNav />
      </div>

      {/* Print Footer */}
      <div className="print-footer" data-date={today} style={{ display: 'none' }}>
        Printed from Sanctu App - {today}
      </div>
    </>
  );
}
