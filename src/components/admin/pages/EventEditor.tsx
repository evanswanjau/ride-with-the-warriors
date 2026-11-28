import { useState, type ReactNode } from 'react';
import type { AdminEvent, EventWindow } from '../../../adminTypes';
import { adminApi } from '../api/adminApi';
import { errorMessage } from '../api/http';
import { ErrorBanner } from '../ui/Feedback';
import { changesFrom, formProblem, formValues, type EventFormValues } from './eventForm';

interface EventEditorProps {
    event: AdminEvent;
    /** Super admins change events; everyone else sees the values only. */
    canEdit: boolean;
    /** Called with a message after a change; the page reloads the events and shows it. */
    onSaved: (message: string) => void;
}

const WINDOWS: { what: EventWindow; label: string; open: (e: AdminEvent) => boolean }[] = [
    { what: 'registration', label: 'Registration', open: e => e.registrationState === 'open' },
    { what: 'raffle', label: 'Raffle', open: e => e.raffleState === 'open' },
    { what: 'feedback', label: 'Feedback', open: e => !!e.feedbackOpen },
];

function Field({ label, children }: { label: string; children: ReactNode }) {
    return <div className="ad-m-field"><div className="ad-m-label">{label}</div>{children}</div>;
}

/** Edit form and Open now / Close now buttons for one event year. */
export default function EventEditor({ event, canEdit, onSaved }: EventEditorProps) {
    const [values, setValues] = useState<EventFormValues>(() => formValues(event));
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const set = (key: keyof EventFormValues) => (e: { target: { value: string } }) => setValues(v => ({ ...v, [key]: e.target.value }));
    const input = (key: keyof EventFormValues, type = 'text', extra: Record<string, string> = {}) => (
        <input className="ad-input" type={type} value={values[key]} onChange={set(key)} disabled={!canEdit || busy} aria-label={key} {...extra} />
    );

    const run = async (action: () => Promise<unknown>, done: string, failure: string) => {
        setBusy(true);
        setError(null);
        try {
            await action();
            onSaved(done);
        } catch (e) {
            setError(errorMessage(e, failure));
        } finally {
            setBusy(false);
        }
    };

    const save = () => {
        const problem = formProblem(values);
        if (problem) { setError(problem); return; }
        run(() => adminApi.events.update(event.year, changesFrom(values)), `${event.year} saved.`, 'Could not save the event');
    };

    const toggle = (what: EventWindow, label: string, isOpen: boolean) => {
        const action = isOpen ? 'close' : 'open';
        const question = isOpen
            ? `Close ${label.toLowerCase()} for ${event.year} now? The website changes straight away.`
            : `Open ${label.toLowerCase()} for ${event.year} now? The website changes straight away.`;
        if (!window.confirm(question)) return;
        run(() => adminApi.events.setWindow(event.year, what, action), `${label} ${isOpen ? 'closed' : 'opened'}.`, `Could not ${action} ${label.toLowerCase()}`);
    };

    return (
        <div className="ad-panel">
            <div className="ad-panel-head">
                <div>
                    <div className="ad-panel-title">{event.year}{event.current ? ' · current event' : ''}</div>
                    <div className="ad-panel-val">{event.name}</div>
                </div>
                {canEdit && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {WINDOWS.filter(w => w.what === 'feedback' || event.current).map(w => {
                            const isOpen = w.open(event);
                            return (
                                <button key={w.what} className={`ad-btn ${isOpen ? 'ad-btn-ghost' : 'ad-btn-primary'}`} disabled={busy} onClick={() => toggle(w.what, w.label, isOpen)}>
                                    {isOpen ? 'Close' : 'Open'} {w.label.toLowerCase()} now
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
            <div className="ad-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {error && <ErrorBanner message={error} actionLabel="Close" onAction={() => setError(null)} />}
                <div className="ad-m-grid">
                    <Field label="Name">{input('name')}</Field>
                    <Field label="Ride day">{input('date', 'date')}</Field>
                    <Field label="Place">{input('location')}</Field>
                    <Field label="Rider limit (empty = no limit)">{input('riderCap', 'number', { min: '1' })}</Field>
                    <Field label="Registration opens">{input('registrationOpensAt', 'datetime-local')}</Field>
                    <Field label="Registration closes">{input('registrationClosesAt', 'datetime-local')}</Field>
                    <Field label="Raffle opens">{input('raffleOpensAt', 'datetime-local')}</Field>
                    <Field label="Raffle closes">{input('raffleClosesAt', 'datetime-local')}</Field>
                    <Field label="Feedback opens">{input('feedbackOpensAt', 'datetime-local')}</Field>
                    <Field label="Feedback closes (empty = until switched off)">{input('feedbackClosesAt', 'datetime-local')}</Field>
                    <Field label="Raffle ticket price (KES)">{input('rafflePrice', 'number', { min: '0' })}</Field>
                    <Field label="Bike hire price (KES)">{input('bikeHirePrice', 'number', { min: '0' })}</Field>
                    <Field label="Hire bikes available (empty = no limit)">{input('bikeStock', 'number', { min: '0' })}</Field>
                </div>
                {canEdit && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="ad-btn ad-btn-primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : `Save ${event.year}`}</button>
                    </div>
                )}
                {!canEdit && <div className="ad-insight">Only a super admin can change events.</div>}
            </div>
        </div>
    );
}
