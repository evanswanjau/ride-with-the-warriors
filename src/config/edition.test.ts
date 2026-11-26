import { describe, expect, it } from 'vitest';
import { countdownTarget, phaseAt } from './edition';

describe('phaseAt', () => {
    it('is pre-registration at 9 Feb 23:59 EAT', () => {
        expect(phaseAt(new Date('2027-02-09T23:59:00+03:00'))).toBe('pre-registration');
    });
    it('is open at 10 Feb 00:00 EAT', () => {
        expect(phaseAt(new Date('2027-02-10T00:00:00+03:00'))).toBe('registration-open');
    });
    it('is closed on 10 Apr', () => {
        expect(phaseAt(new Date('2027-04-10T12:00:00+03:00'))).toBe('registration-closed');
    });
    it('is post-race on 10 May', () => {
        expect(phaseAt(new Date('2027-05-10T12:00:00+03:00'))).toBe('post-race');
    });
});

describe('countdownTarget', () => {
    it('counts to registration before 10 Feb', () => {
        const t = countdownTarget(new Date('2027-01-01T00:00:00+03:00'));
        expect(t?.label).toBe('Registration opens in');
        expect(t?.at.toISOString()).toBe(new Date('2027-02-10T00:00:00+03:00').toISOString());
    });
    it('counts to race day after registration opens', () => {
        const t = countdownTarget(new Date('2027-03-01T00:00:00+03:00'));
        expect(t?.label).toBe('Race day in');
        expect(t?.at.toISOString()).toBe(new Date('2027-05-09T06:00:00+03:00').toISOString());
    });
    it('is null after race day', () => {
        expect(countdownTarget(new Date('2027-05-09T07:00:00+03:00'))).toBeNull();
    });
});
