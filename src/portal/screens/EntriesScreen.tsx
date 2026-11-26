import { Link } from 'react-router-dom';
import { usePortalData } from '../PortalData';
import { EntryCard, YearSwitch } from '../EntryCard';
import { Callout, ScreenHeader } from '../ui';
import { fmtKes, isPaid } from '../format';

const EntriesScreen = () => {
    const { history, year, setYear, loading, error } = usePortalData();
    const entries = history?.registrations ?? [];
    const riders = entries.reduce((n, e) => n + e.riders.length, 0);
    const paid = entries.filter(e => isPaid(e.status) && e.totalAmount != null).reduce((n, e) => n + (e.totalAmount ?? 0), 0);

    return (
        <>
            <ScreenHeader title="Entries" />
            <div className="rp-page">
                {history && <YearSwitch years={history.years} year={year} onChange={setYear} />}
                {error && <Callout kind="error">{error}</Callout>}
                {!history && loading && <p className="rp-muted">Loading your entries…</p>}
                {history && (
                    <p className="rp-muted rp-small" aria-live="polite">
                        RWTW {history.year} · {entries.length} {entries.length === 1 ? 'entry' : 'entries'} · {riders} {riders === 1 ? 'rider' : 'riders'}
                        {paid > 0 && ` · ${fmtKes(paid)} paid`}
                    </p>
                )}
                {history && entries.length === 0 && (
                    <div className="rp-empty">
                        <p>No entries for {history.year}.</p>
                        <Link to="/register" className="rp-btn rp-btn--primary">Register for a ride</Link>
                    </div>
                )}
                <div className="rp-grid">
                    {entries.map(e => <EntryCard key={e.groupId} entry={e} />)}
                </div>
            </div>
        </>
    );
};

export default EntriesScreen;
