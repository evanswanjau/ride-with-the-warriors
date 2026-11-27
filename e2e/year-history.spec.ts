/**
 * Rider account with history, on a phone: a 2026 rider logs in, sees 2026 exactly as it
 * was, goes to register for 2027, and afterwards sees both years side by side. Editing a
 * saved rider changes nothing on the 2026 entry. Data: server/prisma/seed-demo.ts.
 *
 * The 2027 registration screens are Phase 4, so the 2027 entry is made through the API
 * (the same call those screens make).
 */
import { devices, type Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { editSavedRider, login, register2027, sessionToken } from './helpers';

// Phone-sized screen. The browser type is set per project, so it is left out here.
const { viewport, userAgent, deviceScaleFactor, isMobile, hasTouch } = devices['Pixel 7'];
test.use({ viewport, userAgent, deviceScaleFactor, isMobile, hasTouch });

const nav = (page: Page) => page.getByRole('navigation', { name: 'Account' });
const AMINA = {
    firstName: 'Amina', lastName: 'Wanjiru', email: 'rider@test.local', phoneNumber: '0700000001',
    idNumber: '30000001', dob: '1992-04-12', gender: 'female', tshirtSize: 'M',
} as const;

test('a 2026 rider sees their history, registers for 2027, and then sees both years', async ({ page, request }) => {
    await login(page, 'rider@test.local', 'rider@test.local');
    await expect(page.getByRole('heading', { name: 'Hi, Amina' })).toBeVisible();

    // ── 2026, as it was ─────────────────────────────────────────────────────
    const home2026 = page.getByRole('article', { name: 'Recon circuit' });
    await expect(page.getByRole('heading', { name: 'My entries · 2026' })).toBeVisible();
    await expect(home2026.getByRole('link', { name: 'Register for 2027' })).toBeVisible();

    await nav(page).getByRole('link', { name: 'Entries' }).click();
    await expect(page.getByText('RWTW 2026 · 1 entry · 1 rider · 1 bike hired · KES 3,500 paid')).toBeVisible();
    await expect(page.getByRole('group', { name: 'Event year' })).toHaveCount(0); // only one year so far

    await page.getByRole('article', { name: 'Recon circuit' }).getByRole('link', { name: 'Details' }).click();
    await expect(page).toHaveURL(/\/account\/entries\/[^?]+\?year=2026$/);
    await expect(page.getByText('RWTW 2026 is over. This entry is kept exactly as it was')).toBeVisible();
    await expect(page.getByLabel(/^Bib number \d{4}$/)).toBeVisible();
    await expect(page.getByText('Bike hired · KES 1,500')).toBeVisible();
    // Read-only: nothing to book or pay.
    await expect(page.getByRole('button', { name: 'Hire a bike' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /^Pay / })).toHaveCount(0);

    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download confirmation (PDF)' }).click();
    expect((await download).suggestedFilename()).toMatch(/^rwtw-2026-.*\.pdf$/);

    // A reload keeps the year from the address.
    await page.reload();
    await expect(page.getByText('RWTW 2026 is over.')).toBeVisible();

    await nav(page).getByRole('link', { name: 'Tickets' }).click();
    await expect(page.getByText(/^A[A-Z]\d{3}$/).first()).toBeVisible();
    await expect(page.getByText('KES 2,000')).toBeVisible();

    // ── Register for 2027 ───────────────────────────────────────────────────
    await nav(page).getByRole('link', { name: 'Home' }).click();
    await page.getByRole('article', { name: 'Recon circuit' }).getByRole('link', { name: 'Register for 2027' }).click();
    // Open: the first step of the form, with the entry to copy riders from. Closed: the state page.
    await expect(page).toHaveURL(/\/register(\/step\/1)?\?from=/);

    const token = await sessionToken(page);
    await register2027(request, token, 'recon', AMINA);
    await editSavedRider(request, token, AMINA, { lastName: 'Wanjiru-Otieno', tshirtSize: 'XL', emergencyContactName: 'Someone New' });

    // ── Both years ──────────────────────────────────────────────────────────
    await page.goto('/account/entries');
    const years = page.getByRole('group', { name: 'Event year' });
    await expect(years.getByRole('button', { name: '2027' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText(/^RWTW 2027 · 1 entry · 1 rider/)).toBeVisible();
    await expect(page.getByRole('article', { name: 'Recon circuit' }).getByRole('link', { name: /^Pay KES/ })).toBeVisible();

    await years.getByRole('button', { name: '2026' }).click();
    await expect(page.getByText('RWTW 2026 · 1 entry · 1 rider · 1 bike hired · KES 3,500 paid')).toBeVisible();
    const card2026 = page.getByRole('article', { name: 'Recon circuit' });
    await expect(card2026.getByText('Paid')).toBeVisible();
    // Already registered for 2027, so the 2026 card no longer offers it.
    await expect(card2026.getByRole('link', { name: 'Register for 2027' })).toHaveCount(0);

    // The saved-rider edit did not reach the 2026 entry.
    await nav(page).getByRole('link', { name: 'Riders' }).click();
    await page.getByRole('link', { name: /Amina Wanjiru/ }).click();
    await expect(page).toHaveURL(/\?year=2026$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Amina Wanjiru' })).toBeVisible();
    await expect(page.getByText('Wanjiru-Otieno')).toHaveCount(0);
    const details = page.locator('.rp-details');
    await expect(details.getByText('M', { exact: true })).toBeVisible();
    await expect(details.getByText('Someone New')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /^Edit / })).toHaveCount(0);
    await expect(page.getByText('These are the details from the RWTW 2026 entry, kept as they were.')).toBeVisible();
});
