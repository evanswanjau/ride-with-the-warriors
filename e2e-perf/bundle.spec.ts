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
    await expect(page.getByText(/RWTW 2025/).first()).toBeVisible();
});
