# Gothic Stone Liturgical Companion Design

## Objective

Transform Sanctu from a set of useful Catholic utilities into a cohesive, mobile-first liturgical companion. The redesigned PWA should immediately orient the faithful to the Church's day, suggest an appropriate prayer for the user's local time, make Mass participation and traditional prayers easy to reach, and remain useful when the network is unavailable.

## Product priorities

1. The home screen is centered on today's liturgical context rather than a generic feature grid.
2. Local time recommends an appropriate Hour while a selector exposes the other Hours.
3. Today's Mass readings and the bilingual Order of Mass remain prominent, separate actions.
4. The prayer library becomes faster to browse and materially more complete.
5. Static prayers, the Rosary, and the Mass guide remain available offline. Previously viewed readings and Morning Prayer remain available from runtime caches.
6. Visual polish must not add a large animation or JavaScript dependency.

## Approved visual direction: Gothic Stone

The interface follows the visual logic of a Gothic church rather than applying church ornament to every component.

- **Foundation:** pale limestone and graphite in light mode; charcoal masonry and warm vellum text in dark mode.
- **Light:** one original stained-glass artwork is concentrated in the liturgical-day hero. Sapphire, ruby, amber, and verdigris reappear only as small accents.
- **Structure:** subtle mortar courses, narrow borders, shallow stone-like bevels, pointed-arch silhouettes, and restrained tracery establish hierarchy.
- **Typography:** Georgia and platform serif fallbacks provide the editorial/sacred display face; system sans-serif remains the compact interface face. No runtime font download is required.
- **Shape:** compact radii and arched details replace generic large rounded cards.
- **Dark mode:** the layout remains identical. Only material, text, and light tokens crossfade, so the experience feels like the same chapel after sunset.

## Motion

Motion is lightweight CSS only.

- Hero colored light drifts slowly by changing an overlay transform and opacity.
- Cards lift by at most two pixels on hover and compress by one pixel on press.
- Theme colors crossfade over 180–240 ms.
- Page content uses a short fade-and-rise entrance.
- `prefers-reduced-motion: reduce` disables ambient and entrance animation, removes smooth scrolling, and reduces transitions to near-instant changes.

## Home experience

### Liturgical-day hero

The hero shows the localized civil date immediately. It loads cached readings metadata from IndexedDB first, then refreshes `/api/readings` in the background to add season, saint or feast, and liturgical color. If both the cache and network are unavailable, the hero still renders the date and an explicit offline state.

The generated artwork is decorative and has empty alt text. Liturgical information remains real HTML text and never depends on image text.

### Prayer for now

A pure local-time function selects one of five options:

| Local time | Suggested Hour |
| --- | --- |
| 00:00–04:59 | Night Prayer (Compline) |
| 05:00–08:59 | Morning Prayer (Lauds) |
| 09:00–10:59 | Office of Readings |
| 11:00–15:59 | Daytime Prayer |
| 16:00–20:59 | Evening Prayer (Vespers) |
| 21:00–23:59 | Night Prayer (Compline) |

The selector allows any Hour to be chosen without changing the default algorithm. Morning Prayer opens the existing in-app cached experience. The other Hours open the corresponding DivineOffice.org page in a new tab and are labeled as requiring a connection. Each option also provides an offline alternative already stored in Sanctu: readings, Morning Offering, Angelus, Daily Examen, or Act of Contrition.

Sanctu does not copy additional full Liturgy of the Hours texts into the repository. Those translations and the DivineOffice.org presentation carry explicit copyright notices; direct links preserve attribution and avoid presenting a partial devotion as the official Hour.

### Today at Mass

Two equal masonry tiles expose:

- Today's Readings: the existing bilingual USCCB-backed reader with IndexedDB cache.
- Mass Guide: the existing bilingual Order of Mass. Its page gains a visible companion action back to today's readings.

### Secondary paths

The Rosary and prayer library follow beneath the liturgical actions. A persistent mobile bottom navigation exposes Today, Hours, Mass, and Prayers. Desktop layouts keep the same destinations in the top shell without a floating mobile bar.

## Prayer library

The library keeps all current prayers and adds bilingual, traditional or original-reference content for:

- Sign of the Cross
- Prayer to Saint Michael
- Anima Christi
- Spiritual Communion
- Suscipe
- Daily Examen
- Prayer Before Mass
- Prayer After Communion

Users can search localized title, Latin title, and localized prayer text. Favorites are stored only in `localStorage`; no account or network is introduced. Favorite buttons are semantic buttons with localized accessible labels and do not interfere with the prayer link.

Categories remain small and understandable: Essential, Marian, Daily Devotions, and Mass & Eucharist. Daily Examen remains a devotional prayer rather than introducing a separate single-item category.

## Shared application shell

`AppHeader` owns the brand, language control, theme control, optional back destination, and optional print/action slot. `BottomNav` owns the four primary mobile destinations. Pages retain their existing behavior but adopt common material, card, heading, button, focus, and empty/error-state classes.

The root layout no longer constrains every route inside a second max-width wrapper. Each page uses its own readable content width while the header and masonry background can span the viewport.

## Offline and PWA behavior

- The service worker version is bumped so existing users receive the new shell.
- Install precaching uses `Promise.allSettled`, preventing one unavailable dynamic route from aborting installation.
- Static precache includes the home, prayer index and every static prayer detail, Rosary, readings shell, Mass guide, Morning Prayer shell, manifest, icons, and generated artwork.
- Same-origin Next.js static assets are runtime-cached after first use instead of being bypassed.
- Readings and Morning Prayer API responses use stale-while-revalidate behavior and fall back to the last cached response when offline.
- Navigations remain network-first to receive deployments promptly, then use the exact cached page, then the cached home page, then a small static offline document.
- The manifest colors and metadata match the Gothic Stone shell.

## Accessibility

- Text and controls meet WCAG AA contrast in both modes.
- Touch targets are at least 44 by 44 CSS pixels.
- The stained-glass image never contains required text.
- Search has a visible label or accessible label, favorites report pressed state, and the Hour selector uses a native `select`.
- Focus uses a high-contrast amber outline against both stone palettes.
- Bottom navigation accounts for `env(safe-area-inset-bottom)`.
- Print styles continue to remove navigation and decorative artwork.

## Error and loading states

- Liturgical metadata failure leaves the date and a concise offline/cached note visible.
- Dynamic prayer content keeps the existing retry path and receives a clear cached/offline badge when available.
- External Hours are labeled before activation; the app never implies they are available offline.
- A service-worker update failure is logged but never blocks prayer content.

## Testing and verification

- Node tests cover Hour boundary selection and prayer search behavior.
- Node tests inspect service-worker source for required offline routes, runtime Next asset caching, and both dynamic API caches.
- ESLint and the full Next.js production build must pass.
- Browser verification covers a phone-sized light theme, phone-sized dark theme, prayer search/favorite controls, the Hour selector, Mass/readings links, and absence of console errors.
- Service-worker behavior is checked from the built app by confirming registration and cache population; an offline navigation check verifies a cached static route remains usable.

## Non-goals

- Reproducing or redistributing the complete official Liturgy of the Hours.
- Push notifications or scheduled reminders.
- Accounts, cloud synchronization, or community features.
- A full liturgical-calendar engine independent of the existing readings source.
- Heavy animation, video, canvas, WebGL, or an animation framework.
