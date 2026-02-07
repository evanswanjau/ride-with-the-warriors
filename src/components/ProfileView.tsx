import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
    AiOutlineArrowLeft,
    AiOutlineCheck,
    AiOutlineShareAlt,
    AiOutlinePrinter,
    AiOutlineSafety,
    AiOutlineCheckCircle,
    AiOutlineHourglass,
    AiOutlineContacts,
    AiOutlineFileText,
    AiOutlineCreditCard,
    AiOutlineTeam,
    AiOutlineDown,
    AiOutlineStar,
    AiOutlineUser
} from 'react-icons/ai';
import { CIRCUITS } from '../constants';
import { calculateAge, getCategoryColor, getContrastText } from '../utils';

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
    const contrastText = getContrastText(categoryColor);

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
        // Robust payload parsing
        let payloadObj = registration.payload;
        if (typeof payloadObj === 'string') {
            try {
                payloadObj = JSON.parse(payloadObj);
            } catch (e) {
                payloadObj = null;
            }
        }

        // Deep fallback logic
        const riderDetails = payloadObj?.riderDetails || payloadObj;
        const teamDetails = payloadObj?.teamDetails;
        const familyDetails = payloadObj?.familyDetails;

        // Try to find the specific member if it's a team/family
        let specificMember = null;
        if (registration.type === 'team' && teamDetails?.members) {
            specificMember = teamDetails.members.find((m: any) =>
                m.idNumber === registration.idNumber ||
                (m.firstName === registration.firstName && m.lastName === registration.lastName)
            );
        } else if (registration.type === 'family' && familyDetails?.riders) {
            // Check all categories
            for (const cat of ['cubs', 'champs', 'tigers']) {
                const found = familyDetails.riders[cat]?.find((r: any) =>
                    r.firstName === registration.firstName && r.lastName === registration.lastName
                );
                if (found) {
                    specificMember = found;
                    break;
                }
            }
        }

        const info = {
            name: `${registration.firstName} ${registration.lastName}`,
            email: registration.email || riderDetails?.email || specificMember?.email || 'N/A',
            phone: registration.phoneNumber || riderDetails?.phoneNumber || specificMember?.phoneNumber || 'N/A',
            emergencyContact: registration.emergencyContactName || riderDetails?.emergencyContactName || specificMember?.emergencyContactName || familyDetails?.guardian?.emergencyContactName || 'N/A',
            emergencyPhone: registration.emergencyPhone || riderDetails?.emergencyPhone || specificMember?.emergencyPhone || familyDetails?.guardian?.emergencyPhone || 'N/A',
            tshirtSize: registration.tshirtSize || riderDetails?.tshirtSize || specificMember?.tshirtSize || 'N/A',
            subtitle: '',
            details: [] as any[]
        };

        if (registration.type === 'individual') {
            info.details = [
                { label: 'ID/Passport', value: registration.idNumber || riderDetails?.idNumber },
                { label: 'Date of Birth', value: registration.dob || riderDetails?.dob },
                { label: 'Age', value: calculateAge(registration.dob || riderDetails?.dob) || 'N/A' },
                { label: 'Gender', value: registration.gender || riderDetails?.gender },
                { label: 'T-shirt Size', value: info.tshirtSize }
            ];
        } else if (registration.type === 'team') {
            info.subtitle = registration.teamName || teamDetails?.teamName || 'Team Member';
            info.details = [
                { label: 'Role', value: registration.isCaptain ? 'Captain' : 'Rider' },
                { label: 'ID/Passport', value: registration.idNumber || specificMember?.idNumber },
                { label: 'Date of Birth', value: registration.dob || specificMember?.dob },
                { label: 'Age', value: calculateAge(registration.dob || specificMember?.dob) || 'N/A' },
                { label: 'Gender', value: registration.gender || specificMember?.gender },
                { label: 'T-shirt Size', value: info.tshirtSize }
            ];
        } else if (registration.type === 'family') {
            info.subtitle = registration.guardianName ? `${registration.guardianName}'s Family` : 'Family Group';
            info.details = [
                { label: 'Guardian', value: registration.guardianName || familyDetails?.guardian?.fullName },
                { label: 'Category', value: registration.category },
                { label: 'Age', value: calculateAge(registration.dob || specificMember?.dob) || 'N/A' },
                { label: 'Gender', value: registration.gender || specificMember?.gender },
                { label: 'T-shirt Size', value: info.tshirtSize }
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
                            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all font-black uppercase tracking-widest text-[10px]"
                        >
                            <AiOutlinePrinter className="text-lg" />
                            Print / Save as PDF
                        </button>
                    </div>
                </div>

                {/* Ticket Container - Redesigned for Rectangular Boarding Pass Aesthetic */}
                {/* Simple Ticket Card */}
                <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-xl">

                    {/* Color Accent Border */}
                    <div
                        className="w-full lg:w-3 h-2 lg:h-auto"
                        style={{ backgroundColor: categoryColor }}
                    />

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
                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Official Participant Pass 2026</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Pass ID</p>
                                    <p className="text-lg font-mono font-black text-neutral-900 tracking-tight">{registration.id}</p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Participant Name</p>
                                <h1 className="text-3xl md:text-5xl font-black text-neutral-900 uppercase tracking-tighter truncate leading-tight">
                                    {registration.firstName} {registration.lastName}
                                </h1>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span
                                        className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm"
                                        style={{ backgroundColor: categoryColor, color: contrastText }}
                                    >
                                        Category: {registration.category || 'Rider'}
                                    </span>
                                    <span className="px-4 py-1.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-black uppercase tracking-widest">
                                        Type: {registration.type}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Event Details Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-neutral-100">
                            <div>
                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Circuit</p>
                                <p className="text-sm font-black text-neutral-900 uppercase leading-tight">{circuit.title}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Distance</p>
                                <p className="text-sm font-black text-neutral-900 uppercase leading-tight">{circuit.distance}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Date</p>
                                <p className="text-sm font-black text-neutral-900 uppercase leading-tight">{circuit.date}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Start Time</p>
                                <p className="text-sm font-black text-neutral-900 uppercase leading-tight">{circuit.time}</p>
                            </div>
                        </div>
                    </div>

                    {/* Simple Sidebar Divider (Mobile: Horizontal, Desktop: Vertical) */}
                    <div className="h-px lg:h-auto lg:w-px bg-neutral-100 mx-6 lg:mx-0 lg:my-8" />

                    {/* QR & Status Section */}
                    <div className="w-full lg:w-72 p-6 lg:p-8 flex flex-col items-center justify-between bg-neutral-50/50">
                        <div className="w-full text-center lg:text-left mb-6">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3 text-center">Security Status</p>
                            <div className={`py-3 px-4 rounded-2xl flex items-center justify-center gap-2 border font-black uppercase tracking-widest text-xs ${registration.status === 'PAID' || registration.status === 'CONFIRMED'
                                ? 'bg-green-50 border-green-100 text-green-600'
                                : 'bg-amber-50 border-amber-100 text-amber-600'
                                }`}>
                                {registration.status === 'PAID' || registration.status === 'CONFIRMED' ? <AiOutlineCheckCircle className="text-lg" /> : <AiOutlineHourglass className="text-lg" />}
                                {registration.status}
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <div className="p-3 bg-white rounded-2xl border border-neutral-100 shadow-sm">
                                <QRCodeSVG
                                    value={`${window.location.host === 'localhost:5173' || window.location.host.includes('vercel.app') ? window.location.origin : 'https://ridewiththewarriors.com'}/profile/${registration.id}`}
                                    size={120}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                            <div className="text-center">
                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Scan to Verify</p>
                                <p className="font-mono text-[9px] text-neutral-400">{btoa(registration.id).slice(0, 16).toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Details (Collapsible Roster for Teams) */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 no-print">
                    {/* Contact details Card */}
                    <div className="bg-white rounded-[2rem] p-8 border border-neutral-200">
                        <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tighter mb-6 flex items-center gap-3">
                            <AiOutlineContacts className="text-primary no-print" />
                            Contact Information
                        </h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 font-bold">Email Address</p>
                                    <p className="text-neutral-900 font-bold break-all">{info.email}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 font-bold">Primary Phone</p>
                                    <p className="text-neutral-900 font-bold">{info.phone}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-neutral-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 font-bold">Emergency Contact</p>
                                <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase">{info.emergencyContact}</span>
                                        <span className="text-[10px] font-mono text-primary font-black">{info.emergencyPhone}</span>
                                    </div>
                                    <p className="text-[9px] text-neutral-400 uppercase font-bold tracking-widest">Designated Contact Person</p>
                                </div>
                            </div>

                            <div className="pt-4 grid grid-cols-2 gap-4 border-t border-neutral-100">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 font-bold">T-shirt Size</p>
                                    <p className="text-primary font-black uppercase text-lg">{info.tshirtSize}</p>
                                </div>
                                {info.details.filter(d => d.label !== 'T-shirt Size').map((detail, idx) => (
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
                            <AiOutlineFileText className="text-primary no-print" />
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

                            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-800/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="size-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                                        <AiOutlineCreditCard className="text-sm" />
                                    </div>
                                    <p className="text-[10px] font-black text-green-700 dark:text-green-400 uppercase tracking-widest">Payment Example</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[9px] text-green-600/60 dark:text-green-400/50 uppercase font-bold mb-0.5">M-Pesa Reference</p>
                                        <p className="text-xs font-mono font-black text-green-800 dark:text-green-300">RBC7XL9N2J</p>
                                    </div>
                                    <p className="text-[9px] text-green-600/60 dark:text-green-400/50 font-bold uppercase">Success</p>
                                </div>
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
                                        <AiOutlineTeam className="text-3xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tighter mb-1">Team Roster</h3>
                                        <p className="text-sm text-neutral-400 font-black uppercase tracking-widest">{payload.teamDetails.members.length} Registered Riders</p>
                                    </div>
                                </div>
                                <div className="size-12 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-900">
                                    <AiOutlineDown className="transition-transform duration-300" style={{ transform: showAllMembers ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                                </div>
                            </button>
                        </div>

                        {(showAllMembers || true) && (
                            <div className={`${showAllMembers ? '' : 'hidden print:grid'} mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-500 print:grid print:gap-4 print:mt-8`}>
                                {payload.teamDetails.members.map((member: any, idx: number) => (
                                    <div key={idx} className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-primary/30 transition-colors">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`size-12 rounded-xl flex items-center justify-center ${member.isCaptain ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                                                {member.isCaptain ? <AiOutlineStar /> : <AiOutlineUser />}
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
                                            <div>
                                                <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1">T-shirt</p>
                                                <p className="text-xs font-bold text-neutral-900 leading-none">{member.tshirtSize}</p>
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
