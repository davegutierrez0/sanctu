'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type Language = 'en' | 'es';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  language: Language;
  setLanguage: (language: Language) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

function isLanguage(value: string | null): value is Language {
  return value === 'en' || value === 'es';
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';

  try {
    const saved = localStorage.getItem('theme');
    return isTheme(saved) ? saved : 'system';
  } catch {
    return 'system';
  }
}

function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  try {
    const saved = localStorage.getItem('language');
    return isLanguage(saved) ? saved : 'en';
  } catch {
    return 'en';
  }
}

function saveStoredValue(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [language, setLanguageState] = useState<Language>('en');
  const [isDark, setIsDark] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedTheme = getStoredTheme();
    const storedLanguage = getStoredLanguage();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    setThemeState(storedTheme);
    setLanguageState(storedLanguage);
    setIsDark(storedTheme === 'dark' || (storedTheme === 'system' && prefersDark));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    document.documentElement.lang = language;
  }, [isHydrated, language]);

  useEffect(() => {
    if (!isHydrated) return;
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const shouldUseDark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
      root.classList.toggle('dark', shouldUseDark);
      root.style.colorScheme = shouldUseDark ? 'dark' : 'light';
      setIsDark(shouldUseDark);
    };

    applyTheme();

    if (theme === 'system') {
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [isHydrated, theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    saveStoredValue('theme', newTheme);
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    saveStoredValue('language', newLanguage);
    import('@/lib/analytics').then(({ analytics }) => analytics.languageToggled(newLanguage));
  };

  return (
    <AppContext.Provider value={{ theme, setTheme, isDark, language, setLanguage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function useLanguage() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useLanguage must be used within ThemeProvider');
  }
  return { language: context.language, setLanguage: context.setLanguage };
}

// Re-export the Language type for use elsewhere
export type { Language };
