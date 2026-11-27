import type { CurrentEvent } from '../hooks/useCurrentEvent';

export interface Cta { label: string; to: string }

/**
 * The year "Notify me" signs up for: this event's until registration has closed, then the next.
 * Null until the event is known.
 */
export function notifyYear({ event, registration }: Pick<CurrentEvent, 'event' | 'registration'>): number | null {
    if (!event) return null;
    return registration === 'closed' || registration === 'finished' ? event.year + 1 : event.year;
}

/**
 * The main button in the menu, home page and recap pages. Register while registration is
 * open; before it opens (the teaser) and after it closes, the button signs people up to hear
 * first. Never Register while the server has not answered.
 */
export function primaryCta(current: Pick<CurrentEvent, 'event' | 'registration'>): Cta {
    if (current.registration === 'open') return { label: 'Register now', to: '/register' };
    const year = notifyYear(current);
    return { label: year ? `Pre-register ${year}` : 'Pre-register', to: '/register/notify' };
}

/** "Buy raffle" only while raffle ticket sales are open. */
export function raffleCta({ raffle }: Pick<CurrentEvent, 'raffle'>): Cta | null {
    return raffle === 'open' ? { label: 'Buy Raffle', to: '/raffle/step/1' } : null;
}
