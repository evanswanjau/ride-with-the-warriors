import { execSync } from 'node:child_process';

/** Fresh rwtw_e2e database with the synthetic 2026 history before every run. */
export default async function globalSetup() {
    if (process.env.E2E_SKIP_RESET === '1') return;
    execSync('npm run db:e2e:prepare', { cwd: '../server', stdio: 'inherit' });
    await fetch('http://localhost:8025/api/v1/messages', { method: 'DELETE' }).catch(() => undefined);
}
