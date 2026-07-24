import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

const globalCss = read("app/globals.css");
const rosaryPage = read("app/rosary/page.tsx");
const readingsPage = read("app/readings/page.tsx");
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

test("announces when links leave Sanctus in a new browser tab", () => {
  for (const source of externalLinkSources) {
    assert.match(source, /opens in a new tab/);
    assert.match(source, /se abre en una pestaña nueva/);
  }
});
