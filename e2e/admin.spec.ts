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
        await expect(page).toHaveURL(new RegExp(`/admin${path ? `/${path}` : ''}\\?year=2026$`));
        await expect(page.locator('.ad-page-title')).toHaveText(title);
        await expect(page.locator('.ad-loading-overlay')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.locator('.ad-error'), `${label} shows an error`).toHaveCount(0);
        await expect(page.locator('.ad-nav-btn.active')).toHaveText(label);
    }

    // A page link still works after a reload.
    await page.goto('/admin/payments');
    await expect(page.locator('.ad-page-title')).toHaveText('Payments');
});

test('Review now opens unpaid registrations; exports come from the server', async ({ page }) => {
    await logIn(page);
    await page.getByRole('button', { name: /Review Now/ }).click();
    await expect(page).toHaveURL(/\/admin\/registrations\?status=UNPAID&year=2026/);
    await expect(page.locator('.ad-filters select').nth(1)).toHaveValue('UNPAID');

    const csv = page.waitForResponse(r => r.url().includes('/admin/exports/registrations.csv'));
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: /Export CSV/ }).click();
    expect((await csv).status()).toBe(200);
    expect((await download).suggestedFilename()).toBe('registrations-2026.csv');
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

test('the year switcher keeps the year in the address and lists follow it', async ({ page }) => {
    await logIn(page);
    const select = page.getByLabel('Event year');
    await expect(select).toHaveValue('2026'); // the current event in the seed

    const listed = page.waitForRequest(r => r.url().includes('/admin/registrations?') && r.url().includes('year=2026'));
    await nav(page, 'Registrations');
    await expect(page).toHaveURL(/\/admin\/registrations\?year=2026$/);
    await listed;
    await expect(page.locator('.ad-tr').first()).toBeVisible({ timeout: 20_000 });

    // Another year from a link: nothing registered for it yet; the year stays when moving between pages.
    await page.goto('/admin/registrations?year=2027');
    await expect(select).toHaveValue('2027');
    await expect(page.getByText('No registrations found.')).toBeVisible({ timeout: 20_000 });
    await nav(page, 'Raffle');
    await expect(page).toHaveURL(/\/admin\/raffle\?year=2027$/);
    await expect(page.getByText('No raffle tickets found matching filters.')).toBeVisible({ timeout: 20_000 });

    // Choosing a year in the header reloads the page for it.
    await select.selectOption('2026');
    await expect(page).toHaveURL(/\/admin\/raffle\?year=2026$/);
    await expect(page.locator('.ad-tr').first()).toBeVisible({ timeout: 20_000 });

    const csv = page.waitForResponse(r => r.url().includes('/admin/exports/raffle.csv?year=2026'));
    await page.getByRole('button', { name: /Export CSV/ }).click();
    expect((await csv).status()).toBe(200);
});
