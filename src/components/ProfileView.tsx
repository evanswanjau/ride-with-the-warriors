import { useState } from 'react';
import { CIRCUITS } from '../constants';
import { calculateAge } from '../utils';

interface ProfileViewProps {
    registration: any;
    onBack: () => void;
}

const ProfileView = ({ registration, onBack }: ProfileViewProps) => {
    const [showAllMembers, setShowAllMembers] = useState(false);
    const circuit = CIRCUITS.find(c => c.id === registration.circuitId) || CIRCUITS[0];
    const pricing = registration.pricing;
    const payload = registration.payload;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getParticipantInfo = () => {
        // Use flat columns primarily
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
                { label: 'Age', value: calculateAge(registration.dob) || 'N/A' },
                { label: 'Gender', value: registration.gender }
            ];
        }

        return info;
    };

    const info = getParticipantInfo();

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="mb-6 flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span className="font-medium">Back to Search</span>
                </button>

                {/* Success Banner */}
                <div className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl flex items-center gap-4">
                    <div className="size-12 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-2xl">check_circle</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-green-900 dark:text-green-100">Registration Found!</h2>
                        <p className="text-green-700 dark:text-green-300">Your registration is confirmed for {circuit.title}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl overflow-hidden">
                            {/* Header Image */}
                            <div className="relative h-48 bg-gradient-to-br from-primary to-primary-dark">
                                <div className="absolute inset-0 bg-black/20"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h1 className="text-3xl font-bold text-white mb-1">{info.name}</h1>
                                    <p className="text-white/90 text-sm font-bold uppercase tracking-widest">
                                        {info.subtitle || `${registration.type} Participant`}
                                    </p>
                                </div>
                            </div>

                            {/* Registration Details */}
                            <div className="p-8">
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                                        Registration ID
                                    </h3>
                                    <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                        <span className="material-symbols-outlined text-primary">confirmation_number</span>
                                        <code className="text-lg font-mono font-bold text-neutral-900 dark:text-white">
                                            {registration.id}
                                        </code>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                                            Email
                                        </h3>
                                        <p className="text-neutral-900 dark:text-white font-medium">{info.email}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                                            Phone
                                        </h3>
                                        <p className="text-neutral-900 dark:text-white font-medium">{info.phone}</p>
                                    </div>
                                </div>

                                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                                    <h3 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">
                                        Additional Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {info.details.map((detail, idx) => (
                                            <div key={idx}>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">{detail.label}</p>
                                                <p className="text-neutral-900 dark:text-white font-medium capitalize">{detail.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {registration.type === 'team' && (
                                    <div className="mt-8 border-t border-neutral-200 dark:border-neutral-700 pt-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">groups</span>
                                                Team Roster
                                            </h3>
                                            <button
                                                onClick={() => setShowAllMembers(!showAllMembers)}
                                                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-all font-bold text-sm"
                                            >
                                                <span className="material-symbols-outlined text-lg">
                                                    {showAllMembers ? 'expand_less' : 'expand_more'}
                                                </span>
                                                {showAllMembers ? 'Hide Details' : 'View All Members'}
                                            </button>
                                        </div>

                                        {showAllMembers && (
                                            <div className="grid grid-cols-1 gap-4">
                                                {payload.teamDetails.members.map((member: any, idx: number) => (
                                                    <div key={idx} className="p-6 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-primary/30 transition-colors">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`size-12 rounded-full flex items-center justify-center ${member.isCaptain ? 'bg-primary/10 text-primary' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'}`}>
                                                                    <span className="material-symbols-outlined">{member.isCaptain ? 'stars' : 'person'}</span>
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <h4 className="font-bold text-neutral-900 dark:text-white text-lg">
                                                                            {member.firstName} {member.lastName}
                                                                        </h4>
                                                                        {member.isCaptain && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full uppercase font-black">Captain</span>}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-neutral-500 text-xs">
                                                                        <span className="font-mono font-bold text-primary">{member.regId || 'PENDING'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="px-3 py-1 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-bold uppercase text-neutral-500">
                                                                    {member.gender}
                                                                </span>
                                                                <span className="px-3 py-1 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-500">
                                                                    {calculateAge(member.dob)} YRS
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                                                            <div>
                                                                <p className="text-[10px] uppercase text-neutral-400 font-bold tracking-widest mb-1">Email Address</p>
                                                                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{member.email}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] uppercase text-neutral-400 font-bold tracking-widest mb-1">Phone Number</p>
                                                                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{member.phoneNumber}</p>
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
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Event Details */}
                        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Event Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary">event</span>
                                    <div>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Date</p>
                                        <p className="text-sm font-bold text-neutral-900 dark:text-white">{circuit.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary">schedule</span>
                                    <div>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Time</p>
                                        <p className="text-sm font-bold text-neutral-900 dark:text-white">{circuit.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary">location_on</span>
                                    <div>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Location</p>
                                        <p className="text-sm font-bold text-neutral-900 dark:text-white">{circuit.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Payment Summary</h3>
                            <div className="space-y-3">
                                {pricing?.lineItems?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between">
                                        <span className="text-sm text-neutral-600 dark:text-neutral-400">{item.label}</span>
                                        <span className="text-sm font-bold text-neutral-900 dark:text-white">
                                            KES {item.amount.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-bold text-neutral-900 dark:text-white">Total</span>
                                        <span className="text-2xl font-black text-primary">
                                            KES {pricing?.totalAmount?.toLocaleString() || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full text-xs font-bold">
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    {registration.status}
                                </span>
                            </div>
                        </div>

                        {/* Registration Date */}
                        <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl p-4 text-center">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Registered On</p>
                            <p className="text-sm font-bold text-neutral-900 dark:text-white">
                                {formatDate(registration.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
