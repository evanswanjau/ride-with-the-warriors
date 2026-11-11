/** Admin can log in and see the 2026 data. Login from server/prisma/seed.ts. */
import { test, expect } from './fixtures';

test('admin logs in, sees totals and finds a 2026 rider', async ({ page }) => {
    await page.goto('/admin');
    await page.getByPlaceholder('Enter email address').fill('admin@ridewithwarriors.com');
    await page.getByPlaceholder('••••••••').fill('Password@123');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('Confirmed entries', { exact: false }).first()).toBeVisible({ timeout: 20_000 });
    await page.getByText('Registrations', { exact: true }).first().click();
    await page.getByPlaceholder(/Name, team or ID/).fill('Amina');
    await expect(page.getByText('Amina Wanjiru').first()).toBeVisible({ timeout: 20_000 });
});
