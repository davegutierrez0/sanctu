import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getLocalizedMystery,
  ROSARY_MYSTERIES,
} from '../lib/data/rosary.ts';

type LocalizedScriptureSource = {
  reference?: { en?: unknown; es?: unknown };
  text?: { en?: unknown; es?: unknown };
};

test('bundles an English and Spanish Scripture excerpt for all twenty mysteries', () => {
  assert.equal(Object.keys(ROSARY_MYSTERIES).length, 4);

  for (const mysterySet of Object.values(ROSARY_MYSTERIES)) {
    assert.equal(mysterySet.mysteries.length, 5);

    for (const mystery of mysterySet.mysteries) {
      const scripture = mystery.scripture as unknown as LocalizedScriptureSource;

      assert.equal(typeof scripture.reference?.en, 'string');
      assert.equal(typeof scripture.reference?.es, 'string');
      assert.equal(typeof scripture.text?.en, 'string');
      assert.equal(typeof scripture.text?.es, 'string');
      assert.ok((scripture.reference?.en as string).trim().length > 0);
      assert.ok((scripture.reference?.es as string).trim().length > 0);
      assert.ok((scripture.text?.en as string).trim().length > 0);
      assert.ok((scripture.text?.es as string).trim().length > 0);
    }
  }
});

test('localizes both the Scripture citation and passage with the mystery', () => {
  const joyful = ROSARY_MYSTERIES.joyful;
  const english = getLocalizedMystery(joyful, 'en');
  const spanish = getLocalizedMystery(joyful, 'es');

  assert.deepEqual(english.mysteries[0].scripture, {
    reference: joyful.mysteries[0].scripture.reference.en,
    text: joyful.mysteries[0].scripture.text.en,
  });
  assert.deepEqual(spanish.mysteries[0].scripture, {
    reference: joyful.mysteries[0].scripture.reference.es,
    text: joyful.mysteries[0].scripture.text.es,
  });
  assert.notEqual(
    english.mysteries[0].scripture.text,
    spanish.mysteries[0].scripture.text,
  );
});
