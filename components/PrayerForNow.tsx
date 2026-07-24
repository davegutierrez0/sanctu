'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock3, Download } from 'lucide-react';

import { useLanguage } from '@/components/ThemeProvider';
import {
  PRAYER_HOURS,
  getPrayerHour,
  getSuggestedPrayerHour,
  type PrayerHourId,
} from '@/lib/data/prayer-rhythm';

function subscribeToLocalTime(onChange: () => void): () => void {
  const timer = window.setInterval(onChange, 60_000);
  document.addEventListener('visibilitychange', onChange);
  return () => {
    window.clearInterval(timer);
    document.removeEventListener('visibilitychange', onChange);
  };
}

function getSuggestedId(): PrayerHourId {
  return getSuggestedPrayerHour().id;
}

export function PrayerForNow() {
  const { language } = useLanguage();
  const suggestedId = useSyncExternalStore(
    subscribeToLocalTime,
    getSuggestedId,
    () => 'morning-prayer' as PrayerHourId,
  );
  const [selectedId, setSelectedId] = useState<PrayerHourId | null>(null);
  const prayerHour = getPrayerHour(selectedId ?? suggestedId);
  const isSuggested = selectedId === null || selectedId === suggestedId;

  const text = language === 'es'
    ? {
        eyebrow: 'Oración para este momento',
        suggested: 'Sugerida según tu hora local',
        choose: 'Elige una hora de oración',
        pray: 'Rezar ahora',
        offline: 'Alternativa sin conexión',
      }
    : {
        eyebrow: 'Prayer for now',
        suggested: 'Suggested from your local time',
        choose: 'Choose a prayer hour',
        pray: 'Pray now',
        offline: 'Offline alternative',
      };

  const primaryAction = prayerHour.officialExternal ? (
    <a
      className="primary-button"
      href={prayerHour.officialHref}
      target="_blank"
      rel="noopener noreferrer"
    >
      {text.pray}
      <ArrowUpRight aria-hidden="true" size={17} />
      <span className="sr-only">
        {language === 'es' ? ' (se abre en una pestaña nueva)' : ' (opens in a new tab)'}
      </span>
    </a>
  ) : (
    <Link className="primary-button" href={prayerHour.officialHref}>
      {text.pray}
      <Clock3 aria-hidden="true" size={17} />
    </Link>
  );

  return (
    <section id="prayer-for-now" className="prayer-now stone-card reveal-up">
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">{text.eyebrow}</p>
          <h2>{prayerHour.title[language]}</h2>
        </div>
        {isSuggested && <span className="time-badge"><Clock3 aria-hidden="true" size={14} />{text.suggested}</span>}
      </div>

      <label className="hour-select">
        <span>{text.choose}</span>
        <select
          value={selectedId ?? suggestedId}
          onChange={(event) => setSelectedId(event.target.value as PrayerHourId)}
        >
          {PRAYER_HOURS.map((hour) => (
            <option key={hour.id} value={hour.id}>{hour.title[language]}</option>
          ))}
        </select>
      </label>

      <p className="prayer-now-description">{prayerHour.description[language]}</p>
      <div className="button-row">
        {primaryAction}
        <Link className="secondary-button" href={prayerHour.offlineHref}>
          <Download aria-hidden="true" size={17} />
          <span>{text.offline}: {prayerHour.offlineLabel[language]}</span>
        </Link>
      </div>
    </section>
  );
}
