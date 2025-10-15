// Service Worker untuk Sirah Nabi & Sahabat
// Offline-first progressive web app dengan advanced caching

const VERSION = '1.2.0';
const CACHE_NAME = 'sirah-v' + VERSION;
const STATIC_CACHE_NAME = 'sirah-static-v' + VERSION;
const DYNAMIC_CACHE_NAME = 'sirah-dynamic-v' + VERSION;
const PRECACHE_NAME = 'sirah-precache-v' + VERSION;

// File yang akan di-cache untuk offline
const STATIC_FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './cache-manager.js',
  './manifest.json',
  // External resources yang penting
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Cache limits dan strategy
const CACHE_LIMITS = {
  static: 100,
  dynamic: 50,
  precache: 30
};

// Preload popular categories untuk instant access
const POPULAR_CATEGORIES = [
  'nabi_part1',
  'sahabat_khulafa',
  'sahabiyat'
];

// Install event - cache static files
self.addEventListener('install', event => {
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Cache install failed', error);
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName.startsWith('sirah-') && 
                cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== PRECACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) return;
  
  event.respondWith(handleFetch(event.request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Cache first untuk static resources
    if (STATIC_FILES.some(file => request.url.includes(file))) {
      return await cacheFirst(request);
    }
    
    // Strategy 2: Network first untuk data files
    if (request.url.includes('/data/') || request.url.includes('.js')) {
      return await networkFirst(request);
    }
    
    // Strategy 3: Stale while revalidate untuk lainnya
    return await staleWhileRevalidate(request);
    
  } catch (error) {
    // Fallback untuk offline
    if (request.destination === 'document') {
      return caches.match('./index.html');
    }
    
    return new Response('Offline - Resource tidak tersedia', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Cache First Strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  await updateCache(STATIC_CACHE_NAME, request, networkResponse.clone());
  return networkResponse;
}

// Network First Strategy  
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    await updateCache(DYNAMIC_CACHE_NAME, request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const networkResponsePromise = fetch(request).then(response => {
    updateCache(DYNAMIC_CACHE_NAME, request, response.clone());
    return response;
  });
  
  return cachedResponse || networkResponsePromise;
}

// Update cache helper
async function updateCache(cacheName, request, response) {
  if (!response || response.status !== 200) return;
  
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
  await limitCacheSize(cacheName);
}

// Limit cache size
async function limitCacheSize(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  let limit = CACHE_LIMITS.dynamic;
  if (cacheName.includes('static')) limit = CACHE_LIMITS.static;
  if (cacheName.includes('precache')) limit = CACHE_LIMITS.precache;
  
  if (keys.length > limit) {
    await cache.delete(keys[0]);
    await limitCacheSize(cacheName);
  }
}

// Background sync untuk offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'sirah-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Handle any offline actions when connection is restored
}