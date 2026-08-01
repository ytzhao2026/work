/* 自律工作台 - 离线缓存 Service Worker */
const CACHE = 'zilv-workbench-v1';
const PRECACHE = ['./index.html'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // 只处理 GET 请求，且只处理同源请求
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      // 有缓存直接返回，同时后台更新
      const fetchPromise = fetch(e.request).then(resp => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return resp;
      }).catch(() => cached); // 网络失败时回退到缓存

      return cached || fetchPromise;
    })
  );
});
