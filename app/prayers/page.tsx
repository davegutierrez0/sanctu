'use client';

import { PRAYER_UI } from '@/lib/data/prayers';
import { useLanguage } from '@/components/ThemeProvider';
import { usePageEngagement } from '@/hooks/usePageEngagement';
import { PrayerLibrary } from '@/components/PrayerLibrary';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';

export default function PrayersIndexPage() {
  const { language } = useLanguage();
  const ui = PRAYER_UI[language];
  usePageEngagement('prayers');

  return (
    <div className="sanctu-page">
      <AppHeader backHref="/" backLabel={ui.backToHome} />

      <main className="sanctu-content content-page">
        <header className="page-heading">
          <p className="eyebrow">Sanctu</p>
          <h1>{ui.title}</h1>
          <p>{ui.subtitle}</p>
        </header>

        <PrayerLibrary />
      </main>
      <BottomNav />
    </div>
  );
}
