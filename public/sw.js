
const CACHE_NAME = 'ferramentas-v2'; // Incrementada a versão
const STATIC_CACHE = 'ferramentas-static-v2';
const DYNAMIC_CACHE = 'ferramentas-dynamic-v2';

// URLs estáticas que podem ser cachadas por mais tempo
const staticUrlsToCache = [
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// URLs que devem ser verificadas por atualizações mais frequentemente
const dynamicUrlsToCache = [
  '/',
  '/index.html'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(staticUrlsToCache);
      }),
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('Caching dynamic assets');
        return cache.addAll(dynamicUrlsToCache);
      })
    ])
  );
  // Força a ativação imediata do novo service worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE];
  
  event.waitUntil(
    Promise.all([
      // Remove caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Notifica todos os clientes sobre a nova versão
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SW_UPDATED',
            message: 'Nova versão disponível. Recarregue a página para ver as atualizações.'
          });
        });
      })
    ])
  );
  
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ignora requisições que não são GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignora requisições para APIs externas
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(event.request.url);
  
  // Estratégia Network First para arquivos HTML e JS/CSS para garantir atualizações
  if (url.pathname.endsWith('.html') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Se a requisição foi bem-sucedida, atualiza o cache
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Se falhou, tenta buscar no cache
          return caches.match(event.request);
        })
    );
  }
  // Estratégia Cache First para assets estáticos (imagens, ícones, etc.)
  else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        });
      })
    );
  }
});

// Listener para mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
