/* IslamHub moved to https://islamhub.web.id
 *
 * Phones that installed the app here keep opening the old version from the old service worker's
 * cache, so a redirect page alone would never reach them. The browser still checks this file for
 * updates: this worker replaces the old one, drops the IslamHub caches, removes itself and reloads
 * open windows. The reload reaches the redirect page in index.html, which forwards the user's data
 * (a worker cannot read localStorage). localStorage here is left alone.
 */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  const cleaned = (async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith('islamhub-')) await caches.delete(name);
    }
    await self.clients.claim();
  })();
  event.waitUntil(cleaned);
  // Not inside waitUntil: a same-origin navigation waits for this worker's activation to finish, so
  // waiting for the navigation there would hang the page. Unregistering first sends it to the network.
  cleaned.then(async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await self.registration.unregister();
    windows.forEach(client => client.navigate(client.url).catch(() => {}));
  });
});
