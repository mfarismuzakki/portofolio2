/**
 * Islamic SuperApps Service Worker
 * Provides offline capability and caching for all components
 */

const CACHE_NAME = 'islamic-superapps-v1.0.0';
const STATIC_CACHE = 'islamic-superapps-static-v1';
const DYNAMIC_CACHE = 'islamic-superapps-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    // External resources
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap'
];

// Component files (loaded dynamically)
const COMPONENT_FILES = [
    './components/adzan-component.js',
    './components/dzikir-component.js',
    './components/kalkulator-component.js',
    './components/qibla-component.js',
    './components/tata-cara-component.js'
];

// API endpoints that should be cached
const API_CACHE_PATTERNS = [
    /api\.aladhan\.com/,
    /api\.pray\.zone/,
    /islamicfinder\.us/
];

self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...');
    
    event.waitUntil(
        Promise.all([
            // Cache static files
            caches.open(STATIC_CACHE).then((cache) => {
                return cache.addAll(STATIC_FILES);
            }),
            // Prepare dynamic cache
            caches.open(DYNAMIC_CACHE)
        ]).then(() => {
            console.log('✅ Service Worker installed successfully');
            self.skipWaiting();
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('🔧 Service Worker activating...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== CACHE_NAME) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all clients
            self.clients.claim()
        ]).then(() => {
            console.log('✅ Service Worker activated successfully');
        })
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http(s) requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Handle different types of requests
    if (url.origin === location.origin) {
        // Same origin requests (app files)
        event.respondWith(handleAppRequest(request));
    } else if (isAPIRequest(url)) {
        // API requests
        event.respondWith(handleAPIRequest(request));
    } else {
        // External resources (fonts, icons, etc.)
        event.respondWith(handleExternalRequest(request));
    }
});

/**
 * Handle app file requests (HTML, CSS, JS, components)
 */
async function handleAppRequest(request) {
    const url = new URL(request.url);
    
    try {
        // For development: Always fetch fresh for component files
        if (url.pathname.includes('/components/')) {
            console.log('🔄 Fetching fresh component:', url.pathname);
            const response = await fetch(request);
            
            if (response.ok) {
                // Cache for offline use
                const cache = await caches.open(DYNAMIC_CACHE);
                cache.put(request, response.clone());
            }
            
            return response;
        }
        
        // Check static cache first for other files
        const staticCache = await caches.open(STATIC_CACHE);
        let response = await staticCache.match(request);
        
        if (response) {
            // Return cached version and update in background
            updateCacheInBackground(request, staticCache);
            return response;
        }
        
        // Fetch from network
        response = await fetch(request);
        
        if (response.ok) {
            // Cache the response
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
        }
        
        return response;
        
    } catch (error) {
        console.error('❌ App request failed:', error);
        
        // Try to serve from cache as fallback
        const caches_array = [STATIC_CACHE, DYNAMIC_CACHE];
        for (const cacheName of caches_array) {
            const cache = await caches.open(cacheName);
            const cachedResponse = await cache.match(request);
            if (cachedResponse) {
                console.log('📦 Serving from cache:', url.pathname);
                return cachedResponse;
            }
        }
        
        // Return offline fallback for HTML requests
        if (request.headers.get('accept')?.includes('text/html')) {
            return getOfflineFallback();
        }
        
        throw error;
    }
}

/**
 * Handle API requests with cache-first strategy for prayer times
 */
async function handleAPIRequest(request) {
    const url = new URL(request.url);
    
    try {
        // For prayer time APIs, use cache-first strategy
        if (url.hostname.includes('aladhan') || url.hostname.includes('pray')) {
            const cache = await caches.open(DYNAMIC_CACHE);
            const cachedResponse = await cache.match(request);
            
            // Check if cached data is still fresh (max 24 hours for prayer times)
            if (cachedResponse) {
                const cacheDate = new Date(cachedResponse.headers.get('date') || 0);
                const now = new Date();
                const hoursDiff = (now - cacheDate) / (1000 * 60 * 60);
                
                if (hoursDiff < 24) {
                    // Return cached data and update in background
                    updateAPIInBackground(request, cache);
                    return cachedResponse;
                }
            }
        }
        
        // Fetch from network
        const response = await fetch(request);
        
        if (response.ok) {
            // Cache successful API responses
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
        }
        
        return response;
        
    } catch (error) {
        console.error('❌ API request failed:', error);
        
        // Return cached version if available
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            // Add offline indicator to response
            const responseBody = await cachedResponse.text();
            const modifiedBody = JSON.stringify({
                ...JSON.parse(responseBody),
                _offline: true,
                _cachedAt: cachedResponse.headers.get('date')
            });
            
            return new Response(modifiedBody, {
                status: cachedResponse.status,
                statusText: cachedResponse.statusText,
                headers: cachedResponse.headers
            });
        }
        
        throw error;
    }
}

