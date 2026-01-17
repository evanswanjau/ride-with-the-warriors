import { CIRCUITS } from '../constants';
import type { RiderDetails, TeamDetails, FamilyDetails } from '../types';

interface Step5ReviewProps {
    onBack: () => void;
    onSubmit: () => void;
    registrationType: string;
    selectedCircuitId: string;
    riderData: RiderDetails;
    teamData: TeamDetails;
    familyData: FamilyDetails;
}

const Step5Review = ({
    onBack,
    onSubmit,
    registrationType,
    selectedCircuitId,
    riderData,
    teamData,
    familyData
}: Step5ReviewProps) => {
    const circuit = CIRCUITS.find(c => c.id === selectedCircuitId) || CIRCUITS[0];

    // pricing logic
    let totalCost = 0;
    const lineItems: { label: string; amount: number; count?: number }[] = [];

    if (registrationType === 'individual') {
        // Standard Individual Price: 2000/=
        const price = 2000;
        totalCost = price;
        lineItems.push({ label: 'Individual Registration', amount: price });
    } else if (registrationType === 'team') {
        // Team Price: 9000/= Flat Fee for all team types (Blitz, Intermediate, Corporate)
        const price = 9000;
        totalCost = price;
        lineItems.push({ label: 'Team Registration', amount: price });
    } else if (registrationType === 'family') {
        // Family Pricing: Cubs/Champs = 1000/=, Tigers = 2000/=
        const cubsCount = familyData.riders.cubs?.length || 0;
        const champsCount = familyData.riders.champs?.length || 0;
        const tigersCount = familyData.riders.tigers?.length || 0;

        if (cubsCount > 0) {
            const cost = cubsCount * 1000;
            totalCost += cost;
            lineItems.push({ label: `Cubs (x${cubsCount})`, amount: cost, count: cubsCount });
        }
        if (champsCount > 0) {
            const cost = champsCount * 1000;
            totalCost += cost;
            lineItems.push({ label: `Champs (x${champsCount})`, amount: cost, count: champsCount });
        }
        if (tigersCount > 0) {
            const cost = tigersCount * 2000;
            totalCost += cost;
            lineItems.push({ label: `Tigers (x${tigersCount})`, amount: cost, count: tigersCount });
        }
    }

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString() + '/=';
    };

    const renderRegistrationDetails = () => {
        if (registrationType === 'individual') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                        <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Full Name</p>
                        <p className="text-text-light dark:text-white text-base font-medium">{riderData.firstName} {riderData.lastName}</p>
                    </div>
                    <div>
                        <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Gender</p>
                        <p className="text-text-light dark:text-white text-base font-medium capitalize">{riderData.gender}</p>
                    </div>
                    <div>
                        <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Email Address</p>
                        <p className="text-text-light dark:text-white text-base font-medium">{riderData.email}</p>
                    </div>
                    <div>
                        <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Phone Number</p>
                        <p className="text-text-light dark:text-white text-base font-medium">{riderData.phoneNumber}</p>
                    </div>
                    <div>
                        <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">ID / Passport</p>
                        <p className="text-text-light dark:text-white text-base font-medium">{riderData.idNumber}</p>
                    </div>
                    <div>
                        <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Date of Birth</p>
                        <p className="text-text-light dark:text-white text-base font-medium">{riderData.dob}</p>
                    </div>
                </div>
            );
        } else if (registrationType === 'team') {
            return (
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        <div>
                            <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Team Name</p>
                            <p className="text-text-light dark:text-white text-base font-medium">{teamData.teamName}</p>
                        </div>
                        <div>
                            <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Team Size</p>
                            <p className="text-text-light dark:text-white text-base font-medium">{teamData.members.length} Members</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Team Roster</p>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-border-light dark:border-neutral-700 overflow-hidden">
                            {teamData.members.map((member, idx) => (
                                <div key={member.id || idx} className="flex items-center justify-between p-3 border-b border-border-light dark:border-neutral-700 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-8 rounded-full flex items-center justify-center ${member.isCaptain ? 'bg-primary/10 text-primary' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500'}`}>
                                            <span className="material-symbols-outlined text-sm">{member.isCaptain ? 'stars' : 'person'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-text-light dark:text-white leading-tight">{member.firstName} {member.lastName}</span>
                                            <span className="text-[10px] uppercase tracking-wide text-text-muted-light dark:text-gray-400">{member.isCaptain ? 'Captain' : 'Rider'}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-text-light dark:text-gray-300">{member.gender === 'male' ? 'M' : 'F'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        } else if (registrationType === 'family') {
            return (
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        <div>
                            <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Guardian Name</p>
                            <p className="text-text-light dark:text-white text-base font-medium">{familyData.guardian.fullName}</p>
                        </div>
                        <div>
                            <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Emergency Contact</p>
                            <p className="text-text-light dark:text-white text-base font-medium">{familyData.guardian.emergencyPhone}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Email</p>
                            <p className="text-text-light dark:text-white text-base font-medium">{familyData.guardian.email}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Registered Riders</p>
                        <div className="flex flex-col gap-4">
                            {Object.entries(familyData.riders).map(([category, riders]) => (
                                riders.length > 0 && (
                                    <div key={category} className="flex flex-col gap-2">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 w-fit px-2 py-1 rounded">{category}</span>
                                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-border-light dark:border-neutral-700 overflow-hidden">
                                            {riders.map((rider, idx) => (
                                                <div key={rider.id || idx} className="flex items-center justify-between p-3 border-b border-border-light dark:border-neutral-700 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-neutral-400">pedal_bike</span>
                                                        <span className="text-sm font-bold text-text-light dark:text-white">{rider.firstName} {rider.lastName}</span>
                                                    </div>
                                                    <span className="text-xs font-medium text-text-muted-light dark:text-gray-400">{rider.dob}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1 w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-text-light dark:text-white tracking-tight text-[32px] md:text-4xl font-bold leading-tight">Review Your Registration</h1>
                <p className="text-text-muted-light dark:text-gray-400 text-base font-normal leading-normal max-w-2xl">
                    Please verify all information is correct before proceeding to payment.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    {/* Circuit Summary Card - Improved UI */}
                    <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-[#2a2418] shadow-md border border-neutral-100 dark:border-neutral-800">
                        <div className="absolute inset-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-10"></div>
                        <div
                            className="h-32 bg-cover bg-center"
                            style={{ backgroundImage: `url("${circuit.imageUrl}")` }}
                        ></div>
                        <div className="p-6 md:p-8 -mt-12 relative z-20">
                            <div className="bg-white dark:bg-[#342d22] rounded-2xl p-6 shadow-lg border border-neutral-100 dark:border-neutral-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-2">
                                        Selected Circuit
                                    </span>
                                    <h2 className="text-2xl font-bold text-text-light dark:text-white">{circuit.title}</h2>
                                    <div className="flex gap-4 mt-2 text-sm text-text-muted-light dark:text-gray-400 font-medium">
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">calendar_today</span> {circuit.date}</span>
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">location_on</span> {circuit.location}</span>
                                    </div>
                                </div>
                                <button onClick={onBack} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-text-light dark:text-white text-sm font-bold transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">edit</span> Edit
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Registration Details Card */}
                    <div className="rounded-3xl bg-white dark:bg-[#2a2418] p-6 md:p-8 shadow-sm border border-neutral-100 dark:border-neutral-800">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-light dark:border-neutral-800">
                            <h3 className="text-xl font-bold text-text-light dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">badge</span>
                                Registration Details
                            </h3>
                        </div>
                        {renderRegistrationDetails()}
                    </div>
                </div>

                {/* Sticky Order Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 flex flex-col gap-6">
                        <div className="rounded-3xl bg-white dark:bg-[#2a2418] shadow-xl shadow-neutral-200/50 dark:shadow-none border border-neutral-100 dark:border-neutral-800 overflow-hidden">
                            <div className="bg-neutral-50 dark:bg-[#342d22] p-6 border-b border-border-light dark:border-neutral-800">
                                <h3 className="text-lg font-bold text-text-light dark:text-white">Order Summary</h3>
                            </div>
                            <div className="p-6 flex flex-col gap-4">
                                {lineItems.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <span className="text-text-muted-light dark:text-gray-400">{item.label}</span>
                                        <span className="text-text-light dark:text-white font-bold">{formatCurrency(item.amount)}</span>
                                    </div>
                                ))}

                                <div className="h-px w-full bg-border-light dark:bg-neutral-800 my-2"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-text-light dark:text-white text-lg font-bold">Total</span>
                                    <span className="text-primary text-2xl font-black">{formatCurrency(totalCost)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-start gap-3 px-1">
                                <input className="mt-1 size-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-neutral-800 cursor-pointer" id="terms" name="terms" type="checkbox" />
                                <label className="text-sm text-text-muted-light dark:text-gray-400 cursor-pointer" htmlFor="terms">
                                    I agree to the <span className="text-primary font-bold hover:underline">Terms & Conditions</span> and <span className="text-primary font-bold hover:underline">Privacy Policy</span>.
                                </label>
                            </div>

                            <button
                                onClick={onSubmit}
                                className="w-full h-14 rounded-xl bg-primary text-white text-lg font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                            >
                                <span>Proceed to Payment</span>
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>

                            <button
                                onClick={onBack}
                                className="w-full h-12 rounded-xl border border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-text-muted-light dark:text-gray-400 font-bold transition-all cursor-pointer"
                            >
                                Back
                            </button>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-text-muted-light dark:text-gray-500 text-xs">
                            <span className="material-symbols-outlined text-sm">lock</span>
                            <span>Secured by SSL Encryption</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step5Review;
