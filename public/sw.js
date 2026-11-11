/*
 * Service worker for the installable rider portal.
 * - Pages: network first, so a deploy shows up straight away; the last copy is used offline.
 * - Built files (/assets/*, hashed names) and icons: cache first.
 * - API calls and anything not GET are left alone. Entry data for offline use is kept
 *   by the app itself (src/portal/PortalData.tsx).
 */
const VERSION = 'rwtw-v1';
const PAGES = `${VERSION}-pages`;
const STATIC = `${VERSION}-static`;
const SCOPE = new URL(self.registration.scope).pathname;

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(PAGES).then((c) => c.add(`${SCOPE}account`)).catch(() => undefined));
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
            .then(() => self.clients.claim()),
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (url.origin !== self.location.origin || url.pathname.includes('/api/')) return;

    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    if (res.ok) {
                        const copy = res.clone();
                        caches.open(PAGES).then((c) => c.put(req, copy));
                    }
                    return res;
                })
                .catch(async () => (await caches.match(req)) || (await caches.match(`${SCOPE}account`)) || Response.error()),
        );
        return;
    }

    if (url.pathname.startsWith(`${SCOPE}assets/`) || url.pathname.startsWith(`${SCOPE}pwa/`)) {
        event.respondWith(
            caches.match(req).then((hit) => hit || fetch(req).then((res) => {
                if (res.ok) {
                    const copy = res.clone();
                    caches.open(STATIC).then((c) => c.put(req, copy));
                }
                return res;
            })),
        );
    }
});
