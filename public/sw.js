// Sanctus Service Worker
// Keeps the liturgical companion usable when the network is unavailable.

const VERSION = 'v9';
const STATIC_CACHE = `Sanctus-static-${VERSION}`;
const DATA_CACHE = `Sanctus-data-${VERSION}`;
const ASSET_CACHE = `Sanctus-assets-${VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/mass-guide',
  '/morning-prayer',
  '/prayers',
  '/readings',
  '/rosary',
  '/offline.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/art/gothic-stone-glass.png',
  '/prayers/our-father',
  '/prayers/hail-mary',
  '/prayers/glory-be',
  '/prayers/creed',
  '/prayers/hail-holy-queen',
  '/prayers/fatima',
  '/prayers/memorare',
  '/prayers/angelus',
  '/prayers/morning-offering',
  '/prayers/angel-of-god',
  '/prayers/eternal-rest',
  '/prayers/grace-before-meals',
  '/prayers/grace-after-meals',
  '/prayers/act-of-contrition',
  '/prayers/sign-of-the-cross',
  '/prayers/saint-michael',
  '/prayers/anima-christi',
  '/prayers/spiritual-communion',
  '/prayers/suscipe',
  '/prayers/daily-examen',
  '/prayers/before-mass',
  '/prayers/after-communion',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      Promise.allSettled(STATIC_ASSETS.map((asset) => cache.add(asset)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const currentCaches = new Set([STATIC_CACHE, DATA_CACHE, ASSET_CACHE]);
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) =>
          currentCaches.has(cacheName) ? Promise.resolve(false) : caches.delete(cacheName)
        )
      )
    )
  );
  self.clients.claim();
});

async function cacheFirst(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(DATA_CACHE);
  const cached = await cache.match(request);
  const update = fetch(request).then(async (response) => {
    if (response.ok) await cache.put(request, response.clone());
    return response;
  });

  if (cached) {
    event.waitUntil(update.catch(() => undefined));
    return cached;
  }

  return update;
}

async function handleNavigation(request) {
  const cache = await caches.open(STATIC_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    const exact = await cache.match(request);
    if (exact) return exact;

    const home = await cache.match('/');
    if (home) return home;

    return cache.match('/offline.html');
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (
    url.pathname.startsWith('/api/readings') ||
    url.pathname.startsWith('/api/morning-prayer')
  ) {
    event.respondWith(staleWhileRevalidate(request, event));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/art/') ||
    url.pathname.startsWith('/icon-')
  ) {
    event.respondWith(cacheFirst(request));
  }
});
