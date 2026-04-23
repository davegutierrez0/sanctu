# Plan: Fix Duplicate Spanish Reading Header/Citation Bug

## Objective
Prevent Spanish readings from showing the same text for both:
- `label` (e.g., `Primera lectura`)
- `citation` (e.g., `Hechos 8, 26-40`)

## Root Cause
`/api/readings` and the cron prefetch parser currently extract citation from an `<a>` inside `.address`.
English pages include anchor citations, so this works.
Spanish pages currently expose citation as plain `.address` text without an anchor, so citation extraction falls back to label.
That makes both fields identical in the UI.

## Plan (Ordered)
1. **Harden parser in `app/api/readings/route.ts`**
   - Update `parseUSCCBHTML` citation extraction:
     - Parse `.address` HTML text directly.
     - Prefer anchor text when present.
     - Otherwise use cleaned `.address` plain text.
   - Keep existing `normalizeLabel` behavior unless needed.

2. **Apply the same fix in prefetch path**
   - Update `app/api/cron/prefetch-readings/route.ts` parsing to use the same logic so cached data is correct.
   - Ensure both paths produce consistent `label`, `citation`, and `type`.

3. **(Recommended) Share parser helpers**
   - Add a shared parser module (for example `lib/data/readings-parser.ts`) with:
     - `parseUSCCBHTML(html, lang)`
     - `extractCitationFromHeader(...)`
     - `normalizeLabel(...)`
     - `mapLabelToType(...)`
   - Use this shared module in both route files to avoid parser drift.

4. **Alignment cleanup while touching parser**
   - Keep aleluya/aclamacion mapping aligned in both routes.
   - Keep safe fallback behavior when citation text is missing.

5. **Optional resilience guard**
   - If citation still parses to the same value as label:
     - Add a debug marker or
     - refresh cached payload, or
     - temporarily avoid duplicate display in UI as a final fallback.

6. **Validation**
   - Re-fetch fresh data for both languages:
     - `GET /api/readings?date=2026-04-23&lang=es`
     - `GET /api/readings?date=2026-04-23&lang=en`
   - Verify Spanish entries now show correct separate values:
     - `Primera lectura` + `Hechos 8, 26-40`
     - `Salmo Responsorial` + `Salmo ...`
     - `Evangelio` + `Juan ...`
   - Clear stale cache (Redis/local cache) before checking results.

7. **Regression tests (if test infra exists or to be added)**
   - Add parser tests for EN/ES fixture snippets.
   - Assert:
     - correct label mapping
     - correct citation extraction
     - `citation !== label` for first/psalm/gospel-like blocks.

## Suggested Commit Message
`fix: correct Spanish readings citation parsing from USCCB address blocks`
