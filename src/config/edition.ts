/**
 * Copy about the ride that the event row does not hold. Years, dates, place, opening
 * times and the rider cap come from the server (useEdition); nothing here names a year
 * except the archive of the last finished ride, which is about that year on purpose.
 */
import { ordinal } from '../utils/eventDates';

/** The first ride was in 2025; the edition number counts from it. */
const FIRST_EDITION_YEAR = 2025;

/** "1st" for the first ride, one more each year after. */
export const editionOrdinal = (year: number): string => ordinal(year - FIRST_EDITION_YEAR + 1);

/** "RWTW" and the last two digits of the year. */
export const shortName = (year: number): string => `RWTW ${String(year).slice(-2)}`;

/** Riders start at this time (Nairobi) on ride day; the countdown counts to it. */
export const RIDE_START_TIME = '06:00';

export const THEME = {
    theme: "Riding for the Warrior Within: Supporting Soldiers' Mental Health",
} as const;

/** The archive: the last finished ride, as shown on its recap page, results, raffle winners and its gallery. */
export const PAST_EDITION = {
    year: 2026,
    ordinal: '2nd',
    dateLabel: '5 July 2026',
    riders: '800+',
    participants: '2,800',
    carTicket: 'AA130',
    carWinner: 'Nancy ***ambu',
    carPrize: 'Nissan Sylphy',
} as const;

/** Paths of the archive pages. */
export const ARCHIVE = {
    recap: `/${PAST_EDITION.year}`,
    photos: `/gallery?year=${PAST_EDITION.year}`,
    label: `${PAST_EDITION.year} Recap`,
} as const;
