import type { ReactNode } from 'react';
import { useCurrentEvent } from '../../hooks/useCurrentEvent';
import EventStatePage from '../../pages/EventStatePage';
import type { GatedFlow } from '../../pages/eventStateCopy';

/**
 * Shows `children` (the form) only while the server says registration (or the raffle) is
 * open; otherwise the upcoming, closed or finished page. Organisers open and close them in
 * the admin, so no deploy is needed. If the server cannot be reached the page shows closed.
 */
const EventGate = ({ what, children }: { what: GatedFlow; children: ReactNode }) => {
    const current = useCurrentEvent();
    if (current.status === 'loading') return <div className="min-h-screen" role="status" aria-label="Loading" />;
    const state = what === 'registration' ? current.registration : current.raffle;
    if (state === 'open') return <>{children}</>;
    return <EventStatePage what={what} state={state} event={current.event} />;
};

export default EventGate;
