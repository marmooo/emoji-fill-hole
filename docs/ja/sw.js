const CACHE_NAME="2024-05-12 09:30",urlsToCache=["/emoji-fill-hole/","/emoji-fill-hole/index.js","/emoji-fill-hole/ja/","/emoji-fill-hole/ja/index.yomi","/emoji-fill-hole/ja/worker.js","/emoji-fill-hole/ja/model/model.json","/emoji-fill-hole/ja/model/group1-shard1of1.bin","/emoji-fill-hole/kohacu.webp","/emoji-fill-hole/mp3/end.mp3","/emoji-fill-hole/mp3/correct3.mp3","/emoji-fill-hole/favicon/favicon.svg","https://marmooo.github.io/yomico/yomico.min.js","https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.19.0/dist/tf.min.js","https://fonts.googleapis.com/css?family=Source+Code+Pro"];self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(e=>e.addAll(urlsToCache)))}),self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(t=>t||fetch(e.request)))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e!==CACHE_NAME).map(e=>caches.delete(e)))))})