import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');

const prayerIds = [
  'our-father',
  'hail-mary',
  'glory-be',
  'creed',
  'hail-holy-queen',
  'fatima',
  'memorare',
  'angelus',
  'morning-offering',
  'angel-of-god',
  'eternal-rest',
  'grace-before-meals',
  'grace-after-meals',
  'act-of-contrition',
  'sign-of-the-cross',
  'saint-michael',
  'anima-christi',
  'spiritual-communion',
  'suscipe',
  'daily-examen',
  'before-mass',
  'after-communion',
];

test('pre-caches every offline app route and prayer detail in version v10', () => {
  assert.match(source, /const VERSION = ['"]v10['"]/);
  for (const route of ['/', '/mass-guide', '/morning-prayer', '/prayers', '/readings', '/rosary', '/offline.html']) {
    assert.ok(source.includes(`'${route}'`), `missing static route ${route}`);
  }
  for (const id of prayerIds) {
    assert.ok(source.includes(`'/prayers/${id}'`), `missing prayer route ${id}`);
  }
  assert.match(source, /Promise\.allSettled/);
});

test('runtime-caches Next static assets and both dynamic prayer APIs', () => {
  assert.ok(source.includes("url.pathname.startsWith('/_next/static/')"));
  assert.ok(source.includes("url.pathname.startsWith('/api/readings')"));
  assert.ok(source.includes("url.pathname.startsWith('/api/morning-prayer')"));
  assert.match(source, /staleWhileRevalidate/);
});

test('uses exact route, home, then the static offline page for navigation fallback', () => {
  const exactIndex = source.indexOf('cache.match(request)');
  const homeIndex = source.indexOf("cache.match('/')", exactIndex);
  const offlineIndex = source.indexOf("cache.match('/offline.html')", homeIndex);

  assert.ok(exactIndex >= 0, 'exact route fallback missing');
  assert.ok(homeIndex > exactIndex, 'home fallback must follow exact route');
  assert.ok(offlineIndex > homeIndex, 'offline page must be the final fallback');
});
