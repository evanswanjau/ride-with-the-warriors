/** Admin can log in, use every page and export. Login from server/prisma/seed.ts; data from seed-demo.ts. */
import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';

async function logIn(page: Page) {
    await page.goto('/admin');
    await page.getByPlaceholder('Enter email address').fill('admin@ridewithwarriors.com');
    await page.getByPlaceholder('••••••••').fill('Password@123');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('Confirmed entries', { exact: false }).first()).toBeVisible({ timeout: 20_000 });
}

const nav = (page: Page, label: string) => page.locator('.ad-sidebar').getByRole('link', { name: label, exact: true }).click();

test('admin logs in, sees totals and finds a 2026 rider', async ({ page }) => {
    await logIn(page);
    await nav(page, 'Registrations');
    await page.getByPlaceholder(/Name, team or ID/).fill('Amina');
    await expect(page.getByText('Amina Wanjiru').first()).toBeVisible({ timeout: 20_000 });

    await page.locator('.ad-tr').filter({ hasText: 'Amina Wanjiru' }).first().getByTitle('View').click();
    await expect(page.locator('.ad-drawer-title')).toHaveText('Registration Detail');
});

test('every admin page opens on its own address without an error', async ({ page }) => {
    await logIn(page);
    const pages: [string, string, RegExp][] = [
        ['Analytics', 'analytics', /Analytics/],
        ['Registrations', 'registrations', /Registrations/],
        ['Raffle', 'raffle', /Raffle Tickets/],
        ['Payments', 'payments', /Payments/],
        ['Donations', 'donations', /Donations/],
        ['Feedback', 'feedback', /Feedback/],
        ['Bibs', 'bibs', /Bibs/],
        ['Bike Hires', 'bike-hires', /Bike Hires/],
        ['Communications', 'communications', /Bulk SMS\/Email/],
        ['Referrals', 'referrals', /Referral System/],
        ['Pricing', 'pricing', /Pricing Categories/],
        ['Overview', '', /Overview/],
    ];
    for (const [label, path, title] of pages) {
        await nav(page, label);
        await expect(page).toHaveURL(new RegExp(`/admin/${path}$`));
        await expect(page.locator('.ad-page-title')).toHaveText(title);
        await expect(page.locator('.ad-loading-overlay')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.locator('.ad-error'), `${label} shows an error`).toHaveCount(0);
    }

    // A page link still works after a reload.
    await page.goto('/admin/payments');
    await expect(page.locator('.ad-page-title')).toHaveText('Payments');
});

test('Review now opens unpaid registrations; exports come from the server', async ({ page }) => {
    await logIn(page);
    await page.getByRole('button', { name: /Review Now/ }).click();
    await expect(page).toHaveURL(/\/admin\/registrations\?status=UNPAID/);
    await expect(page.locator('.ad-filters select').nth(1)).toHaveValue('UNPAID');

    const csv = page.waitForResponse(r => r.url().includes('/admin/exports/registrations.csv'));
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: /Export CSV/ }).click();
    expect((await csv).status()).toBe(200);
    expect((await download).suggestedFilename()).toMatch(/^registrations-.*\.csv$/);
});

test('Messages test mode previews without sending', async ({ page }) => {
    await logIn(page);
    await nav(page, 'Communications');
    await page.getByPlaceholder('Message Subject...').fill('Test');
    await page.locator('textarea').fill('Hi {firstName}');
    page.once('dialog', d => d.accept());
    await page.getByRole('button', { name: 'Generate Preview' }).click();
    await expect(page.getByText('Test preview generated')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText('SIMULATED')).toBeVisible();
});
