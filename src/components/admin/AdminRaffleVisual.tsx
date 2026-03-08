import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import logo from '../../assets/logos/logo.png';

interface RaffleTicket {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
}

interface AdminRaffleVisualProps {
    tickets: RaffleTicket[];
}

const AdminRaffleVisual: React.FC<AdminRaffleVisualProps> = ({ tickets }) => {
    return (
        <div className="ad-raffle-grid">
            <style>{`
                .ad-raffle-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 20px;
                    padding: 10px 0;
                }
                .ad-raffle-card {
                    background: var(--ad-surface);
                    border: 1px solid var(--ad-border);
                    height: 180px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    position: relative;
                    transition: border-color 0.2s, transform 0.2s;
                    clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%);
                }
                .ad-raffle-card:hover {
                    border-color: var(--ad-accent);
                    transform: translateY(-2px);
                }
                .ad-raffle-top {
                    padding: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    background: rgba(245, 158, 11, 0.03);
                    border-bottom: 1px dashed var(--ad-border);
                }
                .ad-raffle-id-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.55rem;
                    font-weight: 800;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: var(--ad-t3);
                    margin-bottom: 2px;
                }
                .ad-raffle-id {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--ad-accent);
                }
                .ad-raffle-logo {
                    height: 20px;
                    opacity: 0.6;
                }
                .ad-raffle-main {
                    flex: 1;
                    padding: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .ad-raffle-info {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .ad-raffle-name {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.4rem;
                    letter-spacing: 0.03em;
                    color: var(--ad-t1);
                    line-height: 1;
                }
                .ad-raffle-email {
                    font-size: 0.75rem;
                    color: var(--ad-t2);
                    max-width: 180px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .ad-raffle-badge {
                    display: inline-block;
                    padding: 2px 8px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.55rem;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    border-radius: 2px;
                    margin-top: 6px;
                }
                .ad-raffle-qr {
                    background: #fff;
                    padding: 4px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .ad-raffle-footer {
                    padding: 8px 15px;
                    background: var(--ad-raised);
                    border-top: 1px solid var(--ad-border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .ad-raffle-event {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.6rem;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: var(--ad-t3);
                }
            `}</style>

            {tickets.map((ticket) => (
                <div key={ticket.id} className="ad-raffle-card">
                    <div className="ad-raffle-top">
                        <div>
                            <div className="ad-raffle-id-label">Ticket No.</div>
                            <div className="ad-raffle-id">{ticket.id}</div>
                        </div>
                        <img src={logo} alt="RWTW" className="ad-raffle-logo" />
                    </div>

                    <div className="ad-raffle-main">
                        <div className="ad-raffle-info">
                            <div className="ad-raffle-name">{ticket.firstName} {ticket.lastName}</div>
                            <div className="ad-raffle-email">{ticket.email}</div>
                            <span className={`ad-raffle-badge ${ticket.status === 'PAID' ? 'ad-badge-paid' : 'ad-badge-unpaid'}`}>
                                {ticket.status}
                            </span>
                        </div>
                        <div className="ad-raffle-qr">
                            <QRCodeCanvas
                                value={`https://airbornefraternity.org/raffle/profile/${ticket.id}`}
                                size={56}
                                level="H"
                            />
                        </div>
                    </div>

                    <div className="ad-raffle-footer">
                        <span className="ad-raffle-event">RWTW 2026 Raffle Draw</span>
                        <span style={{ fontSize: '0.6rem', color: 'var(--ad-t3)', fontWeight: 700 }}>05 JUL 2026</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminRaffleVisual;
