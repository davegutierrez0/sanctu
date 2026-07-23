import { track } from '@vercel/analytics';

export const analytics = {
  // Readings
  readingsViewed: (date: string, lang: string, cacheState: string) =>
    track('readings_viewed', { date, lang, cache: cacheState }),
  readingsNavigated: (direction: 'prev' | 'next', date: string) =>
    track('readings_nav', { direction, date }),

  // Rosary
  rosaryStarted: (mystery: string, lang: string) =>
    track('rosary_started', { mystery, lang }),
  rosaryDecadeCompleted: (decade: number, mystery: string) =>
    track('rosary_decade', { decade: String(decade), mystery }),
  rosaryCompleted: (mystery: string, lang: string) =>
    track('rosary_completed', { mystery, lang }),
  rosaryReset: () => track('rosary_reset'),
  mysteryChanged: (mystery: string) => track('mystery_changed', { mystery }),
  fatimaPrayerToggled: (enabled: boolean) =>
    track('fatima_toggled', { enabled: String(enabled) }),

  // Prayers
  prayerViewed: (id: string, lang: string) =>
    track('prayer_viewed', { id, lang }),

  // Morning Prayer
  morningPrayerViewed: (date: string, lang: string) =>
    track('morning_prayer_viewed', { date, lang }),

  // User preferences
  themeToggled: (theme: 'light' | 'dark') =>
    track('theme_toggled', { theme }),
  languageToggled: (lang: string) =>
    track('language_toggled', { lang }),

  // Actions
  printClicked: (page: string) => track('print', { page }),
  cacheCleared: () => track('cache_cleared'),
  coffeeClicked: () => track('coffee_clicked'),
  feedbackSubmitted: (lang: string) => track('feedback_submitted', { lang }),

  // PWA
  pwaInstalled: () => track('pwa_installed'),
  pwaPromptShown: () => track('pwa_prompt_shown'),

  // Errors
  apiError: (endpoint: string, status: number, message?: string) =>
    track('api_error', { endpoint, status: String(status), message: message ?? '' }),
  cacheError: (operation: string, error: string) =>
    track('cache_error', { operation, error }),

  // Engagement
  scrollDepth: (page: string, depth: number) =>
    track('scroll_depth', { page, depth: String(depth) }),
  timeOnPage: (page: string, seconds: number) =>
    track('time_on_page', { page, seconds: String(seconds) }),
  offlineUsage: (page: string) => track('offline_usage', { page }),
};
