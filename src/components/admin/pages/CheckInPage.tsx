import { useState } from 'react';
import type { CheckInItem, CheckInRider } from '../../../adminTypes';
import { adminApi } from '../api/adminApi';
import { errorMessage } from '../api/http';
import { useDebounced } from '../hooks/useDebounced';
import { useLoad } from '../hooks/useLoad';
import { hasRole } from '../roles';
import { useAdminShell } from '../useAdminShell';
import { EmptyState, ErrorBanner } from '../ui/Feedback';
import PageHeader from '../ui/PageHeader';
import { cap } from '../ui/format';
import './checkIn.css';

const ITEMS: { item: CheckInItem; label: string; at: 'bibGivenAt' | 'tshirtGivenAt' | 'bikeGivenAt'; by: 'bibGivenBy' | 'tshirtGivenBy' | 'bikeGivenBy' }[] = [
    { item: 'bib', label: 'Bib', at: 'bibGivenAt', by: 'bibGivenBy' },
    { item: 'tshirt', label: 'T-shirt', at: 'tshirtGivenAt', by: 'tshirtGivenBy' },
    { item: 'bike', label: 'Hire bike', at: 'bikeGivenAt', by: 'bikeGivenBy' },
];

const time = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/** Race-day desk, made for a phone: find a rider by name, phone or bib; tick what they were given. */
export default function CheckInPage() {
    const { admin, year } = useAdminShell();
    const canMark = hasRole(admin, 'admin');
    const [query, setQuery] = useState('');
    const q = useDebounced(query.trim(), 300);
    const search = useLoad(() => (q.length >= 2 ? adminApi.checkIn.search(q, year) : Promise.resolve({ riders: [] as CheckInRider[] })), `${year}|${q}`, 'Search failed');
    const [overrides, setOverrides] = useState<Record<string, CheckInRider['checkIn']>>({});
    const [busy, setBusy] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const toggle = async (rider: CheckInRider, item: CheckInItem, given: boolean) => {
        setBusy(`${rider.id}:${item}`);
        setError(null);
        try {
            const { checkIn } = await adminApi.checkIn.mark(rider.id, item, given);
            setOverrides(o => ({ ...o, [rider.id]: checkIn }));
        } catch (e) {
            setError(errorMessage(e, 'Could not save. Try again.'));
        } finally {
            setBusy(null);
        }
    };

    const riders = search.data?.riders ?? [];

    return (
        <div className="ci-page">
            <PageHeader eyebrow={`Race day ${year ?? ''}`} title="Check-in" />
            <input
                className="ad-input ci-search"
                type="search"
                inputMode="search"
                autoFocus
                placeholder="Name, phone or bib"
                aria-label="Search riders"
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
            {(error || search.error) && <ErrorBanner message={error ?? search.error ?? ''} actionLabel="Close" onAction={() => { setError(null); search.clearError(); }} />}
            {q.length < 2 ? <EmptyState>Type at least 2 letters or digits.</EmptyState>
                : !search.loading && riders.length === 0 ? <EmptyState>No paid rider matches “{q}”.</EmptyState>
                    : (
                        <ul className="ci-list">
                            {riders.map(r => {
                                const marks = r.id in overrides ? overrides[r.id] : r.checkIn;
                                return (
                                    <li key={r.id} className="ci-card" aria-label={`${cap(r.firstName)} ${cap(r.lastName)}`}>
                                        <div className="ci-head">
                                            <span className="ci-bib">{r.bibNumber ?? '—'}</span>
                                            <div>
                                                <div className="ci-name">{cap(r.firstName)} {cap(r.lastName)}</div>
                                                <div className="ad-feed-sub">{r.circuitId} · {r.category ?? 'Rider'}{r.teamName ? ` · ${r.teamName}` : ''} · T-shirt {r.tshirtSize ?? '—'}</div>
                                            </div>
                                        </div>
                                        <div className="ci-items">
                                            {ITEMS.filter(i => i.item !== 'bike' || r.bikeHire).map(i => {
                                                const at = marks?.[i.at];
                                                const label = at ? `${i.label} ✓` : `Give ${i.label.toLowerCase()}`;
                                                return (
                                                    <button
                                                        key={i.item}
                                                        className={`ci-item${at ? ' done' : ''}`}
                                                        disabled={!canMark || busy === `${r.id}:${i.item}`}
                                                        aria-pressed={!!at}
                                                        onClick={() => {
                                                            if (at && !window.confirm(`Take back the ${i.label.toLowerCase()} mark for ${cap(r.firstName)}?`)) return;
                                                            toggle(r, i.item, !at);
                                                        }}
                                                    >
                                                        <span>{label}</span>
                                                        {at && <small>{time(at)} · {marks?.[i.by]}</small>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
            {!canMark && <div className="ad-insight">Viewers can search; ticking items needs the Admin role.</div>}
        </div>
    );
}
