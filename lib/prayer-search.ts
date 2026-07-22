export type PrayerSearchLanguage = "en" | "es";

export type PrayerSearchItem = {
  id: string;
  title: Record<PrayerSearchLanguage, string>;
  text: Record<PrayerSearchLanguage, string>;
  latin?: string | null;
  category?: string;
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

export function filterPrayers<T extends PrayerSearchItem>(
  prayers: readonly T[],
  language: PrayerSearchLanguage,
  query: string,
  category: "all" | string,
): T[] {
  const needle = normalize(query.trim());

  return prayers.filter((prayer) => {
    if (category !== "all" && prayer.category !== category) return false;
    if (!needle) return true;

    const searchableText = [
      prayer.title[language],
      prayer.text[language],
      prayer.latin ?? "",
    ]
      .map(normalize)
      .join(" ");

    return searchableText.includes(needle);
  });
}
