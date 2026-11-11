/**
 * Paying through the mock DTB gateway. Every notification is checked in Mailpit.
 */
import { test, expect } from './fixtures';
import { login, dtbNext, waitForMessage, smsAddress } from './helpers';

test('unpaid 2026 registration: paying gives a bib, an SMS and an email', async ({ page }) => {
    await login(page, 'unpaid@test.local', 'unpaid@test.local');
    await page.getByRole('link', { name: /^Pay/ }).first().click();
    const since = new Date();
    await dtbNext('success');
    await page.getByRole('button', { name: 'Send M-Pesa Prompt' }).click();
    await expect(page.getByRole('heading', { name: /You're In!/ })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/^\d{4}$/).first()).toBeVisible();

    const sms = await waitForMessage(smsAddress('254700000005'), since);
    expect(sms.text).toMatch(/payment of KES .* is confirmed/);
    await waitForMessage('unpaid@test.local', since);
});

// COD-119: a new prompt clears the previous failure, so "Retry" can succeed.
test('retry after a cancelled prompt reaches the success page', async ({ page }) => {
    await login(page, 'retry@test.local', 'retry@test.local');
    await page.getByRole('link', { name: /^Pay/ }).first().click();
    await dtbNext('fail');
    await page.getByRole('button', { name: 'Send M-Pesa Prompt' }).click();
    await expect(page.getByText(/cancelled by user/i)).toBeVisible({ timeout: 20_000 });
    await dtbNext('success');
    await page.getByRole('button', { name: 'Retry Send Prompt' }).click();
    await expect(page.getByRole('heading', { name: /You're In!/ })).toBeVisible({ timeout: 20_000 });
});

test('donation without logging in', async ({ page }) => {
    await page.goto('/donate');
    await page.getByRole('button', { name: '1000', exact: true }).click();
    await page.getByPlaceholder('John Doe').fill('Kind Stranger');
    await page.getByPlaceholder('john@example.com').fill('stranger@test.local');
    await page.getByPlaceholder('07XX XXX XXX').fill('0700000099');
    const since = new Date();
    await dtbNext('success');
    await page.getByRole('button', { name: 'Complete Donation' }).click();
    await expect(page.getByRole('heading', { name: 'Thank You!' })).toBeVisible({ timeout: 30_000 });
    const sms = await waitForMessage(smsAddress('254700000099'), since);
    expect(sms.text).toContain('donation');
});
