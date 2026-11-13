import { test, expect, type Page } from '@playwright/test';

/** Gallery filters and deep links. The API and Cloudinary are stubbed, so this runs offline on the built site. */
// Real dimensions, so the masonry grid lays out like it does with photos.
const PHOTO = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#456"/></svg>';

const ALBUMS: Record<string, number> = { 'Race Day': 5, 'Circuit Races': 4, 'Podium & Medals': 3 };
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const photos = [
    ...Object.entries(ALBUMS).flatMap(([album, n]) =>
        Array.from({ length: n }, (_, i) => ({ eventYear: 2026, album, publicId: `rwtw/2026/${slug(album)}/p${i}`, width: 2560, height: 1706, caption: i === 0 ? `${album} cover` : null }))),
    { eventYear: 2025, album: 'Race Day', publicId: 'rwtw/2025/race-day/p0', width: 2560, height: 1706, caption: null },
];

async function stub(page: Page) {
    await page.addInitScript(() => localStorage.setItem('rwtw-feedback-prompt-dismissed', '1')); // site-wide popup
    await page.route('https://res.cloudinary.com/**', (r) => r.fulfill({ status: 200, contentType: 'image/svg+xml', body: PHOTO }));
    await page.route(/\/gallery(\?.*)?$/, (r) =>
        r.request().resourceType() === 'fetch'
            ? r.fulfill({ json: { cloudName: 'demo', years: [2026, 2025], photos } })
            : r.continue());
}

const thumbs = (page: Page) => page.getByTestId('gallery-thumb');

test('defaults to the newest year with every album, and shows counts', async ({ page }) => {
    await stub(page);
    await page.goto('/gallery');
    await expect(thumbs(page)).toHaveCount(12);
    await expect(page.getByTestId('album-all')).toContainText('(12)');
    await expect(page.getByTestId('album-circuit-races')).toContainText('(4)');
    await expect(page.getByTestId('year-2026')).toHaveAttribute('aria-selected', 'true');
});

test('album chips filter and write the URL', async ({ page }) => {
    await stub(page);
    await page.goto('/gallery');
    await page.getByTestId('album-podium-medals').click();
    await expect(thumbs(page)).toHaveCount(3);
    expect(page.url()).toContain('year=2026');
    expect(page.url()).toContain('album=podium-medals');
    await page.getByTestId('album-all').click();
    await expect(thumbs(page)).toHaveCount(12);
    expect(page.url()).not.toContain('album=');
});

test('year tabs switch year and reset the album', async ({ page }) => {
    await stub(page);
    await page.goto('/gallery?year=2026&album=circuit-races');
    await page.getByTestId('year-2025').click();
    await expect(thumbs(page)).toHaveCount(1);
    expect(page.url()).toContain('year=2025');
    expect(page.url()).not.toContain('album=');
});

test('deep link opens the right year and album', async ({ page }) => {
    await stub(page);
    await page.goto('/gallery?year=2026&album=circuit-races');
    await expect(thumbs(page)).toHaveCount(4);
    await expect(page.getByTestId('album-circuit-races')).toHaveAttribute('aria-pressed', 'true');
});

test('unknown year or album falls back instead of showing nothing', async ({ page }) => {
    await stub(page);
    await page.goto('/gallery?year=1999&album=nope');
    await expect(thumbs(page)).toHaveCount(12);
});

test('thumbnails are lazy and sized; lightbox uses the large size', async ({ page }) => {
    await stub(page);
    await page.goto('/gallery?year=2026&album=circuit-races');
    await expect(thumbs(page).first()).toHaveAttribute('loading', 'lazy');
    await expect(thumbs(page).first()).toHaveAttribute('src', /f_auto,q_auto,c_limit,w_600/);
    await thumbs(page).first().click();
    await expect(page.getByTestId('lightbox-img')).toHaveAttribute('src', /w_1600/);
});

test('lightbox: keyboard and swipe navigation', async ({ page }) => {
    await stub(page);
    await page.goto('/gallery?year=2026&album=circuit-races');
    await thumbs(page).first().click();
    const counter = page.getByTestId('lightbox-counter');
    await expect(counter).toHaveText('1 / 4');
    await page.keyboard.press('ArrowRight');
    await expect(counter).toHaveText('2 / 4');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(counter).toHaveText('4 / 4'); // wraps

    // Swipe left = next, swipe right = previous.
    const swipe = (from: number, to: number) => page.getByTestId('lightbox').evaluate((el, [a, b]) => {
        const touch = (x: number) => new Touch({ identifier: 1, target: el, clientX: x, clientY: 200 });
        el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [touch(a)] }));
        el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, changedTouches: [touch(b)] }));
    }, [from, to]);
    await swipe(300, 100);
    await expect(counter).toHaveText('1 / 4');
    await swipe(100, 300);
    await expect(counter).toHaveText('4 / 4');

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('lightbox')).toHaveCount(0);
});

test('no horizontal scroll at phone width', async ({ page }) => {
    await stub(page);
    await page.goto('/gallery');
    await expect(thumbs(page)).toHaveCount(12);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
});
