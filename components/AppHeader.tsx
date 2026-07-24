'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Monitor, Moon, Sun } from 'lucide-react';

import { useLanguage, useTheme } from '@/components/ThemeProvider';
import { analytics } from '@/lib/analytics';

type AppHeaderProps = {
  backHref?: string;
  backLabel?: string;
  action?: ReactNode;
};

export function AppHeader({ backHref, backLabel, action }: AppHeaderProps) {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const nextTheme = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';

  const cycleTheme = () => {
    setTheme(nextTheme);
    if (nextTheme !== 'system') analytics.themeToggled(nextTheme);
  };

  const themeNames = language === 'es'
    ? { system: 'del sistema', light: 'claro', dark: 'oscuro' }
    : { system: 'system', light: 'light', dark: 'dark' };
  const currentThemeLabel = themeNames[theme];
  const nextThemeLabel = themeNames[nextTheme];
  const themeLabel = language === 'es'
    ? `Tema actual: ${currentThemeLabel}. Cambiar al tema ${nextThemeLabel}.`
    : `Theme: ${currentThemeLabel}. Switch to ${nextThemeLabel} theme.`;

  const ThemeIcon = theme === 'system' ? Monitor : theme === 'light' ? Sun : Moon;

  return (
    <header className="app-header no-print">
      <div className="app-header-inner">
        {backHref ? (
          <Link href={backHref} className="header-back">
            <ArrowLeft aria-hidden="true" size={18} />
            <span>{backLabel ?? (language === 'es' ? 'Volver' : 'Back')}</span>
          </Link>
        ) : (
          <Link href="/" className="brand-lockup" aria-label="Sanctus home">
            <span className="brand-mark" aria-hidden="true">✦</span>
            <span>Sanctus</span>
          </Link>
        )}

        <div className="header-actions">
          {action}
          <button
            type="button"
            className="header-control language-control"
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            aria-label={language === 'en' ? 'Cambiar a español' : 'Switch to English'}
          >
            {language === 'en' ? 'ES' : 'EN'}
          </button>
          <button
            type="button"
            className="header-control"
            onClick={cycleTheme}
            aria-label={themeLabel}
            title={themeLabel}
            data-theme-toggle
          >
            <ThemeIcon aria-hidden="true" size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
