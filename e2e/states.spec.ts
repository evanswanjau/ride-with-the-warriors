/**
 * Registration and raffle follow the event's state from the server, on a phone, with no
 * deploy: the admin changes the 2027 dates and the public pages change with them.
 *
 * Needs an API that is not forced open (REGISTRATION_OPEN / RAFFLE_OPEN unset). The default
 * e2e API forces both open, so there these tests skip; point E2E_STATE_API_URL (and the
 * client's VITE_API_URL) at an API without those flags to run them.
 */
import type { APIRequestContext } from '@playwright/test';
import { test, expect } from './fixtures';
import { login } from './helpers';

const API = process.env.E2E_STATE_API_URL ?? process.env.E2E_API_URL ?? 'http://localhost:4100/api/v1';
const YEAR = 2027;
const DAY = 24 * 60 * 60 * 1000;
const at = (days: number) => new Date(Date.now() + days * DAY).toISOString();
const day = (days: number) => at(days).slice(0, 10);

type State = 'upcoming' | 'open' | 'closed' | 'finished';

/** Opens, closes and ride day (days from now) that put both registration and the raffle in `state`. */
const WINDOWS: Record<State, { opens: number; closes: number; ride: number }> = {
    upcoming: { opens: 30, closes: 60, ride: 90 },
    open: { opens: -1, closes: 30, ride: 90 },
    closed: { opens: -30, closes: -1, ride: 30 },
    finished: { opens: -90, closes: -60, ride: -2 },
};

async function adminToken(request: APIRequestContext): Promise<string> {
    const res = await request.post(`${API}/admin/auth/login`, { data: { email: 'admin@ridewithwarriors.com', password: 'Password@123' } });
    expect(res.ok()).toBe(true);
    return (await res.json()).token;
}

async function setState(request: APIRequestContext, state: State) {
    const token = await adminToken(request);
    const headers = { Authorization: `Bearer ${token}` };
    const created = await request.post(`${API}/admin/events`, { headers, data: { year: YEAR, name: `Ride With The Warriors ${YEAR}`, date: '2027-05-09' } });
    expect([201, 409], await created.text()).toContain(created.status());
    const w = WINDOWS[state];
    const res = await request.patch(`${API}/admin/events/${YEAR}`, {
        headers,
        data: {
            date: day(w.ride), location: 'Ulinzi Sports Complex',
            registrationOpensAt: at(w.opens), registrationClosesAt: at(w.closes),
            raffleOpensAt: at(w.opens), raffleClosesAt: at(w.closes),
        },
    });
    expect(res.ok(), await res.text()).toBe(true);
}

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ request }) => {
    await setState(request, 'upcoming');
    const { event } = await (await request.get(`${API}/events/current`)).json();
    test.skip(event.year !== YEAR || event.registrationOpen || event.raffleOpen, 'this API forces registration and the raffle open');
});

test.afterAll(async ({ request }) => {
    // Leave the event as the teaser starts: nothing open yet.
    await setState(request, 'upcoming');
});

const menuLink = (page: import('@playwright/test').Page, name: RegExp) => page.locator('.nav-mobile-ctas').getByRole('link', { name });

test('upcoming: "opens on" pages with Notify me, and no Register or raffle button', async ({ page, request }) => {
    await setState(request, 'upcoming');
    await page.goto('/register');
    await expect(page.getByTestId('registration-upcoming')).toBeVisible();
    await expect(page.getByText(/Registration opens on \d{1,2} \w+ \d{4}\./)).toBeVisible();
    await expect(page.getByRole('link', { name: `Notify Me for ${YEAR}` })).toBeVisible();

    await page.goto('/raffle/step/1');
    await expect(page.getByTestId('raffle-upcoming')).toBeVisible();
    await expect(page.getByText(/Raffle ticket sales open on/)).toBeVisible();

    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(menuLink(page, new RegExp(`Pre-register ${YEAR}`))).toBeVisible();
    await expect(menuLink(page, /Register now|Buy Raffle/)).toHaveCount(0);
});

test('open: Register and Buy Raffle appear, and the forms load for a logged-in rider', async ({ page, request }) => {
    await setState(request, 'open');
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(menuLink(page, /Register now/)).toBeVisible();
    await expect(menuLink(page, /Buy Raffle/)).toBeVisible();

    // Logged out: the form asks for a login first.
    await page.goto('/register');
    await expect(page).toHaveURL(/\/login\?next=/);

    await login(page, 'rider@test.local', 'rider@test.local');
    await expect(page).not.toHaveURL(/\/login/);
    await page.goto('/register');
    await expect(page).toHaveURL(/\/register\/step\/1$/);
    await expect(page.getByText('CHOOSE YOUR CIRCUIT').first()).toBeVisible();

    await page.goto('/military/register/step/1');
    await expect(page.getByText('CHOOSE YOUR CIRCUIT').first()).toBeVisible();

    await page.goto('/raffle/step/1');
    await expect(page.getByText('DETAILS').first()).toBeVisible();
    await expect(page.getByTestId('raffle-closed')).toHaveCount(0);
});

test('closed: "see you on" race day, and no Register or raffle button', async ({ page, request }) => {
    await setState(request, 'closed');
    await page.goto('/register/step/3');
    await expect(page.getByTestId('registration-closed')).toBeVisible();
    await expect(page.getByText(/See you on \w+ \d{1,2} \w+ \d{4} at Ulinzi Sports Complex\./)).toBeVisible();

    await page.goto('/raffle/step/1');
    await expect(page.getByTestId('raffle-closed')).toBeVisible();
    await expect(page.getByText(/The draw is on/)).toBeVisible();

    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(menuLink(page, /Register now|Buy Raffle/)).toHaveCount(0);
    await expect(menuLink(page, new RegExp(`Pre-register ${YEAR + 1}`))).toBeVisible();
});

test('finished: feedback and "Notify me for next year"; raffle links to the winners', async ({ page, request }) => {
    await setState(request, 'finished');
    await page.goto('/register');
    await expect(page.getByTestId('registration-finished')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Share Feedback' })).toBeVisible();
    await expect(page.getByRole('link', { name: `Notify Me for ${YEAR + 1}` })).toBeVisible();

    await page.goto('/raffle/step/2');
    await expect(page.getByTestId('raffle-finished')).toBeVisible();
    await expect(page.getByRole('link', { name: 'See the Winners' })).toHaveAttribute('href', '/raffle-winners');
});

test('a tab left open follows a change made in the admin when it regains focus', async ({ page, request }) => {
    await setState(request, 'closed');
    await page.goto('/register');
    await expect(page.getByTestId('registration-closed')).toBeVisible();
    await setState(request, 'finished');
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    await expect(page.getByTestId('registration-finished')).toBeVisible();
});
