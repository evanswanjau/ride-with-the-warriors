import { useState } from 'react';
import type { AdminEvent, LifecycleState } from '../../../adminTypes';
import { adminApi } from '../api/adminApi';
import { errorMessage } from '../api/http';
import { useLoad } from '../hooks/useLoad';
import { hasRole } from '../roles';
import { useAdminShell } from '../useAdminShell';
import { EmptyState, ErrorBanner, LoadingOverlay, SuccessBanner, TableHead } from '../ui/Feedback';
import PageHeader from '../ui/PageHeader';
import { kes } from '../ui/format';
import EventEditor from './EventEditor';

const COLUMNS = ['Year', 'Name', 'Ride day', 'Registration', 'Raffle', 'Feedback', 'Raffle price', 'Bike hire', 'Rider limit', ''];
const STATE_CLASS: Record<LifecycleState, string> = { upcoming: 'pending', open: 'paid', closed: 'cancelled', finished: 'unpaid' };

function StatePill({ state }: { state?: LifecycleState }) {
    if (!state) return <>—</>;
    return <span className={`ad-badge ad-badge-${STATE_CLASS[state]}`}>{state}</span>;
}

/** Event years: dates, prices, rider limit; open and close registration, raffle and feedback; start next year. */
export default function EventsPage() {
    const { admin } = useAdminShell();
    const canEdit = hasRole(admin, 'super_admin');
    const list = useLoad(() => adminApi.events.list(), 'events', 'Failed to load events');
    const events = list.data?.events ?? [];
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [starting, setStarting] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);

    const selected: AdminEvent | undefined = events.find(e => e.year === selectedYear) ?? events.find(e => e.current) ?? events[0];
    const nextYear = (events[0]?.year ?? new Date().getFullYear()) + 1;

    const startNextYear = async () => {
        const ok = window.confirm(
            `Start ${nextYear}?\n\nThe website's current year moves to ${nextYear}. Circuits and prices are copied from ${events[0]?.year ?? 'the year before'}. ` +
            `Registration and the raffle stay closed until you open them.`,
        );
        if (!ok) return;
        setStarting(true);
        setError(null);
        try {
            await adminApi.events.create(nextYear);
            setNotice(`${nextYear} started. Set its dates, then open registration when ready.`);
            setSelectedYear(nextYear);
            list.reload();
        } catch (e) {
            setError(errorMessage(e, `Could not start ${nextYear}`));
        } finally {
            setStarting(false);
        }
    };

    return (
        <>
            {notice && <SuccessBanner message={notice} onClose={() => setNotice(null)} />}
            {(error || list.error) && <ErrorBanner message={error ?? list.error ?? ''} onAction={() => { setError(null); list.reload(); }} />}
            <PageHeader eyebrow="Configuration" title="Events" actions={canEdit
                ? <button className="ad-btn ad-btn-primary" onClick={startNextYear} disabled={starting || list.loading}>{starting ? 'Starting…' : `Start ${nextYear}`}</button>
                : undefined} />

            <div className="ad-panel">
                <div className="ad-panel-rel">
                    {list.loading && <LoadingOverlay />}
                    {!list.loading && events.length === 0 ? <EmptyState>No events yet.</EmptyState> : (
                        <div className="ad-table-wrap">
                            <table className="ad-table">
                                <TableHead columns={COLUMNS} />
                                <tbody>
                                    {events.map(e => (
                                        <tr key={e.year} className="ad-tr" style={e.year === selected?.year ? { background: 'var(--ad-raised)' } : undefined}>
                                            <td className="ad-td ad-mono">{e.year}{e.current ? ' ★' : ''}</td>
                                            <td className="ad-td">{e.name}</td>
                                            <td className="ad-td ad-mono">{e.date ?? '—'}</td>
                                            <td className="ad-td"><StatePill state={e.registrationState} /></td>
                                            <td className="ad-td"><StatePill state={e.raffleState} /></td>
                                            <td className="ad-td"><span className={`ad-badge ad-badge-${e.feedbackOpen ? 'paid' : 'pending'}`}>{e.feedbackOpen ? 'on' : 'off'}</span></td>
                                            <td className="ad-td">{kes(e.rafflePrice)}</td>
                                            <td className="ad-td">{kes(e.bikeHirePrice)}</td>
                                            <td className="ad-td ad-mono">{e.riderCap ?? 'No limit'}</td>
                                            <td className="ad-td" style={{ textAlign: 'right' }}>
                                                <button className="ad-page-btn" onClick={() => setSelectedYear(e.year)}>{canEdit ? 'Edit' : 'View'}</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Remounts with fresh values after every change, so a stale form never undoes Open now. */}
            {selected && <EventEditor key={JSON.stringify(selected)} event={selected} canEdit={canEdit} onSaved={m => { setNotice(m); list.reload(); }} />}
        </>
    );
}
