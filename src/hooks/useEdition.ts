/**
 * The current ride as public pages write it: year, edition, ride day, place and the
 * registration window, all from the event the server sends. Every field is null until the
 * server answers, so pages leave that piece of text out rather than show a guess.
 */
import { RIDE_START_TIME, editionOrdinal, shortName } from '../config/edition';
import type { LifecycleState } from '../publicApi';
import { dayLabel, rideDayLabel } from '../utils/eventDates';
import { useCurrentEvent } from './useCurrentEvent';

export interface Edition {
    year: number | null;
    /** "3rd" */
    ordinal: string | null;
    /** "RWTW 27" */
    shortName: string | null;
    /** "Sunday 9 May <year>" */
    rideDay: string | null;
    /** "9 May <year>" */
    rideDayShort: string | null;
    /** When riders start, for the countdown. */
    rideStartsAt: Date | null;
    venue: string | null;
    /** "10 February <year>" */
    opensLabel: string | null;
    opensAt: Date | null;
    closesLabel: string | null;
    riderCap: number | null;
    registration: LifecycleState;
}

export function useEdition(): Edition {
    const { event, registration } = useCurrentEvent();
    const year = event?.year ?? null;
    const date = event?.date ?? null;
    return {
        year,
        ordinal: year === null ? null : editionOrdinal(year),
        shortName: year === null ? null : shortName(year),
        rideDay: rideDayLabel(date),
        rideDayShort: rideDayLabel(date, false),
        rideStartsAt: date ? new Date(`${date}T${RIDE_START_TIME}:00+03:00`) : null,
        venue: event?.location ?? null,
        opensLabel: dayLabel(event?.registrationOpensAt ?? null),
        opensAt: event?.registrationOpensAt ? new Date(event.registrationOpensAt) : null,
        closesLabel: dayLabel(event?.registrationClosesAt ?? null),
        riderCap: event?.riderCap ?? null,
        registration,
    };
}
