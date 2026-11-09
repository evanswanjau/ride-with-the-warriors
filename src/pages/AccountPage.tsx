import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/account.css';

interface Rider {
    id: string;
    firstName: string;
    lastName: string;
    category: string | null;
    bibNumber: string | null;
    status: string;
    isCaptain: boolean;
    tshirtSize: string | null;
    bikeHire: { id: string; status: string; amount: number } | null;
}

interface RegistrationGroup {
    groupId: string;
    role: 'owner' | 'participant';
    type: 'individual' | 'team' | 'family';
    circuitId: string;
    teamName: string | null;
    status: string;
    paymentRegistrationId: string | null;
    totalAmount: number | null;
    createdAt: string;
    riders: Rider[];
}

interface History {
    year: number;
    years: number[];
    registrations: RegistrationGroup[];
    raffleTickets: { id: string; ticketNumber: string | null; status: string; createdAt: string }[];
    donations: { id: string; amount: number; status: string; createdAt: string }[];
}

const PAID = ['PAID', 'CONFIRMED', 'COMPLEMENTARY'];
const fmtKes = (n: number) => `KES ${n.toLocaleString('en-KE')}`;
const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
const circuitName = (c: string) => c.charAt(0).toUpperCase() + c.slice(1);

function StatusBadge({ status }: { status: string }) {
    const kind = PAID.includes(status) ? 'paid' : status === 'UNPAID' || status === 'PENDING' ? 'unpaid' : 'other';
    const label = status === 'COMPLEMENTARY' ? 'Complimentary' : status.charAt(0) + status.slice(1).toLowerCase();
    return <span className={`acct-badge acct-badge--${kind}`}>{label}</span>;
}

function groupTitle(g: RegistrationGroup) {
    if (g.type === 'team') return g.teamName || 'Team';
    if (g.type === 'family') return 'Family registration';
    return `${g.riders[0]?.firstName ?? ''} ${g.riders[0]?.lastName ?? ''}`.trim();
}

/** Pay for a bike hired after the registration was paid. */
function BikeHirePay({ bikeHireId, amount, onPaid }: { bikeHireId: string; amount: number; onPaid: () => void }) {
    const { apiFetch, account } = useAuth();
    const [phone, setPhone] = useState(account?.phone ? `0${account.phone.slice(3)}` : '');
    const [state, setState] = useState<'idle' | 'sending' | 'waiting' | 'error'>('idle');
    const [msg, setMsg] = useState('');

    const pay = async () => {
        setState('sending');
        setMsg('');
        const res = await apiFetch(`/me/bike-hire/${bikeHireId}/pay`, { method: 'POST', body: JSON.stringify({ phoneNumber: phone }) });
        const data = await res.json();
        if (!res.ok) {
            setState('error');
            setMsg(data?.error?.message || 'Could not start the payment.');
            return;
        }
        setState('waiting');
        setMsg('Check your phone and enter your M-Pesa PIN.');
        for (let i = 0; i < 20; i++) {
            await new Promise(r => setTimeout(r, 3000));
            const s = await apiFetch(`/me/bike-hire/${bikeHireId}`);
            if (s.ok && (await s.json()).bikeHire.status === 'PAID') {
                onPaid();
                return;
            }
        }
        setState('error');
        setMsg('We have not received the payment yet. Refresh this page in a minute.');
    };

    return (
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <input className="acct-input" style={{ maxWidth: 200, padding: '8px 10px' }} value={phone} onChange={e => setPhone(e.target.value)} placeholder="M-Pesa number" aria-label="M-Pesa phone number" />
            <button className="shimmer-btn shimmer-btn--primary" style={{ border: 'none', cursor: 'pointer', padding: '8px 14px' }} disabled={state === 'sending' || state === 'waiting'} onClick={pay}>
                Pay {fmtKes(amount)}
            </button>
            {msg && <span className={state === 'error' ? 'acct-error' : 'acct-muted'}>{msg}</span>}
        </div>
    );
}

