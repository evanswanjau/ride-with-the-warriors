/**
 * Switches for features that are built but not ready for the public.
 * Each is OFF unless its env var is exactly 'true'. Set them in Vercel / .env files.
 * Registration and the raffle have no switch: they follow the event's state from the server.
 *   VITE_ACCOUNT_ENABLED        /login and /account
 *   VITE_DONATE_ENABLED         /donate
 */
export type Feature = 'account' | 'donate';

const VARS: Record<Feature, string> = {
    account: 'VITE_ACCOUNT_ENABLED',
    donate: 'VITE_DONATE_ENABLED',
};

export function isOn(feature: Feature, env: Record<string, string | undefined> = import.meta.env): boolean {
    return env[VARS[feature]] === 'true';
}
