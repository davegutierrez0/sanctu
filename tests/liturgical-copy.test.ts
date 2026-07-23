import assert from 'node:assert/strict';
import test from 'node:test';

import { localizeLiturgicalSeason } from '../lib/liturgical-copy.ts';

test('shows Ordinary Time in English even when an offline cache contains its Spanish label', () => {
  assert.equal(localizeLiturgicalSeason('Tiempo Ordinario', 'en'), 'Ordinary Time');
});

test('keeps the seasonal label in the selected language', () => {
  assert.equal(localizeLiturgicalSeason('Ordinary Time', 'es'), 'Tiempo Ordinario');
  assert.equal(localizeLiturgicalSeason('Advent', 'en'), 'Advent');
  assert.equal(localizeLiturgicalSeason('Adviento', 'es'), 'Adviento');
});
