const CACHE_NAME = "2023-09-29 10:05";
const urlsToCache = [
  "/emoji-fill-hole/",
  "/emoji-fill-hole/index.js",
  "/emoji-fill-hole/en/worker.js",
  "/emoji-fill-hole/en/model/model.json",
  "/emoji-fill-hole/en/model/group1-shard1of1.bin",
  "/emoji-fill-hole/kohacu.webp",
  "/emoji-fill-hole/mp3/end.mp3",
  "/emoji-fill-hole/mp3/correct3.mp3",
  "/emoji-fill-hole/favicon/favicon.svg",
  "https://cdn.jsdelivr.net/npm/signature_pad@4.1.6/dist/signature_pad.umd.min.js",
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.min.js",
  "https://fonts.googleapis.com/css?family=Source+Code+Pro",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
});
