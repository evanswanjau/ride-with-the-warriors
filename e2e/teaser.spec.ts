/** 2027 teaser: menu, 2026 recap, countdown. Runs with every feature switch on (.env.stack), so it only tests flag-independent things. */
import { test, expect } from './fixtures';

const RECAP = [
    { name: 'Highlights', path: '/2026' },
    { name: 'Photos', path: '/gallery?year=2026' },
    { name: 'Race Results', path: '/results' },
    { name: 'Raffle Winners', path: '/raffle-winners' },
];

test('home shows 2027 facts, countdown and the 2026 highlights link', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('9 May 2027').first()).toBeVisible();
    await expect(page.getByText(/Ulinzi/).first()).toBeVisible();
    await expect(page.getByTestId('countdown')).toBeVisible();
    await expect(page.getByTestId('countdown-cell')).toHaveCount(4);
    await expect(page.getByRole('link', { name: 'See 2026 highlights' })).toBeVisible();
});

test('desktop: 2026 Recap menu has 4 items that navigate', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop menu');
    for (const item of RECAP) {
        await page.goto('/about');
        await page.locator('header.rwtw-nav').getByRole('button', { name: /2026 Recap/ }).click();
        const link = page.getByRole('menuitem', { name: new RegExp(item.name) });
        await expect(page.getByRole('menuitem')).toHaveCount(4);
        await link.click();
        await expect(page).toHaveURL((url) => url.pathname + url.search === item.path);
    }
});

test('mobile: 2026 Recap accordion shows 4 items', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile menu');
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('button', { name: /2026 Recap/ }).click();
    const sub = page.locator('#mobile-recap-sub');
    await expect(sub.getByRole('link')).toHaveCount(4);
    for (const item of RECAP) await expect(sub.getByRole('link', { name: new RegExp(item.name) })).toBeVisible();
});

test('/2026 shows the car ticket and links to the recap pages', async ({ page }) => {
    await page.goto('/2026');
    await expect(page.getByText('AA130').first()).toBeVisible();
    await expect(page.getByTestId('car-winner')).toHaveText('Nancy ***ambu');
    await expect(page.getByText('Nissan Sylphy').first()).toBeVisible();
    for (const href of ['/gallery?year=2026', '/results', '/raffle-winners']) {
        await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
    }
});

test('header has no Race Results or Raffle Winners button', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop header');
    await page.goto('/');
    const header = page.locator('header.rwtw-nav');
    await expect(header.locator('a.nav-cta', { hasText: /Race Results|Raffle Winners/ })).toHaveCount(0);
    await expect(header.getByRole('link', { name: /Race Results|Raffle Winners/ })).toHaveCount(0);
});
