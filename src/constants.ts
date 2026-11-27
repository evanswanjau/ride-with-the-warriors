import type { Circuit } from './types';
import { getCurrentEvent } from './hooks/useCurrentEvent';
import { rideDayLabel } from './utils/eventDates';

type CircuitDetails = Omit<Circuit, 'date' | 'location'>;

/** Ride day and place are the current event's, read when shown, so no year or venue is written here. */
function withEventDetails(circuit: CircuitDetails): Circuit {
    return Object.defineProperties({ ...circuit } as Circuit, {
        date: { enumerable: true, get: () => rideDayLabel(getCurrentEvent().event?.date ?? null, false) ?? 'To be announced' },
        location: { enumerable: true, get: () => getCurrentEvent().event?.location ?? 'To be announced' },
    });
}

const DETAILS: CircuitDetails[] = [
    {
        id: 'blitz',
        title: 'BLITZ CIRCUIT',
        subtitle: 'Team/Individual',
        description: 'Recommended for pro cyclists, the Blitz Circuit offers prize money across each category. The team race is open to all ages, and teams can be constituted of members from different age groups.',
        icon: 'landscape',
        distance: '120 KM',
        price: 2000,
        time: '07:00 AM',
        isCompetitive: true
    },
    {
        id: 'recon',
        title: 'RECON CIRCUIT',
        subtitle: 'Team/Individual',
        description: 'Recommended for regular cyclists, the Recon Circuit offers prize money across both Team and Individual categories. The race is open to all ages, and teams can be constituted of members from different age groups.',
        icon: 'bolt',
        distance: '60 KM',
        price: 2000,
        time: '07:30 AM',
        isCompetitive: true
    },
    {
        id: 'corporate',
        title: 'CORPORATE',
        subtitle: 'Team/Individual',
        description: 'Recommended for corporate teams, we invite teams of three to five to compete for organizational glory, with medals and awards presented to participants in recognition of their collective achievement.',
        icon: 'groups',
        distance: '30 KM',
        price: 9000,
        time: '08:30 AM'
    },
    {
        id: 'family',
        title: 'FAMILY',
        subtitle: 'Kids and Parents',
        description: 'A fun-filled event designed to ignite a passion for cycling in children within a safe environment. Cubs and Champs must be accompanied by a guardian.',
        icon: 'family_restroom',
        distance: '5 KM',
        price: 1000,
        time: '10:00 AM'
    },
];

export const CIRCUITS: Circuit[] = DETAILS.map(withEventDetails);
