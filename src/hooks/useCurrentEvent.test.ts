import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
vi.hoisted(() => { Object.assign(globalThis, { window: { location: { origin: 'http://test' } } }); });

import { getCurrentEvent, refreshCurrentEvent, resetCurrentEventForTests } from './useCurrentEvent';

const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const EVENT = {
    year: 2027, name: 'RWTW', date: '2099-05-09', location: 'Ulinzi',
    registrationOpen: true, registrationOpensAt: null, registrationClosesAt: null,
    raffleOpen: false, raffleOpensAt: null, raffleClosesAt: null,
    rafflePrice: 1000, bikeHirePrice: 1500, bikeStock: null, bikesLeft: null,
    registrationState: 'open', raffleState: 'closed', riderCap: null, feedbackOpen: false, circuits: [],
};

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
    resetCurrentEventForTests();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe('current event', () => {
    it('is closed, never open, before the server answers', () => {
        expect(getCurrentEvent()).toEqual({ status: 'loading', event: null, registration: 'closed', raffle: 'closed' });
    });

    it('takes the states from the server answer', async () => {
        fetchMock.mockResolvedValue(json(200, { event: { ...EVENT, raffleState: 'upcoming' } }));
        await refreshCurrentEvent();
        expect(getCurrentEvent()).toMatchObject({ status: 'ready', registration: 'open', raffle: 'upcoming', event: { year: 2027 } });
    });

    it('stays closed when the server cannot be reached', async () => {
        fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
        await refreshCurrentEvent();
        expect(getCurrentEvent()).toEqual({ status: 'error', event: null, registration: 'closed', raffle: 'closed' });
    });

    it('keeps the last good answer when a refetch fails', async () => {
        fetchMock.mockResolvedValueOnce(json(200, { event: EVENT })).mockResolvedValueOnce(json(500, {}));
        await refreshCurrentEvent();
        await refreshCurrentEvent();
        expect(getCurrentEvent()).toMatchObject({ status: 'ready', registration: 'open' });
    });

    it('shares one request between callers', async () => {
        fetchMock.mockResolvedValue(json(200, { event: EVENT }));
        await Promise.all([refreshCurrentEvent(), refreshCurrentEvent(), refreshCurrentEvent()]);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
});
