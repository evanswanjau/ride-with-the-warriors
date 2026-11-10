/** Terms and FAQs carry the client's 2026-11 rules (COD-129). */
import { test, expect } from './fixtures';

test.describe('Terms and conditions', () => {
    test('shows the identity, non-transferable, no-show and prize clauses', async ({ page }) => {
        await page.goto('/terms-and-conditions');

        await expect(page.getByText(/Last updated:/)).toBeVisible();

        const identity = page.locator('#identity');
        await expect(identity).toContainText('Identity & Eligibility');
        await expect(identity).toContainText(/date of birth .* must match/i);

        const transfer = page.locator('#non-transferable');
        await expect(transfer).toContainText('Non-Transferable Entry');
        await expect(transfer).toContainText(/Riding for another cyclist/i);

        await expect(page.locator('#refunds')).toContainText(/do not show up/i);

        const prizes = page.locator('#prizes');
        await expect(prizes).toContainText(/within 30 days/i);
        await expect(prizes).toContainText(/charity/i);
    });

    test('numbers every clause in order', async ({ page }) => {
        await page.goto('/terms-and-conditions');
        const numbers = await page.locator('.terms-number').allTextContents();
        expect(numbers).toEqual(Array.from({ length: numbers.length }, (_, i) => String(i + 1).padStart(2, '0')));
        expect(numbers.length).toBe(11);
    });
});

test('FAQs answer the ID, transfer, no-show and prize questions', async ({ page }) => {
    await page.goto('/faqs');
    for (const question of [
        'Does my date of birth need to match my ID?',
        'Can someone else ride in my place?',
        'Will I get a refund if I cannot make it on the day?',
        'How long do I have to collect my prize?',
    ]) {
        await expect(page.getByText(question)).toBeVisible();
    }
});
