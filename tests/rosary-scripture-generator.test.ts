import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const generatorUrl = new URL(
  '../scripts/generate-rosary-scripture.mjs',
  import.meta.url,
);
const generatorSource = readFileSync(generatorUrl, 'utf8');

test('pins the complete generated bilingual Rosary corpus', () => {
  const corpus = readFileSync(
    new URL('../lib/data/rosary-scripture.ts', import.meta.url),
  );
  const corpusHash = createHash('sha256').update(corpus).digest('hex');

  assert.equal(
    corpusHash,
    '19d6594d8bfcbeaacab4f92fe1d47d2bfe8ba0076beab441097249e6bdf2e9a9',
  );
});

test('pins the official VPL download URLs and exact source-file hashes', () => {
  assert.match(
    generatorSource,
    /https:\/\/ebible\.org\/Scriptures\/eng-web-c_vpl\.zip/,
  );
  assert.match(
    generatorSource,
    /https:\/\/ebible\.org\/Scriptures\/spablm_vpl\.zip/,
  );
  assert.match(
    generatorSource,
    /e94033a46e951a0369f4fa90ce5908117843e305d7c31f64322ad147e008d6cd/,
  );
  assert.match(
    generatorSource,
    /0d3691a1807192b1507cc9fe892808eb2985899973d00d83753471a9939f3a9d/,
  );
  assert.match(generatorSource, /createHash\('sha256'\)/);
});

test('rejects Scripture files that do not match the pinned public-domain sources', () => {
  const fixtureDirectory = mkdtempSync(join(tmpdir(), 'sanctu-scripture-source-'));
  const englishPath = join(fixtureDirectory, 'english.txt');
  const spanishPath = join(fixtureDirectory, 'spanish.txt');
  const outputPath = join(fixtureDirectory, 'output.ts');

  try {
    writeFileSync(englishPath, 'not the pinned English source\n');
    writeFileSync(spanishPath, 'not the pinned Spanish source\n');

    const result = spawnSync(
      process.execPath,
      [generatorUrl.pathname, englishPath, spanishPath, outputPath],
      { encoding: 'utf8' },
    );

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /English source hash mismatch/);
    assert.match(
      result.stderr,
      /https:\/\/ebible\.org\/Scriptures\/eng-web-c_vpl\.zip/,
    );
    assert.equal(existsSync(outputPath), false);
  } finally {
    rmSync(fixtureDirectory, { recursive: true, force: true });
  }
});
