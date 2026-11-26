import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuPlus, LuTicket, LuHeart, LuTrophy } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import { usePortalData } from '../PortalData';
import { EntryCard } from '../EntryCard';
import { InstallCard } from '../InstallCard';
import { Callout, ScreenHeader } from '../ui';
import { NEXT_EVENT, countdown } from '../event';

function Countdown() {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        if (!NEXT_EVENT.date) return;
        const t = setInterval(() => setNow(Date.now()), 30_000);
        return () => clearInterval(t);
    }, []);

    const when = NEXT_EVENT.date
        ? new Date(NEXT_EVENT.date).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
        : 'Date to be announced';
    const c = NEXT_EVENT.date ? countdown(NEXT_EVENT.date, now) : null;

    return (
        <section className="rp-hero" aria-label="Next event">
            <p className="rp-hero-kicker">Next ride · {when}</p>
            <p className="rp-hero-name">{NEXT_EVENT.name}</p>
            {c && !c.done && (
                <div className="rp-count" role="timer" aria-label={`${c.days} days, ${c.hours} hours and ${c.minutes} minutes to go`}>
                    <div><b>{c.days}</b><span>days</span></div>
                    <div><b>{c.hours}</b><span>hrs</span></div>
                    <div><b>{c.minutes}</b><span>min</span></div>
                </div>
            )}
            {NEXT_EVENT.venue && <p className="rp-hero-venue">{NEXT_EVENT.venue}</p>}
        </section>
    );
}

const HomeScreen = () => {
    const { account } = useAuth();
    const { history, loading, error } = usePortalData();
    const entries = history?.registrations.filter(e => e.status !== 'CANCELLED') ?? [];
    const unpaid = entries.filter(e => e.status === 'UNPAID' && e.role === 'owner').length;

    return (
        <>
            <ScreenHeader title={`Hi, ${account?.firstName ?? ''}`} />
            <div className="rp-page">
                <Countdown />
                {unpaid > 0 && (
                    <Callout kind="warn">
                        <strong>{unpaid === 1 ? '1 entry is' : `${unpaid} entries are`} waiting for payment.</strong> Bibs are assigned once it's paid.
                    </Callout>
                )}
                {error && <Callout kind="error">{error}</Callout>}

                <div className="rp-split">
                    <section className="rp-stack" aria-labelledby="rp-my-entries">
                        <div className="rp-section-head">
                            <h2 id="rp-my-entries" className="rp-h2">My entries{history ? ` · ${history.year}` : ''}</h2>
                            <Link to="/account/entries" className="rp-linkbtn">See all</Link>
                        </div>
                        {!history && loading && <p className="rp-muted">Loading your entries…</p>}
                        {history && entries.length === 0 && (
                            <div className="rp-empty">
                                <p>You have no entries for {history.year} yet.</p>
                                <Link to="/register" className="rp-btn rp-btn--primary">Register for a ride</Link>
                            </div>
                        )}
                        {entries.map(e => <EntryCard key={e.groupId} entry={e} />)}
                    </section>

                    <div className="rp-stack">
                        <section className="rp-stack" aria-labelledby="rp-quick">
                            <h2 id="rp-quick" className="rp-h2">Quick actions</h2>
                            <div className="rp-quick">
                                <Link to="/register"><LuPlus size={22} aria-hidden />Register</Link>
                                <Link to="/raffle/step/1"><LuTicket size={22} aria-hidden />Raffle</Link>
                                <Link to="/donate"><LuHeart size={22} aria-hidden />Donate</Link>
                                <Link to="/results"><LuTrophy size={22} aria-hidden />Results</Link>
                            </div>
                        </section>
                        <InstallCard />
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomeScreen;
