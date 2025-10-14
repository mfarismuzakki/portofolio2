// Service Worker untuk Dzikir & Doa Harian
// Offline-first progressive web app dengan advanced caching

const VERSION = '1.2.0';
const CACHE_NAME = 'dzikirdoa-v' + VERSION;
const STATIC_CACHE_NAME = 'dzikirdoa-static-v' + VERSION;
const DYNAMIC_CACHE_NAME = 'dzikirdoa-dynamic-v' + VERSION;
const PRECACHE_NAME = 'dzikirdoa-precache-v' + VERSION;

// File yang akan di-cache untuk offline
const STATIC_FILES = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './data/doa-collection.js',
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
  'dzikir_pagi',
  'dzikir_petang', 
  'doa_tidur',
  'sholat'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached successfully');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('Service Worker: Error caching static files:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Delete old versions of caches
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== PRECACHE_NAME &&
                (cacheName.includes('dzikirdoa-static') || 
                 cacheName.includes('dzikirdoa-dynamic') ||
                 cacheName.includes('dzikirdoa-precache'))) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        // Preload popular content after activation
        return preloadPopularContent();
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external domains except for fonts and CDN resources
  if (url.origin !== self.location.origin && 
      !url.hostname.includes('fonts.googleapis.com') &&
      !url.hostname.includes('fonts.gstatic.com') &&
      !url.hostname.includes('cdnjs.cloudflare.com')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache:', request.url);
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(request)
          .then(networkResponse => {
            // Check if valid response
            if (!networkResponse || 
                networkResponse.status !== 200 || 
                networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone response for caching
            const responseToCache = networkResponse.clone();

            // Cache strategy based on request type
            if (isStaticAsset(request)) {
              // Cache static assets in static cache
              caches.open(STATIC_CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseToCache);
                })
                .catch(err => console.error('Error caching static asset:', err));
            } else {
              // Cache dynamic content in dynamic cache with limit
              caches.open(DYNAMIC_CACHE_NAME)
                .then(cache => {
                  return cache.keys().then(keys => {
                    if (keys.length >= CACHE_LIMITS.dynamic) {
                      // Remove oldest cached item
                      return cache.delete(keys[0]).then(() => {
                        return cache.put(request, responseToCache);
                      });
                    }
                    return cache.put(request, responseToCache);
                  });
                })
                .catch(err => console.error('Error caching dynamic content:', err));
            }

            return networkResponse;
          })
          .catch(() => {
            // Network failed, try to serve fallback
            console.log('Service Worker: Network failed, serving fallback');
            return getFallbackResponse(request);
          });
      })
  );
});

// Helper function to determine if request is for static asset
function isStaticAsset(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  return pathname.includes('.css') || 
         pathname.includes('.js') || 
         pathname.includes('.json') ||
         pathname.includes('.html') ||
         url.hostname.includes('fonts.googleapis.com') ||
         url.hostname.includes('fonts.gstatic.com') ||
         url.hostname.includes('cdnjs.cloudflare.com');
}

// Fallback responses for offline scenarios
function getFallbackResponse(request) {
  const url = new URL(request.url);
  
  // Fallback for HTML pages
  if (request.destination === 'document') {
    return caches.match('./index.html');
  }
  
  // Fallback for images
  if (request.destination === 'image') {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#1a1a2e" width="200" height="200"/><text fill="#00ffff" x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="14">Offline</text></svg>',
      {
        headers: {
          'Content-Type': 'image/svg+xml'
        }
      }
    );
  }
  
  // Default fallback
  return new Response('Offline - Content not available', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}

// Background sync for when connection is restored
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'dzikirProgress') {
    event.waitUntil(syncDzikirProgress());
  }
});

// Function to sync dzikir progress when online
async function syncDzikirProgress() {
  try {
    // Get stored progress data
    const progressData = await getStoredProgressData();
    
    if (progressData && progressData.length > 0) {
      // Sync with server if needed
      // This would be implemented based on your backend
      console.log('Service Worker: Syncing dzikir progress');
      
      // Clear synced data
      await clearSyncedProgressData();
    }
  } catch (error) {
    console.error('Service Worker: Error syncing progress:', error);
  }
}