/**
 * Handle external resource requests (fonts, CDN files)
 */
async function handleExternalRequest(request) {
    try {
        // Check cache first
        const cache = await caches.open(STATIC_CACHE);
        let response = await cache.match(request);
        
        if (response) {
            return response;
        }
        
        // Fetch from network with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        response = await fetch(request, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            // Cache external resources
            cache.put(request, response.clone());
        }
        
        return response;
        
    } catch (error) {
        console.error('❌ External request failed:', error);
        
        // Return cached version if available
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return empty response for failed external resources
        if (request.url.includes('.css')) {
            return new Response('/* Offline mode - external CSS not available */', {
                headers: { 'Content-Type': 'text/css' }
            });
        }
        
        throw error;
    }
}

/**
 * Update cache in background without blocking response
 */
function updateCacheInBackground(request, cache) {
    // Don't await this - let it run in background
    fetch(request)
        .then((response) => {
            if (response.ok) {
                cache.put(request, response.clone());
            }
        })
        .catch((error) => {
            console.warn('⚠️ Background cache update failed:', error);
        });
}

/**
 * Update API cache in background
 */
function updateAPIInBackground(request, cache) {
    fetch(request)
        .then((response) => {
            if (response.ok) {
                cache.put(request, response.clone());
            }
        })
        .catch((error) => {
            console.warn('⚠️ Background API update failed:', error);
        });
}

/**
 * Check if request is to an API endpoint
 */
function isAPIRequest(url) {
    return API_CACHE_PATTERNS.some(pattern => pattern.test(url.hostname));
}

/**
 * Get offline fallback page
 */
function getOfflineFallback() {
    return new Response(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Islamic SuperApps - Offline</title>
            <style>
                body {
                    font-family: 'Rajdhani', sans-serif;
                    background: linear-gradient(135deg, #0a0a0f 0%, #050508 100%);
                    color: #ffffff;
                    margin: 0;
                    padding: 20px;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }
                .offline-container {
                    max-width: 400px;
                    padding: 40px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 15px;
                    border: 1px solid rgba(0, 255, 255, 0.2);
                }
                .offline-icon {
                    font-size: 48px;
                    color: #00ffff;
                    margin-bottom: 20px;
                }
                h1 {
                    font-family: 'Orbitron', monospace;
                    color: #00ffff;
                    margin-bottom: 15px;
                }
                .retry-btn {
                    background: linear-gradient(135deg, #00ffff, #0080ff);
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    color: #0a0a0f;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <div class="offline-icon">📱</div>
                <h1>Mode Offline</h1>
                <p>Aplikasi berjalan dalam mode offline. Beberapa fitur mungkin terbatas.</p>
                <p>Data tersimpan lokal masih dapat diakses.</p>
                <button class="retry-btn" onclick="window.location.reload()">
                    Coba Lagi
                </button>
            </div>
        </body>
        </html>
    `, {
        headers: { 'Content-Type': 'text/html' }
    });
}

// Background sync for prayer time updates
self.addEventListener('sync', (event) => {
    if (event.tag === 'prayer-time-sync') {
        event.waitUntil(syncPrayerTimes());
    }
});

async function syncPrayerTimes() {
    try {
        // This would sync with the main app to update prayer times
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_PRAYER_TIMES',
                timestamp: Date.now()
            });
        });
    } catch (error) {
        console.error('❌ Prayer time sync failed:', error);
    }
}

// Push notification handling
self.addEventListener('push', (event) => {
    const options = {
        body: 'Waktu sholat telah tiba',
        icon: './assets/icons/icon-192.png',
        badge: './assets/icons/badge-72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Buka Aplikasi'
            },
            {
                action: 'close',
                title: 'Tutup'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Islamic SuperApps', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('./index.html?from=notification')
        );
    }
});

console.log('🚀 Islamic SuperApps Service Worker loaded');