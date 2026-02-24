const CACHE_NAME = 'elite-inventory-v2-tm';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './images/logo-tm.png'
];

// Install Event: Cache core assets
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 [Service Worker] Caching all assets');
                return cache.addAll(ASSETS);
            })
    );
});

// Activate Event: Clean old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// Fetch Event: Network First, Fallback to Cache
self.addEventListener('fetch', (e) => {
    // Skip Supabase API calls (let them be network-only for now)
    if (e.request.url.includes('supabase.co')) return;

    e.respondWith(
        fetch(e.request)
            .catch(() => caches.match(e.request))
    );
});
