/**
 * Admins page: a super admin invites a new admin by email; the invitee sets a password from
 * the link (read from Mailpit) and is signed in with their role; disabling signs them out.
 */
import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { waitForMessage } from './helpers';

async function logIn(page: Page, email: string, password: string) {
    await page.goto('/admin?year=2026');
    await page.getByPlaceholder('Enter email address').fill(email);
    await page.getByPlaceholder('••••••••').fill(password);
    await page.locator('button[type="submit"]').click();
}

const nav = (page: Page) => page.locator('.ad-sidebar');

test('a super admin invites an admin, who sets a password; disabling signs them out', async ({ page, browser }) => {
    const email = `new.admin.${Date.now()}@test.local`;
    await logIn(page, 'admin@ridewithwarriors.com', 'Password@123');
    await nav(page).getByRole('link', { name: 'Admins', exact: true }).click();
    await expect(page.locator('.ad-page-title')).toHaveText('Admins');

    const since = new Date(Date.now() - 1000);
    await page.getByLabel('Name', { exact: true }).fill('Wanjiku Admin');
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel('Role', { exact: true }).selectOption('admin');
    await page.getByRole('button', { name: 'Send invite' }).click();
    await expect(page.getByText(`Invite sent to ${email}.`)).toBeVisible();
    await expect(page.locator('.ad-panel').filter({ hasText: 'Waiting invites' })).toContainText(email);

    // The invitee opens the link from their email, in their own browser.
    const { text } = await waitForMessage(email, since);
    const link = text.match(/https?:\/\/\S+\/admin\/invite\/[A-Za-z0-9_-]+/)?.[0];
    expect(link, 'invite link in the email').toBeTruthy();
    const invitee = await (await browser.newContext()).newPage();
    await invitee.addInitScript(() => { try { localStorage.setItem('rwtw-feedback-prompt-dismissed', '1'); } catch { /* ignore */ } });
    await invitee.goto(new URL(link!).pathname);
    await expect(invitee.getByText(/You are joining as Admin with/)).toBeVisible();
    await invitee.getByLabel('New password').fill('short');
    await invitee.getByLabel('Type it again').fill('short');
    await invitee.getByRole('button', { name: /Set password and sign in/ }).click();
    await expect(invitee.getByText('Use at least 10 characters.')).toBeVisible();
    await invitee.getByLabel('New password').fill('a-Good-password-27');
    await invitee.getByLabel('Type it again').fill('a-Good-password-27');
    await invitee.getByRole('button', { name: /Set password and sign in/ }).click();
    await expect(invitee.getByText('Admin Workspace — Wanjiku Admin')).toBeVisible();
    // An admin does not see the Admins page.
    await expect(nav(invitee).getByRole('link', { name: 'Admins', exact: true })).toHaveCount(0);

    // The link works once only.
    await invitee.goto(new URL(link!).pathname);
    await expect(invitee.getByText(/expired or was already used/)).toBeVisible();

    // The super admin disables the new admin: their next request signs them out.
    await page.reload();
    const row = page.locator('.ad-tr').filter({ hasText: email });
    await expect(row).toBeVisible();
    page.once('dialog', d => d.accept());
    await row.getByRole('button', { name: 'Disable' }).click();
    await expect(page.getByText('Wanjiku Admin disabled.')).toBeVisible();
    await expect(row).toContainText('Disabled');

    await invitee.goto('/admin/registrations?year=2026');
    await expect(invitee.getByPlaceholder('Enter email address')).toBeVisible();
    await logIn(invitee, email, 'a-Good-password-27');
    await expect(invitee.getByText(/This admin account is disabled/)).toBeVisible();
    await invitee.context().close();
});
