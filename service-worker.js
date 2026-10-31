/* 明智君OS v0.5.1: scoped offline shell; never evict other GitHub Pages app caches. */
'use strict';
const PREFIX = 'akechi-os-';
const CACHE_NAME = PREFIX + 'v051-shell-3';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './style.css?v=041',
  './visibility.css?v=042',
  './current-location.css?v=051',
  './script.js?v=051-safe1101',
  './icon-192.png',
  './icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key))
  )));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response && response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
    }
    return response;
  }).catch(() => caches.match(event.request)));
});
