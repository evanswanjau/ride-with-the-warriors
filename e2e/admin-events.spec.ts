/**
 * Admin Events page: start the next year, then open and close registration and watch the
 * public register page follow with no deploy.
 *
 * Needs an API that follows the event dates (REGISTRATION_OPEN / RAFFLE_OPEN unset), like
 * states.spec.ts: point E2E_STATE_API_URL and the client's VITE_API_URL at it. Against the
 * default e2e API (both forced open) these tests skip.
 */
import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { ensureTeaser2027Event } from './helpers';

const API = process.env.E2E_STATE_API_URL ?? process.env.E2E_API_URL ?? 'http://localhost:4100/api/v1';
const YEAR = 2027;

async function logIn(page: Page) {
    await page.goto('/admin/events');
    await page.getByPlaceholder('Enter email address').fill('admin@ridewithwarriors.com');
    await page.getByPlaceholder('••••••••').fill('Password@123');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('.ad-page-title')).toHaveText('Events', { timeout: 20_000 });
}

test.describe.configure({ mode: 'serial' });

test.afterAll(async ({ request }) => {
    // Leave 2027 as the other specs expect it: the teaser, nothing open yet.
    await ensureTeaser2027Event(request, API);
});

test('a super admin starts the next year from the Events page', async ({ page, request }) => {
    const before = await (await request.get(`${API}/events/current`)).json();
    test.skip(before.event.registrationOpen, 'this API forces registration open');
    await logIn(page);

    const start = page.getByRole('button', { name: /^Start \d{4}$/ });
    if (before.event.year >= YEAR) {
        // A database where 2027 already exists: check the button, but do not start 2028.
        await expect(start).toHaveText(`Start ${before.event.year + 1}`);
        return;
    }
    await expect(start).toHaveText(`Start ${YEAR}`);
    page.once('dialog', d => {
        expect(d.message()).toContain(`The website's current year moves to ${YEAR}`);
        d.accept();
    });
    await start.click();
    await expect(page.getByText(`${YEAR} started.`)).toBeVisible();
    await expect(page.locator('.ad-tr').first()).toContainText(`${YEAR} ★`);
    await expect(page.locator('.ad-tr').first()).toContainText('upcoming');

    const after = await (await request.get(`${API}/events/current`)).json();
    expect(after.event).toMatchObject({ year: YEAR, registrationState: 'upcoming' });
    expect(after.event.circuits.length).toBeGreaterThan(0);
});

test('opening and closing registration in the admin changes the public page, no deploy', async ({ page, browser, request }) => {
    await ensureTeaser2027Event(request, API);
    const { event } = await (await request.get(`${API}/events/current`)).json();
    test.skip(event.registrationOpen, 'this API forces registration open');
    await logIn(page);

    const editor = page.locator('.ad-panel').filter({ hasText: `${YEAR} · current event` });
    await expect(editor).toBeVisible();

    // Edit and save: the ride day and the rider limit.
    await editor.getByLabel('riderCap').fill('2000');
    await editor.getByRole('button', { name: `Save ${YEAR}` }).click();
    await expect(page.getByText(`${YEAR} saved.`)).toBeVisible();
    await expect(page.locator('.ad-tr').first()).toContainText('2000');

    // A visitor on the public site, in another browser.
    const visitor = await (await browser.newContext()).newPage();
    await visitor.goto('/register');
    await expect(visitor.getByTestId('registration-upcoming')).toBeVisible();

    page.once('dialog', d => d.accept());
    await editor.getByRole('button', { name: 'Open registration now' }).click();
    await expect(page.getByText('Registration opened.')).toBeVisible();
    await expect(page.locator('.ad-tr').first()).toContainText('open');

    // Open: the form asks the logged-out visitor to log in first.
    await visitor.goto('/register');
    await expect(visitor).toHaveURL(/\/login\?next=/);

    page.once('dialog', d => d.accept());
    await page.getByRole('button', { name: 'Close registration now' }).click();
    await expect(page.getByText('Registration closed.')).toBeVisible();

    await visitor.goto('/register');
    await expect(visitor.getByTestId('registration-closed')).toBeVisible();
    await visitor.context().close();
});

test('feedback switches on and off from the Events page', async ({ page, request }) => {
    await ensureTeaser2027Event(request, API);
    const { event } = await (await request.get(`${API}/events/current`)).json();
    test.skip(event.registrationOpen, 'this API forces registration open');
    await logIn(page);

    page.once('dialog', d => d.accept());
    await page.getByRole('button', { name: 'Open feedback now' }).first().click();
    await expect(page.getByText('Feedback opened.')).toBeVisible();
    expect((await (await request.get(`${API}/events/current`)).json()).event.feedbackOpen).toBe(true);

    page.once('dialog', d => d.accept());
    await page.getByRole('button', { name: 'Close feedback now' }).first().click();
    await expect(page.getByText('Feedback closed.')).toBeVisible();
    expect((await (await request.get(`${API}/events/current`)).json()).event.feedbackOpen).toBe(false);
});
