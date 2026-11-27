import { test as base, expect } from '@playwright/test';

/** Every test starts with the "How was your experience?" popup already dismissed. */
export const test = base.extend({
    page: async ({ page }, provide) => {
        await page.addInitScript(() => {
            // The prompt is remembered per ride year.
            try { for (let y = 2025; y <= 2040; y++) localStorage.setItem(`rwtw-feedback-prompt-dismissed-${y}`, '1'); } catch { /* ignore */ }
        });
        await provide(page);
    },
});

export { expect };
