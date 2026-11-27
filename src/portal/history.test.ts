import { describe, expect, it } from 'vitest';
import { entryPath, hasNextYear, nextAction, registerAgainPath } from './EntryCard';
import { NEXT_EVENT, isPastYear } from './event';
import { yearFromParam } from './format';
import type { Entry, Rider } from './types';

const rider = (over: Partial<Rider> = {}): Rider => ({
    id: 'r1', firstName: 'Amina', lastName: 'Wanjiru', category: 'Individual', bibNumber: '1001',
    status: 'PAID', isCaptain: false, tshirtSize: 'M', bikeHire: null, ...over,
});

const entry = (over: Partial<Entry> = {}): Entry => ({
    groupId: 'g-1', eventYear: NEXT_EVENT.year, role: 'owner', type: 'individual', circuitId: 'recon',
    teamName: null, status: 'PAID', paymentRegistrationId: 'r1', totalAmount: 3500,
    createdAt: '2026-06-01T09:00:00Z', riders: [rider()], ...over,
});

const PAST = NEXT_EVENT.year - 1;

describe('past years are read-only', () => {
    it('only years before the next ride are past', () => {
        expect(isPastYear(PAST)).toBe(true);
        expect(isPastYear(NEXT_EVENT.year)).toBe(false);
    });

    it('a past unpaid entry offers no payment', () => {
        const next = nextAction(entry({ eventYear: PAST, status: 'UNPAID' }));
        expect(next.to).not.toMatch(/^\/payment/);
        expect(next.label).toBe(`Register for ${NEXT_EVENT.year}`);
    });

    it('a past entry with an unpaid bike offers no bike payment', () => {
        const next = nextAction(entry({ eventYear: PAST, riders: [rider({ bikeHire: { id: 'b1', status: 'PENDING', amount: 1500 } })] }));
        expect(next.label).not.toMatch(/bike/i);
    });

    it('a past entry points to registering for the next ride, with the entry to copy from', () => {
        const e = entry({ eventYear: PAST, groupId: 'grp 1' });
        expect(nextAction(e)).toMatchObject({ label: `Register for ${NEXT_EVENT.year}`, to: registerAgainPath(e), primary: true });
        expect(registerAgainPath(e)).toBe('/register?from=grp%201');
    });

    it('once registered for the next ride, a past entry just opens', () => {
        const e = entry({ eventYear: PAST });
        expect(nextAction(e, true)).toMatchObject({ label: 'View entry', to: entryPath(e), primary: false });
    });

    it('the next ride still asks for payment', () => {
        expect(nextAction(entry({ status: 'UNPAID' })).to).toBe('/payment/r1');
    });
});

describe('years in links', () => {
    it('entry links carry the entry year', () => {
        expect(entryPath(entry({ eventYear: 2026 }))).toBe('/account/entries/g-1?year=2026');
    });

    it('reads ?year= only when it is a plausible year', () => {
        expect(yearFromParam('2026')).toBe(2026);
        expect(yearFromParam(null)).toBeNull();
        expect(yearFromParam('abc')).toBeNull();
        expect(yearFromParam('26')).toBeNull();
        expect(yearFromParam('2026.5')).toBeNull();
    });

    it('knows whether the account already has the next ride', () => {
        expect(hasNextYear([NEXT_EVENT.year, PAST])).toBe(true);
        expect(hasNextYear([PAST])).toBe(false);
        expect(hasNextYear(undefined)).toBe(false);
    });
});
