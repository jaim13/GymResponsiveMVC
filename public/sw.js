// sw.js

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('mi-cache').then(function(cache) {
        return cache.addAll([
          '/',
          '/Styles.css',
          '/js/main.js'
        ]);
      })
    );
  });
  
self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
});
