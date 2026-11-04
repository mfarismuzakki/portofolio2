/* IslamHub moved to https://islamhub.web.id
 *
 * Phones that installed the app here keep opening the old version from the old service worker's
 * cache, so a redirect page alone would never reach them. The browser still checks this file for
 * updates: this worker replaces the old one, drops the IslamHub caches, sends open windows to the
 * new address and removes itself. localStorage is left alone.
 */
const TARGET = 'https://islamhub.web.id/';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith('islamhub-')) await caches.delete(name);
    }
    await self.clients.claim();
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await Promise.all(windows.map(client => {
      const { search, hash } = new URL(client.url);
      return client.navigate(TARGET + search + hash).catch(() => {});
    }));
    await self.registration.unregister();
  })());
});
