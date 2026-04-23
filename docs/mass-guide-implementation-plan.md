# Mass Guide Feature Plan

## Goal

- Complete the Roman Rite Mass participation guide feature with bilingual content and a dedicated page.
- Ensure the page is reachable from the home screen and localized by language.
- Keep implementation scoped to the current branch changes and avoid unrelated refactors.

## Current status

- `lib/data/mass-guide.ts` exists with bilingual line-level content for the Mass guide.
- The file needed a type fix so content can be consumed by page code without TypeScript errors.
- Home page currently lacks a card entry for the new feature.
- `lib/data/ui.ts` has no labels for the new Mass guide card.

## Next steps

1. [x] Fix `lib/data/mass-guide.ts` type definitions so `getMassGuide()` returns sections in the shape expected by consumers.
2. [x] Add `app/mass-guide/page.tsx` with:
   - section rendering by line type (`action`, `response`, `text`, `note`),
   - bilingual labels,
   - print button and language toggle,
   - source references.
3. [x] Update `app/page.tsx` to add a home card linking to `/mass-guide`.
4. [x] Update `lib/data/ui.ts` translations with `massGuide` and `massGuideDesc`.
5. [x] Run `npx tsc --noEmit` and lint targeted files to confirm no type/lint issues.

## Validation completed

- `npx --yes tsc --noEmit` passes with no errors.
- `npx --yes eslint app/mass-guide/page.tsx app/page.tsx lib/data/ui.ts lib/data/mass-guide.ts` passes with no output.
