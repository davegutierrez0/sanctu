# Gothic Stone Liturgical Companion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the approved Gothic Stone redesign, time-aware liturgical home, expanded offline prayer library, and hardened PWA caches without adding a heavy runtime dependency.

**Architecture:** Keep the App Router and existing client-side language/theme context. Move deterministic Hour selection and prayer filtering into pure modules covered by Node tests, compose shared navigation and home components around those helpers, keep Catholic reference content in bilingual static data, and make the service worker cache the same-origin shell plus previously viewed dynamic data.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 plus project CSS tokens, Dexie, Lucide, native service workers, Node's test runner.

---

### Task 1: Test runner and prayer-rhythm contract

**Files:**
- Modify: `package.json`
- Create: `tests/prayer-rhythm.test.ts`
- Create: `lib/data/prayer-rhythm.ts`

- [ ] Add `"test": "node --test --experimental-strip-types tests/*.test.ts"` to `scripts`.
- [ ] Write tests asserting the six local-time ranges, all five selectable options, localized labels, and offline alternative paths.
- [ ] Run `npm test` and confirm it fails because `lib/data/prayer-rhythm.ts` does not exist.
- [ ] Implement `PrayerHourId`, `PrayerHour`, `PRAYER_HOURS`, and `getSuggestedPrayerHour(date)` with explicit hour boundaries and `en`/`es` copy.
- [ ] Run `npm test` and confirm all rhythm tests pass.

### Task 2: Searchable, favorite-capable prayer library

**Files:**
- Create: `tests/prayer-search.test.ts`
- Create: `lib/prayer-search.ts`
- Modify: `lib/data/prayers.ts`
- Create: `components/PrayerLibrary.tsx`
- Modify: `app/prayers/page.tsx`

- [ ] Write tests proving search is case-insensitive, matches localized title/text and Latin title, filters categories, and returns all prayers for an empty query.
- [ ] Run `npm test` and confirm the search tests fail because `filterPrayers` is missing.
- [ ] Implement `filterPrayers(prayers, language, query, category)` as a pure function with normalized whitespace and lowercase matching.
- [ ] Run `npm test` and confirm search and rhythm tests pass.
- [ ] Extend `Prayer['category']` with `mass`; add the eight approved bilingual prayers; add localized category, search, favorites, empty-state, and favorite-button labels.
- [ ] Implement `PrayerLibrary` with a native search input, category chips, links, and `localStorage` favorites under `sanctus:favorites`; favorites render first and buttons expose `aria-pressed`.
- [ ] Replace the page-local category rendering in `app/prayers/page.tsx` with `PrayerLibrary`.

### Task 3: Original visual asset and Gothic Stone tokens

**Files:**
- Create: `public/art/gothic-stone-glass.png`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `public/manifest.json`

- [ ] Generate one original wide abstract Gothic stained-glass clerestory image with sapphire, ruby, amber, and verdigris panes in restrained limestone tracery; include no people, saints, text, logos, or watermark.
- [ ] Inspect the generated image and copy the selected output into `public/art/gothic-stone-glass.png` without replacing existing assets.
- [ ] Define light and dark material tokens, masonry background layers, display/interface type families, card/button/header/bottom-navigation primitives, safe-area padding, focus treatment, and reduced-motion rules in `globals.css`.
- [ ] Remove the root max-width wrapper in `app/layout.tsx`, set updated metadata/theme colors, and add a pre-hydration theme script so the stored theme does not flash.
- [ ] Update manifest background/theme colors and icon purposes to match the new shell.

### Task 4: Shared shell and liturgical home

**Files:**
- Create: `components/AppHeader.tsx`
- Create: `components/BottomNav.tsx`
- Create: `components/LiturgicalHero.tsx`
- Create: `components/PrayerForNow.tsx`
- Modify: `app/page.tsx`
- Modify: `lib/data/ui.ts`

- [ ] Implement `AppHeader` with brand, localized language control, system/light/dark toggle, optional back link, and optional action content.
- [ ] Implement `BottomNav` with Today, Hours, Mass, and Prayers destinations plus mobile safe-area treatment.
- [ ] Implement `LiturgicalHero` to render the local date immediately, hydrate liturgical metadata from Dexie, refresh `/api/readings`, persist successful metadata, and keep an honest offline fallback.
- [ ] Implement `PrayerForNow` with a native Hour selector, official-online action, existing in-app Morning Prayer route, and localized offline alternative.
- [ ] Recompose `app/page.tsx` into hero, Prayer for Now, Today at Mass, Rosary/prayer-library secondary paths, install/support footer, and persistent bottom navigation.
- [ ] Add all new localized home and navigation strings to `lib/data/ui.ts`.

### Task 5: Apply the approved system to core prayer surfaces

**Files:**
- Modify: `app/readings/page.tsx`
- Modify: `app/mass-guide/page.tsx`
- Modify: `app/morning-prayer/page.tsx`
- Modify: `app/rosary/page.tsx`
- Modify: `app/prayers/[id]/page.tsx`
- Modify: `components/ReadingContent.tsx`

- [ ] Replace duplicated generic navigation with `AppHeader` and add `BottomNav` where it does not obstruct interactive prayer controls.
- [ ] Apply shared page, heading, card, progress, button, rubric, antiphon, and reading classes while preserving every existing state transition and analytics call.
- [ ] Add a prominent localized "Today's readings" companion action to the Mass guide.
- [ ] Keep print buttons and print-only headers intact; ensure decorative art and bottom navigation use `no-print`.
- [ ] Run `npm run lint` and fix only errors introduced by these component edits.

### Task 6: PWA/offline cache hardening

**Files:**
- Create: `tests/service-worker.test.ts`
- Modify: `public/sw.js`
- Create: `public/offline.html`
- Modify: `components/PWAInstaller.tsx`

- [ ] Write source-level tests asserting the service worker includes all static routes and prayer-detail routes, caches same-origin `/_next/static/` assets, handles `/api/readings` and `/api/morning-prayer`, and falls back to `/offline.html` after exact route and home misses.
- [ ] Run `npm test` and confirm the new service-worker tests fail against version `v3`.
- [ ] Implement version `v4`, resilient install precaching with `Promise.allSettled`, stale-while-revalidate dynamic API caching, runtime static-asset caching, and layered navigation fallback.
- [ ] Add a dependency-free, bilingual-friendly static offline page styled with the Gothic Stone palette.
- [ ] Update registration to call `registration.update()` and avoid noisy production success logging while retaining error logging.
- [ ] Run `npm test` and confirm all test files pass.

### Task 7: End-to-end verification

**Files:**
- Modify only if verification reveals a defect in an already changed file.

- [ ] Run `npm test` and require zero failures.
- [ ] Run `npm run lint` and require zero errors or warnings.
- [ ] Run `npm run build` and require a successful production build.
- [ ] Start the production server, verify the 390-pixel light and dark home screens, Hour selector, prayer search/favorites, Mass/readings navigation, and console output in a real browser.
- [ ] Verify service-worker registration and named cache creation, then simulate offline mode and navigate to a cached static prayer route.
- [ ] Review all changed TSX files against the React best-practices checklist and make only scoped fixes.
- [ ] Inspect `git diff --check`, `git status --short`, and the final diff before handoff.
