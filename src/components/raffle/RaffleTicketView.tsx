import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import {
    AiOutlineArrowLeft,
    AiOutlineCheck,
    AiOutlineShareAlt,
    AiOutlineHourglass,
    AiOutlineCheckCircle,
    AiOutlineDownload,
} from 'react-icons/ai';
import logo from '../../assets/images/logo.png';

interface RaffleTicketViewProps {
    ticket: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string | null;
        idNumber: string;
        gender: string;
        status: string;
        createdAt: string;
    };
    onBack?: () => void;
}

const RaffleTicketView = ({ ticket, onBack }: RaffleTicketViewProps) => {
    const [copySuccess, setCopySuccess] = useState(false);
    const eventDate = '05 July 2026';
    const isPaid = ticket.status === 'PAID' || ticket.status === 'CONFIRMED';

    const handleDownloadPDF = async () => {
        const ticketElement = document.getElementById('raffle-ticket-container');
        if (!ticketElement) return;

        try {
            const dataUrl = await toPng(ticketElement, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
            });

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 10;
            const imgWidth = pageWidth - (margin * 2);

            const img = new Image();
            img.src = dataUrl;
            await new Promise((resolve) => { img.onload = resolve; });

            const imgHeight = (img.height * imgWidth) / img.width;
            pdf.addImage(dataUrl, 'PNG', margin, margin, imgWidth, imgHeight);
            pdf.save(`RWTW_Raffle_Ticket_${ticket.id}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: 'RWTW Raffle Ticket',
            text: `Check out my raffle ticket for Ride With The Warriors 2026 - ${ticket.id}`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <div className="selection:bg-primary selection:text-white font-sans print:p-0 print:bg-white animate-in fade-in duration-500">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

                :root, [data-theme="dark"] {
                    --pv-bg:          #0a0a0a;
                    --pv-card:        #141414;
                    --pv-border:      rgba(255,255,255,0.07);
                    --pv-border-2:    rgba(255,255,255,0.13);
                    --pv-text-1:      #ffffff;
                    --pv-text-2:      rgba(255,255,255,0.58);
                    --pv-text-3:      rgba(255,255,255,0.32);
                    --pv-divider:     rgba(255,255,255,0.05);
                    --tk-bg:          #ffffff;
                    --tk-alt:         #f8f8f8;
                    --tk-border:      #e5e5e5;
                    --tk-text-1:      #111111;
                    --tk-text-3:      #999999;
                }
                [data-theme="light"] {
                    --pv-bg:          #f5f2eb;
                    --pv-card:        #ffffff;
                    --pv-border:      rgba(0,0,0,0.09);
                    --pv-border-2:    rgba(0,0,0,0.15);
                    --pv-text-1:      #111111;
                    --pv-text-2:      rgba(20,20,20,0.60);
                    --pv-text-3:      rgba(20,20,20,0.38);
                    --pv-divider:     rgba(0,0,0,0.05);
                }

                .pv-label-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
                .pv-label-line { height: 1px; width: 32px; background: var(--color-primary); flex-shrink: 0; }
                .pv-eyebrow {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.62rem; font-weight: 700;
                    letter-spacing: 0.26em; text-transform: uppercase;
                    color: var(--color-primary-light);
                }

                .pv-topbar {
                    display: flex; flex-direction: column; gap: 16px;
                    margin-bottom: 28px;
                }
                @media (min-width: 640px) {
                    .pv-topbar { flex-direction: row; align-items: center; justify-content: space-between; }
                }

                .pv-back-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: none; border: none; cursor: pointer;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.75rem; font-weight: 700;
                    letter-spacing: 0.16em; text-transform: uppercase;
                    color: var(--pv-text-3);
                    transition: color 0.2s;
                }
                .pv-back-btn:hover { color: var(--color-primary-light); }

                .pv-action-btn {
                    position: relative; overflow: hidden;
                    display: inline-flex; align-items: center; gap: 7px;
                    padding: 10px 18px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.72rem; font-weight: 800;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    border: none; cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
                }
                .pv-action-btn.ghost {
                    background: var(--pv-card);
                    border: 1px solid var(--pv-border-2);
                    color: var(--pv-text-2);
                }
                .pv-action-btn.ghost:hover { border-color: var(--color-primary); color: var(--color-primary-light); }
                .pv-action-btn.primary {
                    background: var(--color-primary); color: #fff;
                }
                .pv-action-btn.primary:hover { box-shadow: 0 8px 24px rgba(45,106,45,0.35); background: var(--color-primary-dark); }

                #raffle-ticket-container {
                    background: var(--tk-bg);
                    border: 1px solid var(--tk-border);
                    overflow: hidden;
                    display: flex; flex-direction: column;
                    position: relative;
                    margin-bottom: 16px;
                    clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%);
                }
                @media (min-width: 1024px) {
                    #raffle-ticket-container { flex-direction: row; }
                }

                .tk-main {
                    flex: 3;
                    padding: 36px 40px;
                    display: flex; flex-direction: column; justify-content: space-between;
                    border-bottom: 1px solid var(--tk-border);
                }
                @media (min-width: 1024px) {
                    .tk-main { border-bottom: none; border-right: 1px solid var(--tk-border); }
                }

                .tk-logo-group { display: flex; align-items: center; gap: 12px; }
                .tk-logo-box {
                    width: 40px; height: 40px; flex-shrink: 0; overflow: hidden;
                    display: flex; align-items: center; justify-content: center;
                    background: var(--tk-alt);
                    border: 1px solid var(--tk-border);
                    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
                }
                .tk-logo-box img { width: 28px; height: 28px; object-fit: contain; }
                .tk-logo-title {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 1rem; font-weight: 900;
                    letter-spacing: 0.08em; text-transform: uppercase;
                    color: var(--tk-text-1); line-height: 1.1;
                }
                .tk-logo-sub {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.58rem; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase;
                    color: var(--tk-text-3); margin-top: 3px;
                }

                .tk-pass-id-block { text-align: right; }
                .tk-pass-id-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.58rem; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase;
                    color: var(--tk-text-3); margin-bottom: 4px;
                }
                .tk-pass-id {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 700;
                    color: var(--tk-text-1); line-height: 1;
                }

                .tk-name-block { margin-bottom: 20px; }
                .tk-name-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.58rem; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase;
                    color: var(--tk-text-3); margin-bottom: 6px;
                }
                .tk-name {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(2.4rem, 6vw, 3.8rem);
                    letter-spacing: 0.03em; line-height: 0.9;
                    color: var(--tk-text-1); text-transform: uppercase;
                }
                .tk-badge {
                    display: inline-block; margin-top: 12px;
                    padding: 4px 12px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.6rem; font-weight: 800;
                    letter-spacing: 0.18em; text-transform: uppercase;
                    background: var(--color-primary); color: #fff;
                    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
                }

                .tk-meta-strip {
                    padding-top: 20px;
                    border-top: 1px solid var(--tk-border);
                    display: flex; flex-wrap: wrap; gap: 0;
                }
                .tk-meta-cell {
                    flex: 1; min-width: 110px;
                    padding: 12px 0;
                    border-right: 1px solid var(--tk-border);
                    padding-right: 20px;
                }
                .tk-meta-cell:last-child { border-right: none; }
                .tk-meta-cell:not(:first-child) { padding-left: 20px; }
                .tk-meta-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.58rem; font-weight: 700;
                    letter-spacing: 0.2em; text-transform: uppercase;
                    color: var(--tk-text-3); margin-bottom: 5px;
                }
                .tk-meta-value {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.85rem; font-weight: 800;
                    letter-spacing: 0.06em; text-transform: uppercase;
                    color: var(--tk-text-1);
                }

                .tk-sidebar {
                    width: 100%;
                    padding: 28px 32px;
                    background: var(--tk-alt);
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: space-between; gap: 20px;
                }
                @media (min-width: 1024px) { .tk-sidebar { width: 260px; flex-shrink: 0; } }

                .tk-status {
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    padding: 9px 20px; width: 100%;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.72rem; font-weight: 800;
                    letter-spacing: 0.18em; text-transform: uppercase;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
                }
                .tk-status.paid { background: rgba(45,106,45,0.1); border: 1px solid rgba(45,106,45,0.25); color: #1e4d1e; }
                .tk-status.pending { background: rgba(180,120,0,0.08); border: 1px solid rgba(180,120,0,0.22); color: #92400e; }

                .tk-qr-box {
                    padding: 12px; background: #fff;
                    border: 1px solid var(--tk-border);
                    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
                }

                .pv-details-card {
                    background: var(--pv-card);
                    border: 1px solid var(--pv-border);
                    padding: 44px 40px;
                    clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%);
                    margin-top: 32px;
                }

                .pv-section-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.6rem; letter-spacing: 0.03em;
                    color: var(--pv-text-1); margin-bottom: 24px;
                }

                .pv-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
                .pv-field-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.62rem; font-weight: 700;
                    letter-spacing: 0.2em; text-transform: uppercase;
                    color: var(--pv-text-3); margin-bottom: 5px;
                }
                .pv-field-value { font-size: 0.9rem; font-weight: 600; color: var(--pv-text-1); word-break: break-all; }
                .pv-field-value.accent { color: var(--color-primary-light); }
                .pv-field-value.mono { font-family: 'JetBrains Mono', monospace; }

                .pv-line-item {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 12px 0;
                    border-bottom: 1px solid var(--pv-divider);
                    font-size: 0.88rem; color: var(--pv-text-2);
                }
                .pv-total-row {
                    display: flex; align-items: center; justify-content: space-between;
                    padding-top: 16px; margin-top: 4px;
                    border-top: 1px solid var(--pv-border-2);
                }
                .pv-total-label {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.3rem; letter-spacing: 0.03em; color: var(--pv-text-1);
                }
                .pv-total-value {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.8rem; letter-spacing: 0.02em; color: var(--color-primary-light);
                }

                @media print {
                    nav, footer, .no-print, button { display: none !important; }
                    body { background: white !important; }
                    #raffle-ticket-container { flex-direction: row !important; }
                }
            `}</style>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Top bar */}
                <div className="pv-topbar no-print">
                    <button onClick={onBack} className="pv-back-btn">
                        <AiOutlineArrowLeft />
                        Back to Search
                    </button>
                    <div className="flex items-center gap-3">
                        <button onClick={handleShare} className="pv-action-btn ghost">
                            {copySuccess ? <AiOutlineCheck /> : <AiOutlineShareAlt />}
                            {copySuccess ? 'Copied!' : 'Share'}
                        </button>
                        <button onClick={handleDownloadPDF} className="pv-action-btn primary">
                            <AiOutlineDownload />
                            Download PDF
                        </button>
                    </div>
                </div>

                {/* Ticket */}
                <div id="raffle-ticket-container">
                    <div className="tk-main">
                        <div>
                            <div className="tk-top-row flex justify-between items-start">
                                <div className="tk-logo-group">
                                    <div className="tk-logo-box">
                                        <img src={logo} alt="RWTW" />
                                    </div>
                                    <div>
                                        <div className="tk-logo-title">Ride With The Warriors</div>
                                        <div className="tk-logo-sub">Official Raffle Pass 2026</div>
                                    </div>
                                </div>
                                <div className="tk-pass-id-block">
                                    <div className="tk-pass-id-label">Ticket ID</div>
                                    <div className="tk-pass-id">{ticket.id}</div>
                                </div>
                            </div>

                            <div className="tk-name-block mt-8">
                                <div className="tk-name-label">Participant Name</div>
                                <div className="tk-name">{ticket.firstName} {ticket.lastName}</div>
                                <div className="tk-badge">Raffle Entry Pass</div>
                            </div>
                        </div>

                        <div className="tk-meta-strip">
                            {[
                                { label: 'Event Date', value: eventDate },
                                { label: 'Location', value: 'Ulinzi Sports Complex' },
                                { label: 'Price', value: 'KES 1,000' },
                                { label: 'Entry Type', value: 'Raffle' },
                            ].map((m, i) => (
                                <div key={i} className="tk-meta-cell">
                                    <div className="tk-meta-label">{m.label}</div>
                                    <div className="tk-meta-value">{m.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="tk-sidebar">
                        <div className="w-full">
                            <div className="tk-pass-id-label text-center mb-2">Security Status</div>
                            <div className={`tk-status ${isPaid ? 'paid' : 'pending'}`}>
                                {isPaid ? <AiOutlineCheckCircle /> : <AiOutlineHourglass />}
                                {ticket.status}
                            </div>
                        </div>

                        <div className="tk-qr-box">
                            <QRCodeCanvas
                                value={`${window.location.origin}/raffle/profile/${ticket.id}`}
                                size={140} level="H" includeMargin={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Details card */}
                <div className="pv-details-card no-print">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <div className="pv-label-row">
                                <div className="pv-label-line" />
                                <span className="pv-eyebrow">Contact Information</span>
                            </div>
                            <div className="pv-section-title">Participant Details</div>

                            <div className="pv-field-grid">
                                <div className="pv-field">
                                    <div className="pv-field-label">Email Address</div>
                                    <div className="pv-field-value text-xs">{ticket.email}</div>
                                </div>
                                <div className="pv-field">
                                    <div className="pv-field-label">Primary Phone</div>
                                    <div className="pv-field-value">{ticket.phoneNumber || 'N/A'}</div>
                                </div>
                                <div className="pv-field">
                                    <div className="pv-field-label">National ID / Passport</div>
                                    <div className="pv-field-value mono uppercase">{ticket.idNumber}</div>
                                </div>
                                <div className="pv-field">
                                    <div className="pv-field-label">Gender</div>
                                    <div className="pv-field-value capitalize">{ticket.gender}</div>
                                </div>
                            </div>
                        </div>

                        <div className="md:border-l md:border-neutral-800 md:pl-12 dark:md:border-neutral-800 md:border-neutral-200">
                            <div className="pv-label-row">
                                <div className="pv-label-line" />
                                <span className="pv-eyebrow">Transaction</span>
                            </div>
                            <div className="pv-section-title">Summary</div>

                            <div className="pv-line-item">
                                <span>Raffle Entry Fee</span>
                                <span>KES 1,000</span>
                            </div>
                            <div className="pv-total-row">
                                <div className="pv-total-label">Total Amount</div>
                                <div className="pv-total-value">KES 1,000</div>
                            </div>
                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest text-center mt-6">
                                Purchased on {new Date(ticket.createdAt).toLocaleDateString('en-GB', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default RaffleTicketView;
