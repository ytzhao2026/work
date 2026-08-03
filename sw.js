/* 自律工作台 - Service Worker：离线缓存应用外壳 */
const CACHE = 'zilv-workbench-v2';
const PRECACHE = ['./', './index.html', './manifest.json', './sw.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  /* 跨域请求（如 Supabase、CDN）走网络优先，失败回退缓存 */
  if (url.origin !== self.location.origin) {
    e.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }
  /* 同源：先缓存，后台更新 */
  e.respondWith(
    caches.match(req).then(cached => {
      const net = fetch(req).then(resp => {
        if (resp && resp.status === 200) {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return resp;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
