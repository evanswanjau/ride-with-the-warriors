export const EDITION = {
    year: 2027,
    ordinal: '3rd',
    shortName: 'RWTW 27',
    raceDay: '2027-05-09T06:00:00+03:00',
    raceDayLabel: 'Sunday 9 May 2027',
    venue: "Ulinzi Sports Complex, Lang'ata",
    theme: "Riding for the Warrior Within: Supporting Soldiers' Mental Health",
    tagline: 'Ride for the Warrior Within.',
    registrationOpens: '2027-02-10T00:00:00+03:00',
    registrationOpensLabel: '10 February 2027',
    registrationCloses: '2027-04-09T23:59:00+03:00',
    registrationClosesLabel: '9 April 2027',
    riderCap: 2000,
} as const;

export const PAST_EDITION = {
    year: 2026,
    ordinal: '2nd',
    dateLabel: '5 July 2026',
    riders: '800+',
    participants: '2,800',
    carTicket: 'AA130',
} as const;

export type Phase = 'pre-registration' | 'registration-open' | 'registration-closed' | 'post-race';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Which part of the year we are in. Used only for wording and countdown targets; the server decides what is really open. */
export function phaseAt(now: Date = new Date()): Phase {
    const t = now.getTime();
    if (t >= new Date(EDITION.raceDay).getTime() + DAY_MS) return 'post-race';
    if (t >= new Date(EDITION.registrationCloses).getTime()) return 'registration-closed';
    if (t >= new Date(EDITION.registrationOpens).getTime()) return 'registration-open';
    return 'pre-registration';
}

/** What the countdown counts to: registration opening before 10 Feb, then race day. */
export function countdownTarget(now: Date = new Date()): { label: string; at: Date } | null {
    const t = now.getTime();
    const opens = new Date(EDITION.registrationOpens);
    const race = new Date(EDITION.raceDay);
    if (t < opens.getTime()) return { label: 'Registration opens in', at: opens };
    if (t < race.getTime()) return { label: 'Race day in', at: race };
    return null;
}
