const CACHE_NAME="2023-08-21 08:10",urlsToCache=["/emoji-fill-hole/","/emoji-fill-hole/index.js","/emoji-fill-hole/en/","/emoji-fill-hole/en/worker.js","/emoji-fill-hole/en/model/model.json","/emoji-fill-hole/en/model/group1-shard1of1.bin","/emoji-fill-hole/kohacu.webp","/emoji-fill-hole/mp3/end.mp3","/emoji-fill-hole/mp3/correct3.mp3","/emoji-fill-hole/favicon/favicon.svg","https://cdn.jsdelivr.net/npm/signature_pad@4.1.6/dist/signature_pad.umd.min.js","https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.min.js","https://fonts.googleapis.com/css?family=Source+Code+Pro"];self.addEventListener("install",a=>{a.waitUntil(caches.open(CACHE_NAME).then(a=>a.addAll(urlsToCache)))}),self.addEventListener("fetch",a=>{a.respondWith(caches.match(a.request).then(b=>b||fetch(a.request)))}),self.addEventListener("activate",a=>{a.waitUntil(caches.keys().then(a=>Promise.all(a.filter(a=>a!==CACHE_NAME).map(a=>caches.delete(a)))))})