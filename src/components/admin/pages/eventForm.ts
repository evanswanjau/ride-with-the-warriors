/** Converting between an event and the Events page edit form. */
import type { AdminEvent, EventChanges } from '../../../adminTypes';

export interface EventFormValues {
    name: string;
    date: string;
    location: string;
    registrationOpensAt: string;
    registrationClosesAt: string;
    raffleOpensAt: string;
    raffleClosesAt: string;
    feedbackOpensAt: string;
    feedbackClosesAt: string;
    rafflePrice: string;
    bikeHirePrice: string;
    bikeStock: string;
    riderCap: string;
}

const DATE_TIMES = ['registrationOpensAt', 'registrationClosesAt', 'raffleOpensAt', 'raffleClosesAt', 'feedbackOpensAt', 'feedbackClosesAt'] as const;

/** ISO time -> value for <input type="datetime-local"> in the admin's own time zone. */
export function toLocalInput(iso: string | null | undefined): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 16);
}

/** <input type="datetime-local"> value -> ISO time; empty means "no date". */
export function fromLocalInput(value: string): string | null {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function formValues(e: AdminEvent): EventFormValues {
    return {
        name: e.name ?? '',
        date: e.date ?? '',
        location: e.location ?? '',
        registrationOpensAt: toLocalInput(e.registrationOpensAt),
        registrationClosesAt: toLocalInput(e.registrationClosesAt),
        raffleOpensAt: toLocalInput(e.raffleOpensAt),
        raffleClosesAt: toLocalInput(e.raffleClosesAt),
        feedbackOpensAt: toLocalInput(e.feedbackOpensAt),
        feedbackClosesAt: toLocalInput(e.feedbackClosesAt),
        rafflePrice: String(e.rafflePrice ?? ''),
        bikeHirePrice: String(e.bikeHirePrice ?? ''),
        bikeStock: e.bikeStock == null ? '' : String(e.bikeStock),
        riderCap: e.riderCap == null ? '' : String(e.riderCap),
    };
}

const optionalNumber = (v: string) => (v.trim() === '' ? null : Number(v));

/** Form -> PATCH body. Empty optional numbers mean "no limit". */
export function changesFrom(v: EventFormValues): EventChanges {
    const changes: EventChanges = {
        name: v.name.trim(),
        date: v.date || null,
        location: v.location.trim() || null,
        rafflePrice: Number(v.rafflePrice || 0),
        bikeHirePrice: Number(v.bikeHirePrice || 0),
        bikeStock: optionalNumber(v.bikeStock),
        riderCap: optionalNumber(v.riderCap),
    };
    for (const key of DATE_TIMES) changes[key] = fromLocalInput(v[key]);
    return changes;
}

/** What is wrong with the form, or null. */
export function formProblem(v: EventFormValues): string | null {
    if (!v.name.trim()) return 'Enter the event name.';
    for (const [label, value, min] of [['Raffle price', v.rafflePrice, 0], ['Bike hire price', v.bikeHirePrice, 0], ['Bike stock', v.bikeStock, 0], ['Rider limit', v.riderCap, 1]] as const) {
        if (value.trim() === '') continue;
        const n = Number(value);
        if (!Number.isInteger(n) || n < min) return `${label} must be a whole number${min ? ` of at least ${min}` : ''}.`;
    }
    const pairs = [['Registration', v.registrationOpensAt, v.registrationClosesAt], ['Raffle', v.raffleOpensAt, v.raffleClosesAt], ['Feedback', v.feedbackOpensAt, v.feedbackClosesAt]] as const;
    for (const [label, opens, closes] of pairs) {
        // Equal is fine: Open now then Close now in the same minute shows the same time (inputs drop seconds).
        if (opens && closes && new Date(closes) < new Date(opens)) return `${label} cannot close before it opens.`;
    }
    return null;
}
