// Service Worker for Adzan Realtime PWA
const CACHE_NAME = 'adzan-realtime-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/hadith.js',
  '/sunnah-hadith.js',
  '/style.css',
  '../_favicon.png',
  '../images/_logo.png',
  '../images/bg.jpg',
  '/css/font-awesome/css/font-awesome.min.css',
  '/js/jquery-2.1.3.min.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Adzan Realtime: Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Adzan Realtime: Cache install failed', err);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Adzan Realtime: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for prayer notifications
self.addEventListener('sync', event => {
  if (event.tag === 'prayer-notification') {
    event.waitUntil(checkPrayerTimes());
  }
});

// Push notification handler
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '../_favicon.png',
      badge: '../_favicon.png',
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: [
        {
          action: 'open',
          title: 'Buka Aplikasi'
        },
        {
          action: 'dismiss',
          title: 'Tutup'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then(clientList => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.registration.scope) && 'focus' in client) {
            return client.focus();
          }
        }
        // If not open, open new window
        if (clients.openWindow) {
          return clients.openWindow('https://mfarismuzakki.id/adzan_realtime/');
        }
      })
    );
  }
});

// Prayer time checking function
async function checkPrayerTimes() {
  try {
    // This would be called periodically to check prayer times
    // Implementation would depend on stored prayer schedule
    console.log('Adzan Realtime: Checking prayer times for notifications');
  } catch (error) {
    console.error('Adzan Realtime: Error checking prayer times', error);
  }
}