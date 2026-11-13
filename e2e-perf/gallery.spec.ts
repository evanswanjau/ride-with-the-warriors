import { test, expect, type Page } from '@playwright/test';

/** Gallery grouping, filters, grid density and deep links. The API and Cloudinary are stubbed, so this runs offline on the built site. */
// Real dimensions, so the grid lays out like it does with photos.
const PHOTO = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#456"/></svg>';

const ALBUMS: [number, string, number][] = [
    [2026, 'Race Day', 20], [2026, 'Circuit Races', 130], [2026, 'Podium & Medals', 3],
    [2025, 'Registration Drive Launch', 2], [2025, 'Ride With The Warriors 2025', 3],
];
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const photos = ALBUMS.flatMap(([year, album, n]) =>
    Array.from({ length: n }, (_, i) => ({ eventYear: year, album, publicId: `rwtw/${year}/${slug(album)}/p${i}`, width: 2560, height: 1706, caption: i === 0 ? `${album} cover` : null })));

async function stub(page: Page) {
    await page.addInitScript(() => localStorage.setItem('rwtw-feedback-prompt-dismissed', '1')); // site-wide popup
    await page.route('https://res.cloudinary.com/**', (r) => r.fulfill({ status: 200, contentType: 'image/svg+xml', body: PHOTO }));
    await page.route(/\/gallery(\?.*)?$/, (r) =>
        r.request().resourceType() === 'fetch'
            ? r.fulfill({ json: { cloudName: 'demo', years: [2026, 2025], photos } })
            : r.continue());
}

const thumbs = (page: Page) => page.getByTestId('gallery-thumb');

test('"All" groups photos by album, each with a heading, count and a short preview', async ({ page }) => {
    await stub(page);
    await page.goto('/gallery');
    await expect(thumbs(page)).toHaveCount(12 + 12 + 3); // preview of 12 per album
    await expect(page.getByTestId('year-2026')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('album-all')).toContainText('(153)');
    await expect(page.getByTestId('album-circuit-races')).toContainText('(130)');
    await expect(page.getByTestId('section-circuit-races').getByRole('heading')).toHaveText('Circuit Races');
    await expect(page.getByTestId('section-circuit-races')).toContainText('(130)');
    await expect(page.getByTestId('see-all-podium-medals')).toHaveCount(0); // fully shown, nothing to expand
});

test('"See all" opens the album and writes the URL', async ({ page }) => {
    await stub(page);
    await page.goto('/gallery');
    await page.getByTestId('see-all-race-day').click();
    await expect(thumbs(page)).toHaveCount(20);
    expect(page.url()).toContain('year=2026');
    expect(page.url()).toContain('album=race-day');
});

test('album chips filter, and "All" goes back to the grouped view', async ({ page }) => {
    await stub(page);
    await page.goto('/gallery');
    await page.getByTestId('album-podium-medals').click();
    await expect(thumbs(page)).toHaveCount(3);
    expect(page.url()).toContain('album=podium-medals');
    await page.getByTestId('album-all').click();
    await expect(thumbs(page)).toHaveCount(27);
    expect(page.url()).not.toContain('album=');
});

test('a big album is paged with "Load more"', async ({ page }) => {
    await stub(page);
    await page.goto('/gallery?year=2026&album=circuit-races');
    await expect(thumbs(page)).toHaveCount(120);
    await page.getByTestId('load-more').click();
    await expect(thumbs(page)).toHaveCount(130);
    await expect(page.getByTestId('load-more')).toHaveCount(0);
});

test('2025 uses the same layout: its two folders are albums', async ({ page }) => {
    await stub(page);
    await page.goto('/gallery');
    await page.getByTestId('year-2025').click();
    expect(page.url()).toContain('year=2025');
    await expect(thumbs(page)).toHaveCount(5);
    await expect(page.getByTestId('album-all')).toContainText('(5)');
    await expect(page.getByTestId('album-registration-drive-launch')).toContainText('(2)');
    await expect(page.getByTestId('album-ride-with-the-warriors-2025')).toContainText('(3)');
    await expect(page.getByTestId('section-registration-drive-launch').getByRole('heading')).toHaveText('Registration Drive Launch');
});

