/**
 * Participant session token storage. Kept outside React so plain fetch calls
 * (api.ts, payment pages) can attach it too.
 */
const TOKEN_KEY = 'rwtwSession';

export function getSessionToken(): string | null {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
}

export function setSessionToken(token: string | null) {
    try {
        if (token) localStorage.setItem(TOKEN_KEY, token);
        else localStorage.removeItem(TOKEN_KEY);
    } catch {
        /* storage unavailable (private mode): session lasts for this page only */
    }
}

/** Authorization header for the logged-in participant, or nothing. */
export function authHeaders(): Record<string, string> {
    const token = getSessionToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}
