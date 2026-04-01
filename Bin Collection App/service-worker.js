// ---------------------------------------------
// PWA SERVICE WORKER
// ---------------------------------------------

const CACHE_NAME = "bin-pwa-v1";
const STATIC_ASSETS = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./assets/css/colours.css",
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png",
    "./assets/icons/maskable-512.png",
    "./components/countdown.js",
    "./components/next-collection.js",
    "./components/mark-collected.js",
    "./components/ui.js",
    "./data/schedule.json"
];

// ---------------------------------------------
// INSTALL: Cache all static assets
// ---------------------------------------------
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// ---------------------------------------------
// ACTIVATE: Clean old caches
// ---------------------------------------------
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// ---------------------------------------------
// FETCH: Cache-first for static files,
//        Network-first for schedule.json
// ---------------------------------------------
self.addEventListener("fetch", event => {
    const request = event.request;

    // Always fetch fresh schedule.json
    if (request.url.includes("schedule.json")) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    const cloned = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, cloned);
                    });
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // Cache-first for everything else
    event.respondWith(
        caches.match(request).then(cached => {
            return (
                cached ||
                fetch(request).then(response => {
                    const cloned = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, cloned);
                    });
                    return response;
                })
            );
        })
    );
});