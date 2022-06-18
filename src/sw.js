var CACHE_NAME = "2022-06-18 22:35";
var urlsToCache = [
  "/emoji-fill-hole/",
  "/emoji-fill-hole/index.js",
  "/emoji-fill-hole/en/worker.js",
  "/emoji-fill-hole/en/model/model.json",
  "/emoji-fill-hole/en/model/group1-shard1of1.bin",
  "/emoji-fill-hole/kohacu.webp",
  "/emoji-fill-hole/eraser.svg",
  "/emoji-fill-hole/refresh.svg",
  "/emoji-fill-hole/mp3/end.mp3",
  "/emoji-fill-hole/mp3/correct3.mp3",
  "/emoji-fill-hole/favicon/favicon.svg",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/signature_pad@4.0.4/dist/signature_pad.umd.min.js",
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.17.0/dist/tf.min.js",
  "https://fonts.googleapis.com/css?family=Source+Code+Pro",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      }),
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }),
  );
});

self.addEventListener("activate", function (event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
