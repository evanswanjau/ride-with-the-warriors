import { Link } from 'react-router-dom';
import { LuChevronRight } from 'react-icons/lu';
import { usePortalData } from '../PortalData';
import { YearSwitch } from '../EntryCard';
import { Callout, ScreenHeader } from '../ui';
import { circuitName, fmtDob, fullName, initials } from '../format';
import type { Entry, Rider } from '../types';

export interface RiderWithEntry { rider: Rider; entry: Entry }

/** Every rider on this year's entries (all riders for entries you made, yourself for others). */
// eslint-disable-next-line react-refresh/only-export-components
export function ridersOf(entries: Entry[]): RiderWithEntry[] {
    return entries.flatMap(entry => entry.riders.map(rider => ({ rider, entry })));
}

const RidersScreen = () => {
    const { history, year, setYear, loading, error } = usePortalData();
    const riders = history ? ridersOf(history.registrations) : [];

    return (
        <>
            <ScreenHeader title="My riders" />
            <div className="rp-page">
                <p className="rp-muted rp-small">
                    Everyone on your {history?.year ?? ''} entries. Keep their details right: they're checked against ID at check-in.
                </p>
                {history && <YearSwitch years={history.years} year={year} onChange={setYear} />}
                {error && <Callout kind="error">{error}</Callout>}
                {!history && loading && <p className="rp-muted">Loading…</p>}
                {history && riders.length === 0 && (
                    <div className="rp-empty">
                        <p>No riders for {history.year} yet. Riders appear here when you register them.</p>
                        <Link to="/register" className="rp-btn rp-btn--primary">Register for a ride</Link>
                    </div>
                )}
                <ul className="rp-grid rp-grid--tight">
                    {riders.map(({ rider, entry }) => (
                        <li key={rider.id}>
                            <Link to={`/account/riders/${encodeURIComponent(rider.id)}`} className="rp-rider">
                                <span className="rp-av rp-av--lg" aria-hidden>{initials(rider)}</span>
                                <span className="rp-rider-main">
                                    <span className="rp-rider-name">{fullName(rider)}</span>
                                    <span className="rp-rider-sub">
                                        {circuitName(entry.circuitId)}{rider.category ? ` · ${rider.category}` : ''} · Born {fmtDob(rider.dob)}
                                    </span>
                                </span>
                                <LuChevronRight size={22} aria-hidden />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default RidersScreen;
