export type LiturgicalLanguage = 'en' | 'es';

const SEASONS = {
  'ordinary time': { en: 'Ordinary Time', es: 'Tiempo Ordinario' },
  'tiempo ordinario': { en: 'Ordinary Time', es: 'Tiempo Ordinario' },
  advent: { en: 'Advent', es: 'Adviento' },
  adviento: { en: 'Advent', es: 'Adviento' },
  lent: { en: 'Lent', es: 'Cuaresma' },
  cuaresma: { en: 'Lent', es: 'Cuaresma' },
  easter: { en: 'Easter', es: 'Pascua' },
  pascua: { en: 'Easter', es: 'Pascua' },
  christmas: { en: 'Christmas', es: 'Navidad' },
  navidad: { en: 'Christmas', es: 'Navidad' },
} as const;

/**
 * Keeps common liturgical seasons aligned with the selected app language.
 * This also makes an older offline cache safe to show during a language change.
 */
export function localizeLiturgicalSeason(
  season: string | undefined,
  language: LiturgicalLanguage,
): string | undefined {
  if (!season) return undefined;

  const localized = SEASONS[season.trim().toLowerCase() as keyof typeof SEASONS];
  return localized ? localized[language] : season;
}

type LiturgicalHeroSummary = {
  language?: LiturgicalLanguage;
  saint?: string;
  season?: string;
};

export function getLocalizedLiturgicalTitle(
  summary: LiturgicalHeroSummary | null,
  language: LiturgicalLanguage,
  fallbackTitle: string,
): string {
  const season = localizeLiturgicalSeason(summary?.season, language);

  // A saint name should never flash in the wrong language while a fresh local
  // response is loading. Known season names can still be safely localized.
  if (summary?.language !== language) return season || fallbackTitle;

  return summary.saint || season || fallbackTitle;
}
