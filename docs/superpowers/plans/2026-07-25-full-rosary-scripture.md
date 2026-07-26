# Full Rosary Scripture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Replace the Rosary's short paraphrased excerpts with complete, verse-numbered, offline Scripture passages from transparent public-domain translations.

**Architecture:** Keep the mystery metadata in `lib/data/rosary.ts` and move the larger public-domain verse corpus plus translation metadata into a focused `lib/data/rosary-scripture.ts` module. Localize the selected passage in `getLocalizedMystery`, then render verses and source context inside the existing native disclosure.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Node test runner, existing Gothic Stone CSS, public-domain eBible.org VPL source data.

---

### Task 1: Full public-domain passage contract

**Files:**
- Create: `lib/data/rosary-scripture.ts`
- Create: `scripts/generate-rosary-scripture.mjs`
- Modify: `lib/data/rosary.ts`
- Modify: `tests/rosary-scripture.test.ts`
- Create: `tests/rosary-scripture-generator.test.ts`

- [x] **Step 1: Write the failing data tests**

Assert that every localized mystery has a non-empty verse array, that multi-verse citations include every expected verse, that the verse text is substantially longer than the old excerpt, and that each language exposes a public-domain source name and URL. Check exact first/last verses for Luke 1:26–38 to protect source fidelity.

- [x] **Step 2: Run the Scripture test to verify it fails**

Run: `node --test --experimental-strip-types tests/rosary-scripture.test.ts`

Expected: FAIL because mysteries only expose a single `text` string and no translation metadata.

- [x] **Step 3: Add the verse corpus and localize it**

Create `ScriptureVerse`, `ScriptureSource`, and localized `RosaryScripturePassage` types. Bundle the cited verses for all twenty mysteries from the World English Bible Catholic Edition (English) and Santa Biblia libre para el mundo (Spanish), preserving the downloaded source text exactly. Pin the official archive URLs and extracted VPL SHA-256 hashes in the generator, reject mismatched inputs, export source metadata, and look passages up by mystery type and number from `getLocalizedMystery`.

- [x] **Step 4: Run the Scripture test to verify it passes**

Run: `node --test --experimental-strip-types tests/rosary-scripture.test.ts`

Expected: PASS.

### Task 2: Expandable full-passage reader

**Files:**
- Modify: `app/rosary/page.tsx`
- Modify: `lib/data/rosary.ts`
- Modify: `app/globals.css`
- Modify: `public/sw.js`
- Modify: `tests/rosary-ui.test.ts`
- Modify: `tests/service-worker.test.ts`

- [x] **Step 1: Write the failing UI-source test**

Assert that the Rosary page maps `scripture.verses`, renders verse numbers, links the named translation source, and includes bilingual copy explaining the public-domain and non-lectionary status.

- [x] **Step 2: Run the UI test to verify it fails**

Run: `node --test --experimental-strip-types tests/rosary-ui.test.ts`

Expected: FAIL because the disclosure renders one blockquote string with no source information.

- [x] **Step 3: Render and style the complete passage**

Map every verse into a readable paragraph with an accessible superscript verse number. Add the source name, public-domain status, source link, and concise localized note beneath the passage. Keep the disclosure collapsed by default and keyed to the active mystery.

- [x] **Step 4: Advance the offline cache version**

Update the service-worker regression test to `v10` (one version beyond current `main`), verify it fails, then update `public/sw.js` so installed PWAs refresh the changed Rosary JavaScript and CSS assets.

- [x] **Step 5: Run the focused and complete tests**

Run: `node --test --experimental-strip-types tests/rosary-ui.test.ts`

Expected: PASS.

Run: `npm test`

Expected: all tests PASS.

### Task 3: Static and browser verification

**Files:**
- No source changes expected

- [x] **Step 1: Run static verification**

Run: `npm run lint && npm run build && git diff --check`

Expected: all commands exit 0 and `/rosary` is included in the build route output.

- [x] **Step 2: Verify the mobile English experience**

At 390px, enter a decade, expand Scripture, confirm Luke 1:26–38 displays verses 26 through 38 with the WEBC source note, and confirm the disclosure remains readable without horizontal overflow.

- [x] **Step 3: Verify Spanish and navigation behavior**

Switch to Spanish and confirm the complete passage and SBLM source note localize. Change mysteries and verify the native disclosure closes and updates its citation and verses.