// Helper functions for background sync (placeholder implementations)
async function getStoredProgressData() {
  // Implementation to get pending sync data
  return [];
}

async function clearSyncedProgressData() {
  // Implementation to clear synced data
  return true;
}

// Push notification handler
self.addEventListener('push', event => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: 'Saatnya untuk dzikir dan doa 🤲',
    icon: './icon-192x192.png',
    badge: './icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open-dzikir',
        title: 'Buka Dzikir',
        icon: './shortcut-pagi.png'
      },
      {
        action: 'close',
        title: 'Tutup',
        icon: './close-icon.png'
      }
    ],
    requireInteraction: false,
    silent: false
  };

  const title = 'Dzikir & Doa Harian';
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'open-dzikir') {
    // Open dzikir section
    event.waitUntil(
      self.clients.openWindow('./?notification=dzikir')
    );
  } else if (event.action !== 'close') {
    // Default action - open app
    event.waitUntil(
      self.clients.openWindow('./')
    );
  }
});

// Message handler for communication with main app
self.addEventListener('message', event => {
  console.log('Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'GET_VERSION':
        event.ports[0].postMessage({
          version: CACHE_NAME
        });
        break;
      case 'CLEAR_CACHE':
        clearAllCaches().then(() => {
          event.ports[0].postMessage({
            success: true
          });
        });
        break;
      default:
        console.log('Service Worker: Unknown message type:', event.data.type);
    }
  }
});

// Preload popular content untuk akses instant
async function preloadPopularContent() {
  try {
    console.log('Service Worker: Preloading popular content...');
    
    // Import doa collection data
    const doaResponse = await fetch('./data/doa-collection.js');
    if (!doaResponse.ok) throw new Error('Failed to fetch doa collection');
    
    const doaText = await doaResponse.text();
    
    // Extract doa collection object using regex (safe evaluation)
    const match = doaText.match(/const doaCollection = ({[\s\S]*?});/);
    if (!match) {
      console.warn('Service Worker: Could not parse doa collection');
      return;
    }
    
    const cache = await caches.open(PRECACHE_NAME);
    let preloadCount = 0;
    
    // Preload popular categories
    for (const category of POPULAR_CATEGORIES) {
      try {
        // Create virtual request for category data
        const categoryKey = `category-${category}`;
        const categoryRequest = new Request(categoryKey);
        
        // Check if already cached
        const cached = await cache.match(categoryRequest);
        if (!cached) {
          // Create response with category data
          const categoryResponse = new Response(
            JSON.stringify({ 
              category, 
              timestamp: Date.now(),
              preloaded: true 
            }), 
            {
              headers: { 'Content-Type': 'application/json' }
            }
          );
          
          await cache.put(categoryRequest, categoryResponse);
          preloadCount++;
        }
        
        // Limit preload operations
        if (preloadCount >= CACHE_LIMITS.precache) break;
        
      } catch (error) {
        console.warn(`Service Worker: Failed to preload ${category}:`, error);
      }
    }
    
    console.log(`Service Worker: Preloaded ${preloadCount} popular categories`);
    
  } catch (error) {
    console.error('Service Worker: Error preloading popular content:', error);
  }
}

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  const deletePromises = cacheNames.map(cacheName => {
    if (cacheName.includes('dzikirdoa')) {
      return caches.delete(cacheName);
    }
  });
  
  return Promise.all(deletePromises);
}

// Periodic background sync for prayer times (if supported)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-prayer-times') {
    event.waitUntil(updatePrayerTimes());
  }
});

async function updatePrayerTimes() {
  try {
    // Update prayer times in background
    console.log('Service Worker: Updating prayer times in background');
    // Implementation would depend on prayer time API
  } catch (error) {
    console.error('Service Worker: Error updating prayer times:', error);
  }
}

// Error handler
self.addEventListener('error', event => {
  console.error('Service Worker: Error occurred:', event.error);
});

// Unhandled rejection handler
self.addEventListener('unhandledrejection', event => {
  console.error('Service Worker: Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

console.log('Service Worker: Registered successfully');