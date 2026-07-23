'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Church } from 'lucide-react';

import { useLanguage } from '@/components/ThemeProvider';
import { cacheReadings, getCachedReadings, type DailyReadings } from '@/lib/db';
import { toLocalISODate } from '@/lib/date';
import { getLocalizedLiturgicalTitle, localizeLiturgicalSeason } from '@/lib/liturgical-copy';

type LiturgicalSummary = Pick<DailyReadings, 'language' | 'liturgicalColor' | 'season' | 'saint'>;

const COLOR_MAP: Record<string, string> = {
  green: '#54705e',
  red: '#9c3f3f',
  white: '#d8caa8',
  violet: '#6f5079',
  purple: '#6f5079',
  rose: '#b96a78',
};

export function LiturgicalHero() {
  const { language } = useLanguage();
  const [summary, setSummary] = useState<LiturgicalSummary | null>(null);
  const isoDate = toLocalISODate();
  const displayDate = new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    async function loadSummary() {
      const cached = await getCachedReadings(isoDate, language).catch(() => undefined);
      if (cached && isActive) {
        setSummary(cached);
      }

      try {
        const response = await fetch(`/api/readings?date=${isoDate}&lang=${language}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const fresh = await response.json() as Omit<DailyReadings, 'date' | 'fetchedAt'>;
        const localizedFresh = { ...fresh, language: fresh.language ?? language };
        if (isActive) setSummary(localizedFresh);
        await cacheReadings({ ...localizedFresh, date: isoDate, fetchedAt: Date.now() });
      } catch {
        // The cached summary, when present, remains visible offline.
      }
    }

    loadSummary();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, [isoDate, language]);

  const text = language === 'es'
    ? {
        fallbackTitle: 'Hoy en la Iglesia',
        readings: 'Lecturas de hoy',
        mass: 'Guía de la Misa',
      }
    : {
        fallbackTitle: 'Today in the Church',
        readings: "Today's readings",
        mass: 'Mass guide',
      };
  const season = localizeLiturgicalSeason(summary?.season, language);
  const title = getLocalizedLiturgicalTitle(summary, language, text.fallbackTitle);
  const hasLocalizedSaint = summary?.language === language && Boolean(summary.saint);
  const color = COLOR_MAP[(summary?.liturgicalColor ?? '').toLowerCase()] ?? '#b98a3e';

  return (
    <section className="liturgical-hero reveal-up">
      <div className="hero-art" aria-hidden="true">
        <Image
          src="/art/gothic-stone-glass.png"
          alt=""
          fill
          priority
          sizes="(max-width: 760px) 100vw, 920px"
        />
      </div>
      <div className="hero-content">
        <p className="hero-date">{displayDate}</p>
        <div className="hero-title-row">
          <span className="liturgical-color" style={{ backgroundColor: color }} aria-hidden="true" />
          <h1>{title}</h1>
        </div>
        {hasLocalizedSaint && season && <p className="hero-season">{season}</p>}
        <div className="hero-actions">
          <Link href="/readings"><BookOpen aria-hidden="true" size={18} />{text.readings}</Link>
          <Link href="/mass-guide"><Church aria-hidden="true" size={18} />{text.mass}</Link>
        </div>
      </div>
    </section>
  );
}
