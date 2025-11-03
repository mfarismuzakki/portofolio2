/* ===== IslamHub Service Worker ===== */

// IMPORTANT: Update version setiap kali push update!
// Format: islamhub-v[major].[minor].[patch]-[timestamp]
const CACHE_VERSION = '1.2.0-20251103';
const CACHE_NAME = `islamhub-v${CACHE_VERSION}`;

// Strategi: Network First untuk HTML/JS/CSS, Cache First untuk assets statis
const urlsToCache = [
  '/islamhub/',
  '/islamhub/index.html',
  '/islamhub/manifest.json',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Scheherazade+New:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache assets & force update
self.addEventListener('install', (event) => {
  console.log(`Service Worker ${CACHE_VERSION} installing...`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
  // Skip waiting agar SW baru langsung aktif
  self.skipWaiting();
});

// Activate event - clean up old caches & force refresh
self.addEventListener('activate', (event) => {
  console.log(`Service Worker ${CACHE_VERSION} activating...`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('All old caches deleted, claiming clients...');
      // Force reload all tabs to get fresh content
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          console.log('Posting refresh message to client');
          client.postMessage({
            type: 'CACHE_UPDATED',
            version: CACHE_VERSION
          });
        });
      });
    })
  );
  // Take control immediately
  return self.clients.claim();
});

// Fetch event - Network First untuk code, Cache First untuk assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Network First untuk HTML, CSS, JS (selalu ambil yang terbaru)
  if (
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname === '/islamhub/' ||
    url.pathname === '/islamhub/index.html' ||
    url.pathname.includes('/js/') ||
    url.pathname.includes('/css/')
  ) {
    event.respondWith(
      fetch(event.request, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
        .then(response => {
          // Cache response baru
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback ke cache jika offline
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Cache First untuk assets statis (fonts, icons, audio)
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();
        return fetch(fetchRequest).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        }).catch(() => {
          return caches.match('/islamhub/index.html');
        });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Notifikasi baru dari IslamHub',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'islamhub-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('IslamHub', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
