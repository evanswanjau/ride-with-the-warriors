import logo from '../../assets/logos/logo.png';

interface RaffleTicket {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
}

interface AdminRaffleTicketsPrintProps {
    tickets: RaffleTicket[];
}

const AdminRaffleTicketsPrint = ({ tickets }: AdminRaffleTicketsPrintProps) => {
    return (
        <div id="raffle-print-container" style={{ background: '#fff', width: '210mm' }}>
            <style>
                {`
                .raffle-print-page {
                    width: 210mm;
                    height: 297mm;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: repeat(5, 1fr);
                    background: #ffffff;
                    position: relative;
                    margin: 0;
                    padding: 8mm;
                    gap: 0;
                    box-sizing: border-box;
                    page-break-after: always;
                }
                .raffle-ticket-card {
                    height: 56.2mm; /* Exact 1/5 of A4 height minus padding */
                    width: 100%;
                    border: 0.2pt dashed #000;
                    display: flex;
                    flex-direction: column;
                    background: #ffffff;
                    padding: 5mm;
                    box-sizing: border-box;
                    position: relative;
                    overflow: hidden;
                }
                .ticket-header {
                    display: flex;
                    align-items: center;
                    gap: 3mm;
                    padding-bottom: 2mm;
                    margin-bottom: 3mm;
                }
                .ticket-logo {
                    height: 10mm;
                    width: auto;
                }
                .ticket-title-wrap {
                    display: flex;
                    flex-direction: column;
                }
                .ticket-title-main {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 14px;
                    font-weight: 900;
                    line-height: 1;
                    color: #000;
                    text-transform: uppercase;
                    letter-spacing: 0.02em;
                }
                .ticket-title-sub {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 8px;
                    font-weight: 700;
                    color: #333;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .ticket-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 1mm;
                }
                .ticket-no-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 10px;
                    font-weight: 800;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                }
                .ticket-no-val {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 48px;
                    font-weight: 950;
                    color: #000;
                    line-height: 0.8;
                    margin: 1mm 0;
                }
                .ticket-name {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 18px;
                    font-weight: 800;
                    color: #000;
                    text-transform: uppercase;
                    text-align: center;
                    max-width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .ticket-footer-strip {
                    margin-top: auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    font-family: 'Barlow Condensed', sans-serif;
                }
                .ticket-event-tag {
                    font-size: 9px;
                    font-weight: 900;
                    color: #fff;
                    background: #000;
                    padding: 1px 4px;
                    text-transform: uppercase;
                }
                .ticket-date-tag {
                    font-size: 9px;
                    font-weight: 700;
                    color: #000;
                    text-transform: uppercase;
                }
                `}
            </style>

            {/* Split tickets into pages of 15 (3x5 grid) */}
            {Array.from({ length: Math.ceil(tickets.length / 15) }).map((_, pageIdx) => (
                <div key={pageIdx} className="raffle-print-page">
                    {tickets.slice(pageIdx * 15, (pageIdx + 1) * 15).map((ticket) => (
                        <div key={ticket.id} className="raffle-ticket-card">
                            <div className="ticket-header">
                                <img src={logo} alt="Logo" className="ticket-logo" />
                                <div className="ticket-title-wrap">
                                    <div className="ticket-title-main">Ride With The Warriors</div>
                                    <div className="ticket-title-sub">KDF &bull; Airborne Fraternity</div>
                                </div>
                            </div>

                            <div className="ticket-content">
                                <div className="ticket-no-label">Raffle Ticket No.</div>
                                <div className="ticket-no-val">{ticket.id}</div>
                                <div className="ticket-name">{ticket.firstName} {ticket.lastName}</div>
                            </div>

                            <div className="ticket-footer-strip">
                                <div className="ticket-event-tag">Official Entry 2026</div>
                                <div className="ticket-date-tag">Draw Date: 05 JUL 2026</div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default AdminRaffleTicketsPrint;
