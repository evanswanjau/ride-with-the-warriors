import { useState } from 'react';
import type { FamilyDetails, JuniorRider } from '../types';

interface FamilyRegistrationFlowProps {
    data: FamilyDetails;
    onChange: (data: FamilyDetails) => void;
    onNext: () => void;
    onBack: () => void;
    errors: Record<string, string>;
}

const FamilyRegistrationFlow = ({ data, onChange, onNext, onBack, errors }: FamilyRegistrationFlowProps) => {
    const categories = [
        { id: 'cubs', title: 'Cubs (Ages 3-5)', icon: 'pedal_bike' },
        { id: 'champs', title: 'Champs (Ages 6-10)', icon: 'directions_bike' },
        { id: 'tigers', title: 'Tigers (Ages 11-14)', icon: 'sports_score' }
    ];



    const [activeCategory, setActiveCategory] = useState('cubs');

    const addRider = (category: string) => {
        onChange({
            ...data,
            riders: {
                ...data.riders,
                [category]: [
                    ...data.riders[category],
                    { id: Math.random().toString(36).substr(2, 9), firstName: '', lastName: '', dob: '', gender: '' }
                ]
            }
        });
    };

    const removeRider = (category: string, id: string) => {
        onChange({
            ...data,
            riders: {
                ...data.riders,
                [category]: data.riders[category].filter(r => r.id !== id)
            }
        });
    };

    const updateRider = (category: string, id: string, field: keyof JuniorRider, value: string) => {
        onChange({
            ...data,
            riders: {
                ...data.riders,
                [category]: data.riders[category].map(r => r.id === id ? { ...r, [field]: value } : r)
            }
        });
    };

    const updateGuardian = (field: string, value: string) => {
        onChange({
            ...data,
            guardian: { ...data.guardian, [field]: value }
        });
    };

    return (
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1 w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-wrap justify-between gap-3 px-4">
                <div className="flex min-w-72 flex-col gap-3">
                    <h1 className="text-text-light dark:text-white tracking-tight text-[32px] md:text-4xl font-bold leading-tight">
                        Who's riding today?
                    </h1>
                    <p className="text-text-muted-light dark:text-gray-400 text-base font-normal leading-normal max-w-2xl">
                        Register your little warriors for their specific age groups. You can add multiple riders across different categories.
                    </p>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="px-4">
                <div className="flex flex-col sm:flex-row border-b border-border-light dark:border-white/10 sm:justify-between gap-2 sm:gap-0">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`group flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 flex-1 transition-all ${activeCategory === cat.id
                                ? 'border-primary text-text-light dark:text-white bg-white dark:bg-white/5 sm:bg-transparent rounded-t-lg sm:rounded-none'
                                : 'border-transparent text-text-muted-light dark:text-gray-400 hover:border-border-light dark:hover:border-white/20'
                                }`}
                        >
                            <span className={`material-symbols-outlined mb-2 text-[28px] ${activeCategory === cat.id ? 'text-primary' : 'opacity-50'}`}>
                                {cat.icon}
                            </span>
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">{cat.title}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Rider List */}
            <div className="px-4 flex flex-col gap-8">
                {data.riders[activeCategory].map((rider: JuniorRider, index: number) => (
                    <div key={rider.id} className="bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-white/5 shadow-sm overflow-hidden transform transition-all hover:shadow-md">
                        <div className="bg-primary/5 dark:bg-white/5 p-4 border-b border-border-light dark:border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">face_6</span>
                                <h3 className="text-text-light dark:text-white text-lg font-bold leading-tight">
                                    {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1, -1)} Rider {index + 1}
                                </h3>
                            </div>
                            <button
                                onClick={() => removeRider(activeCategory, rider.id)}
                                className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[16px]">delete</span> Remove
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-text-light dark:text-gray-200">First Name</label>
                                <input
                                    className={`h-11 rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 focus:ring-1 outline-none transition-all placeholder:text-text-muted-light ${errors[`${rider.id}.firstName`]
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-border-light dark:border-gray-600 focus:ring-primary focus:border-primary'
                                        }`}
                                    placeholder="e.g. Leo"
                                    type="text"
                                    value={rider.firstName}
                                    onChange={(e) => updateRider(activeCategory, rider.id, 'firstName', e.target.value)}
                                />
                                {errors[`${rider.id}.firstName`] && <span className="text-red-500 text-xs font-medium">{errors[`${rider.id}.firstName`]}</span>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-text-light dark:text-gray-200">Last Name</label>
                                <input
                                    className={`h-11 rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 focus:ring-1 outline-none transition-all placeholder:text-text-muted-light ${errors[`${rider.id}.lastName`]
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-border-light dark:border-gray-600 focus:ring-primary focus:border-primary'
                                        }`}
                                    placeholder="e.g. Walker"
                                    type="text"
                                    value={rider.lastName}
                                    onChange={(e) => updateRider(activeCategory, rider.id, 'lastName', e.target.value)}
                                />
                                {errors[`${rider.id}.lastName`] && <span className="text-red-500 text-xs font-medium">{errors[`${rider.id}.lastName`]}</span>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-text-light dark:text-gray-200">Date of Birth</label>
                                <div className="relative">
                                    <input
                                        className={`w-full h-11 rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 focus:ring-1 outline-none transition-all ${errors[`${rider.id}.dob`]
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-border-light dark:border-gray-600 focus:ring-primary focus:border-primary'
                                            }`}
                                        placeholder="dd/mm/yyyy"
                                        type="date"
                                        value={rider.dob}
                                        onChange={(e) => updateRider(activeCategory, rider.id, 'dob', e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-text-muted-light dark:text-gray-400">
                                    {activeCategory === 'cubs' ? 'Must be between 3 and 5 years old.' : activeCategory === 'champs' ? 'Must be between 6 and 10 years old.' : 'Must be between 11 and 14 years old.'}
                                </p>
                                {errors[`${rider.id}.dob`] && <span className="text-red-500 text-xs font-medium">{errors[`${rider.id}.dob`]}</span>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-text-light dark:text-gray-200">Gender</label>
                                <div className="flex items-center gap-6 h-11 px-1">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            className="w-5 h-5 text-primary border-border-light focus:ring-primary bg-white dark:bg-gray-900 dark:border-gray-600 transition-all form-radio"
                                            name={`gender_${rider.id}`}
                                            type="radio"
                                            value="male"
                                            checked={rider.gender === 'male'}
                                            onChange={() => updateRider(activeCategory, rider.id, 'gender', 'male')}
                                        />
                                        <span className="text-text-light dark:text-white text-sm font-medium group-hover:text-primary transition-colors">Male</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            className="w-5 h-5 text-primary border-border-light focus:ring-primary bg-white dark:bg-gray-900 dark:border-gray-600 transition-all form-radio"
                                            name={`gender_${rider.id}`}
                                            type="radio"
                                            value="female"
                                            checked={rider.gender === 'female'}
                                            onChange={() => updateRider(activeCategory, rider.id, 'gender', 'female')}
                                        />
                                        <span className="text-text-light dark:text-white text-sm font-medium group-hover:text-primary transition-colors">Female</span>
                                    </label>
                                </div>
                                {errors[`${rider.id}.gender`] && <span className="text-red-500 text-xs font-medium">{errors[`${rider.id}.gender`]}</span>}
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => addRider(activeCategory)}
                    className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-border-light dark:border-gray-600 rounded-xl text-text-muted-light dark:text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group"
                >
                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_circle</span>
                    <span className="font-bold">Add Another {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1, -1)}</span>
                </button>

                <div className="h-px w-full bg-border-light dark:bg-white/10 my-2"></div>

                {/* Guardian Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 px-1">
                        <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
                        <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Guardian Information</h3>
                        <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">Required</span>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-l-4 border-l-primary shadow-sm border-y border-r border-border-light dark:border-white/5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-1.5 md:col-span-3">
                                <label className="text-sm font-semibold text-text-light dark:text-gray-200">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={`h-11 rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 focus:ring-1 outline-none transition-all placeholder:text-text-muted-light ${errors['guardian.fullName']
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-border-light dark:border-gray-600 focus:ring-primary focus:border-primary'
                                        }`}
                                    placeholder="Parent or Legal Guardian Name"
                                    type="text"
                                    value={data.guardian.fullName}
                                    onChange={(e) => updateGuardian('fullName', e.target.value)}
                                />
                                {errors['guardian.fullName'] && <span className="text-red-500 text-xs font-medium">{errors['guardian.fullName']}</span>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-text-light dark:text-gray-200">
                                    Emergency Phone <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light text-[20px]">phone</span>
                                    <input
                                        className={`w-full h-11 rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white pl-10 pr-4 focus:ring-1 outline-none transition-all placeholder:text-text-muted-light ${errors['guardian.emergencyPhone']
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-border-light dark:border-gray-600 focus:ring-primary focus:border-primary'
                                            }`}
                                        placeholder="+254 7XX XXX XXX"
                                        type="tel"
                                        value={data.guardian.emergencyPhone}
                                        onChange={(e) => updateGuardian('emergencyPhone', e.target.value)}
                                    />
                                </div>
                                {errors['guardian.emergencyPhone'] && <span className="text-red-500 text-xs font-medium">{errors['guardian.emergencyPhone']}</span>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-text-light dark:text-gray-200">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light text-[20px]">email</span>
                                    <input
                                        className={`w-full h-11 rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white pl-10 pr-4 focus:ring-1 outline-none transition-all placeholder:text-text-muted-light ${errors['guardian.email']
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-border-light dark:border-gray-600 focus:ring-primary focus:border-primary'
                                            }`}
                                        placeholder="guardian@example.com"
                                        type="email"
                                        value={data.guardian.email}
                                        onChange={(e) => updateGuardian('email', e.target.value)}
                                    />
                                </div>
                                {errors['guardian.email'] && <span className="text-red-500 text-xs font-medium">{errors['guardian.email']}</span>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-text-light dark:text-gray-200">
                                    Relationship to Child <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        className={`w-full h-11 rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 appearance-none focus:ring-1 outline-none transition-all cursor-pointer ${errors['guardian.relationship']
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-border-light dark:border-gray-600 focus:ring-primary focus:border-primary'
                                            }`}
                                        value={data.guardian.relationship}
                                        onChange={(e) => updateGuardian('relationship', e.target.value)}
                                    >
                                        <option disabled value="">Select relationship</option>
                                        <option value="parent">Parent</option>
                                        <option value="grandparent">Grandparent</option>
                                        <option value="legal_guardian">Legal Guardian</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted-light">expand_more</span>
                                </div>
                                {errors['guardian.relationship'] && <span className="text-red-500 text-xs font-medium">{errors['guardian.relationship']}</span>}
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-text-muted-light dark:text-gray-400 px-1">
                        <span className="material-symbols-outlined align-middle text-[18px] mr-1">info</span>
                        This guardian will be the primary contact for all registered children during the event.
                    </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-8 pb-12">
                    <button
                        onClick={onBack}
                        className="w-full sm:w-auto px-8 h-12 rounded-lg border border-border-light dark:border-gray-600 text-text-light dark:text-white font-bold hover:bg-background-light dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        Back
                    </button>
                    <button
                        onClick={onNext}
                        className="w-full sm:w-auto px-10 h-12 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                    >
                        Next: Payment
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[20px]">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FamilyRegistrationFlow;
