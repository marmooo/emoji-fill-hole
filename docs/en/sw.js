var CACHE_NAME="2023-06-18 00:00",urlsToCache=["/emoji-fill-hole/","/emoji-fill-hole/index.js","/emoji-fill-hole/en/","/emoji-fill-hole/en/worker.js","/emoji-fill-hole/en/model/model.json","/emoji-fill-hole/en/model/group1-shard1of1.bin","/emoji-fill-hole/kohacu.webp","/emoji-fill-hole/eraser.svg","/emoji-fill-hole/refresh.svg","/emoji-fill-hole/mp3/end.mp3","/emoji-fill-hole/mp3/correct3.mp3","/emoji-fill-hole/favicon/favicon.svg","https://cdn.jsdelivr.net/npm/signature_pad@4.1.5/dist/signature_pad.umd.min.js","https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.6.0/dist/tf.min.js","https://fonts.googleapis.com/css?family=Source+Code+Pro"];self.addEventListener("install",function(a){a.waitUntil(caches.open(CACHE_NAME).then(function(a){return a.addAll(urlsToCache)}))}),self.addEventListener("fetch",function(a){a.respondWith(caches.match(a.request).then(function(b){return b||fetch(a.request)}))}),self.addEventListener("activate",function(a){var b=[CACHE_NAME];a.waitUntil(caches.keys().then(function(a){return Promise.all(a.map(function(a){if(b.indexOf(a)===-1)return caches.delete(a)}))}))})