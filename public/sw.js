// Sanctu Service Worker
// Provides offline functionality and caching for the Catholic prayer app

const VERSION = 'v2';
const CACHE_NAME = `Sanctu-static-${VERSION}`;
const READING_CACHE = `Sanctu-readings-${VERSION}`;

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/prayers',
  '/rosary',
  '/readings',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== READING_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  // Let Next.js manage its own build assets so we don't cache-bust ourselves
  if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/__nextjs/')) {
    return;
  }

  // Handle API routes specially (readings from USCCB)
  if (url.pathname.startsWith('/api/readings')) {
    event.respondWith(
      caches.open(READING_CACHE).then(async (cache) => {
        const cached = await cache.match(request);

        // Return cached if available and less than 24 hours old
        if (cached) {
          const cachedDate = new Date(cached.headers.get('date'));
          const now = new Date();
          const hoursSinceCached = (now - cachedDate) / (1000 * 60 * 60);

          if (hoursSinceCached < 24) {
            return cached;
          }
        }

        // Fetch fresh data
        try {
          const response = await fetch(request);
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        } catch (error) {
          // Return cached version if network fails
          if (cached) {
            return cached;
          }
          throw error;
        }
      })
    );
    return;
  }

  // Always try network first for navigations to avoid serving stale HTML after deploys
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match('/');
        })
    );
    return;
  }

  // For all other requests, use cache-first strategy
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request).then((fetchResponse) => {
        // Cache successful GET requests
        if (request.method === 'GET' && fetchResponse.ok) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        }
        return fetchResponse;
      });
    })
  );
});
