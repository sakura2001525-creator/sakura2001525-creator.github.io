const CACHE_NAME = `barcode-reader-demo-pwa-v1`;

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
      '/',
    ]);
  })());
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Get the resource from the cache.
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    } else {
        try {
          // If the resource was not in the cache, try the network.
          const fetchResponse = await fetch(event.request);

          if (event.request.url.indexOf('chrome-extension') === -1) {
              // Save the resource in the cache and return it.
              cache.put(event.request, fetchResponse.clone());
          } else {
              console.log("not caching : ", event.request.url);
          }

          return fetchResponse;
        } catch (e) {
          // The network failed.
        }
    }
  })());
});
