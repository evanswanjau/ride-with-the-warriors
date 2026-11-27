/**
 * The current event, from GET /events/current. Fetched once for the whole app, kept in
 * memory, and fetched again when the window regains focus (an organiser may have opened
 * or closed registration meanwhile).
 *
 * While it loads, or when the server cannot be reached, both states are 'closed': the
 * site never offers a form the server may refuse.
 */
import { useEffect, useSyncExternalStore } from 'react';
import { publicApi, type LifecycleState, type PublicEvent } from '../publicApi';
import { stateOf } from '../publicApi/eventState';

export interface CurrentEvent {
    status: 'loading' | 'ready' | 'error';
    /** The last event the server sent; null until the first answer. */
    event: PublicEvent | null;
    registration: LifecycleState;
    raffle: LifecycleState;
}

const LOADING: CurrentEvent = { status: 'loading', event: null, registration: 'closed', raffle: 'closed' };

let snapshot: CurrentEvent = LOADING;
let inFlight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function publish(next: CurrentEvent) {
    snapshot = next;
    listeners.forEach(l => l());
}

/** Fetches the event; concurrent callers share one request. */
export function refreshCurrentEvent(): Promise<void> {
    inFlight ??= publicApi.events.current()
        .then(({ event }) => publish({ status: 'ready', event, registration: stateOf(event, 'registration'), raffle: stateOf(event, 'raffle') }))
        // Keep showing the last good answer if a refetch fails; with none, stay closed.
        .catch(() => { if (!snapshot.event) publish({ ...LOADING, status: 'error' }); })
        .finally(() => { inFlight = null; });
    return inFlight;
}

/** The cached answer, without subscribing. */
export const getCurrentEvent = (): CurrentEvent => snapshot;

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}

let focusListeners = 0;
const onFocus = () => { void refreshCurrentEvent(); };

export function useCurrentEvent(): CurrentEvent {
    const current = useSyncExternalStore(subscribe, getCurrentEvent);

    useEffect(() => {
        if (snapshot.status === 'loading') void refreshCurrentEvent();
        if (focusListeners++ === 0) window.addEventListener('focus', onFocus);
        return () => {
            if (--focusListeners === 0) window.removeEventListener('focus', onFocus);
        };
    }, []);

    return current;
}

/** Test hook: forget the cached event. */
export function resetCurrentEventForTests() {
    snapshot = LOADING;
    inFlight = null;
}
