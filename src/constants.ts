import type { Circuit } from './types';

export const CIRCUITS: Circuit[] = [
    {
        id: 'blitz',
        title: 'BLITZ CIRCUIT',
        subtitle: 'Team/Individual',
        description: 'Choose from five competitive options with prizes to be won in each age category. The team race is open to all ages. Recommended for regular cyclists.',
        icon: 'landscape',
        distance: '120 KM',
        price: 2000,
        date: 'Aug 24th, 2026',
        time: '06:00 AM',
        location: 'Karura Forest, Nairobi'
    },
    {
        id: 'intermediate',
        title: 'INTERMEDIATE',
        subtitle: 'Team/Individual',
        description: 'Competitive races for amateurs of all ages. Prizes to be won in both Team and Individual categories.',
        icon: 'bolt',
        distance: '60 KM',
        price: 2000,
        date: 'Aug 24th, 2026',
        time: '07:30 AM',
        location: 'Karura Forest, Nairobi'
    },
    {
        id: 'corporate',
        title: 'CORPORATE',
        subtitle: 'Team/Individual',
        description: 'Represent your organization. Groups of five riders competing for organizational glory. While there is no prize money, teams receive medals and participation awards.',
        icon: 'groups',
        distance: '30 KM',
        price: 9000,
        date: 'Aug 24th, 2026',
        time: '07:00 AM',
        location: 'Karura Forest, Nairobi'
    },
    {
        id: 'family',
        title: 'FAMILY',
        subtitle: 'Kids and Moms',
        description: 'A fun-filled event for children of all ages to help ignite their passion for cycling in a safe environment.',
        icon: 'family_restroom',
        distance: '5 KM',
        price: 1000,
        date: 'Aug 24th, 2026',
        time: '09:00 AM',
        location: 'Karura Forest, Nairobi'
    },
];
