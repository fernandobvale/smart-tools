const STATIC_CACHE = 'ferramentas-static-v10';
const ASSET_CACHE = 'ferramentas-assets-v10';

const staticUrlsToCache = [
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

const FALLBACK_HTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Carregando...</title>
  <style>
    body { font-family: system-ui, sans-serif; text-align: center; padding: 48px 20px; }
    button { padding: 10px 16px; border: 0; border-radius: 8px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Carregando aplicação...</h1>
  <p>Se a atualização travou, recarregue a página.</p>
  <button onclick="location.reload()">Recarregar</button>
</body>
</html>
`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(staticUrlsToCache)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const allowedCaches = [STATIC_CACHE, ASSET_CACHE];

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!allowedCaches.includes(cacheName)) {
            return caches.delete(cacheName);
          }
          return Promise.resolve(false);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(
        () => new Response(FALLBACK_HTML, { headers: { 'Content-Type': 'text/html; charset=UTF-8' } })
      )
    );
    return;
  }

  const isAppCodeRequest =
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.includes('/node_modules/.vite/') ||
    url.search.includes('v=');

  if (isAppCodeRequest) {
    event.respondWith(fetch(event.request));
    return;
  }

  const isStaticAsset =
    staticUrlsToCache.includes(url.pathname) ||
    /\.(?:png|jpg|jpeg|svg|webp|gif|ico|woff2?)$/i.test(url.pathname);

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone();
            caches.open(ASSET_CACHE).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        });
      })
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
