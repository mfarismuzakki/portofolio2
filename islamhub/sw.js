/* ===== IslamHub Service Worker =====
 *
 * Offline-first app shell:
 *  - Every file in precache-manifest.js is stored at install. Unchanged files are copied
 *    from the previous version instead of being downloaded again.
 *  - App files are served from cache immediately, so the app opens without a network.
 *  - Network requests that are still needed use a short timeout and fall back to cache,
 *    so a weak signal can never hold the splash screen.
 *  - User data caches (prayer tables, Qur'an pages, downloaded audio) survive updates.
 */
importScripts('precache-manifest.js');

const BUILD = '5b244be665f9';
const SHELL = `islamhub-shell-${self.__PRECACHE_VERSION || BUILD}`;
const DATA = 'islamhub-data';                // runtime cache, kept across versions
const AUDIO = 'islamhub-alquran-audio';      // explicit Qur'an audio downloads only
const META = '__precache_meta__';
const NET_TIMEOUT = 3500;

const scopeUrl = new URL(self.registration.scope);
const abs = path => new URL(path, scopeUrl).href;
const PRECACHE = new Map((self.__PRECACHE || []).map(([path, rev]) => [abs(path), rev]));
const stripSearch = href => href.split('?')[0].split('#')[0];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    const previous = await previousShell();
    const oldMeta = previous ? await previous.match(META).then(r => r ? r.json() : {}).catch(() => ({})) : {};
    const queue = [...PRECACHE.entries()];
    const worker = async () => {
      while (queue.length) {
        const [url, rev] = queue.shift();
        try {
          if (previous && oldMeta[url] === rev) {
            const hit = await previous.match(url);
            if (hit) { await cache.put(url, hit); continue; }
          }
          const res = await fetch(url, { cache: 'no-cache' });
          if (res.ok) await cache.put(url, res);
        } catch (e) { /* a missing file must not block the rest of the shell */ }
      }
    };
    await Promise.all(Array.from({ length: 6 }, worker));
    await cache.put(META, new Response(JSON.stringify(Object.fromEntries(PRECACHE))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      // Old shells and the pre-2026 single versioned cache are replaced; data caches stay.
      if ((name.startsWith('islamhub-shell-') && name !== SHELL) || name.startsWith('islamhub-v')) await caches.delete(name);
    }
    if (self.registration.navigationPreload) await self.registration.navigationPreload.disable().catch(() => {});
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Only our own files; APIs, YouTube and map tiles go straight to the network.
  if (url.origin !== scopeUrl.origin || !url.pathname.startsWith(scopeUrl.pathname)) return;

  if (req.mode === 'navigate') {
    event.respondWith(navigation(req));
    return;
  }
  const key = stripSearch(url.href);
  if (PRECACHE.has(key)) {
    event.respondWith(shellFirst(req, key));
    return;
  }
  if (url.pathname.includes('/assets/audio/')) {
    event.respondWith(audio(req));
    return;
  }
  if (url.pathname.endsWith('/live-streams.json')) {
    event.respondWith(networkFirst(req, key));
    return;
  }
  // Prayer tables, Qur'an pages, images and anything else: cache first, refresh in background.
  event.respondWith(staleWhileRevalidate(req, key));
});

async function previousShell() {
  const names = (await caches.keys()).filter(n => n.startsWith('islamhub-shell-') && n !== SHELL);
  return names.length ? caches.open(names[names.length - 1]) : null;
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
  });
}

async function navigation(req) {
  const shell = await caches.open(SHELL);
  const cached = await shell.match(abs('index.html'));
  if (cached) {
    // Open instantly from the shell; fresh HTML arrives with the next worker update.
    return cached;
  }
  try {
    return await withTimeout(fetch(req), NET_TIMEOUT);
  } catch (e) {
    return (await caches.match(abs('index.html'), { ignoreSearch: true })) || offlinePage();
  }
}

async function shellFirst(req, key) {
  const shell = await caches.open(SHELL);
  const hit = await shell.match(key);
  if (hit) return hit;
  try {
    const res = await withTimeout(fetch(req), NET_TIMEOUT * 2);
    if (res.ok) shell.put(key, res.clone());
    return res;
  } catch (e) {
    return (await caches.match(key, { ignoreSearch: true })) || Response.error();
  }
}

async function networkFirst(req, key) {
  const data = await caches.open(DATA);
  try {
    const res = await withTimeout(fetch(req, { cache: 'no-cache' }), NET_TIMEOUT);
    if (res.ok) data.put(key, res.clone());
    return res;
  } catch (e) {
    return (await data.match(key)) || Response.error();
  }
}

async function staleWhileRevalidate(req, key) {
  const data = await caches.open(DATA);
  const hit = await data.match(key);
  const refresh = fetch(req).then(res => {
    if (res.ok && res.status === 200) data.put(key, res.clone());
    return res;
  });
  if (hit) {
    refresh.catch(() => {});
    return hit;
  }
  try {
    return await withTimeout(refresh, NET_TIMEOUT * 3);
  } catch (e) {
    return Response.error();
  }
}

// Audio is served from cache with Range support (<audio> seeks with Range requests).
// Qur'an audio: only what the user downloaded; otherwise it streams.
// Adzan and dzikir audio: stored on first play so reminders work offline.
async function audio(req) {
  const key = stripSearch(req.url);
  const quran = key.includes('/assets/audio/alquran/');
  const cache = await caches.open(quran ? AUDIO : DATA);
  let hit = await cache.match(key);
  if (!hit) {
    if (quran) return fetch(req);
    try {
      const full = await fetch(key);
      if (!full.ok) return full;
      await cache.put(key, full.clone());
      hit = full;
    } catch (e) {
      return Response.error();
    }
  }
  const range = req.headers.get('range');
  if (!range) return hit;
  const buf = await hit.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  const start = m && m[1] ? Number(m[1]) : 0;
  const end = m && m[2] ? Math.min(Number(m[2]), buf.byteLength - 1) : buf.byteLength - 1;
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': hit.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': `bytes ${start}-${end}/${buf.byteLength}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes'
    }
  });
}

function offlinePage() {
  return new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><body style="font-family:system-ui;padding:24px;background:#f6f3ea;color:#1f3d33"><h2>IslamHub sedang offline</h2><p>Buka aplikasi sekali saat ada internet agar tersimpan dan bisa dipakai offline.</p><button onclick="location.reload()">Coba lagi</button>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

// Push notification event
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Notifikasi baru dari IslamHub',
    icon: abs('assets/icons/icon-192x192.png'),
    badge: abs('assets/icons/icon-72x72.png'),
    vibrate: [200, 100, 200],
    tag: 'islamhub-notification',
    requireInteraction: false
  };
  event.waitUntil(self.registration.showNotification('IslamHub', options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(scopeUrl.href));
});
