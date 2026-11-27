/** What the register and raffle pages say when they are not open (EventStatePage). */
import type { LifecycleState, PublicEvent } from '../publicApi';
import { dayLabel, rideDayLabel } from '../utils/eventDates';

export type GatedFlow = 'registration' | 'raffle';

export interface StateCopy {
    eyebrow: string;
    heading: [string, string];
    lines: string[];
    actions: { to: string; label: string }[];
}

export function stateCopy(what: GatedFlow, state: Exclude<LifecycleState, 'open'>, event: PublicEvent | null): StateCopy {
    const name = event ? `Ride With The Warriors ${event.year}` : 'Ride With The Warriors';
    const rideDay = rideDayLabel(event?.date ?? null);
    const where = event?.location ? ` at ${event.location}` : '';
    const next = event ? ` for ${event.year + 1}` : '';
    const home = { to: '/', label: 'Back to Home' };

    if (what === 'registration') {
        const opens = dayLabel(event?.registrationOpensAt ?? null);
        if (state === 'upcoming') return {
            eyebrow: 'Registration Opens Soon',
            heading: ['Cyclist Registration', 'Opens Soon'],
            lines: [
                opens ? `Registration opens on ${opens}.` : 'Registration dates will be announced soon.',
                `Pre-register now and we'll tell you first when ${name} registration opens.`,
            ],
            actions: [{ to: '/register/notify', label: `Notify Me${event ? ` for ${event.year}` : ''}` }],
        };
        if (state === 'closed') return {
            eyebrow: 'Registration Closed',
            heading: ['Cyclist Registration', 'Is Now Closed'],
            lines: [`Registration for ${name} has closed.`, rideDay ? `See you on ${rideDay}${where}.` : 'See you on race day.'],
            actions: [home],
        };
        return {
            eyebrow: 'Ride Complete',
            heading: ['Thank You For', 'Riding With Us'],
            lines: [`${name} is over.`, `Share your experience and sign up to be notified when registration opens${next}.`],
            actions: [
                ...(event?.feedbackOpen ? [{ to: '/feedback', label: 'Share Feedback' }] : []),
                { to: '/register/notify', label: `Notify Me${next}` },
            ],
        };
    }

    const opens = dayLabel(event?.raffleOpensAt ?? null);
    if (state === 'upcoming') return {
        eyebrow: 'Raffle Opens Soon',
        heading: ['Raffle Ticket Sales', 'Open Soon'],
        lines: [
            opens ? `Raffle ticket sales open on ${opens}.` : 'Raffle ticket sales open soon.',
            "Sign up and we'll let you know when tickets go on sale.",
        ],
        actions: [{ to: '/register/notify', label: `Notify Me${event ? ` for ${event.year}` : ''}` }],
    };
    if (state === 'closed') return {
        eyebrow: 'Raffle Closed',
        heading: ['Raffle Ticket Sales', 'Are Now Closed'],
        lines: [`Raffle ticket sales for ${name} have closed.`, rideDay ? `The draw is on ${rideDay}${where}.` : 'The draw takes place on race day.'],
        actions: [home],
    };
    return {
        eyebrow: 'Raffle Complete',
        heading: ['The Raffle Draw', 'Has Taken Place'],
        lines: [`Thank you for supporting ${name}.`, `See the winners, and sign up to be notified when registration opens${next}.`],
        actions: [{ to: '/raffle-winners', label: 'See the Winners' }, { to: '/register/notify', label: `Notify Me${next}` }],
    };
}
