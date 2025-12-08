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

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const saved = localStorage.getItem('theme') as Theme | null;
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem('language') as Language | null;
  return saved ?? 'en';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());
  const [language, setLanguageState] = useState<Language>(() => getInitialLanguage());
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const initialTheme = getInitialTheme();
    if (initialTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return initialTheme === 'dark';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
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
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
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
