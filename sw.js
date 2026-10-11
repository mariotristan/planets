// Service worker: saves every file on the first visit so the app works with no network.
// Pages load from the saved copy right away, and each file is re-downloaded in the
// background so the next visit gets any updates.

const CACHE = "planets-v2";
const FILES = [
  "./",
  "index.html",
  "styles.css",
  "data.js",
  "i18n.js",
  "app.js",
  "stickers.js",
  "explore.js",
  "compare.js",
  "fly.js",
  "quiz.js",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  const saved = caches.match(req, { ignoreSearch: true });
  const fresh = fetch(req).then((res) => {
    if (res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
    }
    return res;
  });
  e.respondWith(saved.then((s) => s || fresh));
  e.waitUntil(fresh.catch(() => {})); // offline: keep using the saved copy
});
