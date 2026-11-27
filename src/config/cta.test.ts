import { describe, expect, it } from 'vitest';
import type { LifecycleState, PublicEvent } from '../publicApi';
import { stateCopy } from '../pages/eventStateCopy';
import { countdownTarget, dayLabel, ordinal, rideDayLabel } from '../utils/eventDates';
import { notifyYear, primaryCta, raffleCta } from './cta';
import { editionOrdinal, shortName } from './edition';

const event = { year: 2027, date: '2027-05-09', location: 'Ulinzi Sports Complex', registrationOpensAt: '2027-02-09T21:00:00Z', feedbackOpen: true } as PublicEvent;
const current = (registration: LifecycleState, raffle: LifecycleState = 'closed', e: PublicEvent | null = event) => ({ event: e, registration, raffle });

describe('menu buttons follow the state', () => {
    it('Register only while registration is open', () => {
        expect(primaryCta(current('open'))).toEqual({ label: 'Register now', to: '/register' });
        expect(primaryCta(current('upcoming'))).toEqual({ label: 'Pre-register 2027', to: '/register/notify' });
        expect(primaryCta(current('closed'))).toEqual({ label: 'Pre-register 2028', to: '/register/notify' });
        expect(primaryCta(current('finished'))).toEqual({ label: 'Pre-register 2028', to: '/register/notify' });
    });

    it('never Register before the server answers', () => {
        expect(primaryCta(current('closed', 'closed', null))).toEqual({ label: 'Pre-register', to: '/register/notify' });
        expect(notifyYear(current('closed', 'closed', null))).toBeNull();
    });

    it('Buy Raffle only while the raffle is open', () => {
        expect(raffleCta(current('closed', 'open'))).toEqual({ label: 'Buy Raffle', to: '/raffle/step/1' });
        for (const s of ['upcoming', 'closed', 'finished'] as const) expect(raffleCta(current('open', s))).toBeNull();
    });
});

describe('state pages', () => {
    it('upcoming registration gives the opening day in Nairobi time', () => {
        expect(stateCopy('registration', 'upcoming', event).lines[0]).toBe('Registration opens on 10 February 2027.');
        expect(stateCopy('registration', 'upcoming', { ...event, registrationOpensAt: null }).lines[0]).toBe('Registration dates will be announced soon.');
    });

    it('closed gives the ride day and place', () => {
        expect(stateCopy('registration', 'closed', event).lines[1]).toBe('See you on Sunday 9 May 2027 at Ulinzi Sports Complex.');
        expect(stateCopy('raffle', 'closed', event).lines[1]).toBe('The draw is on Sunday 9 May 2027 at Ulinzi Sports Complex.');
    });

    it('finished offers feedback only while it is open, and notify for next year', () => {
        expect(stateCopy('registration', 'finished', event).actions.map(a => a.label)).toEqual(['Share Feedback', 'Notify Me for 2028']);
        expect(stateCopy('registration', 'finished', { ...event, feedbackOpen: false }).actions.map(a => a.label)).toEqual(['Notify Me for 2028']);
        expect(stateCopy('raffle', 'finished', event).actions[0]).toEqual({ to: '/raffle-winners', label: 'See the Winners' });
    });
});

describe('dates and editions', () => {
    it('writes dates the way the site does', () => {
        expect(rideDayLabel('2027-05-09')).toBe('Sunday 9 May 2027');
        expect(rideDayLabel('2027-05-09', false)).toBe('9 May 2027');
        expect(rideDayLabel(null)).toBeNull();
        expect(dayLabel('2027-04-09T20:59:00Z')).toBe('9 April 2027');
        expect(dayLabel('2027-04-09T21:00:00Z')).toBe('10 April 2027');
    });

    it('counts editions from the first ride', () => {
        expect(editionOrdinal(2027)).toBe('3rd');
        expect(editionOrdinal(2026)).toBe('2nd');
        expect(shortName(2027)).toBe('RWTW 27');
        expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 111].map(ordinal)).toEqual(['1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd', '111th']);
    });
});

describe('countdown', () => {
    const opensAt = new Date('2027-02-10T00:00:00+03:00');
    const rideStartsAt = new Date('2027-05-09T06:00:00+03:00');
    it('counts to registration opening, then to the start on ride day', () => {
        expect(countdownTarget(new Date('2027-01-01T00:00:00+03:00'), { opensAt, rideStartsAt })).toEqual({ label: 'Registration opens in', at: opensAt });
        expect(countdownTarget(new Date('2027-03-01T00:00:00+03:00'), { opensAt, rideStartsAt })).toEqual({ label: 'Race day in', at: rideStartsAt });
    });
    it('shows nothing after the start or before the dates are known', () => {
        expect(countdownTarget(new Date('2027-05-09T07:00:00+03:00'), { opensAt, rideStartsAt })).toBeNull();
        expect(countdownTarget(new Date('2027-01-01T00:00:00+03:00'), { opensAt: null, rideStartsAt: null })).toBeNull();
    });
});
