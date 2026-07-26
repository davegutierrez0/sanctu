# Rosary Scripture and Resume Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add optional offline Scripture excerpts to every mystery and let users resume an interrupted Rosary at the exact saved prayer.

**Architecture:** Keep localized mystery content in `lib/data/rosary.ts`, put the versioned checkpoint contract and validation in a pure `lib/rosary-progress.ts` module, and let the Rosary client component coordinate local storage and UI. Browser-native disclosure keeps the Scripture interaction accessible and lightweight.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Node test runner, localStorage, Tailwind utilities and existing Gothic Stone CSS.

---

### Task 1: Versioned Rosary checkpoint

**Files:**
- Create: `lib/rosary-progress.ts`
- Create: `tests/rosary-progress.test.ts`

- [ ] **Step 1: Write the failing checkpoint tests**

Create tests that import `parseRosaryProgress`, `describeRosaryProgress`, and `ROSARY_PROGRESS_STORAGE_KEY`. Assert that a complete valid record parses unchanged, invalid JSON/future versions/out-of-range counters/completed phases return `null`, and representative phase labels are correct in English and Spanish.

- [ ] **Step 2: Run the checkpoint test to verify it fails**

Run: `node --test --experimental-strip-types tests/rosary-progress.test.ts`

Expected: FAIL because `lib/rosary-progress.ts` does not exist.

- [ ] **Step 3: Implement the minimal checkpoint module**

Define:

```ts
export const ROSARY_PROGRESS_STORAGE_KEY = 'sanctu:rosary-progress';

export interface RosaryProgress {
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

export function parseRosaryProgress(value: string | null): RosaryProgress | null;
export function describeRosaryProgress(progress: RosaryProgress, language: Language): string;
```

Validate every enum, integer range, and timestamp before returning a record. Produce phase-specific labels such as `Decade 3 · Hail Mary 6 of 10` and `Decena 3 · Ave María 6 de 10`.

- [ ] **Step 4: Run the checkpoint test and complete suite**

Run: `node --test --experimental-strip-types tests/rosary-progress.test.ts`

Expected: PASS.

Run: `npm test`

Expected: all tests PASS.

### Task 2: Offline Scripture content

**Files:**
- Modify: `lib/data/rosary.ts`
- Create: `tests/rosary-scripture.test.ts`

- [ ] **Step 1: Write the failing Scripture data tests**

Assert that all four mystery sets contain five mysteries, every mystery exposes non-empty English and Spanish `reference` and `text` values, and `getLocalizedMystery` returns plain localized Scripture strings rather than the untranslated object.

- [ ] **Step 2: Run the Scripture test to verify it fails**

Run: `node --test --experimental-strip-types tests/rosary-scripture.test.ts`

Expected: FAIL because the existing `scripture` field contains only a citation string.

- [ ] **Step 3: Add localized Scripture excerpts**

Change the mystery Scripture contract to:

```ts
scripture: {
  reference: { en: string; es: string };
  text: { en: string; es: string };
};
```

Add one concise, scene-defining passage to each of the twenty mysteries. Localize book names and passage text. Update `getLocalizedMystery` to return:

```ts
scripture: {
  reference: m.scripture.reference[lang],
  text: m.scripture.text[lang],
}
```

- [ ] **Step 4: Run the Scripture test and complete suite**

Run: `node --test --experimental-strip-types tests/rosary-scripture.test.ts`

Expected: PASS.

Run: `npm test`

Expected: all tests PASS.

### Task 3: Resume and Scripture interface

**Files:**
- Modify: `app/rosary/page.tsx`
- Modify: `lib/data/rosary.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Add bilingual interface copy**

Extend `ROSARY_UI` with `readScripture`, `scriptureReflection`, `resumeTitle`, `resumeAt`, `resume`, and `startOver` in English and Spanish.

- [ ] **Step 2: Hydrate and persist checkpoint state**

Read and parse `sanctu:rosary-progress` alongside the existing Rosary preferences. Gate persistence behind hydration and a meaningful session-start flag. Save the full checkpoint after prayer navigation; clear it on completion and reset.

- [ ] **Step 3: Add the resume card**

Render a stone-card when a valid checkpoint is available. Identify the saved mystery with `getLocalizedMystery`, show `describeRosaryProgress`, restore all counters on Resume, and clear the record on Start over.

- [ ] **Step 4: Add the Scripture disclosure**

Replace the citation-only paragraph in the active mystery card with native `<details className="rosary-scripture">`. The summary contains the localized action and citation; the panel contains the localized excerpt and a small reflection label.

- [ ] **Step 5: Style the new interface**

Add focused styles for `.rosary-resume`, `.rosary-resume-actions`, `.rosary-scripture`, and `.rosary-scripture-text`, using existing surface, border, accent, serif, and reduced-motion conventions.

- [ ] **Step 6: Run static verification**

Run: `npm test`

Expected: all tests PASS.

Run: `npm run lint`

Expected: exit 0 with no lint errors.

Run: `npm run build`

Expected: exit 0 with `/rosary` included in the route output.

### Task 4: Mobile interaction verification

**Files:**
- No source changes expected
- Browser artifacts, if captured: `output/playwright/`

- [ ] **Step 1: Start the production server**

Run: `npm run start -- -H 127.0.0.1 -p 53174`

Expected: Next.js reports Ready and serves `http://127.0.0.1:53174`.

- [ ] **Step 2: Verify English resume behavior at 390px**

Open `/rosary`, advance into a decade and several beads, reload, confirm the resume card names the exact saved position, press Resume, and confirm the active bead matches. Reload once more, press Start over, and confirm the checkpoint card does not return.

- [ ] **Step 3: Verify Scripture and Spanish localization**

Advance to the active mystery, open and close the Scripture disclosure, switch to Spanish, and confirm the disclosure label, citation, passage, and resume copy are Spanish. Check the browser console for errors.

- [ ] **Step 4: Check the final diff**

Run: `git diff --check`

Expected: no whitespace errors.
