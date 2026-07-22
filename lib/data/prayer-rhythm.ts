export type PrayerHourId =
  | "office-readings"
  | "morning-prayer"
  | "daytime-prayer"
  | "evening-prayer"
  | "night-prayer";

type LocalizedText = {
  en: string;
  es: string;
};

export type PrayerHour = {
  id: PrayerHourId;
  title: LocalizedText;
  shortTitle: LocalizedText;
  description: LocalizedText;
  officialHref: string;
  officialExternal: boolean;
  offlineHref: string;
  offlineLabel: LocalizedText;
};

export const PRAYER_HOURS: PrayerHour[] = [
  {
    id: "office-readings",
    title: { en: "Office of Readings", es: "Oficio de Lecturas" },
    shortTitle: { en: "Readings", es: "Lecturas" },
    description: {
      en: "A longer meditation on Scripture and the Church’s tradition.",
      es: "Una meditación más extensa sobre la Escritura y la tradición de la Iglesia.",
    },
    officialHref: "https://divineoffice.org/today/office-of-readings/",
    officialExternal: true,
    offlineHref: "/readings",
    offlineLabel: { en: "Today’s Mass readings", es: "Lecturas de la Misa de hoy" },
  },
  {
    id: "morning-prayer",
    title: { en: "Morning Prayer", es: "Laudes" },
    shortTitle: { en: "Morning", es: "Laudes" },
    description: {
      en: "Begin the day with praise, Scripture, and intercession.",
      es: "Comienza el día con alabanza, Escritura e intercesión.",
    },
    officialHref: "/morning-prayer",
    officialExternal: false,
    offlineHref: "/prayers/morning-offering",
    offlineLabel: { en: "Morning Offering", es: "Ofrecimiento de la mañana" },
  },
  {
    id: "daytime-prayer",
    title: { en: "Daytime Prayer", es: "Hora intermedia" },
    shortTitle: { en: "Daytime", es: "Intermedia" },
    description: {
      en: "Pause in the middle of the day and return your work to God.",
      es: "Haz una pausa a mitad del día y devuelve tu trabajo a Dios.",
    },
    officialHref: "https://divineoffice.org/today/daytime-prayer/",
    officialExternal: true,
    offlineHref: "/prayers/angelus",
    offlineLabel: { en: "The Angelus", es: "El Ángelus" },
  },
  {
    id: "evening-prayer",
    title: { en: "Evening Prayer", es: "Vísperas" },
    shortTitle: { en: "Evening", es: "Vísperas" },
    description: {
      en: "Give thanks for the day and pray with the universal Church.",
      es: "Da gracias por el día y reza con la Iglesia universal.",
    },
    officialHref: "https://divineoffice.org/today/evening-prayer/",
    officialExternal: true,
    offlineHref: "/prayers/daily-examen",
    offlineLabel: { en: "Daily Examen", es: "Examen diario" },
  },
  {
    id: "night-prayer",
    title: { en: "Night Prayer", es: "Completas" },
    shortTitle: { en: "Night", es: "Completas" },
    description: {
      en: "Entrust the night to God with repentance, peace, and hope.",
      es: "Confía la noche a Dios con arrepentimiento, paz y esperanza.",
    },
    officialHref: "https://divineoffice.org/today/compline/",
    officialExternal: true,
    offlineHref: "/prayers/act-of-contrition",
    offlineLabel: { en: "Act of Contrition", es: "Acto de contrición" },
  },
];

export function getPrayerHour(id: PrayerHourId): PrayerHour {
  return PRAYER_HOURS.find((hour) => hour.id === id) ?? PRAYER_HOURS[1];
}

export function getSuggestedPrayerHour(date = new Date()): PrayerHour {
  const hour = date.getHours();

  if (hour < 5 || hour >= 21) return getPrayerHour("night-prayer");
  if (hour < 9) return getPrayerHour("morning-prayer");
  if (hour < 11) return getPrayerHour("office-readings");
  if (hour < 16) return getPrayerHour("daytime-prayer");
  return getPrayerHour("evening-prayer");
}
