import { useState } from 'react';
import { CIRCUITS } from '../constants';
import { calculateAge } from '../utils';

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        const shareData = {
            title: 'Ride with the Warriors Registration',
            text: `View my registration for ${circuit.title} - #${registration.id}`,
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
                        nav, footer, .no-print {
                            display: none !important;
                        }
                        body {
                            background: white !important;
                        }
                        .print-container {
                            width: 100% !important;
                            max-width: none !important;
                            padding: 0 !important;
                            margin: 0 !important;
                            background: white !important;
                            border: none !important;
                        }
                        .ticket-card {
                            border: 2px solid #e5e5e5 !important;
                            border-radius: 1rem !important;
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
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all font-black uppercase tracking-widest text-[10px]"
                        >
                            <span className="material-symbols-outlined text-lg">download</span>
                            Download / Print
                        </button>
                    </div>
                </div>

                {/* Ticket Container */}
                <div className="relative flex flex-col lg:flex-row bg-white rounded-[2rem] overflow-hidden border border-neutral-200 ticket-card">

                    {/* Main Ticket Body */}
                    <div className="flex-1 p-8 md:p-12 relative overflow-hidden bg-white">
                        {/* Background Branding Elements - Subtle in light mode */}
                        <div className="absolute -top-24 -right-24 size-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute top-12 right-12 opacity-[0.03] pointer-events-none select-none">
                            <span className="material-symbols-outlined text-[200px] leading-none text-black">pedal_bike</span>
                        </div>

                        <div className="relative z-10 h-full flex flex-col">
                            {/* Top row: Branding + ID */}
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="size-10 bg-primary rounded-xl flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white font-black text-2xl">shield</span>
                                        </div>
                                        <h2 className="text-xl font-black text-neutral-900 tracking-tighter uppercase leading-none">
                                            Ride with <br /> the <span className="text-primary italic">Warriors</span>
                                        </h2>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Official Registration Access</p>
                                </div>
                                <div className="text-left md:text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 font-bold">Registration Ticket ID</p>
                                    <p className="text-3xl font-mono font-black text-primary">#{registration.id}</p>
                                </div>
                            </div>

                            {/* Participant Name */}
                            <div className="mb-12">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 font-bold">Participant Name</p>
                                <h1 className="text-4xl md:text-6xl font-black text-neutral-900 leading-tight uppercase tracking-tight">
                                    {registration.firstName} <br />
                                    <span className="text-neutral-400">{registration.lastName}</span>
                                </h1>
                            </div>

                            {/* Event Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-auto pt-8 border-t border-neutral-100">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 font-bold">Circuit</p>
                                    <p className="text-sm font-bold text-neutral-900 uppercase">{circuit.title}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 font-bold">Distance</p>
                                    <p className="text-sm font-bold text-neutral-900 uppercase">{circuit.distance}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 font-bold">Event Date</p>
                                    <p className="text-sm font-bold text-neutral-900 uppercase">{circuit.date}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 font-bold">Start Time</p>
                                    <p className="text-sm font-bold text-neutral-900 uppercase">{circuit.time}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Perforation Line (Horizontal on Mobile, Vertical on Desktop) */}
                    <div className="relative flex items-center justify-center pointer-events-none bg-neutral-50/50 lg:bg-transparent">
                        {/* Circular notches */}
                        <div className="hidden lg:block absolute -top-4 size-8 rounded-full bg-neutral-100 border border-neutral-200" />
                        <div className="hidden lg:block absolute -bottom-4 size-8 rounded-full bg-neutral-100 border border-neutral-200" />
                        <div className="lg:hidden absolute -left-4 size-8 rounded-full bg-neutral-100 border border-neutral-200" />
                        <div className="lg:hidden absolute -right-4 size-8 rounded-full bg-neutral-100 border border-neutral-200" />

                        {/* Perforated border */}
                        <div className="h-px lg:h-full w-full lg:w-px border-t lg:border-l border-dashed border-neutral-300" />
                    </div>

                    {/* Ticket Stub */}
                    <div className="w-full lg:w-80 p-8 md:p-12 bg-neutral-50 relative flex flex-col">
                        <div className="mb-8">
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4 text-center lg:text-left font-bold">Status Details</p>
                            <div className={`p-4 rounded-xl flex items-center justify-center gap-3 border ${registration.status === 'PAID' || registration.status === 'CONFIRMED'
                                ? 'bg-green-500/5 border-green-200 text-green-600'
                                : 'bg-yellow-500/5 border-yellow-200 text-yellow-600'
                                }`}>
                                <span className="material-symbols-outlined text-xl">{
                                    registration.status === 'PAID' || registration.status === 'CONFIRMED' ? 'verified' : 'pending_actions'
                                }</span>
                                <span className="text-sm font-black uppercase tracking-widest leading-none pt-0.5">{registration.status}</span>
                            </div>
                        </div>

                        {/* Enhanced QR Section */}
                        <div className="mt-auto flex flex-col items-center">
                            <div className="size-44 p-4 bg-white rounded-2xl border border-neutral-100 overflow-hidden relative group transition-all">
                                <div className="w-full h-full p-2 border-2 border-neutral-100 rounded-lg flex items-center justify-center relative">
                                    <div className="absolute inset-0 p-2 grid grid-cols-8 grid-rows-8 gap-[1px]">
                                        {Array.from({ length: 64 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`rounded-[1px] ${
                                                    // Create "fixed" corner patterns for more realism
                                                    (i < 3 || (i > 4 && i < 8) || (i > 55 && i < 59)) && (i % 8 < 3 || i % 8 > 4)
                                                        ? 'bg-neutral-900'
                                                        : Math.random() > 0.6 ? 'bg-neutral-900' : 'bg-transparent'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <div className="relative z-10 size-8 bg-white rounded-md flex items-center justify-center font-black">
                                        <span className="material-symbols-outlined text-primary text-xl">shield</span>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px] no-print">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest bg-primary px-3 py-1.5 rounded-full">Scan Ticket</span>
                                </div>
                            </div>
                            <p className="mt-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest font-bold">Digital Auth Hash</p>
                            <p className="font-mono text-[10px] text-neutral-500 break-all text-center mt-1 bg-neutral-200/50 px-3 py-1.5 rounded">{btoa(registration.id).slice(0, 16)}</p>
                        </div>
                    </div>
                </div>

                {/* Additional Details (Collapsible Roster for Teams) */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 print:block print:space-y-8">
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
                    <div className="mt-8 print:mt-12">
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
