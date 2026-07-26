import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getLocalizedMystery,
  ROSARY_MYSTERIES,
} from '../lib/data/rosary.ts';

type LocalizedScripture = {
  reference?: unknown;
  verses?: Array<{ number?: unknown; text?: unknown }>;
  source?: {
    name?: unknown;
    url?: unknown;
    publicDomain?: unknown;
  };
};

const expectedVerseCounts = {
  joyful: [13, 18, 20, 17, 12],
  luminous: [5, 11, 2, 8, 3],
  sorrowful: [11, 1, 5, 2, 14],
  glorious: [10, 6, 4, 1, 1],
} as const;

test('bundles every cited verse in English and Spanish for all twenty mysteries', () => {
  assert.equal(Object.keys(ROSARY_MYSTERIES).length, 4);

  for (const language of ['en', 'es'] as const) {
    for (const [type, mysterySet] of Object.entries(ROSARY_MYSTERIES)) {
      const localized = getLocalizedMystery(mysterySet, language);
      assert.equal(localized.mysteries.length, 5);

      localized.mysteries.forEach((mystery, index) => {
        const scripture = mystery.scripture as unknown as LocalizedScripture;
        const expectedCount = expectedVerseCounts[
          type as keyof typeof expectedVerseCounts
        ][index];

        assert.equal(typeof scripture.reference, 'string');
        assert.equal(scripture.verses?.length, expectedCount);
        assert.ok(
          scripture.verses?.every(
            (verse) =>
              typeof verse.number === 'string' &&
              verse.number.length > 0 &&
              typeof verse.text === 'string' &&
              verse.text.trim().length > 0,
          ),
        );
        assert.equal(scripture.source?.publicDomain, true);
        assert.equal(typeof scripture.source?.name, 'string');
        assert.match(String(scripture.source?.url), /^https:\/\//);
      });
    }
  }
});

test('preserves the exact public-domain source text for Luke 1:26–38', () => {
  const english = getLocalizedMystery(ROSARY_MYSTERIES.joyful, 'en');
  const spanish = getLocalizedMystery(ROSARY_MYSTERIES.joyful, 'es');

  assert.deepEqual(english.mysteries[0].scripture.verses[0], {
    number: '26',
    text: 'Now in the sixth month, the angel Gabriel was sent from God to a city of Galilee named Nazareth,',
  });
  assert.deepEqual(english.mysteries[0].scripture.verses.at(-1), {
    number: '38',
    text: 'Mary said, “Behold, the servant of the Lord; let it be done to me according to your word.” Then the angel departed from her.',
  });
  assert.deepEqual(spanish.mysteries[0].scripture.verses[0], {
    number: '26',
    text: 'En el sexto mes, el ángel Gabriel fue enviado por Dios a una ciudad de Galilea llamada Nazaret,',
  });
  assert.deepEqual(spanish.mysteries[0].scripture.verses.at(-1), {
    number: '38',
    text: 'María dijo: «He aquí la sierva del Señor; hágase en mí según tu palabra». Entonces el ángel se alejó de ella.',
  });
});

test('identifies the English Catholic edition and labels the Spanish source honestly', () => {
  const english = getLocalizedMystery(ROSARY_MYSTERIES.joyful, 'en');
  const spanish = getLocalizedMystery(ROSARY_MYSTERIES.joyful, 'es');

  assert.equal(
    english.mysteries[0].scripture.source.name,
    'World English Bible, Catholic Edition',
  );
  assert.match(english.mysteries[0].scripture.source.note, /not the U\.S\. Mass lectionary/i);
  assert.equal(
    spanish.mysteries[0].scripture.source.name,
    'Santa Biblia libre para el mundo',
  );
  assert.match(spanish.mysteries[0].scripture.source.note, /no es el leccionario católico oficial/i);
});
