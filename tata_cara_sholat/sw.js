// Service Worker untuk Aplikasi Tata Cara Sholat
// Cache strategy: Cache first untuk aset, Network first untuk data

const CACHE_NAME = 'tata-cara-sholat-v1.0.0';
const CACHE_DURATION = 10 * 60 * 1000; // 10 menit

const STATIC_ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './data/sholat-data.js',
    './data/bacaan-sholat.js',
    './data/sunnah-sholat.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('SW: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('SW: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('SW: Installed successfully');
                self.skipWaiting();
            })
            .catch(error => {
                console.error('SW: Install failed', error);
            })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
    console.log('SW: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('SW: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('SW: Activated successfully');
                self.clients.claim();
            })
    );
});

// Fetch event - serve from cache with fallback to network
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip external requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // If found in cache and not expired, return cached version
                if (cachedResponse) {
                    // Check if cache is still valid (for data files)
                    if (isDataFile(event.request.url)) {
                        const cacheTime = cachedResponse.headers.get('sw-cached-at');
                        if (cacheTime && Date.now() - parseInt(cacheTime) < CACHE_DURATION) {
                            console.log('SW: Serving from cache (fresh):', event.request.url);
                            return cachedResponse;
                        }
                    } else {
                        // Static assets - always serve from cache
                        console.log('SW: Serving from cache (static):', event.request.url);
                        return cachedResponse;
                    }
                }

                // Not in cache or expired, fetch from network
                console.log('SW: Fetching from network:', event.request.url);
                return fetch(event.request)
                    .then(networkResponse => {
                        // Only cache successful responses
                        if (networkResponse.status === 200) {
                            const responseToCache = networkResponse.clone();
                            
                            // Add timestamp for data files
                            if (isDataFile(event.request.url)) {
                                const headers = new Headers(responseToCache.headers);
                                headers.set('sw-cached-at', Date.now().toString());
                                const modifiedResponse = new Response(responseToCache.body, {
                                    status: responseToCache.status,
                                    statusText: responseToCache.statusText,
                                    headers: headers
                                });
                                
                                caches.open(CACHE_NAME).then(cache => {
                                    cache.put(event.request, modifiedResponse);
                                });
                            } else {
                                // Cache static assets normally
                                caches.open(CACHE_NAME).then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                            }
                        }
                        
                        return networkResponse;
                    })
                    .catch(error => {
                        console.log('SW: Network failed, trying cache:', event.request.url);
                        
                        // Network failed, try to serve from cache even if expired
                        return caches.match(event.request)
                            .then(cachedResponse => {
                                if (cachedResponse) {
                                    console.log('SW: Serving stale cache:', event.request.url);
                                    return cachedResponse;
                                }
                                
                                // If it's a navigation request and no cache, return offline page
                                if (event.request.mode === 'navigate') {
                                    return createOfflinePage();
                                }
                                
                                throw error;
                            });
                    });
            })
    );
});

// Message event - handle commands from main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'SKIP_WAITING':
                self.skipWaiting();
                break;
            case 'CLEAR_CACHE':
                clearCache().then(() => {
                    event.ports[0].postMessage({ success: true });
                });
                break;
            case 'GET_CACHE_INFO':
                getCacheInfo().then(info => {
                    event.ports[0].postMessage(info);
                });
                break;
        }
    }
});

// Helper functions
function isDataFile(url) {
    return url.includes('/data/') || url.includes('.js');
}

function createOfflinePage() {
    const offlineHTML = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Offline - Tata Cara Sholat</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
                    color: #fff;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }
                .offline-container {
                    max-width: 400px;
                    padding: 2rem;
                }
                .offline-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    opacity: 0.7;
                }
                h1 {
                    color: #00ffff;
                    margin-bottom: 1rem;
                }
                p {
                    color: #8b9dc3;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                }
                .retry-btn {
                    background: linear-gradient(45deg, #00ffff, #0095ff);
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    color: #0f0f23;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 16px;
                }
                .retry-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 255, 255, 0.3);
                }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <div class="offline-icon">📱</div>
                <h1>Anda Sedang Offline</h1>
                <p>Aplikasi Tata Cara Sholat memerlukan koneksi internet untuk memuat konten terbaru. Silakan periksa koneksi internet Anda.</p>
                <button class="retry-btn" onclick="window.location.reload()">Coba Lagi</button>
            </div>
        </body>
        </html>
    `;
    
    return new Response(offlineHTML, {
        headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
        }
    });
}

async function clearCache() {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('SW: All caches cleared');
    } catch (error) {
        console.error('SW: Error clearing cache:', error);
    }
}

async function getCacheInfo() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const requests = await cache.keys();
        
        const cacheInfo = {
            name: CACHE_NAME,
            size: requests.length,
            items: requests.map(req => ({
                url: req.url,
                method: req.method
            }))
        };
        
        return cacheInfo;
    } catch (error) {
        console.error('SW: Error getting cache info:', error);
        return { error: error.message };
    }
}

// Background sync for offline actions (if supported)
if ('sync' in self.registration) {
    self.addEventListener('sync', event => {
        if (event.tag === 'background-sync') {
            event.waitUntil(doBackgroundSync());
        }
    });
}

async function doBackgroundSync() {
    try {
        console.log('SW: Performing background sync');
        // Sync any offline actions when connection is restored
        // This could include syncing favorite changes, etc.
    } catch (error) {
        console.error('SW: Background sync failed:', error);
    }
}

// Push notification handler (for future use)
self.addEventListener('push', event => {
    if (event.data) {
        const options = {
            body: event.data.text(),
            icon: './icon-192.png',
            badge: './icon-192.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Buka Aplikasi',
                    icon: './icon-192.png'
                },
                {
                    action: 'close',
                    title: 'Tutup',
                    icon: './icon-192.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification('Tata Cara Sholat', options)
        );
    }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('./')
        );
    }
});

console.log('SW: Service Worker script loaded');