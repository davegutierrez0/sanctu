'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookHeart, BookOpen, ChevronRight, Church, Coffee, Heart, RefreshCw } from 'lucide-react';

import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { FeedbackAnnouncement } from '@/components/FeedbackAnnouncement';
import { LiturgicalHero } from '@/components/LiturgicalHero';
import { PrayerForNow } from '@/components/PrayerForNow';
import { useLanguage } from '@/components/ThemeProvider';
import { analytics } from '@/lib/analytics';
import { clearAllData } from '@/lib/db';
import { usePageEngagement } from '@/hooks/usePageEngagement';

const HOME_TEXT = {
  en: {
    massEyebrow: 'Today at Mass',
    massTitle: 'Arrive ready to listen and respond',
    readings: "Today's Mass readings",
    readingsDescription: 'Read, pray, and cache the complete readings for the day.',
    guide: 'Bilingual Mass guide',
    guideDescription: 'The ordinary of the Mass with English and Spanish responses.',
    continueEyebrow: 'Keep close',
    continueTitle: 'Prayer for the rest of the day',
    rosary: 'Pray the Rosary',
    rosaryDescription: 'Mysteries, meditations, and saved progress.',
    library: 'Prayer library',
    libraryDescription: 'Searchable devotions for daily life and the Mass.',
    footer: 'Made with prayer for the faithful.',
    support: 'Support this free app',
    settings: 'Offline data & settings',
    clear: 'Clear offline data',
    clearing: 'Clearing…',
    clearPrompt: 'Clear all offline data and caches? This will reset the app.',
    clearError: 'The cache could not be cleared. Please try again.',
  },
  es: {
    massEyebrow: 'Hoy en la Misa',
    massTitle: 'Llega preparado para escuchar y responder',
    readings: 'Lecturas de la Misa de hoy',
    readingsDescription: 'Lee, reza y guarda sin conexión las lecturas completas del día.',
    guide: 'Guía bilingüe de la Misa',
    guideDescription: 'El ordinario de la Misa con respuestas en inglés y español.',
    continueEyebrow: 'Ten a mano',
    continueTitle: 'Oración para el resto del día',
    rosary: 'Rezar el Rosario',
    rosaryDescription: 'Misterios, meditaciones y progreso guardado.',
    library: 'Biblioteca de oraciones',
    libraryDescription: 'Devociones para la vida diaria y la Misa.',
    footer: 'Hecho con oración para los fieles.',
    support: 'Apoya esta aplicación gratuita',
    settings: 'Datos sin conexión y ajustes',
    clear: 'Borrar datos sin conexión',
    clearing: 'Borrando…',
    clearPrompt: '¿Borrar todos los datos y cachés? Esto restablecerá la aplicación.',
    clearError: 'No se pudo borrar el caché. Inténtalo de nuevo.',
  },
} as const;

export default function HomePage() {
  const { language } = useLanguage();
  const text = HOME_TEXT[language];
  const [isClearing, setIsClearing] = useState(false);
  usePageEngagement('home');

  const clearAllCaches = async () => {
    if (!window.confirm(text.clearPrompt)) return;
    setIsClearing(true);

    try {
      await clearAllData();
      localStorage.clear();

      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      }

      analytics.cacheCleared();
      window.location.reload();
    } catch {
      setIsClearing(false);
      window.alert(text.clearError);
    }
  };

  return (
    <div className="sanctus-page home-page">
      <AppHeader />
      <main className="sanctus-content home-content">
        <LiturgicalHero />
        <FeedbackAnnouncement />
        <PrayerForNow />

        <section className="home-section reveal-up">
          <div className="section-intro">
            <p className="eyebrow">{text.massEyebrow}</p>
            <h2>{text.massTitle}</h2>
          </div>
          <div className="feature-grid">
            <Link href="/readings" className="feature-card stone-card">
              <span className="feature-icon sapphire"><BookOpen aria-hidden="true" size={22} /></span>
              <span>
                <strong>{text.readings}</strong>
                <small>{text.readingsDescription}</small>
              </span>
              <ChevronRight aria-hidden="true" size={20} />
            </Link>
            <Link href="/mass-guide" className="feature-card stone-card">
              <span className="feature-icon amber"><Church aria-hidden="true" size={22} /></span>
              <span>
                <strong>{text.guide}</strong>
                <small>{text.guideDescription}</small>
              </span>
              <ChevronRight aria-hidden="true" size={20} />
            </Link>
          </div>
        </section>

        <section className="home-section reveal-up">
          <div className="section-intro">
            <p className="eyebrow">{text.continueEyebrow}</p>
            <h2>{text.continueTitle}</h2>
          </div>
          <div className="feature-grid compact">
            <Link href="/rosary" className="feature-card stone-card">
              <span className="feature-icon ruby"><Heart aria-hidden="true" size={22} /></span>
              <span>
                <strong>{text.rosary}</strong>
                <small>{text.rosaryDescription}</small>
              </span>
              <ChevronRight aria-hidden="true" size={20} />
            </Link>
            <Link href="/prayers" className="feature-card stone-card">
              <span className="feature-icon verdigris"><BookHeart aria-hidden="true" size={22} /></span>
              <span>
                <strong>{text.library}</strong>
                <small>{text.libraryDescription}</small>
              </span>
              <ChevronRight aria-hidden="true" size={20} />
            </Link>
          </div>
        </section>

        <footer className="home-footer no-print">
          <p>{text.footer}</p>
          <a
            href="https://buymeacoffee.com/davegutierrez0"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analytics.coffeeClicked()}
          >
            <Coffee aria-hidden="true" size={16} />
            {text.support}
            <span className="sr-only">
              {language === 'es' ? ' (se abre en una pestaña nueva)' : ' (opens in a new tab)'}
            </span>
          </a>
          <details>
            <summary>{text.settings}</summary>
            <button type="button" onClick={clearAllCaches} disabled={isClearing}>
              <RefreshCw aria-hidden="true" size={15} className={isClearing ? 'spin' : ''} />
              {isClearing ? text.clearing : text.clear}
            </button>
          </details>
        </footer>
      </main>
      <BottomNav />
    </div>
  );
}
