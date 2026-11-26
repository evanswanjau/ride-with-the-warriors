/**
 * Error tracking. Starts only when VITE_SENTRY_DSN is set at build time, so
 * local runs send nothing. VITE_APP_ENV tags events (local / uat / production).
 *
 * The SDK is loaded as its own chunk once the page is idle, so it stays out of
 * the entry bundle and off the critical path.
 */
import { whenIdle } from './utils/idle';

export function startSentry(): void {
    const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
    if (!dsn) return;
    whenIdle(() => {
        import('@sentry/react')
            .then((Sentry) => {
                Sentry.init({
                    dsn,
                    environment: (import.meta.env.VITE_APP_ENV as string | undefined) ?? (import.meta.env.PROD ? 'production' : 'local'),
                    sendDefaultPii: false,
                    tracesSampleRate: 0.1,
                });
            })
            .catch(() => {
                /* the site works without error tracking */
            });
    });
}
