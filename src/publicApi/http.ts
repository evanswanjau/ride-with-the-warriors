/**
 * The only place the public site talks to the API. Turns every failure into one
 * PublicApiError with the server's message, and attaches the rider's session
 * when a call asks for it.
 *
 * The admin has its own helper (components/admin/api/http.ts) that does the same
 * with the admin token; the two should become one client later.
 */
import { API_BASE_URL } from '../config';
import { authHeaders } from '../auth/session';

export class PublicApiError extends Error {
    readonly status: number;
    readonly code: string;

    constructor(message: string, status: number, code: string) {
        super(message);
        this.name = 'PublicApiError';
        this.status = status;
        this.code = code;
    }
}

export interface RequestOptions {
    method?: 'GET' | 'POST';
    body?: unknown;
    headers?: Record<string, string>;
    /** Attach the logged-in rider's session, when there is one. */
    session?: boolean;
}

// The server answers { error: { code, message } }; a few older routes send { error: 'text' } or { message }.
async function errorFrom(res: Response): Promise<PublicApiError> {
    const fallback = `Request failed (${res.status})`;
    const data = (await res.json().catch(() => null)) as { error?: unknown; message?: unknown } | null;
    const err = data?.error;
    if (err && typeof err === 'object') {
        const e = err as { code?: unknown; message?: unknown };
        return new PublicApiError(typeof e.message === 'string' ? e.message : fallback, res.status, typeof e.code === 'string' ? e.code : `HTTP_${res.status}`);
    }
    const message = typeof err === 'string' ? err : typeof data?.message === 'string' ? data.message : fallback;
    return new PublicApiError(message, res.status, `HTTP_${res.status}`);
}

export async function request<T>(path: string, { method = 'GET', body, headers = {}, session = false }: RequestOptions = {}): Promise<T> {
    const all: Record<string, string> = { ...headers, ...(session ? authHeaders() : {}) };
    if (body !== undefined) all['Content-Type'] = 'application/json';

    let res: Response;
    try {
        res = await fetch(`${API_BASE_URL}${path}`, { method, headers: all, body: body === undefined ? undefined : JSON.stringify(body) });
    } catch {
        throw new PublicApiError('Could not reach the server. Check your connection and try again.', 0, 'NETWORK');
    }
    if (!res.ok) throw await errorFrom(res);
    return (await res.json().catch(() => ({}))) as T;
}
