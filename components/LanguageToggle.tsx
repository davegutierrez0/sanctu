'use client';

import { useLanguage } from './ThemeProvider';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 text-sm font-medium rounded-l-full border transition-colors ${
          language === 'en'
            ? 'bg-amber-700 text-white border-amber-700'
            : 'bg-transparent text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800'
        }`}
        aria-pressed={language === 'en'}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('es')}
        className={`px-3 py-1.5 text-sm font-medium rounded-r-full border border-l-0 transition-colors ${
          language === 'es'
            ? 'bg-amber-700 text-white border-amber-700'
            : 'bg-transparent text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800'
        }`}
        aria-pressed={language === 'es'}
      >
        Espanol
      </button>
    </div>
  );
}

// Compact version for header/nav
export function LanguageToggleCompact() {
  const { language, setLanguage } = useLanguage();

  const toggle = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <button
      onClick={toggle}
      className="px-2 py-1 text-xs font-medium uppercase tracking-wide rounded border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
      title={language === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
    >
      {language === 'en' ? 'ES' : 'EN'}
    </button>
  );
}
