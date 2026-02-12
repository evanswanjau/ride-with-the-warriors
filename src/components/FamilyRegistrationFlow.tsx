import { useState } from 'react';
import type { FamilyDetails, JuniorRider } from '../types';
import ErrorBanner from './ErrorBanner';
import { calculateAge } from '../utils';


import {
    AiOutlineExperiment,
    AiOutlineUser,
    AiOutlineDelete,
    AiOutlinePlusCircle,
    AiOutlineSafety,
    AiOutlineInfoCircle,
    AiOutlineArrowLeft,
    AiOutlineArrowRight,
    AiOutlineDown
} from 'react-icons/ai';
import {
    MdPedalBike,
    MdDirectionsBike,
    MdPersonOff,
    MdWoman
} from 'react-icons/md';

interface FamilyRegistrationFlowProps {
    data: FamilyDetails;
    onChange: (data: FamilyDetails) => void;
    onNext: () => void;
    onBack: () => void;
    errors: Record<string, string>;
    formErrors: string[];
    isSubmitting: boolean;
}

const FamilyRegistrationFlow = ({ data, onChange, onNext, onBack, errors, formErrors, isSubmitting }: FamilyRegistrationFlowProps) => {
    const categories = [
        { id: 'cubs', title: 'Cubs (Ages 4-8)', icon: MdPedalBike },
        { id: 'champs', title: 'Champs (Ages 9-13)', icon: MdDirectionsBike }
    ];

    const [activeCategory, setActiveCategory] = useState('cubs');

    const addRider = (category: string) => {
        onChange({
            ...data,
            riders: {
                ...data.riders,
                [category]: [
                    ...data.riders[category],
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        firstName: '',
                        lastName: '',
                        dob: '',
                        gender: category === 'tigers' ? 'female' : '',
                        tshirtSize: '',
                        idNumber: '',
                        emergencyContactName: '',
                        emergencyPhone: ''
                    }
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
        const updatedGuardian = { ...data.guardian, [field]: value };

        // Sync fullName
        if (field === 'firstName' || field === 'lastName') {
            updatedGuardian.fullName = `${field === 'firstName' ? value : updatedGuardian.firstName} ${field === 'lastName' ? value : updatedGuardian.lastName}`.trim();
        }

        let updatedRiders = { ...data.riders };

        // Handle Parent syncing
        if (updatedGuardian.participation === 'mom') {
            const momRider: JuniorRider = {
                id: 'mom-rider-id', // Fixed ID for the synced mom
                firstName: updatedGuardian.firstName,
                lastName: updatedGuardian.lastName,
                dob: updatedGuardian.dob,
                idNumber: updatedGuardian.idNumber,
                gender: updatedGuardian.gender || 'female',
                tshirtSize: updatedGuardian.tshirtSize,
                emergencyContactName: '',
                emergencyPhone: updatedGuardian.phoneNumber
            };
            updatedRiders.tigers = [momRider];
        } else {
            updatedRiders.tigers = [];
        }

        onChange({
            ...data,
            guardian: updatedGuardian,
            riders: updatedRiders
        });
    };

    return (
        <div className="layout-content-container flex flex-col flex-1 w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                <div className="flex items-center">
                    <button
                        onClick={() => {
                            onChange({
                                guardian: {
                                    firstName: 'Jane',
                                    lastName: 'Doe',
                                    fullName: 'Jane Doe',
                                    dob: '1985-06-20',
                                    email: `jane.doe.${Math.floor(Math.random() * 1000)}@example.com`,
                                    phoneNumber: '0712345678',
                                    idNumber: '12345678',
                                    gender: 'female',
                                    participation: 'mom',
                                    tshirtSize: 'M',
                                    relationship: 'Mother',
                                    emergencyPhone: '0788990011',
                                    emergencyContactName: 'John Doe'
                                },
                                riders: {
                                    cubs: [{
                                        id: Math.random().toString(36).substr(2, 9),
                                        firstName: 'Little',
                                        lastName: 'Doe',
                                        dob: '2020-01-01',
                                        gender: 'male',
                                        tshirtSize: 'S',
                                        idNumber: '',
                                        emergencyContactName: '',
                                        emergencyPhone: ''
                                    }],
                                    champs: [{
                                        id: Math.random().toString(36).substr(2, 9),
                                        firstName: 'Big',
                                        lastName: 'Doe',
                                        dob: '2015-01-01',
                                        gender: 'female',
                                        tshirtSize: 'L',
                                        idNumber: '',
                                        emergencyContactName: '',
                                        emergencyPhone: ''
                                    }],
                                    tigers: [
                                        {
                                            id: 'mom-rider-id',
                                            firstName: 'Jane',
                                            lastName: 'Doe',
                                            dob: '1985-06-20',
                                            idNumber: '12345678',
                                            gender: 'female',
                                            tshirtSize: 'M',
                                            emergencyContactName: '',
                                            emergencyPhone: '0712345678'
                                        }
                                    ]
                                }
                            });
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all font-semibold text-sm w-fit h-fit"
                        type="button"
                    >
                        <AiOutlineExperiment className="text-lg" />
                        Fill with Test Data
                    </button>
                </div>
            </div>

            <div className="px-4">
                <ErrorBanner errors={formErrors} />
            </div>

            {/* Category Tabs */}
            <div className="px-4">
                <div className="flex flex-col sm:flex-row border-b border-[#e6e0d4] dark:border-[#2d332d] sm:justify-between gap-2 sm:gap-0">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`group flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 flex-1 transition-all ${activeCategory === cat.id
                                ? 'border-primary text-text-light dark:text-white bg-white dark:bg-[#2a2418] sm:bg-transparent rounded-t-lg sm:rounded-none'
                                : 'border-transparent text-text-muted-light dark:text-gray-400 hover:border-border-light dark:hover:border-white/20'
                                }`}
                            disabled={isSubmitting}
                        >
                            <cat.icon className={`mb-2 text-[28px] ${activeCategory === cat.id ? 'text-primary' : 'opacity-50'}`} />
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">{cat.title}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Rider List */}
            <div className="px-4 flex flex-col gap-8">
                {data.riders[activeCategory].map((rider: JuniorRider, index: number) => (
                    <div key={rider.id} className="bg-white dark:bg-[#2a2418] rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden transform transition-all hover:shadow-md">
                        <div className="bg-primary/5 dark:bg-white/5 p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <AiOutlineUser className="text-primary text-xl" />
                                <h3 className="text-text-light dark:text-white text-lg font-bold leading-tight">
                                    {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1, -1)} Rider {index + 1}
                                </h3>
                            </div>
                            <button
                                onClick={() => removeRider(activeCategory, rider.id)}
                                className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 transition-colors bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full"
                                disabled={isSubmitting}
                            >
                                <AiOutlineDelete className="text-[16px]" /> Delete
                            </button>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <div className="flex flex-col gap-2">
                                <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                    First Name <span className="text-red-500">*</span>
                                </span>
                                <input
                                    className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors[`${rider.id}.firstName`]
                                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                        }`}
                                    placeholder="e.g. Leo"
                                    type="text"
                                    value={rider.firstName}
                                    onChange={(e) => updateRider(activeCategory, rider.id, 'firstName', e.target.value)}
                                    disabled={isSubmitting}
                                />
                                {errors[`${rider.id}.firstName`] && <span className="text-red-500 text-xs font-medium">{errors[`${rider.id}.firstName`]}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                    Last Name <span className="text-red-500">*</span>
                                </span>
                                <input
                                    className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors[`${rider.id}.lastName`]
                                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                        }`}
                                    placeholder="e.g. Walker"
                                    type="text"
                                    value={rider.lastName}
                                    onChange={(e) => updateRider(activeCategory, rider.id, 'lastName', e.target.value)}
                                    disabled={isSubmitting}
                                />
                                {errors[`${rider.id}.lastName`] && <span className="text-red-500 text-xs font-medium">{errors[`${rider.id}.lastName`]}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider flex items-center justify-between">
                                    <span>Date of Birth <span className="text-red-500">*</span></span>
                                    {rider.dob && (
                                        <span className="text-primary normal-case font-bold bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                                            {calculateAge(rider.dob)} years old
                                        </span>
                                    )}
                                </span>
                                <input
                                    className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors[`${rider.id}.dob`]
                                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                        }`}
                                    type="date"
                                    value={rider.dob}
                                    onChange={(e) => updateRider(activeCategory, rider.id, 'dob', e.target.value)}
                                    disabled={isSubmitting}
                                />
                                <p className="text-[10px] font-bold text-text-muted-light dark:text-gray-500 uppercase tracking-widest mt-1">
                                    {activeCategory === 'cubs' ? 'Age Range: 4-8 Years' : 'Age Range: 9-13 Years'}
                                </p>
                                {errors[`${rider.id}.dob`] && <span className="text-red-500 text-xs font-medium">{errors[`${rider.id}.dob`]}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                    T-shirt Size <span className="text-red-500">*</span>
                                </span>
                                <div className="relative">
                                    <select
                                        className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all appearance-none cursor-pointer ${errors[`${rider.id}.tshirtSize`]
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-300 dark:border-gray-700 focus:border-primary'
                                            }`}
                                        value={rider.tshirtSize}
                                        onChange={(e) => updateRider(activeCategory, rider.id, 'tshirtSize', e.target.value)}
                                        disabled={isSubmitting}
                                    >
                                        <option value="">Select Size</option>
                                        <option value="XS">Youth XS</option>
                                        <option value="S">Youth S</option>
                                        <option value="M">Youth M</option>
                                        <option value="L">Youth L</option>
                                        <option value="XL">Youth XL</option>
                                        <option value="S_ADULT">Adult S</option>
                                        <option value="M_ADULT">Adult M</option>
                                    </select>
                                    <AiOutlineDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                </div>
                                {errors[`${rider.id}.tshirtSize`] && <span className="text-red-500 text-xs font-medium">{errors[`${rider.id}.tshirtSize`]}</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                    Gender <span className="text-red-500">*</span>
                                </span>
                                <div className="flex gap-6 items-center h-[42px] px-1">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                className="peer sr-only"
                                                name={`gender_${rider.id}`}
                                                type="radio"
                                                value="male"
                                                checked={rider.gender === 'male'}
                                                onChange={() => updateRider(activeCategory, rider.id, 'gender', 'male')}
                                                disabled={isSubmitting}
                                            />
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 peer-checked:border-primary peer-checked:border-[5px] transition-all"></div>
                                        </div>
                                        <span className={`text-sm font-medium transition-colors ${rider.gender === 'male' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>Male</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                className="peer sr-only"
                                                name={`gender_${rider.id}`}
                                                type="radio"
                                                value="female"
                                                checked={rider.gender === 'female'}
                                                onChange={() => updateRider(activeCategory, rider.id, 'gender', 'female')}
                                                disabled={isSubmitting}
                                            />
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 peer-checked:border-primary peer-checked:border-[5px] transition-all"></div>
                                        </div>
                                        <span className={`text-sm font-medium transition-colors ${rider.gender === 'female' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>Female</span>
                                    </label>
                                </div>
                                {errors[`${rider.id}.gender`] && <span className="text-red-500 text-xs font-medium">{errors[`${rider.id}.gender`]}</span>}
                            </div>


                        </div>
                    </div>
                ))}

                <button
                    onClick={() => addRider(activeCategory)}
                    className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-border-light dark:border-gray-600 rounded-xl text-text-muted-light dark:text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || (activeCategory === 'tigers' && data.riders.tigers.length >= 1)}
                >
                    <AiOutlinePlusCircle className="group-hover:scale-110 transition-transform" />
                    <span className="font-bold">
                        {activeCategory === 'tigers' && data.riders.tigers.length >= 1
                            ? 'Only one Parent can be added'
                            : `${data.riders[activeCategory].length === 0 ? 'Add a' : 'Add Another'} ${activeCategory === 'tigers' ? 'Parent' : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1, -1)}`
                        }
                    </span>
                </button>

                <div className="h-px w-full bg-border-light dark:bg-white/10 my-2"></div>

                {/* Guardian Section */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2 px-1">
                        <AiOutlineSafety className="text-primary text-2xl" />
                        <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Guardian Information</h3>
                        <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border border-red-100 dark:bg-red-900/40 dark:border-red-800">Required</span>
                    </div>
                    <div className="bg-white dark:bg-[#2a2418] p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <div className="flex flex-col gap-2">
                                <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">First Name <span className="text-red-500">*</span></span>
                                <input
                                    className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors['guardian.firstName'] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-700 focus:border-primary'}`}
                                    placeholder="Jane"
                                    type="text"
                                    value={data.guardian.firstName}
                                    onChange={(e) => updateGuardian('firstName', e.target.value)}
                                    disabled={isSubmitting}
                                />
                                {errors['guardian.firstName'] && <span className="text-red-500 text-xs font-medium">{errors['guardian.firstName']}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">Last Name <span className="text-red-500">*</span></span>
                                <input
                                    className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors['guardian.lastName'] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-700 focus:border-primary'}`}
                                    placeholder="Doe"
                                    type="text"
                                    value={data.guardian.lastName}
                                    onChange={(e) => updateGuardian('lastName', e.target.value)}
                                    disabled={isSubmitting}
                                />
                                {errors['guardian.lastName'] && <span className="text-red-500 text-xs font-medium">{errors['guardian.lastName']}</span>}
                            </div>



                            <div className="flex flex-col gap-2">
                                <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">Email Address <span className="text-red-500">*</span></span>
                                <input
                                    className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors['guardian.email'] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-700 focus:border-primary'}`}
                                    placeholder="email@example.com"
                                    type="email"
                                    value={data.guardian.email}
                                    onChange={(e) => updateGuardian('email', e.target.value)}
                                    disabled={isSubmitting}
                                />
                                {errors['guardian.email'] && <span className="text-red-500 text-xs font-medium">{errors['guardian.email']}</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">Phone Number <span className="text-red-500">*</span></span>
                                <input
                                    className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors['guardian.phoneNumber'] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-700 focus:border-primary'}`}
                                    placeholder="+254 7XX XXX XXX"
                                    type="tel"
                                    value={data.guardian.phoneNumber}
                                    onChange={(e) => updateGuardian('phoneNumber', e.target.value)}
                                    disabled={isSubmitting}
                                />
                                {errors['guardian.phoneNumber'] && <span className="text-red-500 text-xs font-medium">{errors['guardian.phoneNumber']}</span>}
                            </div>

                            <div className="flex flex-col gap-2 md:col-span-2">
                                <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">Participating in the ride? <span className="text-red-500">*</span></span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {[
                                        { id: 'none', label: 'Not riding', icon: MdPersonOff },
                                        { id: 'mom', label: 'Riding as a Parent (5km)', icon: MdWoman },
                                        { id: 'other', label: 'Riding in another circuit', icon: MdDirectionsBike }
                                    ].map((opt) => (
                                        <label key={opt.id} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${data.guardian.participation === opt.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 dark:border-gray-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}>
                                            <input
                                                type="radio"
                                                name="participation"
                                                className="peer sr-only"
                                                checked={data.guardian.participation === opt.id}
                                                onChange={() => updateGuardian('participation', opt.id)}
                                            />
                                            <div className={`size-8 rounded-lg flex items-center justify-center ${data.guardian.participation === opt.id ? 'bg-primary text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'}`}>
                                                <opt.icon className="text-[20px]" />
                                            </div>
                                            <span className={`text-sm font-bold ${data.guardian.participation === opt.id ? 'text-text-light dark:text-white' : 'text-text-muted-light dark:text-gray-400'}`}>{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {data.guardian.participation === 'mom' && (
                                <>
                                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">ID / Passport Number <span className="text-red-500">*</span></span>
                                        <input
                                            className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors['guardian.idNumber'] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-700 focus:border-primary'}`}
                                            placeholder="12345678"
                                            type="text"
                                            value={data.guardian.idNumber}
                                            onChange={(e) => updateGuardian('idNumber', e.target.value)}
                                            disabled={isSubmitting}
                                        />
                                        {errors['guardian.idNumber'] && <span className="text-red-500 text-xs font-medium">{errors['guardian.idNumber']}</span>}
                                    </div>

                                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider flex items-center justify-between">
                                            <span>Date of Birth (Parent) <span className="text-red-500">*</span></span>
                                            {data.guardian.dob && (
                                                <span className="text-primary normal-case font-bold bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                                                    {calculateAge(data.guardian.dob)} years old
                                                </span>
                                            )}
                                        </span>
                                        <input
                                            className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors['guardian.dob'] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-700 focus:border-primary'}`}
                                            type="date"
                                            value={data.guardian.dob}
                                            onChange={(e) => updateGuardian('dob', e.target.value)}
                                            disabled={isSubmitting}
                                        />
                                        {errors['guardian.dob'] && <span className="text-red-500 text-xs font-medium">{errors['guardian.dob']}</span>}
                                    </div>

                                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">Gender <span className="text-red-500">*</span></span>
                                        <div className="flex gap-6 items-center h-[42px] px-1">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    className="peer sr-only"
                                                    name="guardian_gender"
                                                    type="radio"
                                                    value="male"
                                                    checked={data.guardian.gender === 'male'}
                                                    onChange={() => updateGuardian('gender', 'male')}
                                                    disabled={isSubmitting}
                                                />
                                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 peer-checked:border-primary peer-checked:border-[5px] transition-all"></div>
                                                <span className={`text-sm font-medium transition-colors ${data.guardian.gender === 'male' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>Male</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    className="peer sr-only"
                                                    name="guardian_gender"
                                                    type="radio"
                                                    value="female"
                                                    checked={data.guardian.gender === 'female'}
                                                    onChange={() => updateGuardian('gender', 'female')}
                                                    disabled={isSubmitting}
                                                />
                                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 peer-checked:border-primary peer-checked:border-[5px] transition-all"></div>
                                                <span className={`text-sm font-medium transition-colors ${data.guardian.gender === 'female' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>Female</span>
                                            </label>
                                        </div>
                                        {errors['guardian.gender'] && <span className="text-red-500 text-xs font-medium">{errors['guardian.gender']}</span>}
                                    </div>

                                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">T-shirt Size (Parent) <span className="text-red-500">*</span></span>
                                        <div className="relative">
                                            <select
                                                className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all appearance-none cursor-pointer ${errors['guardian.tshirtSize'] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-700 focus:border-primary'}`}
                                                value={data.guardian.tshirtSize}
                                                onChange={(e) => updateGuardian('tshirtSize', e.target.value)}
                                                disabled={isSubmitting}
                                            >
                                                <option value="">Select Size</option>
                                                <option value="S">Small (S)</option>
                                                <option value="M">Medium (M)</option>
                                                <option value="L">Large (L)</option>
                                                <option value="XL">Extra Large (XL)</option>
                                                <option value="XXL">Double Extra Large (XXL)</option>
                                            </select>
                                            <AiOutlineDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                        </div>
                                        {errors['guardian.tshirtSize'] && <span className="text-red-500 text-xs font-medium">{errors['guardian.tshirtSize']}</span>}
                                    </div>
                                </>
                            )}
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">Relationship <span className="text-red-500">*</span></span>
                                <div className="relative">
                                    <select
                                        className={`w-full h-[42px] rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 appearance-none outline-none transition-all cursor-pointer text-sm ${errors['guardian.relationship'] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-700 focus:border-primary'}`}
                                        value={data.guardian.relationship}
                                        onChange={(e) => updateGuardian('relationship', e.target.value)}
                                        disabled={isSubmitting}
                                    >
                                        <option value="" disabled>Select relationship</option>
                                        <option value="parent">Parent</option>
                                        <option value="legal_guardian">Legal Guardian</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <AiOutlineDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                </div>
                                {errors['guardian.relationship'] && <span className="text-red-500 text-xs font-medium">{errors['guardian.relationship']}</span>}
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-text-muted-light dark:text-gray-400 px-1">
                        <AiOutlineInfoCircle className="align-middle text-[18px] mr-1" />
                        This guardian will be the primary contact for all registered children during the event.
                    </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-[#e6e0d4] dark:border-[#2d332d]">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center h-12 px-6 rounded-lg text-gray-500 hover:text-[#1c170d] dark:text-gray-400 dark:hover:text-white font-bold transition-colors cursor-pointer"
                        disabled={isSubmitting}
                    >
                        <AiOutlineArrowLeft className="mr-2 text-sm" />
                        Back
                    </button>
                    <button
                        onClick={onNext}
                        className="flex min-w-[200px] items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-primary hover:bg-green-600 active:bg-green-700 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-green-500/20 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-3">
                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Saving Draft...</span>
                            </div>
                        ) : (
                            <>
                                <span className="truncate">Next: Review</span>
                                <AiOutlineArrowRight className="ml-2 text-xl" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default FamilyRegistrationFlow;
