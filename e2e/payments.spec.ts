/**
 * Paying through the mock DTB gateway. Every notification is checked in Mailpit.
 * 2026 is over and read-only in the account, so each test pays for a 2027 entry.
 */
import { test, expect } from './fixtures';
import { login, dtbNext, waitForMessage, smsAddress, register2027, sessionToken } from './helpers';

test('unpaid 2027 registration: paying gives a bib, an SMS and an email', async ({ page, request }) => {
    await login(page, 'unpaid@test.local', 'unpaid@test.local');
    await expect(page.getByRole('heading', { name: 'Hi, Kevin' })).toBeVisible();
    // The abandoned 2026 entry can no longer be paid.
    await expect(page.getByRole('link', { name: /^Pay/ })).toHaveCount(0);
    await register2027(request, await sessionToken(page), 'blitz', {
        firstName: 'Kevin', lastName: 'Kiprop', email: 'unpaid@test.local', phoneNumber: '0700000005',
        idNumber: '30000005', dob: '1996-06-16', gender: 'male', tshirtSize: 'L',
    });
    await page.goto('/account');
    await expect(page.getByRole('heading', { name: 'My entries · 2027' })).toBeVisible();
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
test('retry after a cancelled prompt reaches the success page', async ({ page, request }) => {
    await login(page, 'retry@test.local', 'retry@test.local');
    await expect(page.getByRole('heading', { name: 'Hi, Ruth' })).toBeVisible();
    await register2027(request, await sessionToken(page), 'recon', {
        firstName: 'Ruth', lastName: 'Wairimu', email: 'retry@test.local', phoneNumber: '0700000008',
        idNumber: '30000008', dob: '1994-03-30', gender: 'female', tshirtSize: 'S',
    });
    await page.goto('/account');
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
