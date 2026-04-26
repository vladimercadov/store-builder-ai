const CACHE_NAME = 'store-builder-v1';

// Usamos rutas relativas con "./" para que funcione en /store-builder-ai/
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './service-worker.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Forzamos la carga de los recursos básicos
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Activa el service worker inmediatamente
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Estrategia: Cache First, fallback to Network
      return response || fetch(event.request).catch(() => {
        // Si falla la red y no hay caché (offline total), retornamos el index.html
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
