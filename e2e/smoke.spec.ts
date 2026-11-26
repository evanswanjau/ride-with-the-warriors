/** Public pages load without errors (desktop and mobile). */
import { test, expect } from './fixtures';

for (const path of ['/', '/about', '/circuits', '/faqs', '/gallery', '/results', '/2026', '/donate', '/login', '/contact']) {
    test(`page ${path} loads`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const res = await page.goto(path);
        expect(res?.ok()).toBe(true);
        await expect(page.locator('body')).not.toBeEmpty();
        expect(errors).toEqual([]);
    });
}
