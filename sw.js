// প্রতিবার নতুন আপডেট দেওয়ার সময় শুধু নিচের ভার্সন নম্বরটি বদলাবেন (যেমন: v1.1.0 -> v1.2.0)
const CACHE_NAME = "carrom-scorer-pro-v1.1.0";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg"
];

// ইনস্টল হওয়ার সময় সব ফাইল অফলাইনের জন্য সেভ করে রাখবে
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// নতুন ভার্সন চালু হলে পুরোনো ক্যাশ ডিলিট করবে
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// ইউজার "Update Now" বাটনে চাপ দিলে নতুন ভার্সন সাথে সাথে অ্যাক্টিভ হবে
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// অফলাইন ফার্স্ট: প্রথমে ফোনের ক্যাশ থেকে চালাবে, না পেলে নেট থেকে আনবে
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const reqUrl = new URL(event.request.url);
  if (reqUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
