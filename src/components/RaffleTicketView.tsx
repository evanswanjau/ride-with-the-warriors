import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import {
    AiOutlineArrowLeft,
    AiOutlineCheck,
    AiOutlineShareAlt,
    AiOutlineSafety,
    AiOutlineHourglass,
    AiOutlineCheckCircle,
    AiOutlineContacts,
    AiOutlineFileText,
    AiOutlineDownload,
    AiOutlineMail,
    AiOutlinePhone,
    AiOutlineUser
} from 'react-icons/ai';

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
    const eventLocation = 'Ulinzi Sports Complex, Nairobi';

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
            <div className="max-w-5xl mx-auto">
                {/* Navigation & Actions */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-neutral-500 hover:text-primary transition-all group"
                    >
                        <AiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-black uppercase tracking-widest leading-none pt-0.5">Back to Search</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-all font-black uppercase tracking-widest text-[10px]"
                        >
                            {copySuccess ? <AiOutlineCheck className="text-lg" /> : <AiOutlineShareAlt className="text-lg" />}
                            {copySuccess ? 'Copied!' : 'Share'}
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-green-600 transition-all font-black uppercase tracking-widest text-[10px]"
                        >
                            <AiOutlineDownload className="text-lg" />
                            Download PDF
                        </button>
                    </div>
                </div>

                {/* Ticket Card - Rectangular Boarding Pass Aesthetic */}
                <div id="raffle-ticket-container" className="relative flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-xl">
                    {/* Color Accent Border */}
                    <div className="w-full lg:w-3 h-2 lg:h-auto bg-primary" />

                    {/* Main Content Area */}
                    <div className="flex-[3] p-6 lg:p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-neutral-900 rounded-xl flex items-center justify-center">
                                        <AiOutlineSafety className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-neutral-900 uppercase tracking-tighter leading-none">
                                            Ride with <span className="text-primary">Warriors</span>
                                        </h2>
                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Official Raffle Pass 2026</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Ticket ID</p>
                                    <p className="text-lg font-mono font-black text-neutral-900 tracking-tight">{ticket.id}</p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Participant Name</p>
                                <h1 className="text-3xl md:text-5xl font-black text-neutral-900 uppercase tracking-tighter truncate leading-tight">
                                    {ticket.firstName} {ticket.lastName}
                                </h1>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        RAFFLE ENTRY
                                    </span>
                                    <span className="px-4 py-1.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-black uppercase tracking-widest">
                                        PRICE: KES 1,000
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Event Details Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-neutral-100">
                            <div>
                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Date</p>
                                <p className="text-sm font-black text-neutral-900 uppercase leading-tight">{eventDate}</p>
                            </div>
                            <div className="col-span-1 md:col-span-3">
                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Location</p>
                                <p className="text-sm font-black text-neutral-900 uppercase leading-tight">{eventLocation}</p>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px lg:h-auto lg:w-px bg-neutral-100 mx-6 lg:mx-0 lg:my-8" />

                    {/* QR & Status Section */}
                    <div className="w-full lg:w-72 p-6 lg:p-8 flex flex-col items-center justify-between bg-neutral-50/50">
                        <div className="w-full text-center lg:text-left mb-6">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3 text-center">Status</p>
                            <div className={`py-3 px-4 rounded-2xl flex items-center justify-center gap-2 border font-black uppercase tracking-widest text-xs ${ticket.status === 'PAID'
                                ? 'bg-green-50 border-green-100 text-green-600'
                                : 'bg-amber-50 border-amber-100 text-amber-600'
                                }`}>
                                {ticket.status === 'PAID' ? <AiOutlineCheckCircle className="text-lg" /> : <AiOutlineHourglass className="text-lg" />}
                                {ticket.status}
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <div className="p-3 bg-white rounded-2xl border border-neutral-100">
                                <QRCodeCanvas
                                    value={`${window.location.origin}/raffle/profile/${ticket.id}`}
                                    size={120}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Details */}
                <div className="mt-8 bg-white rounded-[2rem] p-8 border border-neutral-200 no-print">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <div>
                            <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tighter mb-6 flex items-center gap-3">
                                <AiOutlineContacts className="text-primary" />
                                Contact Information
                            </h3>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center shrink-0">
                                            <AiOutlineMail className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Email Address</p>
                                            <p className="text-neutral-900 font-medium break-all">{ticket.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center shrink-0">
                                            <AiOutlinePhone className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Primary Phone</p>
                                            <p className="text-neutral-900 font-medium">{ticket.phoneNumber || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-neutral-100 grid grid-cols-2 gap-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center shrink-0">
                                            <AiOutlineSafety className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">National ID / Passport</p>
                                            <p className="text-neutral-900 font-medium uppercase">{ticket.idNumber || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center shrink-0">
                                            <AiOutlineUser className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Gender</p>
                                            <p className="text-neutral-900 font-medium capitalize">{ticket.gender || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Summary */}
                        <div className="md:border-l md:border-neutral-100 md:pl-12 pt-12 md:pt-0 border-t md:border-t-0 mt-12 md:mt-0 pt-12 md:pt-0">
                            <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tighter mb-6 flex items-center gap-3">
                                <AiOutlineFileText className="text-primary" />
                                Transaction Summary
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-neutral-50 last:border-0">
                                    <span className="text-sm text-neutral-500 font-bold">Raffle Entry Fee</span>
                                    <span className="text-sm font-black text-neutral-900 leading-none">KES 1,000</span>
                                </div>
                                <div className="mt-4 pt-4 flex justify-between items-center border-t border-neutral-100">
                                    <span className="text-lg font-black text-neutral-900 uppercase tracking-tighter">Total Price</span>
                                    <span className="text-2xl font-black text-primary">KES 1,000</span>
                                </div>
                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest text-center mt-6">
                                    Purchased on {new Date(ticket.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RaffleTicketView;
