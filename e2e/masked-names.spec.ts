/** Public Raffle Winners and Results pages show masked surnames; the car winner (AA130) is row 1. */
import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';

/** A displayed name is first word in full, then only masked words (`***` + the tail of the surname). */
const isMasked = (name: string) => {
    const [, ...rest] = name.trim().split(/\s+/);
    return rest.every(word => /^\*\*\*/.test(word));
};

const nameCells = (page: Page) => page.locator('td.name-cell');

test('raffle winners: car (AA130) is first and surnames are masked', async ({ page }) => {
    await page.goto('/raffle-winners');
    const rows = page.locator('table.winners-table tbody tr');
    await expect(rows.first()).toBeVisible();

    const first = rows.first().locator('td');
    await expect(first.nth(0)).toHaveText('1');
    await expect(first.nth(1)).toContainText('Nissan Sylphy');
    await expect(first.nth(2)).toHaveText('AA130');
    await expect(first.nth(3)).toHaveText(/^nancy \*\*\*ambu$/i);

    for (const name of await nameCells(page).allTextContents()) {
        expect(isMasked(name), `unmasked name on raffle page: "${name}"`).toBe(true);
    }
});

test('raffle winners: search works by first name and ticket number, masked surname leaks nothing', async ({ page }) => {
    await page.goto('/raffle-winners');
    const search = page.getByPlaceholder(/search/i);

    await search.fill('aa021');
    await expect(page.locator('table.winners-table tbody tr').first()).toContainText('AA021');

    await search.fill('jacob');
    await expect(page.locator('table.winners-table tbody tr').first()).toContainText(/jacob/i);

    // Searching the real surname finds nothing: it is not in the data.
    await search.fill('oyugi');
    await expect(page.getByText('No winners found')).toBeVisible();
});

test('results: rider surnames are masked', async ({ page }) => {
    await page.goto('/results');
    await expect(nameCells(page).first()).toBeVisible();
    const names = await nameCells(page).allTextContents();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
        expect(isMasked(name), `unmasked name on results page: "${name}"`).toBe(true);
    }

    await page.getByPlaceholder(/search/i).first().fill('kibet');
    await expect(page.getByText('Hannah')).toHaveCount(0);
});

test('raffle winners: grand prize card shows the car, ticket and masked winner', async ({ page }) => {
    await page.goto('/raffle-winners');
    const card = page.getByTestId('grand-prize');
    await expect(card).toContainText('Grand Prize');
    await expect(card).toContainText('Nissan Sylphy');
    await expect(card).toContainText('AA130');
    await expect(card).toContainText('Nancy ***ambu');
    await expect(card).not.toContainText('Karambu');

    // Table row 1 is highlighted, badged, and names are title case (not lowercase).
    const row = page.locator('table.winners-table tbody tr').first();
    await expect(row).toHaveClass(/row-grand/);
    await expect(row.locator('.grand-badge')).toContainText('Car');
    await expect(row.locator('td.name-cell')).toHaveText('Nancy ***ambu');
});
