import { QRCodeCanvas } from 'qrcode.react';
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
        <div id="raffle-print-container" className="bg-white p-0 w-[210mm] min-h-[297mm]">
            <style>
                {`
                @media screen {
                    #raffle-print-container {
                        margin: 0 auto;
                        border: 1px solid #ddd;
                    }
                }
                .raffle-print-page {
                    page-break-after: always;
                    width: 210mm;
                    height: 297mm;
                    padding: 10mm;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-auto-rows: min-content;
                    gap: 15px;
                }
                .raffle-ticket-card {
                    height: 60mm;
                    border: 1px dashed #ccc;
                    padding: 3mm;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    background: white;
                    overflow: hidden;
                }
                `}
            </style>

            {/* Split tickets into pages of 15 (3x5 grid) */}
            {Array.from({ length: Math.ceil(tickets.length / 15) }).map((_, pageIdx) => (
                <div key={pageIdx} className="raffle-print-page">
                    {tickets.slice(pageIdx * 15, (pageIdx + 1) * 15).map((ticket) => (
                        <div key={ticket.id} className="raffle-ticket-card">
                            <div className="flex justify-between items-start">
                                <img src={logo} alt="Logo" className="h-6 w-auto object-contain" />
                                <div className="text-right">
                                    <p className="text-[6px] font-bold text-neutral-400 uppercase tracking-widest">ID</p>
                                    <p className="text-sm font-black text-neutral-900 tracking-tighter leading-none">{ticket.id}</p>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-center items-center text-center my-1">
                                <p className="text-[6px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Ticket ID</p>
                                <p className="text-xl font-black text-neutral-900 leading-none">
                                    {ticket.id}
                                </p>
                            </div>

                            <div className="flex items-end justify-between border-t border-neutral-100 pt-1">
                                <div className="flex-1 min-w-0 pr-1">
                                    <p className="text-[6px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Name</p>
                                    <p className="text-[8px] font-black text-neutral-900 uppercase truncate leading-tight">
                                        {ticket.firstName} {ticket.lastName}
                                    </p>
                                    <div className="mt-1">
                                        <span className="bg-primary/10 text-primary text-[6px] font-black px-1 py-0.5 rounded uppercase">
                                            Raffle Entry
                                        </span>
                                    </div>
                                </div>
                                <div className="shrink-0 bg-white p-0.5 border border-neutral-100 rounded">
                                    <QRCodeCanvas
                                        value={`https://ridewiththewarriors.com/raffle/profile/${ticket.id}`}
                                        size={40}
                                        level="H"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default AdminRaffleTicketsPrint;
