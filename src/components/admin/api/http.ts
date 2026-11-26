/**
 * The only place the admin talks to the API. Adds the admin token, turns every
 * failure into one AdminApiError, and signs the admin out when the server
 * refuses the token.
 */
import { API_BASE_URL } from '../../../config';
import { endSession, readSession } from './session';

export class AdminApiError extends Error {
    readonly status: number;
    readonly code: string;
    readonly details?: unknown;

    constructor(message: string, status: number, code: string, details?: unknown) {
        super(message);
        this.name = 'AdminApiError';
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

export type Query = Record<string, string | number | boolean | null | undefined>;

export interface RequestOptions {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    query?: Query;
    body?: unknown;
    /** false for public endpoints and the login itself. */
    auth?: boolean;
}

/** Full URL for an API path; empty query values are left out. */
export function apiUrl(path: string, query: Query = {}): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
    }
    const qs = params.toString();
    return `${API_BASE_URL}${path}${qs ? `?${qs}` : ''}`;
}

// The server answers { error: { code, message } }; a few older routes send { error: 'text' } or { message }.
async function errorFrom(res: Response): Promise<AdminApiError> {
    const fallback = `Request failed (${res.status})`;
    const data = (await res.json().catch(() => null)) as { error?: unknown; message?: unknown } | null;
    const err = data?.error;
    if (err && typeof err === 'object') {
        const e = err as { code?: unknown; message?: unknown; details?: unknown };
        return new AdminApiError(typeof e.message === 'string' ? e.message : fallback, res.status, typeof e.code === 'string' ? e.code : `HTTP_${res.status}`, e.details);
    }
    const message = typeof err === 'string' ? err : typeof data?.message === 'string' ? data.message : fallback;
    return new AdminApiError(message, res.status, `HTTP_${res.status}`);
}

/** Sends a request and returns the raw response (for streams); throws AdminApiError when it fails. */
export async function send(path: string, { method = 'GET', query, body, auth = true }: RequestOptions = {}): Promise<Response> {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (auth) {
        const token = readSession()?.token;
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    let res: Response;
    try {
        res = await fetch(apiUrl(path, query), { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    } catch {
        throw new AdminApiError('Could not reach the server. Check your connection and try again.', 0, 'NETWORK');
    }
    if (!res.ok) {
        const error = await errorFrom(res);
        if (auth && res.status === 401) endSession();
        throw error;
    }
    return res;
}

export async function requestJson<T>(path: string, options?: RequestOptions): Promise<T> {
    const res = await send(path, options);
    return (await res.json()) as T;
}

export async function requestBlob(path: string, options?: RequestOptions): Promise<Blob> {
    const res = await send(path, options);
    return res.blob();
}

/** Readable text for any error thrown while loading or saving. */
export function errorMessage(error: unknown, fallback: string): string {
    if (error instanceof AdminApiError) return error.message;
    return fallback;
}
