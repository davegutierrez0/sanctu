import assert from 'node:assert/strict';
import test from 'node:test';

import { getMassGuide } from '../lib/data/mass-guide.ts';

test('keeps the participant guide in the correct Roman Rite sequence', () => {
  const guide = getMassGuide('en');
  assert.deepEqual(
    guide.sections.map((section) => section.id),
    ['introductory-rites', 'liturgy-of-the-word', 'liturgy-of-the-eucharist', 'concluding-rites'],
  );

  const word = guide.sections.find((section) => section.id === 'liturgy-of-the-word');
  assert.ok(word?.lines.some((line) => line.type === 'action' && line.en.startsWith('Sit for the first reading')));
  assert.ok(word?.lines.some((line) => line.type === 'action' && line.en.startsWith('Stand for the Gospel')));

  const eucharist = guide.sections.find((section) => section.id === 'liturgy-of-the-eucharist');
  const memorialIndex = eucharist?.lines.findIndex((line) => line.en.includes('Memorial Acclamation')) ?? -1;
  const lordPrayerIndex = eucharist?.lines.findIndex((line) => line.en.includes('Lord’s Prayer')) ?? -1;
  assert.ok(memorialIndex >= 0 && lordPrayerIndex > memorialIndex);
});

test('uses the corrected official English and Spanish assembly acclamations', () => {
  const english = JSON.stringify(getMassGuide('en'));
  const spanish = JSON.stringify(getMassGuide('es'));

  assert.match(english, /Hosanna in the highest/);
  assert.doesNotMatch(english, /Christ has died/);
  assert.match(spanish, /Dios del universo/);
  assert.match(spanish, /Anunciamos tu muerte/);
  assert.doesNotMatch(spanish, /Profesín|Comunioón|comunicación de los santos/);
});
