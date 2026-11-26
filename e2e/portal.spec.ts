/**
 * Rider portal (/account/*): bibs with check-in QR, rider details with a locked ID
 * and a guarded date of birth, email change verified at the new address, install
 * support. Data: server/prisma/seed-demo.ts. Each test logs in as a different
 * account because the server allows 3 codes per address per window.
 */
import { test, expect } from './fixtures';
import { login, waitForMessage, codeFrom } from './helpers';

const nav = (page: import('@playwright/test').Page) => page.getByRole('navigation', { name: 'Account' });

test('entry detail shows a bib card with a check-in QR for every rider', async ({ page }) => {
    await login(page, 'parent@test.local', 'parent@test.local');
    const entry = page.getByRole('article', { name: 'Family ride' });
    await entry.getByRole('link', { name: 'Details' }).click();

    await expect(page.getByRole('heading', { name: 'Bibs & check-in' })).toBeVisible();
    for (const name of ['Grace Muthoni', 'Hope Muthoni', 'Ian Muthoni']) {
        await expect(page.getByRole('img', { name: `Check-in QR code for ${name}` })).toBeVisible();
    }
    await expect(page.getByRole('button', { name: 'Download confirmation (PDF)' })).toBeVisible();

    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download confirmation (PDF)' }).click();
    expect((await download).suggestedFilename()).toMatch(/^rwtw-2026-.*\.pdf$/);
});

test('rider details: ID is locked, date of birth needs confirming before it saves', async ({ page }) => {
    await login(page, 'captain@test.local', 'captain@test.local');
    await nav(page).getByRole('link', { name: 'Riders' }).click();
    await page.getByRole('link', { name: /Felix Njoroge/ }).click();

    await expect(page.getByText('ID or passport number')).toBeVisible();
    await expect(page.getByText('Locked')).toBeVisible();
    await expect(page.getByRole('button', { name: /edit id/i })).toHaveCount(0);

    await page.getByRole('button', { name: 'Edit date of birth' }).click();
    const sheet = page.getByRole('dialog', { name: 'Date of birth' });
    await expect(sheet.getByText(/must match the date on the rider's ID/)).toBeVisible();
    await sheet.getByLabel('Date of birth').fill('1993-12-24');
    const save = sheet.getByRole('button', { name: 'Save date of birth' });
    await expect(save).toBeDisabled();
    await sheet.getByLabel(/I confirm this matches/).check();
    await save.click();

    await expect(sheet).toHaveCount(0);
    await expect(page.getByText('Saved')).toBeVisible();
    await expect(page.getByText('24 Dec 1993')).toBeVisible();
});

test('changing email sends a code to the new address and only then saves it', async ({ page }, testInfo) => {
    // The change sticks, so each project uses its own account.
    const oldEmail = testInfo.project.name === 'mobile' ? 'member@test.local' : 'unpaid@test.local';
    const newEmail = `changed.${testInfo.project.name}@test.local`;
    await login(page, oldEmail, oldEmail);
    await nav(page).getByRole('link', { name: 'Profile' }).click();
    await page.getByRole('button', { name: 'Change email' }).click();

    const sheet = page.getByRole('dialog', { name: 'Change email address' });
    await sheet.getByLabel('New email address').fill(newEmail);
    const since = new Date(Date.now() - 1000);
    await sheet.getByRole('button', { name: 'Send code' }).click();
    await expect(sheet.getByText(/Enter the 6-digit code we sent to/)).toBeVisible();
    // Still the old address until the code is entered.
    await expect(page.locator('.rp-details').getByText(oldEmail)).toBeVisible();

    const { text } = await waitForMessage(newEmail, since);
    await sheet.getByLabel('6-digit code').fill(codeFrom(text));
    await sheet.getByRole('button', { name: 'Verify and save' }).click();

    await expect(page.getByText(/Your email address has been changed/)).toBeVisible();
    await expect(page.locator('.rp-details').getByText(newEmail)).toBeVisible();
    // The old address is told about the change.
    await waitForMessage(oldEmail, since);
});

test('works as an installable app: manifest, icons and tab navigation', async ({ page, request }) => {
    const manifest = await (await request.get('/manifest.webmanifest')).json();
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('./account');
    for (const icon of manifest.icons) {
        expect((await request.get(`/${icon.src}`)).ok()).toBe(true);
    }

    await login(page, 'retry@test.local', 'retry@test.local');
    await expect(page.getByRole('heading', { name: 'Add RWTW to your home screen' })).toBeVisible();
    await page.getByRole('button', { name: 'Not now' }).click();
    await expect(page.getByRole('heading', { name: 'Add RWTW to your home screen' })).toHaveCount(0);

    for (const [tab, heading] of [['Entries', 'Entries'], ['Riders', 'My riders'], ['Tickets', 'Tickets'], ['Profile', 'Profile'], ['Home', 'Hi, Ruth']]) {
        await nav(page).getByRole('link', { name: tab }).click();
        await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    }

    await nav(page).getByRole('link', { name: 'Profile' }).click();
    await page.getByRole('button', { name: 'Log out' }).click();
    await expect(page).toHaveURL(/\/login/);
});
