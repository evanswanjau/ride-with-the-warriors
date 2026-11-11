import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { LuBike, LuCreditCard, LuDownload, LuLock } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import { usePortalData } from '../PortalData';
import type { Entry, Rider } from '../types';
import { checkInPayload, circuitName, entrySubtitle, entryTitle, fmtDate, fmtKes, fullName, isPaid } from '../format';
import { Callout, ScreenHeader, StatusChip, errorMessage } from '../ui';

function BibCard({ entry, rider, year }: { entry: Entry; rider: Rider; year: number }) {
    const ready = isPaid(entry.status) && !!rider.bibNumber;
    if (!ready) {
        return (
            <div className="rp-bib rp-bib--pending">
                <div>
                    <p className="rp-bib-event">{circuitName(entry.circuitId)}{rider.category ? ` · ${rider.category}` : ''}</p>
                    <p className="rp-bib-pending">{entry.status === 'CANCELLED' ? 'Entry cancelled' : 'Bib assigned after payment'}</p>
                    <p className="rp-bib-name">{fullName(rider)}</p>
                </div>
                <span className="rp-bib-lock" aria-hidden><LuLock size={22} /></span>
            </div>
        );
    }
    return (
        <div className="rp-bib" data-bib={rider.bibNumber!} data-rider={fullName(rider)} data-category={rider.category ?? ''}>
            <div className="rp-bib-text">
                <p className="rp-bib-event">RWTW {year} · {circuitName(entry.circuitId)}</p>
                <p className="rp-bib-no" aria-label={`Bib number ${rider.bibNumber}`}>{rider.bibNumber}</p>
                <p className="rp-bib-name">{fullName(rider)}{rider.isCaptain ? ' (captain)' : ''}</p>
                <p className="rp-bib-meta">{rider.category ?? ''}{rider.category ? ' · ' : ''}Show this at check-in</p>
            </div>
            <QRCodeCanvas
                value={checkInPayload(year, rider)}
                size={192}
                marginSize={2}
                className="rp-bib-qr"
                role="img"
                aria-label={`Check-in QR code for ${fullName(rider)}`}
            />
        </div>
    );
}

/** M-Pesa payment for a bike booked after the entry was paid. */
function BikeHirePay({ bikeHireId, amount, onPaid }: { bikeHireId: string; amount: number; onPaid: () => void }) {
    const { apiFetch, account } = useAuth();
    const [phone, setPhone] = useState(account?.phone ? `0${account.phone.slice(3)}` : '');
    const [state, setState] = useState<'idle' | 'sending' | 'waiting' | 'error'>('idle');
    const [msg, setMsg] = useState('');

    const pay = async (e: React.FormEvent) => {
        e.preventDefault();
        setState('sending');
        setMsg('');
        const res = await apiFetch(`/me/bike-hire/${bikeHireId}/pay`, { method: 'POST', body: JSON.stringify({ phoneNumber: phone }) });
        if (!res.ok) {
            setState('error');
            setMsg(await errorMessage(res, 'Could not start the payment.'));
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
        setMsg("We haven't received the payment yet. Pull down to refresh in a minute.");
    };

    return (
        <form className="rp-bikepay" onSubmit={pay}>
            <label className="rp-label" htmlFor={`mpesa-${bikeHireId}`}>M-Pesa number</label>
            <div className="rp-inline">
                <input id={`mpesa-${bikeHireId}`} className="rp-input" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
                <button type="submit" className="rp-btn rp-btn--primary" disabled={state === 'sending' || state === 'waiting'}>
                    Pay {fmtKes(amount)}
                </button>
            </div>
            {msg && <p className={state === 'error' ? 'rp-error' : 'rp-muted rp-small'} role="status">{msg}</p>}
        </form>
    );
}

function BikeRow({ entry, rider, onChange }: { entry: Entry; rider: Rider; onChange: () => void }) {
    const { apiFetch } = useAuth();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const owner = entry.role === 'owner';
    const bike = rider.bikeHire;

    const hire = async () => {
        setBusy(true);
        setError('');
        const res = await apiFetch('/me/bike-hire', { method: 'POST', body: JSON.stringify({ registrationId: rider.id }) });
        setBusy(false);
        if (!res.ok) {
            setError(await errorMessage(res, 'Could not book the bike.'));
            return;
        }
        onChange();
    };

    let status: React.ReactNode;
    if (bike?.status === 'PAID') status = <StatusChip status="PAID" />;
    else if (bike && entry.status === 'UNPAID') status = <span className="rp-small rp-muted">Paid with the entry</span>;
    else if (bike) status = <StatusChip status="PENDING" />;
    else if (owner && entry.status !== 'CANCELLED') {
        status = (
            <button type="button" className="rp-btn rp-btn--quiet" disabled={busy} onClick={hire}>
                <LuBike size={18} aria-hidden /> {busy ? 'Booking…' : 'Hire a bike'}
            </button>
        );
    } else status = <span className="rp-small rp-muted">—</span>;

    return (
        <li className="rp-row">
            <div className="rp-row-main">
                <p className="rp-row-title">{fullName(rider)}</p>
                <p className="rp-row-sub">
                    {bike?.status === 'PAID' ? 'Bike hired · collect it at the start village' : bike ? `Bike booked · ${fmtKes(bike.amount)}` : 'Own bike'}
                </p>
            </div>
            {status}
            {bike?.status === 'PENDING' && owner && isPaid(entry.status) && (
                <div className="rp-row-full"><BikeHirePay bikeHireId={bike.id} amount={bike.amount} onPaid={onChange} /></div>
            )}
            {error && <p className="rp-error rp-row-full" role="alert">{error}</p>}
        </li>
    );
}

async function downloadConfirmation(entry: Entry, year: number) {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const green: [number, number, number] = [45, 106, 45];
    doc.setFillColor(...green);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(`RIDE WITH THE WARRIORS ${year}`, 14, 17);
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(14);
    doc.text('Entry confirmation', 14, 42);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`${entryTitle(entry)} · ${entrySubtitle(entry)}`, 14, 50);
    doc.text(`Status: ${isPaid(entry.status) ? 'Paid' : entry.status}${entry.totalAmount != null ? ` · ${fmtKes(entry.totalAmount)}` : ''} · Registered ${fmtDate(entry.createdAt)}`, 14, 57);

    let y = 70;
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.rp-bib[data-bib]'));
    for (const card of cards) {
        if (y > 250) { doc.addPage(); y = 20; }
        const canvas = card.querySelector('canvas');
        if (canvas) doc.addImage(canvas.toDataURL('image/png'), 'PNG', 14, y, 36, 36);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.text(card.dataset.bib ?? '', 56, y + 12);
        doc.setFontSize(12);
        doc.text(card.dataset.rider ?? '', 56, y + 21);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(card.dataset.category ?? '', 56, y + 28);
        y += 44;
    }
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text('Show the QR code at check-in with the ID or birth certificate the entry was made with.', 14, Math.min(y + 6, 285));
    doc.save(`rwtw-${year}-${entry.groupId.slice(0, 8)}.pdf`);
}

