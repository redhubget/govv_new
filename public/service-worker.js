const CACHE_NAME='govv-cache-v1'; const APP_SHELL=['/','/index.html','/manifest.json']
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL))) })
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=> k!==CACHE_NAME && caches.delete(k))))) })
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url)
  if(APP_SHELL.includes(url.pathname) || url.pathname.startsWith('/data/activities')){
    e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request))); return
  }
  e.respondWith(fetch(e.request).catch(()=> caches.match(e.request)))
})