/**
 * Registration and raffle state of an event, as the server works it out
 * (`registrationState` / `raffleState`). The site never compares dates itself; if a server
 * leaves the state out, the page shows closed rather than offer a form it may refuse.
 */
import type { LifecycleState, PublicEvent } from './types';

export function stateOf(event: PublicEvent, what: 'registration' | 'raffle'): LifecycleState {
    return (what === 'registration' ? event.registrationState : event.raffleState) ?? 'closed';
}