const EntryScreen = () => {
    const { groupId } = useParams();
    const { history, loading, reload } = usePortalData();
    const entry = history?.registrations.find(e => e.groupId === groupId);

    if (!history || !entry) {
        return (
            <>
                <ScreenHeader title="Entry" back="/account/entries" />
                <div className="rp-page">
                    {loading ? <p className="rp-muted">Loading…</p> : (
                        <div className="rp-empty">
                            <p>We couldn't find that entry for {history?.year ?? 'this year'}.</p>
                            <Link to="/account/entries" className="rp-btn rp-btn--quiet">Back to entries</Link>
                        </div>
                    )}
                </div>
            </>
        );
    }

    const unpaid = entry.status === 'UNPAID';
    const owner = entry.role === 'owner';
    const hasBibs = isPaid(entry.status) && entry.riders.some(r => r.bibNumber);

    return (
        <>
            <ScreenHeader title={entryTitle(entry)} back="/account/entries" />
            <div className="rp-page">
                <div className="rp-entry-head">
                    <p className="rp-entry-sub">{entrySubtitle(entry)} · Registered {fmtDate(entry.createdAt)}</p>
                    <StatusChip status={entry.status} />
                </div>

                <div className="rp-split">
                    <section className="rp-stack" aria-labelledby="rp-bibs">
                        <h2 id="rp-bibs" className="rp-h2">{entry.riders.length > 1 ? 'Bibs' : 'Bib'} &amp; check-in</h2>
                        {entry.riders.map(r => <BibCard key={r.id} entry={entry} rider={r} year={history.year} />)}
                    </section>

                    <div className="rp-stack">
                        <section className="rp-stack" aria-labelledby="rp-bikes">
                            <h2 id="rp-bikes" className="rp-h2">Bike hire</h2>
                            <ul className="rp-card rp-rows">
                                {entry.riders.map(r => <BikeRow key={r.id} entry={entry} rider={r} onChange={reload} />)}
                            </ul>
                        </section>

                        <section className="rp-stack" aria-labelledby="rp-payment">
                            <h2 id="rp-payment" className="rp-h2">Payment</h2>
                            <div className="rp-card rp-stack">
                                {unpaid && owner && entry.paymentRegistrationId ? (
                                    <>
                                        <Callout kind="warn">
                                            Not paid yet{entry.totalAmount != null ? `: ${fmtKes(entry.totalAmount)}` : ''}. Pay by M-Pesa to keep your places and get your bibs.
                                        </Callout>
                                        <Link to={`/payment/${entry.paymentRegistrationId}`} className="rp-btn rp-btn--primary rp-btn--block">
                                            <LuCreditCard size={18} aria-hidden /> Pay {entry.totalAmount != null ? fmtKes(entry.totalAmount) : 'now'}
                                        </Link>
                                    </>
                                ) : owner ? (
                                    <div className="rp-row rp-row--flat">
                                        <div className="rp-row-main">
                                            <p className="rp-row-title">{entry.totalAmount != null ? fmtKes(entry.totalAmount) : '—'}</p>
                                            <p className="rp-row-sub">Entry fee{entry.riders.some(r => r.bikeHire) ? ' incl. bike hire booked before payment' : ''}</p>
                                        </div>
                                        <StatusChip status={entry.status} />
                                    </div>
                                ) : (
                                    <p className="rp-muted rp-small">Paid by the person who registered you. Ask them for the receipt.</p>
                                )}
                            </div>
                        </section>

                        {hasBibs && (
                            <button type="button" className="rp-btn rp-btn--ghost rp-btn--block" onClick={() => downloadConfirmation(entry, history.year)}>
                                <LuDownload size={18} aria-hidden /> Download confirmation (PDF)
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default EntryScreen;
