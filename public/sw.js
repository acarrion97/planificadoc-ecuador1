/*
 * Service worker de PlanificaDoc.
 * - /api/* nunca se cachea (datos del usuario, auth, generación de documentos).
 * - Navegaciones: red primero; sin conexión cae al HTML cacheado o a "/".
 * - Estáticos del mismo origen (JS/CSS/fuentes/imágenes): cache con revalidación
 *   en segundo plano. Los bundles de Expo llevan hash, así que un deploy nuevo
 *   trae archivos nuevos y los viejos se purgan al cambiar CACHE_VERSION.
 */
const CACHE_VERSION = "v1";
const RUNTIME_CACHE = `planificadoc-${CACHE_VERSION}`;
const PRECACHE = ["/", "/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(RUNTIME_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== RUNTIME_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname === "/admin.html") return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
    );
    return;
  }

  if (/\.(js|css|woff2?|ttf|otf|png|jpe?g|svg|webp|ico|json)$/.test(url.pathname)) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request)
            .then((response) => {
              if (response.ok) cache.put(request, response.clone());
              return response;
            })
            .catch(() => cached);
          return cached || network;
        })
      )
    );
  }
});
