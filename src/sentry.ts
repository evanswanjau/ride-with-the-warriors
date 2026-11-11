/**
 * Error tracking. Starts only when VITE_SENTRY_DSN is set at build time, so
 * local runs send nothing. VITE_APP_ENV tags events (local / uat / production).
 */
import * as Sentry from '@sentry/react';

const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

if (dsn) {
    Sentry.init({
        dsn,
        environment: (import.meta.env.VITE_APP_ENV as string | undefined) ?? (import.meta.env.PROD ? 'production' : 'local'),
        sendDefaultPii: false,
        tracesSampleRate: 0.1,
    });
}

export { Sentry };
