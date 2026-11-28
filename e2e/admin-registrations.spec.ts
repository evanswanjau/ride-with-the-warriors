/**
 * Registration detail drawer: correct a rider's details, record a refund note, cancel the entry.
 * Uses Moses Ruto (seed-demo.ts, a complimentary military entry no other spec touches).
 */
import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';

async function openMoses(page: Page) {
    await page.goto('/admin/registrations?year=2026');
    await page.getByPlaceholder('Enter email address').fill('admin@ridewithwarriors.com');
    await page.getByPlaceholder('••••••••').fill('Password@123');
    await page.locator('button[type="submit"]').click();
    await page.getByPlaceholder(/Name, team or ID/).fill('Moses');
    const row = page.locator('.ad-tr').filter({ hasText: 'Moses Ruto' });
    await expect(row).toBeVisible({ timeout: 20_000 });
    await row.getByTitle('View').click();
    await expect(page.locator('.ad-drawer-title')).toHaveText('Registration Detail');
    return page.locator('.ad-drawer');
}

test('an admin corrects a rider, notes a refund and cancels the entry, with reasons on record', async ({ page }) => {
    const drawer = await openMoses(page);

    await drawer.getByRole('button', { name: 'Edit rider' }).click();
    await drawer.getByLabel('T-shirt size').fill('XL');
    await drawer.getByLabel('Reason (kept in the audit log)').fill('Asked for a bigger size');
    await drawer.getByRole('button', { name: 'Save rider' }).click();
    await expect(drawer.getByText('Rider details saved.')).toBeVisible();
    await expect(drawer.locator('.ad-drawer-field-val').filter({ hasText: /^XL$/ })).toBeVisible();
    await expect(drawer.getByText(/edit-details/)).toBeVisible();

    await drawer.getByRole('button', { name: 'Refund note' }).click();
    await drawer.getByLabel('Amount refunded (KES, optional)').fill('500');
    await drawer.getByLabel('Note').fill('Refunded the kit difference by M-Pesa');
    await drawer.getByRole('button', { name: 'Save note' }).click();
    await expect(drawer.getByText('Refund note saved.')).toBeVisible();
    await expect(drawer.getByText('Refunded the kit difference by M-Pesa')).toBeVisible();

    await drawer.getByRole('button', { name: 'Cancel entry' }).click();
    await drawer.getByLabel('Reason (kept in the audit log)').fill('Rider withdrew');
    await drawer.locator('form').getByRole('button', { name: 'Cancel entry' }).click();
    await expect(drawer.getByText('Entry cancelled.')).toBeVisible();
    await expect(drawer.locator('.ad-drawer-field-val').filter({ hasText: /^CANCELLED$/ })).toBeVisible();
    // A cancelled entry cannot be cancelled or moved again.
    await expect(drawer.getByRole('button', { name: 'Move to another entry' })).toHaveCount(0);
});
