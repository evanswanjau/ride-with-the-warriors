import { test as base, expect } from '@playwright/test';

/** Every test starts with the "How was your experience?" popup already dismissed. */
export const test = base.extend({
    page: async ({ page }, use) => {
        await page.addInitScript(() => {
            try { localStorage.setItem('rwtw-feedback-prompt-dismissed', '1'); } catch { /* ignore */ }
        });
        await use(page);
    },
});

export { expect };
