const CACHE_NAME = 'productivity-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/state.js',
  '/js/rule.js',
  '/js/plan.js',
  '/js/reminders.js',
  '/js/environment.js',
  '/js/fitness.js',
  '/js/finance.js',
  '/js/archetypes.js',
  '/js/strategy.js',
  '/js/activity.js',
  '/js/analytics.js',
  '/js/settings.js',
  '/lib/chart.min.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});