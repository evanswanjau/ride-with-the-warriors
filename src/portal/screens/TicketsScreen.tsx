import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { LuCreditCard, LuHeart, LuLock } from 'react-icons/lu';
import { usePortalData } from '../PortalData';
import { YearSwitch } from '../EntryCard';
import { Callout, ScreenHeader, StatusChip } from '../ui';
import { fmtDate, fmtKes, rafflePayload } from '../format';

const TicketsScreen = () => {
    const { history, year, setYear, loading, error } = usePortalData();
    const tickets = history?.raffleTickets ?? [];
    const donations = history?.donations ?? [];
    const unpaid = tickets.filter(t => t.status === 'UNPAID');

    return (
        <>
            <ScreenHeader title="Tickets" />
            <div className="rp-page">
                {history && <YearSwitch years={history.years} year={year} onChange={setYear} />}
                {error && <Callout kind="error">{error}</Callout>}
                {!history && loading && <p className="rp-muted">Loading…</p>}

                {history && (
                    <div className="rp-split">
                        <section className="rp-stack" aria-labelledby="rp-raffle">
                            <h2 id="rp-raffle" className="rp-h2">Raffle tickets</h2>
                            {tickets.length === 0 && <p className="rp-muted">No raffle tickets for {history.year}.</p>}
                            <ul className="rp-stack">
                                {tickets.map(t => (
                                    <li key={t.id} className="rp-ticket">
                                        {t.ticketNumber ? (
                                            <QRCodeSVG value={rafflePayload(t.ticketNumber)} size={72} marginSize={2} className="rp-ticket-qr" role="img" aria-label={`QR code for ticket ${t.ticketNumber}`} />
                                        ) : (
                                            <span className="rp-ticket-ph" aria-hidden><LuLock size={22} /></span>
                                        )}
                                        <div className="rp-ticket-main">
                                            <p className="rp-ticket-no">{t.ticketNumber ?? 'Number after payment'}</p>
                                            <p className="rp-muted rp-small">Bought {fmtDate(t.createdAt)}{t.paymentFailed ? ' · last payment failed' : ''}</p>
                                            <StatusChip status={t.status} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {unpaid.length > 0 && (
                                <Link to={`/raffle/payment/bulk?ids=${unpaid.map(t => t.id).join(',')}`} className="rp-btn rp-btn--primary rp-btn--block">
                                    <LuCreditCard size={18} aria-hidden /> Pay for {unpaid.length} {unpaid.length === 1 ? 'ticket' : 'tickets'}
                                </Link>
                            )}
                        </section>

                        <section className="rp-stack" aria-labelledby="rp-donations">
                            <h2 id="rp-donations" className="rp-h2">Donations</h2>
                            {donations.length === 0 ? (
                                <p className="rp-muted">No donations for {history.year}.</p>
                            ) : (
                                <ul className="rp-card rp-rows">
                                    {donations.map(d => (
                                        <li key={d.id} className="rp-row">
                                            <div className="rp-row-main">
                                                <p className="rp-row-title">{fmtKes(d.amount)}</p>
                                                <p className="rp-row-sub">{fmtDate(d.createdAt)}</p>
                                            </div>
                                            <StatusChip status={d.status} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <Link to="/donate" className="rp-btn rp-btn--ghost rp-btn--block">
                                <LuHeart size={18} aria-hidden /> Make a donation
                            </Link>
                        </section>
                    </div>
                )}
            </div>
        </>
    );
};

export default TicketsScreen;
