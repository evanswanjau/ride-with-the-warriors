import { describe, expect, it } from 'vitest';
import { changesFrom, formProblem, formValues, fromLocalInput, toLocalInput } from './eventForm';
import { hasRole } from '../roles';

const event = {
    year: 2027, name: 'Ride With The Warriors 2027', date: '2027-05-09', location: null,
    registrationOpensAt: '2027-02-10T06:00:00.000Z', registrationClosesAt: null,
    raffleOpensAt: null, raffleClosesAt: null, feedbackOpensAt: null, feedbackClosesAt: null,
    rafflePrice: 1000, bikeHirePrice: 1500, bikeStock: null, riderCap: 2000,
};

describe('event form', () => {
    it('round-trips an event through the form', () => {
        const v = formValues(event);
        expect(v).toMatchObject({ riderCap: '2000', bikeStock: '', location: '' });
        expect(changesFrom(v)).toEqual({
            name: event.name, date: '2027-05-09', location: null, rafflePrice: 1000, bikeHirePrice: 1500, bikeStock: null, riderCap: 2000,
            registrationOpensAt: '2027-02-10T06:00:00.000Z', registrationClosesAt: null, raffleOpensAt: null, raffleClosesAt: null,
            feedbackOpensAt: null, feedbackClosesAt: null,
        });
    });

    it('keeps local date-times exact', () => {
        expect(fromLocalInput(toLocalInput('2027-04-09T20:59:00.000Z'))).toBe('2027-04-09T20:59:00.000Z');
        expect(toLocalInput(null)).toBe('');
        expect(fromLocalInput('')).toBeNull();
    });

    it('flags bad values', () => {
        const v = formValues(event);
        expect(formProblem(v)).toBeNull();
        expect(formProblem({ ...v, name: ' ' })).toMatch(/name/);
        expect(formProblem({ ...v, riderCap: '0' })).toMatch(/Rider limit/);
        expect(formProblem({ ...v, rafflePrice: '9.5' })).toMatch(/Raffle price/);
        expect(formProblem({ ...v, registrationClosesAt: '2027-01-01T00:00' })).toMatch(/Registration cannot close before it opens/);
        // Opened and closed in the same minute.
        expect(formProblem({ ...v, feedbackOpensAt: '2027-05-10T09:30', feedbackClosesAt: '2027-05-10T09:30' })).toBeNull();
    });
});

describe('hasRole', () => {
    it('ranks viewer < admin < super_admin; unknown counts as viewer', () => {
        expect(hasRole({ role: 'super_admin' }, 'super_admin')).toBe(true);
        expect(hasRole({ role: 'admin' }, 'super_admin')).toBe(false);
        expect(hasRole({ role: 'admin' }, 'admin')).toBe(true);
        expect(hasRole({ role: 'owner' }, 'admin')).toBe(false);
        expect(hasRole(null, 'viewer')).toBe(true);
    });
});
