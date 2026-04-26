const CACHE_NAME = 'store-builder-v1';
// Lista de recursos críticos para funcionamiento offline
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/main.dart.js',
  '/manifest.json',
  '/assets/DESIGN.md',
  '/assets/models/default_anchor.glb'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Usamos catch para evitar fallos si algunos archivos no existen en entorno dev (ej. main.dart.js)
      return cache.addAll(ASSETS_TO_CACHE).catch(err => console.log('Algunos recursos no se pudieron almacenar:', err));
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retorna el recurso desde el caché o va a la red si no está
      return response || fetch(event.request);
    })
  );
});
