import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { ROSARY_UI } from '../lib/data/rosary.ts';

const readProjectFile = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('provides bilingual copy for Scripture and saved Rosary actions', () => {
  assert.equal(ROSARY_UI.en.readScripture, 'Read Scripture');
  assert.equal(ROSARY_UI.es.readScripture, 'Leer la Escritura');
  assert.equal(ROSARY_UI.en.resumeTitle, 'Continue your Rosary?');
  assert.equal(ROSARY_UI.es.resumeTitle, '¿Continuar tu Rosario?');
  assert.equal(ROSARY_UI.en.resume, 'Resume');
  assert.equal(ROSARY_UI.es.startOver, 'Empezar de nuevo');
});

test('wires validated progress storage and a native Scripture disclosure into the Rosary page', () => {
  const source = readProjectFile('app/rosary/page.tsx');

  assert.match(source, /parseRosaryProgress/);
  assert.match(source, /createRosaryProgress\(/);
  assert.match(source, /ROSARY_PROGRESS_STORAGE_KEY/);
  assert.match(source, /localStorage\.setItem\(ROSARY_PROGRESS_STORAGE_KEY/);
  assert.match(source, /localStorage\.removeItem\(ROSARY_PROGRESS_STORAGE_KEY/);
  assert.match(
    source,
    /<details key={`\$\{mysteryType\}-\$\{currentDecade\}`} className="rosary-scripture">/,
  );
  assert.match(source, /describeRosaryProgress/);

  const preferenceHydrationGuards = source.match(
    /if \(!storageHydrated \|\| typeof window === 'undefined'\) return;/g,
  );
  assert.equal(preferenceHydrationGuards?.length, 2);
  assert.match(
    source,
    /const skipToDecade = \(decadeIndex: number\) => \{[\s\S]*?setClosingStep\(0\);[\s\S]*?\};/,
  );
});
