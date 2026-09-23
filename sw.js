const CACHE_NAME = 'burger301-v1';
const arquivosParaCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json'
];

// Instalação do Service Worker e armazenamento dos ficheiros em cache
self.addEventListener('install', evento => {
    evento.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(arquivosParaCache);
        })
    );
});

// Resposta a requisições (permite funcionamento mais rápido)
self.addEventListener('fetch', evento => {
    evento.respondWith(
        caches.match(evento.request).then(respostaEmCache => {
            return respostaEmCache || fetch(evento.request);
        })
    );
});
