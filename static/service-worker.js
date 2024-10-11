const CACHE_NAME = 'emotion-detector-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/static/style.css',
    '/static/script.js',
    '/manifest.json',
    '/static/icon.png'
];

// Install event to cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return Promise.all(
                urlsToCache.map(url => {
                    return fetch(url).then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to fetch ${url}: ${response.status}`);
                        }
                        return cache.put(url, response); // Cache the response
                    }).catch(error => {
                        console.error('Failed to cache:', error); // Log the error for debugging
                    });
                })
            );
        })
    );
});

// Fetch event to serve cached resources
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {
                return caches.match('/index.html'); // Serve index.html when offline
            });
        })
    );
});

// Activate event to clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName); // Delete old caches
                    }
                })
            );
        })
    );
});
