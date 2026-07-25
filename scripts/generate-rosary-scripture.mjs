#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const [, , englishPath, spanishPath, outputPath] = process.argv;

if (!englishPath || !spanishPath || !outputPath) {
  throw new Error(
    'Usage: node scripts/generate-rosary-scripture.mjs <eng-web-c_vpl.txt> <spablm_vpl.txt> <output.ts>',
  );
}

const sources = {
  en: {
    label: 'English',
    url: 'https://ebible.org/Scriptures/eng-web-c_vpl.zip',
    sha256: 'e94033a46e951a0369f4fa90ce5908117843e305d7c31f64322ad147e008d6cd',
  },
  es: {
    label: 'Spanish',
    url: 'https://ebible.org/Scriptures/spablm_vpl.zip',
    sha256: '0d3691a1807192b1507cc9fe892808eb2985899973d00d83753471a9939f3a9d',
  },
};

const ranges = {
  'joyful-1': ['LUK', 1, 26, 38],
  'joyful-2': ['LUK', 1, 39, 56],
  'joyful-3': ['LUK', 2, 1, 20],
  'joyful-4': ['LUK', 2, 22, 38],
  'joyful-5': ['LUK', 2, 41, 52],
  'luminous-1': ['MAT', 3, 13, 17],
  'luminous-2': ['JOH', 2, 1, 11],
  'luminous-3': ['MAR', 1, 14, 15],
  'luminous-4': ['MAT', 17, 1, 8],
  'luminous-5': ['MAT', 26, 26, 28],
  'sorrowful-1': ['MAT', 26, 36, 46],
  'sorrowful-2': ['MAT', 27, 26, 26],
  'sorrowful-3': ['MAT', 27, 27, 31],
  'sorrowful-4': ['JOH', 19, 16, 17],
  'sorrowful-5': ['LUK', 23, 33, 46],
  'glorious-1': ['MAT', 28, 1, 10],
  'glorious-2': ['ACT', 1, 6, 11],
  'glorious-3': ['ACT', 2, 1, 4],
  'glorious-4': ['REV', 12, 1, 1],
  'glorious-5': ['REV', 12, 1, 1],
};

function readPinnedSource(path, source) {
  const contents = readFileSync(path);
  const actualHash = createHash('sha256').update(contents).digest('hex');

  if (actualHash !== source.sha256) {
    throw new Error(
      `${source.label} source hash mismatch. Download the pinned archive from ${source.url} and update the source manifest consciously if adopting a new edition. Expected ${source.sha256}; received ${actualHash}.`,
    );
  }

  return contents.toString('utf8');
}

function readBible(contents) {
  const verses = new Map();

  for (const line of contents.split(/\r?\n/)) {
    const match = /^([A-Z0-9]{3}) (\d+):(\d+) (.+)$/.exec(line);
    if (!match) continue;

    const [, book, chapter, verse, text] = match;
    verses.set(`${book} ${chapter}:${verse}`, text);
  }

  return verses;
}

function extractPassages(bible) {
  return Object.fromEntries(
    Object.entries(ranges).map(([key, [book, chapter, start, end]]) => {
      const passage = [];

      for (let verse = start; verse <= end; verse += 1) {
        const lookupKey = `${book} ${chapter}:${verse}`;
        const text = bible.get(lookupKey);
        if (!text) throw new Error(`Missing source verse: ${lookupKey}`);
        passage.push({ number: String(verse), text });
      }

      return [key, passage];
    }),
  );
}

const passages = {
  en: extractPassages(readBible(readPinnedSource(englishPath, sources.en))),
  es: extractPassages(readBible(readPinnedSource(spanishPath, sources.es))),
};

const generated = `/**
 * Complete Rosary passages generated from public-domain eBible.org VPL files.
 *
 * English: World English Bible, Catholic Edition (2020 stable text edition)
 * Source: ${sources.en.url}
 * VPL SHA-256: ${sources.en.sha256}
 * Spanish: Santa Biblia libre para el mundo (public-domain draft dated 2026-05-22)
 * Source: ${sources.es.url}
 * VPL SHA-256: ${sources.es.sha256}
 *
 * Preserve the source wording exactly. Re-run scripts/generate-rosary-scripture.mjs
 * with the official source files instead of editing verse text by hand.
 */

export type RosaryMysteryType = 'joyful' | 'sorrowful' | 'glorious' | 'luminous';
export type ScriptureLanguage = 'en' | 'es';
export type RosaryScriptureKey = \`\${RosaryMysteryType}-\${1 | 2 | 3 | 4 | 5}\`;

export interface ScriptureVerse {
  number: string;
  text: string;
}

export interface ScriptureSource {
  name: string;
  abbreviation: string;
  url: string;
  publicDomain: true;
  note: string;
}

export interface RosaryScripturePassage {
  verses: readonly ScriptureVerse[];
  source: ScriptureSource;
}

export const ROSARY_SCRIPTURE_SOURCES: Record<ScriptureLanguage, ScriptureSource> = {
  en: {
    name: 'World English Bible, Catholic Edition',
    abbreviation: 'WEBC',
    url: 'https://ebible.org/eng-web-c/copyright.htm',
    publicDomain: true,
    note: 'A modern public-domain Catholic edition for prayer and study; it is not the U.S. Mass lectionary.',
  },
  es: {
    name: 'Santa Biblia libre para el mundo',
    abbreviation: 'SBLM',
    url: 'https://ebible.org/bible/details.php?id=spablm',
    publicDomain: true,
    note: 'Traducción moderna de dominio público, actualmente en revisión; no es el leccionario católico oficial.',
  },
};

export const ROSARY_SCRIPTURE_PASSAGES = ${JSON.stringify(passages, null, 2)} as const satisfies Record<
  ScriptureLanguage,
  Record<RosaryScriptureKey, readonly ScriptureVerse[]>
>;

export function getRosaryScripturePassage(
  mysteryType: RosaryMysteryType,
  mysteryNumber: number,
  language: ScriptureLanguage,
): RosaryScripturePassage {
  const key = \`\${mysteryType}-\${mysteryNumber}\` as RosaryScriptureKey;
  const verses = ROSARY_SCRIPTURE_PASSAGES[language][key];

  if (!verses) {
    throw new Error(\`Missing Rosary Scripture passage: \${key}\`);
  }

  return {
    verses,
    source: ROSARY_SCRIPTURE_SOURCES[language],
  };
}
`;

writeFileSync(outputPath, generated);
