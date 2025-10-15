const CACHE_NAME = 'kalkulator-waris-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Amiri:wght@400;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          console.log('[SW] Serving from cache:', event.request.url);
          return response;
        }
        
        console.log('[SW] Fetching from network:', event.request.url);
        return fetch(event.request).then(response => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          // Cache successful responses
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // Fallback for offline
        if (event.request.destination === 'document') {
          return caches.match('./offline.html').then(response => {
            return response || new Response(
              `<!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Offline - Kalkulator Waris</title>
                <style>
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    text-align: center;
                    padding: 20px;
                  }
                  .offline-container {
                    max-width: 400px;
                  }
                  .offline-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    opacity: 0.7;
                  }
                  .offline-title {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                  }
                  .offline-message {
                    opacity: 0.8;
                    line-height: 1.6;
                  }
                  .retry-btn {
                    background: linear-gradient(135deg, #00ffff, #0080ff);
                    border: none;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    margin-top: 1rem;
                    font-size: 1rem;
                  }
                </style>
              </head>
              <body>
                <div class="offline-container">
                  <div class="offline-icon">📱</div>
                  <h1 class="offline-title">Mode Offline</h1>
                  <p class="offline-message">
                    Anda sedang offline. Beberapa fitur mungkin tidak tersedia. 
                    Aplikasi akan kembali normal saat koneksi internet pulih.
                  </p>
                  <button class="retry-btn" onclick="window.location.reload()">
                    Coba Lagi
                  </button>
                </div>
              </body>
              </html>`,
              { 
                headers: { 'Content-Type': 'text/html' }
              }
            );
          });
        }
      })
  );
});

// Background Sync untuk menyimpan data saat offline
self.addEventListener('sync', event => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync-calculation') {
    event.waitUntil(syncCalculations());
  }
});

async function syncCalculations() {
  console.log('[SW] Syncing calculations...');
  // Implementation untuk sinkronisasi data perhitungan
  // Bisa ditambahkan jika diperlukan fitur sync dengan server
}

// Push notifications (untuk update app atau reminder)
self.addEventListener('push', event => {
  console.log('[SW] Push received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Aplikasi Kalkulator Waris telah diperbarui',
    icon: './icon-192x192.png',
    badge: './icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Buka Aplikasi',
        icon: './icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Tutup',
        icon: './icon-192x192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Kalkulator Waris', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification click received.');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});

// Message handler for communication with main thread
self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_NAME
    });
  }
});

// Show update available notification
self.addEventListener('install', event => {
  // Skip waiting to activate new service worker immediately
  self.skipWaiting();
});

// Notify clients about update
self.addEventListener('activate', event => {
  event.waitUntil(
    self.clients.claim().then(() => {
      // Notify all clients about the update
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'UPDATE_AVAILABLE'
          });
        });
      });
    })
  );
});