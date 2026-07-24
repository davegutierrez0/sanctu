import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file: string) => readFileSync(path.join(root, file), "utf8");
const colorChannels = (hex: string) => [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
const luminance = (hex: string) => {
  const [red, green, blue] = colorChannels(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};
const contrast = (foreground: string, background: string) => {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
};

const globalCss = read("app/globals.css");
const rosaryPage = read("app/rosary/page.tsx");
const readingsPage = read("app/readings/page.tsx");
const morningPrayerPage = read("app/morning-prayer/page.tsx");
const bottomNav = read("components/BottomNav.tsx");
const appHeader = read("components/AppHeader.tsx");
const themeProvider = read("components/ThemeProvider.tsx");
const feedbackAnnouncement = read("components/FeedbackAnnouncement.tsx");
const externalLinkSources = [
  read("app/page.tsx"),
  read("app/mass-guide/page.tsx"),
  read("app/morning-prayer/page.tsx"),
  read("components/FeedbackAnnouncement.tsx"),
  read("components/PrayerForNow.tsx"),
];

test("lets button utility and component styles control readable foreground colors", () => {
  assert.doesNotMatch(globalCss, /button,\s*\ninput,\s*\nselect\s*\{[^}]*color:\s*inherit/);
  assert.doesNotMatch(globalCss, /button,\s*\ninput,\s*\nselect\s*\{[^}]*font:\s*inherit/);
  assert.match(globalCss, /--accent-contrast:/);
  assert.match(globalCss, /--ruby-action:/);
  assert.match(globalCss, /\.primary-button\s*\{[^}]*color:\s*var\(--accent-contrast\)/s);
  assert.match(globalCss, /\.filter-chip\.is-active\s*\{[^}]*color:\s*var\(--accent-contrast\)/s);
});

test("gives the Rosary selector and progress meaningful selected-state semantics", () => {
  assert.match(rosaryPage, /role="group"/);
  assert.match(rosaryPage, /aria-label=\{ui\.selectMystery\}/);
  assert.match(rosaryPage, /aria-pressed=\{mysteryType === key\}/);
  assert.match(rosaryPage, /rosary-mystery-option/);
  assert.match(rosaryPage, /role="progressbar"/);
  assert.match(rosaryPage, /aria-valuenow=\{Math\.round\(progress\)\}/);
  assert.match(rosaryPage, /<h2 className="text-2xl font-light mb-6 tracking-tight">\{ui\.allMysteries\}<\/h2>/);
  assert.match(rosaryPage, /<h3 className="font-medium mb-1">/);
});

test("themes Morning Prayer with the shared Gothic Stone palette", () => {
  assert.doesNotMatch(morningPrayerPage, /(?:text|bg|border)-purple-/);
  assert.doesNotMatch(readingsPage, /(?:text|bg|border)-purple-/);
  assert.match(morningPrayerPage, /morning-prayer-page/);
  assert.match(morningPrayerPage, /office-antiphon/);
  assert.match(morningPrayerPage, /office-psalm-heading/);
  assert.match(morningPrayerPage, /office-rubric/);
  assert.match(morningPrayerPage, /office-reference/);
  assert.match(globalCss, /\.office-antiphon\s*\{[^}]*background:[^}]*var\(--accent-soft\)/s);
  assert.match(globalCss, /\.office-psalm-heading\s*\{[^}]*color:\s*var\(--sapphire\)/s);
  assert.match(globalCss, /\.office-rubric\s*\{[^}]*color:\s*var\(--ruby\)/s);
  assert.match(globalCss, /\.office-source-link\s*\{[^}]*min-height:\s*44px;/s);
  assert.match(globalCss, /\.reading-label\s*\{[^}]*color:\s*var\(--sapphire\)/s);

  const darkTokens = globalCss.match(/\.dark\s*\{(?<tokens>[^}]*)\}/)?.groups?.tokens ?? "";
  const darkSapphire = darkTokens.match(/--sapphire:\s*(#[0-9a-f]{6})/i)?.[1] ?? "#000000";
  const darkSurface = darkTokens.match(/--surface-strong:\s*(#[0-9a-f]{6})/i)?.[1] ?? "#ffffff";
  assert.ok(contrast(darkSapphire, darkSurface) >= 4.5, "dark sapphire accents must remain readable on stone cards");
});

test("keeps primary mobile controls at least 44 pixels tall", () => {
  assert.match(globalCss, /\.header-control\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px;/s);
  assert.match(globalCss, /\.feedback-form-tabs button\s*\{[^}]*min-height:\s*44px;/s);
  assert.match(globalCss, /\.filter-chip\s*\{[^}]*min-height:\s*44px;/s);
  assert.match(globalCss, /\.rosary-mystery-option\s*\{[^}]*min-height:\s*44px;/s);
  assert.match(globalCss, /\.rosary-disclosure\s*\{[^}]*min-height:\s*44px;/s);
  assert.match(globalCss, /\.home-footer summary\s*\{[^}]*min-height:\s*44px;/s);
  assert.match(globalCss, /\.home-footer details button\s*\{[^}]*min-height:\s*44px;/s);
  assert.equal((readingsPage.match(/min-h-11/g) ?? []).length, 2);
});

test("announces current navigation, contact mode, and the theme button action", () => {
  assert.match(bottomNav, /aria-current=\{active \? 'page' : undefined\}/);
  assert.match(feedbackAnnouncement, /aria-pressed=\{mode === 'subscribe'\}/);
  assert.match(feedbackAnnouncement, /aria-pressed=\{mode === 'feedback'\}/);
  assert.match(appHeader, /Switch to \$\{nextThemeLabel\} theme/);
  assert.match(appHeader, /Cambiar al tema \$\{nextThemeLabel\}/);
});

test("does not let the initial system preference overwrite the saved theme during hydration", () => {
  assert.match(themeProvider, /const \[isHydrated, setIsHydrated\] = useState\(false\)/);
  assert.match(themeProvider, /if \(!isHydrated\) return;/);
});

test("announces when links leave Sanctu in a new browser tab", () => {
  for (const source of externalLinkSources) {
    assert.match(source, /opens in a new tab/);
    assert.match(source, /se abre en una pestaña nueva/);
  }
});