const AccountPage = () => {
    const { account, apiFetch, signOut } = useAuth();
    const navigate = useNavigate();
    const [year, setYear] = useState<number | null>(null);
    const [history, setHistory] = useState<History | null>(null);
    const [error, setError] = useState('');
    const [busyRider, setBusyRider] = useState<string | null>(null);

    const load = useCallback(async (y: number | null) => {
        const res = await apiFetch(`/me/history${y ? `?year=${y}` : ''}`);
        if (!res.ok) {
            setError('Could not load your history. Please refresh the page.');
            return;
        }
        const data: History = await res.json();
        setError('');
        setHistory(data);
        setYear(data.year);
    }, [apiFetch]);

    // Initial load (state is only set in the async callback).
    useEffect(() => {
        let cancelled = false;
        apiFetch('/me/history').then(async res => {
            if (cancelled) return;
            if (!res.ok) { setError('Could not load your history. Please refresh the page.'); return; }
            const data: History = await res.json();
            if (cancelled) return;
            setHistory(data);
            setYear(data.year);
        }).catch(() => { if (!cancelled) setError('Could not load your history. Please refresh the page.'); });
        return () => { cancelled = true; };
    }, [apiFetch]);

    const hireBike = async (registrationId: string) => {
        setBusyRider(registrationId);
        const res = await apiFetch('/me/bike-hire', { method: 'POST', body: JSON.stringify({ registrationId }) });
        const data = await res.json();
        setBusyRider(null);
        if (!res.ok) {
            setError(data?.error?.message || 'Could not book the bike.');
            return;
        }
        load(year);
    };

    if (!account) return null;

    return (
        <div className="acct-page">
            <div className="acct-wrap acct-wrap--wide">
                <div className="acct-head">
                    <div>
                        <div className="acct-eyebrow">My account</div>
                        <h1 className="acct-title">Hi, {account.firstName}</h1>
                        <p className="acct-muted" style={{ margin: 0 }}>
                            {[account.email, account.phone && `+${account.phone}`].filter(Boolean).join(' · ')}
                        </p>
                    </div>
                    <div className="acct-actions">
                        {history && history.years.length > 0 && (
                            <div className="acct-years" role="group" aria-label="Event year">
                                {history.years.map(y => (
                                    <button key={y} className="acct-year" aria-pressed={y === year} onClick={() => load(y)}>RWTW {y}</button>
                                ))}
                            </div>
                        )}
                        <button className="acct-link" onClick={async () => { await signOut(); navigate('/'); }}>Log out</button>
                    </div>
                </div>

                {error && <p className="acct-error" role="alert" style={{ marginBottom: '1.5rem' }}>{error}</p>}
                {!history && !error && <p className="acct-muted">Loading your history…</p>}

                {history && (
                    <>
                        <section className="acct-section">
                            <h2 className="acct-section-title">Registrations · RWTW {history.year}</h2>
                            {history.registrations.length === 0 && (
                                <div className="acct-empty acct-muted">No registrations for {history.year}.</div>
                            )}
                            {history.registrations.map(g => {
                                const unpaid = g.status === 'UNPAID';
                                return (
                                    <article key={g.groupId} className="acct-card">
                                        <div className="acct-card-head">
                                            <div>
                                                <h3 className="acct-card-title">{groupTitle(g)}</h3>
                                                <span className="acct-muted">
                                                    {circuitName(g.circuitId)} circuit · {g.type}
                                                    {g.role === 'participant' && ' · registered by someone else'}
                                                    {' · '}{fmtDate(g.createdAt)}
                                                </span>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <StatusBadge status={g.status} />
                                                {g.totalAmount != null && <div className="acct-muted" style={{ marginTop: 6 }}>{fmtKes(g.totalAmount)}</div>}
                                            </div>
                                        </div>

                                        <table className="acct-riders">
                                            <thead>
                                                <tr><th>Rider</th><th>Category</th><th>Bib</th><th>Bike hire</th></tr>
                                            </thead>
                                            <tbody>
                                                {g.riders.map(rd => (
                                                    <tr key={rd.id}>
                                                        <td>{rd.firstName} {rd.lastName}{rd.isCaptain && <span className="acct-muted"> (captain)</span>}</td>
                                                        <td data-hide-mobile>{rd.category ?? '—'}</td>
                                                        <td>
                                                            {rd.bibNumber
                                                                ? <span className="acct-bib">{rd.bibNumber}</span>
                                                                : <span className="acct-bib acct-bib--pending">Assigned after payment</span>}
                                                        </td>
                                                        <td data-hide-mobile>
                                                            {rd.bikeHire ? (
                                                                <>
                                                                    <StatusBadge status={rd.bikeHire.status} />
                                                                    {rd.bikeHire.status === 'PENDING' && !unpaid && g.role === 'owner' && (
                                                                        <BikeHirePay bikeHireId={rd.bikeHire.id} amount={rd.bikeHire.amount} onPaid={() => load(year)} />
                                                                    )}
                                                                </>
                                                            ) : g.role === 'owner' && g.status !== 'CANCELLED' ? (
                                                                <button className="acct-link" disabled={busyRider === rd.id} onClick={() => hireBike(rd.id)}>Hire a bike</button>
                                                            ) : '—'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {unpaid && g.role === 'owner' && g.paymentRegistrationId && (
                                            <div className="acct-actions" style={{ marginTop: 14 }}>
                                                <Link to={`/payment/${g.paymentRegistrationId}`} className="shimmer-btn shimmer-btn--primary">
                                                    Pay {g.totalAmount != null ? fmtKes(g.totalAmount) : 'now'}
                                                </Link>
                                                <span className="acct-muted">Bib numbers are assigned once payment is received.</span>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </section>

                        <section className="acct-section">
                            <h2 className="acct-section-title">Raffle tickets</h2>
                            {history.raffleTickets.length === 0 ? (
                                <div className="acct-empty acct-muted">No raffle tickets for {history.year}.</div>
                            ) : (
                                <>
                                    <div className="acct-tickets">
                                        {history.raffleTickets.map(t => (
                                            <div key={t.id} className="acct-ticket">
                                                {t.ticketNumber
                                                    ? <div className="acct-bib">{t.ticketNumber}</div>
                                                    : <div className="acct-bib acct-bib--pending">Number after payment</div>}
                                                <div style={{ marginTop: 6 }}><StatusBadge status={t.status} /></div>
                                            </div>
                                        ))}
                                    </div>
                                    {history.raffleTickets.some(t => t.status === 'UNPAID') && (
                                        <div className="acct-actions" style={{ marginTop: 14 }}>
                                            <Link to={`/raffle/payment/bulk?ids=${history.raffleTickets.filter(t => t.status === 'UNPAID').map(t => t.id).join(',')}`} className="shimmer-btn shimmer-btn--primary">
                                                Pay for unpaid tickets
                                            </Link>
                                        </div>
                                    )}
                                </>
                            )}
                        </section>

                        <section className="acct-section">
                            <h2 className="acct-section-title">Donations</h2>
                            {history.donations.length === 0 ? (
                                <div className="acct-empty acct-muted">No donations for {history.year}.</div>
                            ) : (
                                history.donations.map(d => (
                                    <div key={d.id} className="acct-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>{fmtKes(d.amount)} <span className="acct-muted">· {fmtDate(d.createdAt)}</span></span>
                                        <StatusBadge status={d.status} />
                                    </div>
                                ))
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

export default AccountPage;
