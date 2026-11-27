/**
 * Registration and raffle state of an event. The server sends `registrationState` /
 * `raffleState` (server Phase 2); for a server that does not yet, the same rule is worked
 * out here from what it does send, so the site never compares dates anywhere else.
 */
import type { LifecycleState, PublicEvent } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

type What = 'registration' | 'raffle';

/** True once the ride day ("YYYY-MM-DD", UTC midnight, as the server stores it) is over. */
export function rideDayOver(date: string | null, now: Date = new Date()): boolean {
    if (!date) return false;
    const day = Date.parse(`${date}T00:00:00Z`);
    return Number.isFinite(day) && now.getTime() >= day + DAY_MS;
}

/** The server's rule: finished after ride day, open inside the window, closed after it, upcoming before. */
export function stateOf(event: PublicEvent, what: What, now: Date = new Date()): LifecycleState {
    const sent = what === 'registration' ? event.registrationState : event.raffleState;
    if (sent) return sent;
    if (rideDayOver(event.date, now)) return 'finished';
    if (what === 'registration' ? event.registrationOpen : event.raffleOpen) return 'open';
    const closesAt = what === 'registration' ? event.registrationClosesAt : event.raffleClosesAt;
    if (closesAt && Date.parse(closesAt) <= now.getTime()) return 'closed';
    return 'upcoming';
}
