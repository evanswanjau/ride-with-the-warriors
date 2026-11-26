/**
 * The admin's sign-in, kept in localStorage for seven days. Nothing else in the
 * admin reads or writes these keys: the API client takes the token from here.
 */
import type { AdminUser } from '../../../types';

const TOKEN_KEY = 'adminToken';
const USER_KEY = 'adminUser';
const EXPIRY_KEY = 'adminSessionExpiry';
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

/** Fired on window when the session ends without the admin pressing Sign out (expired, or the server refused the token). */
export const SIGNED_OUT_EVENT = 'rwtw:admin-signed-out';

export interface AdminSession {
    token: string;
    admin: AdminUser | null;
}

function parseUser(raw: string | null): AdminUser | null {
    if (!raw) return null;
    try {
        return JSON.parse(raw) as AdminUser;
    } catch {
        return null;
    }
}

export function clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRY_KEY);
}

/** The current session, or null when there is none or it has expired (an expired one is removed). */
export function readSession(now: number = Date.now()): AdminSession | null {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = Number(localStorage.getItem(EXPIRY_KEY));
    if (!token || !expiry || now >= expiry) {
        if (token) clearSession();
        return null;
    }
    return { token, admin: parseUser(localStorage.getItem(USER_KEY)) };
}

export function saveSession(token: string, admin: AdminUser, now: number = Date.now()): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(admin));
    localStorage.setItem(EXPIRY_KEY, String(now + SESSION_MS));
}

/** Ends the session and tells the admin screen to show the login form. */
export function endSession(): void {
    clearSession();
    window.dispatchEvent(new Event(SIGNED_OUT_EVENT));
}
