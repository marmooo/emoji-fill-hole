const CACHE_NAME="2025-04-06 01:35",urlsToCache=["/emoji-fill-hole/","/emoji-fill-hole/index.js","/emoji-fill-hole/en/","/emoji-fill-hole/en/worker.js","/emoji-fill-hole/en/model/model.json","/emoji-fill-hole/en/model/group1-shard1of1.bin","/emoji-fill-hole/kohacu.webp","/emoji-fill-hole/mp3/end.mp3","/emoji-fill-hole/mp3/correct3.mp3","/emoji-fill-hole/favicon/favicon.svg","https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js","https://fonts.googleapis.com/css?family=Source+Code+Pro"];self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(e=>e.addAll(urlsToCache)))}),self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(t=>t||fetch(e.request)))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e!==CACHE_NAME).map(e=>caches.delete(e)))))})