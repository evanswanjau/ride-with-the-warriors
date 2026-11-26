import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
// config.ts reads window.location when it is imported.
vi.hoisted(() => { Object.assign(globalThis, { window: { location: { origin: 'http://test' } } }); });

import { AdminApiError, apiUrl, errorMessage, requestJson } from './http';
import { SIGNED_OUT_EVENT, readSession, saveSession } from './session';

function memoryStorage(): Storage {
    const data = new Map<string, string>();
    return {
        get length() { return data.size; },
        clear: () => data.clear(),
        getItem: (k) => data.get(k) ?? null,
        key: (i) => [...data.keys()][i] ?? null,
        removeItem: (k) => { data.delete(k); },
        setItem: (k, v) => { data.set(k, String(v)); },
    };
}

const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

let fetchMock: ReturnType<typeof vi.fn>;
let signedOut: number;

beforeEach(() => {
    signedOut = 0;
    const target = new EventTarget();
    target.addEventListener(SIGNED_OUT_EVENT, () => { signedOut++; });
    vi.stubGlobal('localStorage', memoryStorage());
    vi.stubGlobal('window', target);
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => vi.unstubAllGlobals());

describe('apiUrl', () => {
    it('leaves out empty query values', () => {
        expect(apiUrl('/admin/raffle', { page: 2, status: '', search: undefined, year: 2026 })).toMatch(/\/admin\/raffle\?page=2&year=2026$/);
        expect(apiUrl('/admin/dashboard')).toMatch(/\/admin\/dashboard$/);
    });
});

describe('requestJson', () => {
    it('sends the saved token and returns the body', async () => {
        saveSession('tok-1', { name: 'Admin' });
        fetchMock.mockResolvedValue(json(200, { ok: true }));

        await expect(requestJson('/admin/x')).resolves.toEqual({ ok: true });
        const [, init] = fetchMock.mock.calls[0];
        expect(init.headers.Authorization).toBe('Bearer tok-1');
    });

    it('sends no token to public endpoints', async () => {
        saveSession('tok-1', { name: 'Admin' });
        fetchMock.mockResolvedValue(json(200, {}));
        await requestJson('/events/current', { auth: false });
        expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
    });

    it('turns every error body into one AdminApiError', async () => {
        fetchMock.mockResolvedValueOnce(json(400, { error: { code: 'VALIDATION', message: 'Bad status' } }));
        await expect(requestJson('/admin/x')).rejects.toMatchObject({ status: 400, code: 'VALIDATION', message: 'Bad status' });

        fetchMock.mockResolvedValueOnce(json(500, { error: 'Plain text' }));
        await expect(requestJson('/admin/x')).rejects.toMatchObject({ status: 500, message: 'Plain text' });

        fetchMock.mockResolvedValueOnce(new Response('not json', { status: 502 }));
        await expect(requestJson('/admin/x')).rejects.toMatchObject({ status: 502, message: 'Request failed (502)' });

        fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
        await expect(requestJson('/admin/x')).rejects.toMatchObject({ status: 0, code: 'NETWORK' });
    });

    it('signs the admin out when the server refuses the token', async () => {
        saveSession('old', { name: 'Admin' });
        fetchMock.mockResolvedValue(json(401, { error: { code: 'UNAUTHORIZED', message: 'Session expired' } }));

        await expect(requestJson('/admin/x')).rejects.toBeInstanceOf(AdminApiError);
        expect(readSession()).toBeNull();
        expect(signedOut).toBe(1);
    });

    it('keeps the session when a wrong password is refused at login', async () => {
        saveSession('still-valid', { name: 'Admin' });
        fetchMock.mockResolvedValue(json(401, { error: { code: 'INVALID', message: 'Wrong password' } }));

        await expect(requestJson('/admin/auth/login', { method: 'POST', body: {}, auth: false })).rejects.toThrow('Wrong password');
        expect(readSession()?.token).toBe('still-valid');
        expect(signedOut).toBe(0);
    });
});

describe('session', () => {
    it('expires after seven days', () => {
        const now = Date.UTC(2027, 0, 1);
        saveSession('t', { name: 'A' }, now);
        expect(readSession(now + 6 * 86_400_000)?.token).toBe('t');
        expect(readSession(now + 7 * 86_400_000)).toBeNull();
        expect(localStorage.getItem('adminToken')).toBeNull();
    });
});

describe('errorMessage', () => {
    it('uses the server message, or the fallback for anything else', () => {
        expect(errorMessage(new AdminApiError('From server', 400, 'X'), 'fallback')).toBe('From server');
        expect(errorMessage(new Error('boom'), 'fallback')).toBe('fallback');
    });
});
