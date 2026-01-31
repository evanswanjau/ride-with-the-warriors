import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CIRCUITS } from '../constants';
import { calculateAge, getCategoryColor } from '../utils';

interface ProfileViewProps {
    registration: any;
    onBack: () => void;
}

const ProfileView = ({ registration, onBack }: ProfileViewProps) => {
    const [showAllMembers, setShowAllMembers] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const circuit = CIRCUITS.find(c => c.id === registration.circuitId) || CIRCUITS[0];
    const pricing = registration.pricing;
    const payload = registration.payload;
    const categoryColor = getCategoryColor(registration.id);
    const darkColors = ['#000080', '#800020', '#78350f', '#a855f7', '#6b7280', '#800020'];
    const isDarkBackground = darkColors.includes(categoryColor.toLowerCase());

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDownloadPDF = () => {
        // Browser print is the most reliable way to generate PDFs with modern CSS
        // Our @media print styles ensure a clean, professional ticket-only output
        window.print();
    };

    const handleShare = async () => {
        const shareData = {
            title: 'Ride with the Warriors Registration',
            text: `View my registration for ${circuit.title} - ${registration.id}`,
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

    const getParticipantInfo = () => {
        const info = {
            name: `${registration.firstName} ${registration.lastName}`,
            email: registration.email || 'N/A',
            phone: registration.phoneNumber || registration.emergencyPhone || 'N/A',
            subtitle: '',
            details: [] as any[]
        };

        if (registration.type === 'individual') {
            info.details = [
                { label: 'ID/Passport', value: registration.idNumber },
                { label: 'Date of Birth', value: registration.dob },
                { label: 'Age', value: calculateAge(registration.dob) || 'N/A' },
                { label: 'Gender', value: registration.gender }
            ];
        } else if (registration.type === 'team') {
            info.subtitle = `Team: ${registration.teamName}`;
            info.details = [
                { label: 'Team', value: registration.teamName },
                { label: 'Member Type', value: registration.isCaptain ? 'Captain' : 'Rider' },
                { label: 'Age', value: calculateAge(registration.dob) || 'N/A' },
                { label: 'Gender', value: registration.gender }
            ];
        } else if (registration.type === 'family') {
            info.subtitle = registration.guardianName ? `${registration.guardianName}'s Family` : 'Family Group';
            info.details = [
                { label: 'Guardian', value: registration.guardianName },
                { label: 'Category', value: registration.category },
                { label: 'Age', value: calculateAge(registration.dob) || 'N/A' },
                { label: 'Gender', value: registration.gender }
            ];
        }

        return info;
    };

    const info = getParticipantInfo();

    return (
        <div className="selection:bg-primary selection:text-white font-sans print:p-0 print:bg-white">
            <style>
                {`
                    @media print {
                        @page {
                            size: auto;
                            margin: 10mm;
                        }
                        nav, footer, .no-print, button {
                            display: none !important;
                        }
                        body {
                            background: white !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        .print-container {
                            width: 100% !important;
                            max-width: none !important;
                            padding: 0 !important;
                            margin: 0 !important;
                        }
                        .ticket-card {
                            border: 1px solid #e5e5e5 !important;
                            box-shadow: none !important;
                            break-inside: avoid;
                            page-break-inside: avoid;
                            display: flex !important;
                            flex-direction: row !important;
                            min-height: auto !important;
                        }
                        .lg\\:flex-row {
                            flex-direction: row !important;
                        }
                        .lg\\:w-3 {
                            width: 12px !important;
                        }
                        .lg\\:w-80 {
                            width: 320px !important;
                        }
                        .lg\\:block {
                            display: block !important;
                        }
                        .hidden.lg\\:block {
                            display: block !important;
                        }
                    }
                `}
            </style>

            <div className="max-w-5xl mx-auto print-container">
                {/* Navigation & Actions */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-neutral-500 hover:text-primary transition-all group"
                    >
                        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        <span className="text-sm font-black uppercase tracking-widest leading-none pt-0.5">Back to Search</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-all font-black uppercase tracking-widest text-[10px]"
                        >
                            <span className="material-symbols-outlined text-lg">{copySuccess ? 'check' : 'share'}</span>
                            {copySuccess ? 'Copied!' : 'Share'}
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all font-black uppercase tracking-widest text-[10px]"
                        >
                            <span className="material-symbols-outlined text-lg">print</span>
                            Print / Save as PDF
                        </button>
                    </div>
                </div>

                {/* Ticket Container - Redesigned for Rectangular Boarding Pass Aesthetic */}
                <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row bg-white rounded-[2rem] overflow-hidden border border-neutral-200 ticket-card shadow-2xl shadow-neutral-200/50">

                    {/* Left Branding Ribbon */}
                    <div
                        className="w-full lg:w-4 flex lg:flex-col items-center justify-center transition-colors duration-700"
                        style={{ backgroundColor: categoryColor }}
                    />

                    {/* Main Ticket Body */}
                    <div className="flex-[3] relative overflow-hidden bg-white flex flex-col border-r border-dashed border-neutral-100 lg:border-r-0">
                        {/* Background Branding Elements */}
                        <div
                            className="absolute -top-32 -right-32 size-[500px] rounded-full blur-[120px] pointer-events-none opacity-20 transition-colors duration-700"
                            style={{ backgroundColor: categoryColor }}
                        />
                        <div className="absolute top-12 right-12 opacity-[0.03] pointer-events-none select-none">
                            <span className="material-symbols-outlined text-[240px] leading-none text-black">pedal_bike</span>
                        </div>

                        <div className="relative z-10 flex-1 flex flex-col p-6 lg:p-10">
                            {/* Top Header: Branding + ID */}
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="size-14 bg-neutral-900 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                                        <span className="material-symbols-outlined text-white font-black text-3xl">shield</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-neutral-900 tracking-tighter uppercase leading-none mb-1">
                                            Ride with <span className="text-primary">Warriors</span>
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Official Pass</span>
                                            <div className="size-1 rounded-full bg-neutral-200" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">2026 Edition</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-neutral-50 px-6 py-3 rounded-2xl border border-neutral-100 backdrop-blur-sm self-stretch md:self-auto flex flex-col justify-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-0.5 text-center md:text-right">Ticket ID</p>
                                    <p className="text-xl font-mono font-black text-neutral-900 tracking-tight text-center md:text-right">{registration.id}</p>
                                </div>
                            </div>

                            {/* Participant Name - ELONGATED */}
                            <div className="mb-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-4 font-bold flex items-center gap-2">
                                    <span className="size-1.5 rounded-full" style={{ backgroundColor: categoryColor }}></span>
                                    Registered Participant
                                </p>
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-neutral-900 leading-[0.8] uppercase tracking-tighter truncate max-w-full">
                                    {registration.firstName} <br />
                                    <span className="text-neutral-200 stroke-neutral-900" style={{ WebkitTextStroke: '1px #e5e5e5' }}>{registration.lastName}</span>
                                </h1>

                                <div className="mt-8 flex flex-wrap items-center gap-3">
                                    <div
                                        className="px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-sm transition-colors duration-700"
                                        style={{ backgroundColor: categoryColor, color: isDarkBackground ? 'white' : 'neutral-900' }}
                                    >
                                        Category: {registration.category || 'Rider'}
                                    </div>
                                    <div className="px-5 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-black uppercase tracking-widest shadow-sm">
                                        Type: {registration.type}
                                    </div>
                                </div>
                            </div>

                            {/* Horizontal Event Strip */}
                            <div
                                className="mt-auto p-4 lg:p-6 rounded-[2rem] flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 lg:gap-8 backdrop-blur-md border border-white/50 transition-colors duration-700"
                                style={{ backgroundColor: categoryColor + '10' }} // Slightly more visible tint
                            >
                                <div className="flex-1 min-w-[120px]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 font-bold">Circuit</p>
                                    <p className="text-sm lg:text-base font-black text-neutral-900 uppercase tracking-tighter">{circuit.title}</p>
                                </div>
                                <div className="w-px h-8 bg-neutral-200 hidden lg:block" />
                                <div className="flex-1 min-w-[80px]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 font-bold">Distance</p>
                                    <p className="text-sm lg:text-base font-black text-neutral-900 uppercase tracking-tighter">{circuit.distance}</p>
                                </div>
                                <div className="w-px h-8 bg-neutral-200 hidden lg:block" />
                                <div className="flex-1 min-w-[120px]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 font-bold">Event Date</p>
                                    <p className="text-sm lg:text-base font-black text-neutral-900 uppercase tracking-tighter">
                                        {circuit.date}
                                    </p>
                                </div>
                                <div className="w-px h-8 bg-neutral-200 hidden lg:block" />
                                <div className="flex-1 min-w-[100px]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 font-bold">Start Time</p>
                                    <p className="text-sm lg:text-base font-black text-neutral-900 uppercase tracking-tighter">{circuit.time}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Perforation Line (Horizontal on Mobile, Vertical on Desktop) */}
                    <div className="relative flex items-center justify-center pointer-events-none bg-neutral-50/50 lg:bg-transparent">
                        {/* Circular notches with shadows for realism */}
                        <div className="hidden lg:block absolute -top-4 size-10 rounded-full bg-neutral-100 border border-neutral-200 shadow-inner" />
                        <div className="hidden lg:block absolute -bottom-4 size-10 rounded-full bg-neutral-100 border border-neutral-200 shadow-inner" />
                        <div className="lg:hidden absolute -left-4 size-10 rounded-full bg-neutral-100 border border-neutral-200 shadow-inner" />
                        <div className="lg:hidden absolute -right-4 size-10 rounded-full bg-neutral-100 border border-neutral-200 shadow-inner" />

                        {/* Perforated border */}
                        <div className="h-px lg:h-[80%] w-[80%] lg:w-px border-t lg:border-l border-dashed border-neutral-300" />
                    </div>

                    {/* Ticket Stub (QR & Status) */}
                    <div className="w-full lg:w-80 p-6 lg:p-8 bg-neutral-50/80 relative flex flex-col justify-between overflow-hidden">
                        {/* Vertical Branding Side Text - Boarding Pass Style */}
                        <div className="absolute top-1/2 -right-12 translate-y-[-50%] rotate-90 hidden lg:flex items-center gap-3 select-none pointer-events-none opacity-20 whitespace-nowrap">
                            <span className="text-4xl font-black uppercase tracking-[0.2em] text-neutral-400">
                                {registration.category || 'STANDARD RIDER'}
                            </span>
                            <div className="w-32 h-2" style={{ backgroundColor: categoryColor }} />
                        </div>
                        {/* Status Stamp */}
                        <div className="mb-8">
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4 text-center lg:text-left">Entry Clearance</p>
                            <div className={`relative p-6 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed transition-all duration-500 ${registration.status === 'PAID' || registration.status === 'CONFIRMED'
                                ? 'bg-green-500/5 border-green-600/30 text-green-600'
                                : 'bg-amber-500/5 border-amber-600/30 text-amber-600'
                                }`}>
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neutral-50 px-3 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">verified_user</span>
                                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">Security Status</span>
                                </div>
                                <span className="material-symbols-outlined text-4xl mb-2">{
                                    registration.status === 'PAID' || registration.status === 'CONFIRMED' ? 'check_circle' : 'hourglass_empty'
                                }</span>
                                <span className="text-xl font-black uppercase tracking-[0.2em] leading-none">{registration.status}</span>
                            </div>
                        </div>

                        {/* QR Section - Embedded in a VIP badge style */}
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative p-6 bg-white rounded-[2.5rem] shadow-xl shadow-neutral-200/50 group transition-all hover:scale-105">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-transparent via-neutral-100 to-transparent rounded-[2.6rem] opacity-50 pointer-events-none" />
                                <div className="size-36 flex items-center justify-center relative bg-white rounded-3xl overflow-hidden border border-neutral-50">
                                    <QRCodeSVG
                                        value={`${window.location.host === 'localhost:5173' || window.location.host.includes('vercel.app') ? window.location.origin : 'https://ridewiththewarriors.com'}/profile/${registration.id}`}
                                        size={120}
                                        level="H"
                                        includeMargin={true}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                    <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px] no-print">
                                        <span className="text-[10px] font-black text-white bg-neutral-900 px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">Scan to Verify</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Pass Hash</p>
                                <p className="font-mono text-[10px] text-neutral-500 bg-neutral-200/30 px-4 py-1.5 rounded-full border border-neutral-100">
                                    {btoa(registration.id).slice(0, 12).toUpperCase()}
                                </p>
                            </div>
                        </div>

                        {/* Bottom Utility (Not visible in print usually, but nice on screen) */}
                        <div className="mt-12 pt-8 border-t border-neutral-200/50 text-center no-print">
                            <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest mb-2">Member Support</p>
                            <div className="flex justify-center gap-4 text-neutral-400">
                                <span className="material-symbols-outlined text-lg">headset_mic</span>
                                <span className="material-symbols-outlined text-lg">info</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Details (Collapsible Roster for Teams) */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 no-print">
                    {/* Contact details Card */}
                    <div className="bg-white rounded-[2rem] p-8 border border-neutral-200">
                        <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tighter mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary no-print">contact_mail</span>
                            Contact Information
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 font-bold">Email Address</p>
                                <p className="text-neutral-900 font-bold">{info.email}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 font-bold">Phone / Emergency Contact</p>
                                <p className="text-neutral-900 font-bold">{info.phone}</p>
                            </div>
                            <div className="pt-4 grid grid-cols-2 gap-4 border-t border-neutral-100">
                                {info.details.map((detail, idx) => (
                                    <div key={idx}>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 font-bold">{detail.label}</p>
                                        <p className="text-neutral-900 font-bold capitalize">{detail.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Payment History Card */}
                    <div className="bg-white rounded-[2rem] p-8 border border-neutral-200">
                        <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tighter mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary no-print">receipt_long</span>
                            Transaction Summary
                        </h3>
                        <div className="space-y-4">
                            {pricing?.lineItems?.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-neutral-50 last:border-0">
                                    <span className="text-sm text-neutral-500 font-medium font-bold">{item.label}</span>
                                    <span className="text-sm font-black text-neutral-900 leading-none">KES {item.amount.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="mt-4 pt-4 flex justify-between items-center border-t border-neutral-100">
                                <span className="text-lg font-black text-neutral-900 uppercase tracking-tighter">Total Price</span>
                                <span className="text-2xl font-black text-primary">KES {pricing?.totalAmount?.toLocaleString() || 0}</span>
                            </div>
                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest text-center mt-6">
                                Registered on {formatDate(registration.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>

                {registration.type === 'team' && (
                    <div className="mt-8 print:mt-12 no-print">
                        <div className="no-print">
                            <button
                                onClick={() => setShowAllMembers(!showAllMembers)}
                                className="w-full p-8 bg-white rounded-[2rem] border border-neutral-200 text-left hover:bg-neutral-50 transition-colors flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="size-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-3xl">groups</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tighter mb-1">Team Roster</h3>
                                        <p className="text-sm text-neutral-400 font-black uppercase tracking-widest">{payload.teamDetails.members.length} Registered Riders</p>
                                    </div>
                                </div>
                                <div className="size-12 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-900">
                                    <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: showAllMembers ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                        expand_more
                                    </span>
                                </div>
                            </button>
                        </div>

                        {(showAllMembers || true) && (
                            <div className={`${showAllMembers ? '' : 'hidden print:grid'} mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-500 print:grid print:gap-4 print:mt-8`}>
                                {payload.teamDetails.members.map((member: any, idx: number) => (
                                    <div key={idx} className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-primary/30 transition-colors">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`size-12 rounded-xl flex items-center justify-center ${member.isCaptain ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                                                <span className="material-symbols-outlined">{member.isCaptain ? 'stars' : 'person'}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-neutral-900 uppercase tracking-tighter leading-tight">
                                                    {member.firstName} {member.lastName}
                                                </h4>
                                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">{member.regId || 'PENDING'}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                                            <div>
                                                <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1">Gender</p>
                                                <p className="text-xs font-bold text-neutral-900 uppercase">{member.gender}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1">Age</p>
                                                <p className="text-xs font-bold text-neutral-900 leading-none">{calculateAge(member.dob)} YRS</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileView;
