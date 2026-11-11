/** Public pages show highlight photos from both 2025 and 2026, and they load. */
import { test, expect } from './fixtures';
import type { Locator } from '@playwright/test';

const years = async (imgs: Locator) =>
    new Set(await imgs.evaluateAll(els => els.map(e => e.getAttribute('data-year'))));

const expectLoaded = async (imgs: Locator) => {
    for (const img of await imgs.all()) {
        await img.scrollIntoViewIfNeeded();
        await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true);
    }
};

test('homepage hero is a 2026 photo with the logo cropped out', async ({ page }) => {
    await page.goto('/');
    const hero = page.getByTestId('home-hero-img');
    await expect(hero).toHaveAttribute('data-year', '2026');
    await expect(hero).toHaveAttribute('src', /res\.cloudinary\.com\/.+\/c_crop,.+rwtw-2026-017$/);
    await expectLoaded(hero);
});

test('homepage collage mixes 2025 and 2026', async ({ page }) => {
    await page.goto('/');
    const imgs = page.getByTestId('home-collage-img');
    await expect(imgs).toHaveCount(4);
    expect(await years(imgs)).toEqual(new Set(['2025', '2026']));
    await expectLoaded(imgs);
});

test('About page mixes 2025 and 2026', async ({ page }) => {
    await page.goto('/about');
    const imgs = page.getByTestId('about-highlight-img');
    await expect(imgs).toHaveCount(6);
    expect(await years(imgs)).toEqual(new Set(['2025', '2026']));
    await expectLoaded(imgs);
});

test('circuit cards mix 2025 and 2026', async ({ page }) => {
    await page.goto('/circuits');
    const imgs = page.getByTestId('circuit-card-img');
    await expect(imgs).toHaveCount(4);
    expect(await years(imgs)).toEqual(new Set(['2025', '2026']));
    await expectLoaded(imgs);
});
