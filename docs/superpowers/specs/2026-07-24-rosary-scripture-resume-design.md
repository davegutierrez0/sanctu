# Rosary Scripture and Resume Design

## Goal

Make the guided Rosary easier to return to and richer to meditate with by adding optional, offline Scripture excerpts and a durable on-device checkpoint.

## Product behavior

- During each decade, the active mystery card shows a collapsed “Read Scripture” disclosure with the mystery citation. Opening it reveals a short bilingual passage selected from the cited scene. The disclosure is closed by default so the normal prayer rhythm remains visually quiet.
- Scripture content is bundled with the existing Rosary data and localized with the app language. It never requires a network request and therefore works in the installed PWA while offline.
- Once the user advances a prayer or jumps to a decade, Sanctu saves the exact current mystery, phase, prayer step, decade, and bead in local storage.
- On a later visit, a compact “Continue your Rosary?” card identifies the saved mystery and exact position. The user may resume that checkpoint or start over.
- Completing the Rosary, using Reset, choosing a different mystery, or choosing Start over removes the old checkpoint.
- A missing, malformed, out-of-range, or future-version checkpoint is ignored. Storage failures never prevent the Rosary from functioning.

## Architecture

`lib/data/rosary.ts` remains the source of truth for the four mystery sets. Each mystery receives a localized Scripture reference and a concise localized excerpt. `getLocalizedMystery` resolves both values together with the existing title and meditation.

`lib/rosary-progress.ts` owns the versioned checkpoint schema, validation, JSON parsing, and bilingual human-readable position labels. It is independent from React and browser globals so the important edge cases can be unit-tested directly.

`app/rosary/page.tsx` owns browser storage access and UI state. It hydrates preferences and any checkpoint before enabling saves, preventing the initial default state from overwriting a real checkpoint. The component writes after meaningful progress, applies a checkpoint only after the user presses Resume, and clears it at terminal/reset transitions.

## Data model

The stored value uses key `sanctu:rosary-progress` and schema version `1`:

```ts
interface RosaryProgress {
  version: 1;
  mysteryType: MysteryType;
  phase: 'opening' | 'decade' | 'decadeEnd' | 'closing';
  openingStep: number;
  currentDecade: number;
  currentBead: number;
  decadeEndStep: number;
  closingStep: number;
  savedAt: number;
}
```

Completion is intentionally excluded from the schema because a completed Rosary has nothing left to resume.

## Interface

The resume card appears between the page heading and current progress. It uses the existing stone-card visual language and two clear actions: a primary Resume button and a quiet Start over button.

The Scripture disclosure lives inside the active mystery card, after the meditation. Its summary includes the localized citation and a chevron. The revealed passage is visually inset and uses the serif reading style without adding a modal or another navigation layer.

## Accessibility and resilience

- Native `<details>` and `<summary>` provide keyboard interaction and expansion semantics without JavaScript.
- Resume actions are ordinary buttons with complete bilingual labels.
- Saved values are range-checked before use; invalid JSON or unavailable local storage falls back to a fresh Rosary.
- No new dependency, API, cache, or service-worker route is required.

## Verification

- Unit tests cover complete bilingual Scripture data and localization.
- Unit tests cover checkpoint parsing, invalid records, and position labels for opening, decade, decade-end, and closing phases.
- Existing tests, lint, and production build must pass.
- A 390px browser run must prove: a checkpoint appears after reload, Resume restores the exact bead, Start over clears it, Scripture opens and closes, and Spanish labels/content render.
