const CACHE_NAME = 'blacktrigger-hq-v9';
const urlsToCache = [
  '/',
  '/index.html',
  '/utils.js',
  '/ruleOfDay.js',
  '/plan.js',
  '/environment.js',
  '/finance.js',
  '/fitness.js',
  '/strategy.js',
  '/habits.js',
  '/notes.js',
  '/knowledge.js',
  '/archetype.js',
  '/analytics.js',
  '/help.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.error('Ошибка кэширования:', err))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(err => console.error('Ошибка fetch:', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});