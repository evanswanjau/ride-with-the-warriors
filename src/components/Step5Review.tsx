import { useState } from 'react';
import { CIRCUITS } from '../constants';
import type { RiderDetails, TeamDetails, FamilyDetails } from '../types';
import { getClassification, calculateAge } from '../utils';
import blitzIndividual from '../assets/images/blitz-individual.jpeg';
import blitzTeam from '../assets/images/blitz-team.jpeg';
import reconIndividual from '../assets/images/recon-individual.jpeg';
import reconTeam from '../assets/images/recon-team.jpeg';
import corporateIndividual from '../assets/images/corporate-individual.jpeg';
import corporateTeam from '../assets/images/corporate-team.jpeg';
import familyImage from '../assets/images/family.jpeg';

interface Step5ReviewProps {
    onBack: () => void;
    onSubmit: () => void;
    registrationType: string;
    selectedCircuitId: string;
    riderData: RiderDetails;
    teamData: TeamDetails;
    familyData: FamilyDetails;
    isSubmitting?: boolean;
    registrationId: string | null;
    pricingCategories: any[];
}

const Step5Review = ({
    onBack,
    onSubmit,
    registrationType,
    selectedCircuitId,
    riderData,
    teamData,
    familyData,
    isSubmitting = false,
    registrationId,
    pricingCategories = []
}: Step5ReviewProps) => {
    const [termsAgreed, setTermsAgreed] = useState(false);

    const circuit = CIRCUITS.find(c => c.id === selectedCircuitId) || CIRCUITS[0];

    const getReviewImage = () => {
        if (registrationType === 'family') return familyImage;

        if (registrationType === 'individual') {
            switch (selectedCircuitId) {
                case 'blitz': return blitzIndividual;
                case 'recon': return reconIndividual;
                case 'corporate': return corporateIndividual;
                default: return blitzIndividual;
            }
        }

        if (registrationType === 'team') {
            switch (selectedCircuitId) {
                case 'blitz': return blitzTeam;
                case 'recon': return reconTeam;
                case 'corporate': return corporateTeam;
                default: return blitzTeam;
            }
        }

        return circuit.imageUrl || '';
    };

    const reviewImage = getReviewImage();

    // pricing and classification logic
    let totalCost = 0;
    const lineItems: { label: string; amount: number; count?: number; color?: string; category?: string; regRange?: string }[] = [];

    if (registrationType === 'individual') {
        const age = calculateAge(riderData.dob || '');
        const classification = getClassification(pricingCategories, selectedCircuitId, 'individual', age);
        totalCost = classification.price;
        lineItems.push({
            label: `${riderData.firstName} - ${classification.category}`,
            amount: classification.price,
            category: classification.category,
            regRange: registrationId ? registrationId : classification.regRange,
            color: classification.hexColor
        });
    } else if (registrationType === 'team') {
        const classification = getClassification(pricingCategories, selectedCircuitId, 'team');
        totalCost = classification.price;
        lineItems.push({
            label: `Team: ${teamData.teamName}`,
            amount: classification.price,
            category: classification.category,
            regRange: registrationId ? registrationId : classification.regRange,
            color: classification.hexColor
        });
    } else if (registrationType === 'family') {
        Object.entries(familyData.riders).forEach(([catId, riders]) => {
            if (riders.length > 0) {
                const classification = getClassification(pricingCategories, 'family', 'family', null, catId);
                const cost = riders.length * classification.price;
                totalCost += cost;
                lineItems.push({
                    label: `${classification.category} (x${riders.length})`,
                    amount: cost,
                    count: riders.length,
                    category: classification.category,
                    regRange: registrationId ? registrationId : classification.regRange,
                    color: classification.hexColor
                });
            }
        });
    }

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString() + '/=';
    };

    const renderRegistrationDetails = () => {
        if (registrationType === 'individual') {
            const age = calculateAge(riderData.dob || '');

            return (
                <div className="flex flex-col gap-8">
                    {/* Classification info moved to circuit card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        <div>
                            <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Full Name</p>
                            <p className="text-sm text-black dark:text-white font-bold leading-relaxed">{riderData.firstName} {riderData.lastName}</p>
                        </div>
                        <div>
                            <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Gender</p>
                            <p className="text-sm text-black dark:text-white font-bold leading-relaxed capitalize">{riderData.gender}</p>
                        </div>
                        <div>
                            <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Email Address</p>
                            <p className="text-sm text-black dark:text-white font-bold leading-relaxed">{riderData.email}</p>
                        </div>
                        <div>
                            <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Phone Number</p>
                            <p className="text-sm text-black dark:text-white font-bold leading-relaxed">{riderData.phoneNumber}</p>
                        </div>
                        <div>
                            <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">ID / Passport</p>
                            <p className="text-sm text-black dark:text-white font-bold leading-relaxed">{riderData.idNumber}</p>
                        </div>
                        <div>
                            <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Date of Birth</p>
                            <p className="text-sm text-black dark:text-white font-bold leading-relaxed">{riderData.dob} (Age: {age})</p>
                        </div>
                        <div>
                            <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">T-shirt Size</p>
                            <p className="text-sm text-black dark:text-white font-bold leading-relaxed">{riderData.tshirtSize || 'Not selected'}</p>
                        </div>
                        <div>
                            <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Emergency Contact</p>
                            <p className="text-sm text-black dark:text-white font-bold leading-relaxed">{riderData.emergencyContactName} ({riderData.emergencyPhone})</p>
                        </div>
                    </div>
                </div>
            );
        } else if (registrationType === 'team') {
            return (
                <div className="flex flex-col gap-6">
                    {/* Classification info moved to circuit card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        <div>
                            <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Team Name</p>
                            <p className="text-sm text-black dark:text-white font-bold leading-relaxed">{teamData.teamName}</p>
                        </div>
                        <div>
                            <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Team Size</p>
                            <p className="text-sm text-black dark:text-white font-bold leading-relaxed">{teamData.members.length} Members</p>
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
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-bold text-primary">{member.tshirtSize}</span>
                                            <span className="text-[8px] uppercase tracking-tighter text-neutral-400">Size</span>
                                        </div>
                                        <div className="h-6 w-px bg-neutral-100 dark:bg-neutral-700"></div>
                                        <span className="text-xs font-medium text-text-light dark:text-gray-300">{member.gender === 'male' ? 'M' : 'F'} (Age: {calculateAge(member.dob)})</span>
                                    </div>
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
                            <p className="text-sm text-black dark:text-white font-bold leading-relaxed">{familyData.guardian.firstName} {familyData.guardian.lastName}</p>
                        </div>
                        <div>
                            <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Participation</p>
                            <p className="text-sm text-black dark:text-white font-bold leading-relaxed capitalize">
                                {familyData.guardian.participation === 'none' ? 'Not riding' :
                                    familyData.guardian.participation === 'mom' ? 'Parent (5km)' :
                                        'Riding in another circuit'}
                            </p>
                        </div>
                        <div>
                            <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Emergency Contact</p>
                            <p className="text-sm text-black dark:text-white font-bold leading-relaxed">{familyData.guardian.emergencyPhone}</p>
                        </div>
                        <div>
                            <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Email</p>
                            <p className="text-sm text-black dark:text-white font-bold leading-relaxed">{familyData.guardian.email}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-text-muted-light dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Registered Riders</p>
                        <div className="flex flex-col gap-4">
                            {Object.entries(familyData.riders).map(([category, riders]) => {
                                if (riders.length === 0) return null;
                                const classification = getClassification(pricingCategories, 'family', 'family', null, category);
                                return (
                                    <div key={category} className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-white uppercase tracking-wider px-2 py-1 rounded shadow-sm" style={{ backgroundColor: classification.hexColor }}>
                                                {classification.category}
                                            </span>
                                            <span className="text-[10px] font-bold text-text-muted-light dark:text-gray-400 uppercase tracking-widest leading-none">REG: {classification.regRange}</span>
                                        </div>
                                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-border-light dark:border-neutral-700 overflow-hidden">
                                            {riders.map((rider, idx) => (
                                                <div key={rider.id || idx} className="flex items-center justify-between p-3 border-b border-border-light dark:border-neutral-700 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-neutral-400 text-sm">pedal_bike</span>
                                                        <span className="text-sm font-bold text-text-light dark:text-white">{rider.firstName} {rider.lastName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-xs font-bold text-primary">{rider.tshirtSize}</span>
                                                            <span className="text-[8px] uppercase tracking-tighter text-neutral-400">Size</span>
                                                        </div>
                                                        <div className="h-6 w-px bg-neutral-100 dark:bg-neutral-700"></div>
                                                        <span className="text-xs font-medium text-text-muted-light dark:text-gray-400 uppercase">{rider.gender || 'Any'}</span>
                                                        <span className="text-xs font-bold text-primary">{calculateAge(rider.dob)} Years</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
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
                <div className="lg:col-span-2">
                    <div className="group relative overflow-hidden rounded-[32px] bg-white dark:bg-[#2a2418] shadow-2xl shadow-neutral-200/50 dark:shadow-none border border-neutral-100 dark:border-neutral-800 transition-all duration-500 hover:shadow-3xl">
                        {/* High-Impact Header Image */}
                        <div className="relative h-56 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent z-10"></div>
                            <div
                                className="h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                style={{ backgroundImage: `url("${reviewImage}")` }}
                            ></div>

                            {/* Premium Floating Badge */}
                            <div className="absolute top-6 left-6 z-20 flex flex-col gap-1 translate-y-2 opacity-0 animate-in fade-in slide-in-from-top-4 duration-700 fill-mode-forwards">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border border-white/30">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    Confirmed Selection
                                </span>
                            </div>

                            {/* Glassmorphism Edit Button */}
                            <button
                                onClick={onBack}
                                className="absolute top-6 right-6 z-30 flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/25 backdrop-blur-xl text-white text-xs font-bold transition-all border border-white/20 shadow-2xl group/btn"
                            >
                                <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">edit</span>
                                <span className="tracking-wide">REFINE CHOICE</span>
                            </button>

                            {/* Distance Badge */}
                            <div className="absolute bottom-6 left-6 z-20">
                                <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-black bg-white/90 dark:bg-black/80 text-gray-900 dark:text-gray-100 backdrop-blur-md shadow-2xl border border-white/20">
                                    <span className="material-symbols-outlined text-[20px] mr-2">distance</span>
                                    {circuit.distance}
                                </span>
                            </div>
                        </div>

                        {/* Unified Card Content */}
                        <div className="flex flex-col">
                            {/* Section 1: Official Credentials */}
                            <div className="p-6 md:p-8 flex flex-col gap-6">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold">Official Entry</span>
                                    <h2 className="text-3xl text-text-light dark:text-white leading-tight tracking-tight uppercase font-bold">
                                        {circuit.title}
                                    </h2>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-5 py-1 px-1">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-primary/5 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Event Date</span>
                                                <span className="text-sm text-text-light dark:text-white font-bold leading-none">{circuit.date}</span>
                                            </div>
                                        </div>
                                        <div className="h-8 w-px bg-neutral-100 dark:bg-neutral-800 hidden sm:block"></div>
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-primary/5 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Location</span>
                                                <span className="text-sm text-text-light dark:text-white font-bold leading-none">{circuit.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {(registrationType === 'individual' || registrationType === 'team') && (() => {
                                        const age = registrationType === 'individual' ? calculateAge(riderData.dob || '') : null;
                                        const classification = getClassification(pricingCategories, selectedCircuitId, registrationType, age);
                                        return (
                                            <div
                                                className="flex flex-wrap items-center gap-10 py-3 px-6 rounded-2xl border border-white/20 shadow-inner"
                                                style={{
                                                    backgroundColor: classification.hexColor || '#f97316',
                                                }}
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[10px] uppercase tracking-wider text-white/70 font-bold">Category</span>
                                                    <span className="text-base text-white font-bold uppercase tracking-tight leading-none">{classification.category}</span>
                                                </div>
                                                <div className="h-8 w-px bg-white/20 hidden sm:block"></div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[10px] uppercase tracking-wider text-white/70 font-bold">Bib Number</span>
                                                    <span className="text-base text-white font-bold tracking-wide leading-none">
                                                        {registrationId ? registrationId : classification.regRange}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {registrationType === 'family' && (
                                        <div className="bg-neutral-50 dark:bg-neutral-800/50 py-2.5 px-4 rounded-xl border border-neutral-100 dark:border-neutral-700/50">
                                            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Registration Summary</span>
                                            <p className="text-base text-text-light dark:text-white font-bold">
                                                Family Unit — {Object.values(familyData.riders).flat().length} Riders Registered
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section 2: Registration Details */}
                            <div className="px-6 md:px-8 pb-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">person</span>
                                    <h3 className="text-lg font-bold text-text-light dark:text-white">Full Personnel Details</h3>
                                </div>
                                {renderRegistrationDetails()}
                            </div>
                        </div>
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
                                    <div key={index} className="flex flex-col gap-1 border-b border-border-light dark:border-neutral-800 pb-3 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col">
                                                <span className="text-text-light dark:text-white font-bold leading-snug">{item.label}</span>
                                                {item.regRange && (
                                                    <span className="text-[10px] text-text-muted-light dark:text-gray-400 font-bold uppercase tracking-wider">
                                                        Reg: {item.regRange}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-text-light dark:text-white font-bold">{formatCurrency(item.amount)}</span>
                                        </div>
                                        {item.color && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                <span className="text-[10px] font-bold text-text-muted-light dark:text-gray-500 uppercase tracking-widest leading-none">Category Color</span>
                                            </div>
                                        )}
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
                                <input
                                    className="mt-1 size-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-neutral-800 cursor-pointer"
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    checked={termsAgreed}
                                    onChange={(e) => setTermsAgreed(e.target.checked)}
                                />
                                <label className="text-sm text-text-muted-light dark:text-gray-400 cursor-pointer" htmlFor="terms">
                                    I agree to the <a
                                        href="/terms-and-conditions"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary font-bold hover:underline"
                                    >Terms & Conditions</a> and <a
                                        href="/privacy-policy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary font-bold hover:underline"
                                    >Privacy Policy</a>.
                                </label>
                            </div>

                            <button
                                onClick={onSubmit}
                                disabled={isSubmitting || !termsAgreed}
                                className="w-full h-14 rounded-xl bg-primary text-white text-lg font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{isSubmitting ? 'Processing...' : 'Proceed to Payment'}</span>
                                {!isSubmitting && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
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
