import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
// config.ts reads window.location when it is imported.
vi.hoisted(() => { Object.assign(globalThis, { window: { location: { origin: 'http://test' } } }); });

import { PublicApiError, publicApi, type PublicEvent } from '.';
import { rideDayOver, stateOf } from './eventState';

const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const store = new Map<string, string>();
let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
    store.clear();
    vi.stubGlobal('localStorage', { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v), removeItem: (k: string) => store.delete(k) });
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe('publicApi', () => {
    it('sends JSON and returns the body', async () => {
        fetchMock.mockResolvedValue(json(200, { notifyRegistered: true }));
        await expect(publicApi.feedback({ role: 'CYCLIST', rating: 5 })).resolves.toEqual({ notifyRegistered: true });
        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toMatch(/\/feedback$/);
        expect(init.method).toBe('POST');
        expect(init.headers['Content-Type']).toBe('application/json');
        expect(JSON.parse(init.body)).toEqual({ role: 'CYCLIST', rating: 5 });
    });

    it('turns { error: { code, message } } into a PublicApiError', async () => {
        fetchMock.mockResolvedValue(json(403, { error: { code: 'REGISTRATION_CLOSED', message: 'Registration is closed' } }));
        const err = await publicApi.notify({ email: 'a@example.test' }).catch(e => e);
        expect(err).toBeInstanceOf(PublicApiError);
        expect(err).toMatchObject({ status: 403, code: 'REGISTRATION_CLOSED', message: 'Registration is closed' });
    });

    it('reads the older { error: "text" } shape', async () => {
        fetchMock.mockResolvedValue(json(400, { error: 'Email is required' }));
        await expect(publicApi.enquiry({ name: '', email: '', phone: '', subject: '', message: '' })).rejects.toMatchObject({ message: 'Email is required', code: 'HTTP_400' });
    });

    it('reports a network failure plainly', async () => {
        fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
        await expect(publicApi.gallery()).rejects.toMatchObject({ status: 0, code: 'NETWORK' });
    });

    it('attaches the rider session only where asked', async () => {
        store.set('rwtwSession', 'tok');
        fetchMock.mockResolvedValue(json(200, { donation: { status: 'PAID' } }));
        await publicApi.donations.status('d 1', 'dt');
        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toMatch(/\/donations\/d%201$/);
        expect(init.headers).toEqual({ 'X-Donation-Token': 'dt', Authorization: 'Bearer tok' });

        fetchMock.mockResolvedValue(json(200, {}));
        await publicApi.notify({ email: 'a@example.test' });
        expect(fetchMock.mock.calls[1][1].headers.Authorization).toBeUndefined();
    });
});

const NOW = new Date('2027-03-01T12:00:00Z');
const event = (over: Partial<PublicEvent> = {}): PublicEvent => ({
    year: 2027, name: 'RWTW', date: '2027-05-09', location: 'Ulinzi',
    registrationOpen: false, registrationOpensAt: null, registrationClosesAt: null,
    raffleOpen: false, raffleOpensAt: null, raffleClosesAt: null,
    rafflePrice: 1000, bikeHirePrice: 1500, bikeStock: null, bikesLeft: null,
    ...over,
});

describe('stateOf', () => {
    it("uses the server's state when it sends one", () => {
        expect(stateOf(event({ registrationState: 'closed', registrationOpen: true }), 'registration', NOW)).toBe('closed');
        expect(stateOf(event({ raffleState: 'open' }), 'raffle', NOW)).toBe('open');
    });

    it('works the state out from dates and the open flag otherwise', () => {
        expect(stateOf(event(), 'registration', NOW)).toBe('upcoming');
        expect(stateOf(event({ registrationOpensAt: '2027-04-01T00:00:00Z' }), 'registration', NOW)).toBe('upcoming');
        expect(stateOf(event({ registrationOpen: true }), 'registration', NOW)).toBe('open');
        expect(stateOf(event({ registrationClosesAt: '2027-03-01T12:00:00Z' }), 'registration', NOW)).toBe('closed');
        expect(stateOf(event({ raffleOpen: true }), 'raffle', NOW)).toBe('open');
        expect(stateOf(event({ raffleOpen: false, raffleClosesAt: '2027-02-01T00:00:00Z' }), 'raffle', NOW)).toBe('closed');
    });

    it('is finished once the ride day is over, even if still open', () => {
        const after = new Date('2027-05-10T00:00:00Z');
        expect(stateOf(event({ registrationOpen: true }), 'registration', after)).toBe('finished');
        expect(stateOf(event(), 'raffle', after)).toBe('finished');
        expect(stateOf(event(), 'raffle', new Date('2027-05-09T23:59:59Z'))).toBe('upcoming');
    });

    it('never finishes without a ride day', () => {
        expect(rideDayOver(null, NOW)).toBe(false);
        expect(rideDayOver('not a date', NOW)).toBe(false);
    });
});
