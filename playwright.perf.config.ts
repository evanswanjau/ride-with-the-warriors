/**
 * Bundle/image checks that need only the built site (no API, no Docker).
 *   npm run e2e:perf        (builds, serves the build, runs e2e-perf/)
 * PERF_PORT picks the port (default 4392).
 */
import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PERF_PORT ?? 4392);

export default defineConfig({
    testDir: './e2e-perf',
    timeout: 60_000,
    workers: 1,
    reporter: [['list']],
    use: { baseURL: `http://localhost:${port}`, ...devices['Pixel 7'] },
    webServer: {
        command: `npx vite build --mode development && npx vite preview --mode development --port ${port} --strictPort`,
        url: `http://localhost:${port}`,
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
    },
});
