/**
 * Switches for features that are built but not ready for the public.
 * Each is OFF unless its env var is exactly 'true'. Set them in Vercel / .env files.
 *   VITE_ACCOUNT_ENABLED        /login and /account
 *   VITE_REGISTRATION_ENABLED   /register flow (also needs the date to be past 10 Feb)
 *   VITE_RAFFLE_ENABLED         raffle ticket purchase
 *   VITE_DONATE_ENABLED         /donate
 */
export type Feature = 'account' | 'registration' | 'raffle' | 'donate';

const VARS: Record<Feature, string> = {
    account: 'VITE_ACCOUNT_ENABLED',
    registration: 'VITE_REGISTRATION_ENABLED',
    raffle: 'VITE_RAFFLE_ENABLED',
    donate: 'VITE_DONATE_ENABLED',
};

export function isOn(feature: Feature, env: Record<string, string | undefined> = import.meta.env): boolean {
    return env[VARS[feature]] === 'true';
}
