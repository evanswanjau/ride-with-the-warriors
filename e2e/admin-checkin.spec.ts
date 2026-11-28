/**
 * Race-day check-in on a phone: find a rider by phone and by name, hand out the bib and T-shirt,
 * take a mark back. Uses Eric Kamau (seed-demo.ts, a paid 2026 team rider).
 */
import { devices } from '@playwright/test';
import { test, expect } from './fixtures';

test.use({ ...devices['Pixel 7'] });

test('the desk finds a rider and marks the bib and T-shirt handed out, on a phone', async ({ page }) => {
    await page.goto('/admin/checkin?year=2026');
    await page.getByPlaceholder('Enter email address').fill('admin@ridewithwarriors.com');
    await page.getByPlaceholder('••••••••').fill('Password@123');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('.ad-page-title')).toHaveText('Check-in', { timeout: 20_000 });
    // Phone layout: the menu is a row above the page, and the page is not wider than the screen.
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

    const search = page.getByLabel('Search riders');
    await search.fill('0700 000 012');
    const card = page.getByRole('listitem', { name: 'Eric Kamau' });
    await expect(card).toBeVisible();

    await card.getByRole('button', { name: /Give bib/ }).tap();
    await expect(card.getByRole('button', { name: /Bib ✓/ })).toContainText('admin@ridewithwarriors.com');
    await card.getByRole('button', { name: /Give t-shirt/ }).tap();
    await expect(card.getByRole('button', { name: /T-shirt ✓/ })).toBeVisible();
    // No hire bike for this rider, so no bike button.
    await expect(card.getByRole('button', { name: /bike/i })).toHaveCount(0);

    // The marks are saved: a new search by name shows them.
    await search.fill('');
    await search.fill('eric kamau');
    await expect(page.getByRole('listitem', { name: 'Eric Kamau' }).getByRole('button', { name: /Bib ✓/ })).toBeVisible();

    // A mistake at the desk can be taken back.
    page.once('dialog', d => d.accept());
    await page.getByRole('listitem', { name: 'Eric Kamau' }).getByRole('button', { name: /Bib ✓/ }).tap();
    await expect(page.getByRole('listitem', { name: 'Eric Kamau' }).getByRole('button', { name: /Give bib/ })).toBeVisible();

    await search.fill('nobody-by-this-name');
    await expect(page.getByText(/No paid rider matches/)).toBeVisible();
});
