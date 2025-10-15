
const CACHE_NAME = 'ferramentas-v6'; // Incrementada para v6
const STATIC_CACHE = 'ferramentas-static-v6';
const DYNAMIC_CACHE = 'ferramentas-dynamic-v6';

// URLs estáticas essenciais que podem ser cachadas com segurança
const staticUrlsToCache = [
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Fallback HTML básico para quando tudo falhar
const FALLBACK_HTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Carregando...</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
    .loading { font-size: 18px; color: #666; }
    .retry { margin-top: 20px; }
    button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="loading">Carregando aplicação...</div>
  <div class="retry">
    <button onclick="location.reload()">Tentar Novamente</button>
    <button onclick="clearCacheAndReload()">Limpar Cache</button>
  </div>
  <script>
    function clearCacheAndReload() {
      if ('caches' in window) {
        caches.keys().then(names => {
          Promise.all(names.map(name => caches.delete(name)))
            .then(() => location.reload());
        });
      } else {
        location.reload();
      }
    }
    setTimeout(() => location.reload(), 3000);
  </script>
</body>
</html>
`;

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Caching static assets only');
      return cache.addAll(staticUrlsToCache);
    }).catch(err => {
      console.warn('Failed to cache static assets:', err);
      // Continue installation even if caching fails
    })
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

  // Ignora requisições para APIs externas e websockets
  if (!event.request.url.startsWith(self.location.origin) || 
      event.request.url.includes('ws://') || 
      event.request.url.includes('wss://')) {
    return;
  }

  const url = new URL(event.request.url);
  
  // Network-first para navegação SPA
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(event.request, responseClone);
            });
            return response;
          }
          throw new Error('Network response not ok');
        })
        .catch(() => {
          return caches.match('/index.html').then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response(FALLBACK_HTML, {
              headers: { 'Content-Type': 'text/html' }
            });
          });
        })
    );
    return;
  }
  
  // Estratégia Stale While Revalidate para arquivos críticos
  if (url.pathname.endsWith('.html') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname === '/') {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request)
            .then(networkResponse => {
              // Se a resposta da rede for válida, atualiza o cache
              if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(error => {
              console.warn('Network fetch failed for:', event.request.url, error);
              return null;
            });

          // Se temos cache, retorna imediatamente e atualiza em background
          if (cachedResponse) {
            fetchPromise.catch(() => {}); // Silencia erros do background fetch
            return cachedResponse;
          }

          // Se não temos cache, aguarda a rede ou retorna fallback
          return fetchPromise.then(networkResponse => {
            if (networkResponse) {
              return networkResponse;
            }
            
            // Fallback para HTML
            if (url.pathname === '/' || url.pathname.endsWith('.html')) {
              return new Response(FALLBACK_HTML, {
                headers: { 'Content-Type': 'text/html' }
              });
            }
            
            // Para outros recursos, tenta buscar no cache global
            return caches.match(event.request);
          });
        });
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
        }).catch(error => {
          console.warn('Failed to fetch static asset:', event.request.url, error);
          return new Response('', { status: 404 });
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
