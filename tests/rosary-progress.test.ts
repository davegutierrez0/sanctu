import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createRosaryProgress,
  describeRosaryProgress,
  parseRosaryProgress,
  ROSARY_PROGRESS_STORAGE_KEY,
  type RosaryProgress,
} from '../lib/rosary-progress.ts';

const validProgress: RosaryProgress = {
  version: 1,
  mysteryType: 'glorious',
  phase: 'decade',
  openingStep: 5,
  currentDecade: 2,
  currentBead: 6,
  decadeEndStep: 0,
  closingStep: 0,
  savedAt: 1_753_400_000_000,
};

test('parses a complete versioned Rosary checkpoint', () => {
  assert.equal(ROSARY_PROGRESS_STORAGE_KEY, 'sanctu:rosary-progress');
  assert.deepEqual(
    parseRosaryProgress(JSON.stringify(validProgress)),
    validProgress,
  );
});

test('rejects malformed, unsupported, completed, and out-of-range checkpoints', () => {
  const invalidValues = [
    null,
    '{not-json',
    JSON.stringify({ ...validProgress, version: 2 }),
    JSON.stringify({ ...validProgress, mysteryType: 'mystery' }),
    JSON.stringify({ ...validProgress, phase: 'complete' }),
    JSON.stringify({ ...validProgress, openingStep: 6 }),
    JSON.stringify({ ...validProgress, currentDecade: 5 }),
    JSON.stringify({ ...validProgress, currentBead: 11 }),
    JSON.stringify({ ...validProgress, decadeEndStep: 2 }),
    JSON.stringify({ ...validProgress, closingStep: 3 }),
    JSON.stringify({ ...validProgress, savedAt: 0 }),
    JSON.stringify({
      ...validProgress,
      phase: 'opening',
      currentDecade: 4,
    }),
    JSON.stringify({
      ...validProgress,
      phase: 'decadeEnd',
      currentBead: 5,
    }),
    JSON.stringify({
      ...validProgress,
      phase: 'closing',
      currentDecade: 2,
    }),
  ];

  for (const value of invalidValues) {
    assert.equal(parseRosaryProgress(value), null);
  }
});

test('describes the exact saved prayer in English and Spanish', () => {
  assert.equal(
    describeRosaryProgress(
      { ...validProgress, phase: 'opening', openingStep: 2 },
      'en',
    ),
    'Opening prayers · Prayer 3 of 6',
  );
  assert.equal(
    describeRosaryProgress(validProgress, 'en'),
    'Decade 3 · Hail Mary 6 of 10',
  );
  assert.equal(
    describeRosaryProgress(
      { ...validProgress, phase: 'decade', currentBead: 0 },
      'es',
    ),
    'Decena 3 · Padre Nuestro',
  );
  assert.equal(
    describeRosaryProgress(
      { ...validProgress, phase: 'decadeEnd', decadeEndStep: 1 },
      'es',
    ),
    'Decena 3 · Oración de Fátima',
  );
  assert.equal(
    describeRosaryProgress(
      { ...validProgress, phase: 'closing', closingStep: 1 },
      'en',
    ),
    'Closing prayers · Prayer 2 of 3',
  );
});

test('normalizes irrelevant counters before persisting a checkpoint', () => {
  const checkpoint = createRosaryProgress(
    {
      mysteryType: 'sorrowful',
      phase: 'decade',
      openingStep: 5,
      currentDecade: 1,
      currentBead: 0,
      decadeEndStep: 1,
      closingStep: 2,
    },
    1_753_400_000_100,
  );

  assert.equal(checkpoint.closingStep, 0);
  assert.deepEqual(
    parseRosaryProgress(JSON.stringify(checkpoint)),
    checkpoint,
  );
});