test('deep links work for both years', async ({ page }) => {
    await stub(page);
    await page.goto('/gallery?year=2026&album=podium-medals');
    await expect(thumbs(page)).toHaveCount(3);
    await expect(page.getByTestId('album-podium-medals')).toHaveAttribute('aria-pressed', 'true');
    await page.goto('/gallery?year=2025&album=ride-with-the-warriors-2025');
    await expect(thumbs(page)).toHaveCount(3);
    await expect(page.getByTestId('year-2025')).toHaveAttribute('aria-selected', 'true');
});

test('unknown year or album falls back instead of showing nothing', async ({ page }) => {
    await stub(page);
    await page.goto('/gallery?year=1999&album=nope');
    await expect(thumbs(page)).toHaveCount(27);
});

for (const [width, cols, gapMax] of [[375, 3, 6], [768, 4, 6], [1280, 6, 6]] as const) {
    test(`grid is ${cols} square, frameless tiles per row at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await stub(page);
        await page.goto('/gallery?year=2026&album=race-day');
        await expect(thumbs(page)).toHaveCount(20);
        const grid = page.locator('.gallery-grid').first();
        const tracks = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
        const gap = await grid.evaluate((el) => parseFloat(getComputedStyle(el).columnGap));
        expect(tracks).toBe(cols);
        expect(gap).toBeLessThanOrEqual(gapMax);
        const tile = page.locator('.gallery-item').first();
        const box = await tile.boundingBox();
        expect(Math.abs(box!.width - box!.height)).toBeLessThan(1.5); // square
        expect(await tile.evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe('0px'); // no frame
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow).toBeLessThanOrEqual(0);
    });
}

test('tiles are lazy square Cloudinary crops; the lightbox uses the large size', async ({ page }) => {
    await stub(page);
    await page.goto('/gallery?year=2026&album=podium-medals');
    await expect(thumbs(page).first()).toHaveAttribute('loading', 'lazy');
    await expect(thumbs(page).first()).toHaveAttribute('src', /f_auto,q_auto,c_fill,g_auto,ar_1:1,w_400/);
    await thumbs(page).first().click();
    await expect(page.getByTestId('lightbox-img')).toHaveAttribute('src', /w_1600/);
});

test('tiles show a keyboard focus ring', async ({ page }) => {
    await stub(page);
    await page.goto('/gallery?year=2026&album=podium-medals');
    await expect(thumbs(page)).toHaveCount(3);
    for (let i = 0; i < 60; i++) {
        await page.keyboard.press('Tab');
        if (await page.evaluate(() => document.activeElement?.classList.contains('gallery-item'))) break;
    }
    expect(await page.evaluate(() => document.activeElement?.classList.contains('gallery-item'))).toBe(true);
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement as Element).outlineStyle);
    expect(outline).not.toBe('none');
});

test('lightbox: keyboard and swipe navigation', async ({ page }) => {
    await stub(page);
    await page.goto('/gallery?year=2026&album=podium-medals');
    await thumbs(page).first().click();
    const counter = page.getByTestId('lightbox-counter');
    await expect(counter).toHaveText('1 / 3');
    await page.keyboard.press('ArrowRight');
    await expect(counter).toHaveText('2 / 3');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(counter).toHaveText('3 / 3'); // wraps

    // Swipe left = next, swipe right = previous.
    const swipe = (from: number, to: number) => page.getByTestId('lightbox').evaluate((el, [a, b]) => {
        const touch = (x: number) => new Touch({ identifier: 1, target: el, clientX: x, clientY: 200 });
        el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [touch(a)] }));
        el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, changedTouches: [touch(b)] }));
    }, [from, to]);
    await swipe(300, 100);
    await expect(counter).toHaveText('1 / 3');
    await swipe(100, 300);
    await expect(counter).toHaveText('3 / 3');

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('lightbox')).toHaveCount(0);
});
