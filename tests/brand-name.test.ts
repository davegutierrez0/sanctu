import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const readProjectFile = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('uses Sanctu consistently across the primary app branding surfaces', () => {
  const manifest = JSON.parse(readProjectFile('public/manifest.json')) as {
    name: string;
    short_name: string;
  };

  assert.equal(manifest.name, 'Sanctu — Catholic Liturgical Companion');
  assert.equal(manifest.short_name, 'Sanctu');

  for (const path of [
    'app/layout.tsx',
    'components/AppHeader.tsx',
    'components/FeedbackAnnouncement.tsx',
    'lib/formspree.ts',
    'public/offline.html',
    'README.md',
  ]) {
    const source = readProjectFile(path);
    assert.match(source, /Sanctu/);
    assert.doesNotMatch(source, new RegExp(`${manifest.short_name}s`));
  }
});
