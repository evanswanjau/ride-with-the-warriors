/**
 * A rider from 2026 comes back: logs in with the email (or phone) they used,
 * and sees their 2026 history. Data: server/prisma/seed-demo.ts.
 */
import { test, expect } from './fixtures';
import { login, smsAddress, waitForMessage, codeFrom } from './helpers';

test('2026 rider logs in by email and sees their history', async ({ page }) => {
    await login(page, 'rider@test.local', 'rider@test.local');
    await expect(page.getByRole('heading', { name: 'Hi, Amina' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'RWTW 2026' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Amina Wanjiru' })).toBeVisible();
    await expect(page.getByText(/^\d{4}$/).first()).toBeVisible(); // bib number
    await expect(page.getByRole('heading', { name: 'Raffle tickets' })).toBeVisible();
    await expect(page.getByText(/^A[A-Z]\d{3}$/).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Donations' })).toBeVisible();
});

test('logging in by phone sends the code by SMS', async ({ page }) => {
    await login(page, '0700000001', smsAddress('254700000001'));
    await expect(page.getByRole('heading', { name: 'Hi, Amina' })).toBeVisible();
});

test('team captain sees the whole team; a member sees only their own entry', async ({ page, context }) => {
    await login(page, 'captain@test.local', 'captain@test.local');
    await expect(page.getByRole('heading', { name: 'Rift Riders' })).toBeVisible();
    await expect(page.getByRole('cell', { name: /Felix/ })).toBeVisible();

    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
    await login(page, 'member@test.local', 'member@test.local');
    await expect(page.getByText('registered by someone else')).toBeVisible();
    await expect(page.getByRole('cell', { name: /Felix/ })).toHaveCount(0);
});

test('a 2026 entry made before accounts existed is claimed on first login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email or phone number').fill('legacy@test.local');
    await page.getByRole('button', { name: 'Continue' }).click();
    // No account yet: asks for a name, then sends the code.
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
    await page.getByLabel('First name').fill('Lucy');
    await page.getByLabel('Last name').fill('Chebet');
    const since = new Date(Date.now() - 1000);
    await page.getByRole('button', { name: /continue|send|create/i }).first().click();
    await expect(page.getByRole('heading', { name: 'Enter your code' })).toBeVisible();
    const { text } = await waitForMessage('legacy@test.local', since);
    await page.getByLabel('6-digit code').fill(codeFrom(text));
    await page.getByRole('button', { name: /log in|verify|continue/i }).first().click();
    await expect(page.getByRole('heading', { name: 'Lucy Chebet' })).toBeVisible();
});
