/**
 * End-to-end tests against the full local stack, isolated from your dev data:
 *   client :5174 → API :4100 (database rwtw_e2e) → mock DTB :4110, email/SMS → Mailpit :8025
 *
 * Needs the server repo next to this one (../server) and Docker running:
 *   cd ../server && npm run stack:up
 *   npm run e2e            (resets rwtw_e2e, starts everything, runs the tests)
 *   npm run e2e:ui         (same, with the Playwright UI)
 */
import { defineConfig, devices } from '@playwright/test';

const SERVER_DIR = '../server';

export default defineConfig({
    testDir: './e2e',
    globalSetup: './e2e/global-setup.ts',
    fullyParallel: false,
    workers: 1,
    retries: process.env.CI ? 1 : 0,
    timeout: 60_000,
    expect: { timeout: 15_000 },
    reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
    use: {
        baseURL: 'http://localhost:5174',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
        { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /(smoke|portal)\.spec\.ts/ },
    ],
    webServer: [
        {
            command: 'npx tsx dev/mock-dtb/server.ts',
            cwd: SERVER_DIR,
            url: 'http://localhost:4110/__pushes',
            env: { MOCK_DTB_PORT: '4110', MOCK_DTB_DELAY_MS: '500' },
            reuseExistingServer: !process.env.CI,
        },
        {
            command: 'npm run e2e:api',
            cwd: SERVER_DIR,
            url: 'http://localhost:4100/health',
            reuseExistingServer: !process.env.CI,
            timeout: 60_000,
        },
        {
            command: 'npx vite --mode stack --port 5174 --strictPort',
            url: 'http://localhost:5174',
            env: { VITE_API_URL: 'http://localhost:4100/api/v1' },
            reuseExistingServer: !process.env.CI,
        },
    ],
});
