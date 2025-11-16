const CACHE = 'ultrapro-v1';
const assets = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/modules/calculator.js',
  '/modules/graph.js',
  '/modules/ai-solver.js'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=> c.addAll(assets)).catch(()=>{}));
});
self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(r=> r || fetch(e.request))
  );
});
