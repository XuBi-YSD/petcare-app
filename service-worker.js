// Service worker tối giản: cache "khung" giao diện để trang mở nhanh hơn
// và có thể cài lên điện thoại. Dữ liệu thật (Firestore) luôn cần mạng.
const CACHE_NAME = "petcare-shell-v1";
const SHELL_FILES = [
  "./",
  "index.html",
  "booking.html",
  "profile.html",
  "admin.html",
  "assets/css/style.css",
  "assets/icons/icon-192.png",
  "manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Chỉ áp dụng cache cho request GET cùng gốc (không đụng vào Firebase API)
  if (event.request.method !== "GET" || !event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
