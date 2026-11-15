import { test, expect, type Page } from '@playwright/test';

const HEAVY = /AdminPage|recharts|xlsx|jspdf|html2canvas|html-to-image/i;
const PIXEL = Buffer.from('R0lGODlhAQABAAAAACw=', 'base64');

/** Loads a path and returns every script/image URL requested. Cloudinary is stubbed so the test runs offline. */
async function collect(page: Page, path: string) {
    const urls: string[] = [];
    await page.route('https://res.cloudinary.com/**', (r) => r.fulfill({ status: 200, contentType: 'image/gif', body: PIXEL }));
    page.on('request', (r) => urls.push(r.url()));
    await page.goto(path, { waitUntil: 'networkidle' });
    return urls;
}

test('homepage loads no admin, chart, spreadsheet or PDF code', async ({ page }) => {
    const urls = await collect(page, '/');
    const scripts = urls.filter((u) => /\.js(\?|$)/.test(u) && u.startsWith('http://localhost'));
    expect(scripts.length).toBeGreaterThan(0);
    expect(scripts.filter((u) => HEAVY.test(u))).toEqual([]);
});

test('homepage serves photos from Cloudinary, sized, with no bundled JPEGs', async ({ page }) => {
    const urls = await collect(page, '/');
    expect(urls.filter((u) => /\.jpe?g(\?|$)/i.test(u) && u.startsWith('http://localhost'))).toEqual([]);
    const cld = urls.filter((u) => u.startsWith('https://res.cloudinary.com/'));
    expect(cld.length).toBeGreaterThan(0);
    for (const u of cld) expect(u).toMatch(/f_auto,q_auto,c_limit,w_\d+/);
    const imgs = await page.locator('img[data-year]').evaluateAll((els) =>
        els.map((e) => ({ w: e.getAttribute('width'), h: e.getAttribute('height') })));
    expect(imgs.length).toBeGreaterThan(0);
    for (const i of imgs) { expect(Number(i.w)).toBeGreaterThan(0); expect(Number(i.h)).toBeGreaterThan(0); }
});

test('admin code is fetched only when /admin is opened', async ({ page }) => {
    const urls = await collect(page, '/admin');
    expect(urls.some((u) => /AdminPage/.test(u))).toBe(true);
});

test('gallery lists 2025 albums from Cloudinary', async ({ page }) => {
    const urls = await collect(page, '/gallery');
    expect(urls.filter((u) => /\.jpe?g(\?|$)/i.test(u) && u.startsWith('http://localhost'))).toEqual([]);
    await expect(page.getByTestId('year-2025')).toBeVisible();
});

test('homepage logos are small, resized images', async ({ page }) => {
    const sizes: { url: string; bytes: number }[] = [];
    page.on('response', async (r) => {
        const url = r.url();
        if (url.startsWith('http://localhost') && r.request().resourceType() === 'image') {
            const body = await r.body().catch(() => Buffer.alloc(0));
            sizes.push({ url, bytes: body.length });
        }
    });
    await collect(page, '/');
    await page.locator('.sp-track').evaluate((el) => el.scrollIntoView());
    await expect.poll(() => sizes.some((s) => /kdf/i.test(s.url))).toBe(true);
    await page.waitForLoadState('networkidle');
    for (const s of sizes) expect(s.bytes, s.url).toBeLessThan(40 * 1024);
    expect(sizes.filter((s) => /kdf/i.test(s.url)).every((s) => /\.webp$/.test(s.url))).toBe(true);
});

test('fonts are self-hosted and preloaded; analytics waits for the first interaction', async ({ page }) => {
    const gtag: string[] = [];
    await page.route('https://www.googletagmanager.com/**', (r) => { gtag.push(r.request().url()); return r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }); });
    const urls = await collect(page, '/');
    expect(urls.filter((u) => /fonts\.(googleapis|gstatic)\.com/.test(u))).toEqual([]);
    expect(urls.some((u) => /\/assets\/bebasneue-normal-400-[\w-]+\.woff2$/.test(u))).toBe(true);
    expect(await page.locator('link[rel="preload"][as="font"]').count()).toBeGreaterThan(0);
    expect(gtag).toEqual([]);
    await page.mouse.wheel(0, 400);
    await expect.poll(() => gtag.length).toBeGreaterThan(0);
});

test('gallery thumbnails are responsive Cloudinary images', async ({ page }) => {
    await collect(page, '/gallery');
    const thumb = page.getByTestId('gallery-thumb').first();
    await expect(thumb).toBeVisible();
    const srcset = (await thumb.getAttribute('srcset')) ?? '';
    for (const w of [240, 400, 600]) expect(srcset).toContain(`w_${w}/`);
    expect(await thumb.getAttribute('sizes')).toContain('33vw');
});
