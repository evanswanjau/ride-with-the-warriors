

import type { RiderDetails } from '../types';
import ErrorBanner from './ErrorBanner';
import { calculateAge } from '../utils';
import {
    AiOutlineExperiment,
    AiOutlineDown,
    AiOutlineArrowLeft,
    AiOutlineArrowRight
} from 'react-icons/ai';


interface Step4RiderDetailsProps {
    data: RiderDetails;
    onChange: (data: RiderDetails) => void;
    onNext: () => void;
    onBack: () => void;
    errors: Record<string, string>;
    formErrors: string[];
    isSubmitting: boolean;
}

const Step4RiderDetails = ({ data, onChange, onNext, onBack, errors, formErrors, isSubmitting }: Step4RiderDetailsProps) => {
    const handleInputChange = (field: keyof RiderDetails, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="layout-content-container flex flex-col flex-1 w-full gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-text-light dark:text-white tracking-tight text-[32px] md:text-4xl font-bold leading-tight">Rider Details</h1>
                    <p className="text-text-muted-light dark:text-gray-400 text-base font-normal leading-normal max-w-2xl">
                        Please provide your personal information to complete the registration.
                    </p>
                </div>
                <button
                    onClick={() => {
                        onChange({
                            firstName: 'Jane',
                            lastName: 'Doe',
                            email: `jane.doe.${Math.floor(Math.random() * 1000)}@example.com`,
                            phoneNumber: '0712345678',
                            idNumber: '12345678',
                            dob: '1995-05-15',
                            gender: 'female',
                            tshirtSize: 'M',
                            emergencyContactName: 'John Smith',
                            emergencyPhone: '0787654321'
                        });
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all font-semibold text-sm w-fit"
                    type="button"
                >
                    <AiOutlineExperiment className="text-lg" />
                    Fill with Test Data
                </button>
            </div>

            <ErrorBanner errors={formErrors} />

            <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
                <div className="bg-white dark:bg-[#2a2418] rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <label className="flex flex-col gap-2">
                            <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                First Name <span className="text-red-500">*</span>
                            </span>
                            <div className="relative">
                                <input
                                    className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors.firstName
                                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                        }`}
                                    placeholder="Jane"
                                    type="text"
                                    value={data.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.firstName && <span className="text-red-500 text-xs font-medium">{errors.firstName}</span>}
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                Last Name <span className="text-red-500">*</span>
                            </span>
                            <div className="relative">
                                <input
                                    className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors.lastName
                                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                        }`}
                                    placeholder="Doe"
                                    type="text"
                                    value={data.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.lastName && <span className="text-red-500 text-xs font-medium">{errors.lastName}</span>}
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                Email Address <span className="text-red-500">*</span>
                            </span>
                            <div className="relative">
                                <input
                                    className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors.email
                                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                        }`}
                                    placeholder="jane.doe@example.com"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.email && <span className="text-red-500 text-xs font-medium">{errors.email}</span>}
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                Phone Number <span className="text-red-500">*</span>
                            </span>
                            <div className="relative">
                                <input
                                    className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors.phoneNumber
                                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                        }`}
                                    placeholder="0712 345 678"
                                    type="tel"
                                    value={data.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.phoneNumber && <span className="text-red-500 text-xs font-medium">{errors.phoneNumber}</span>}
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                National ID / Passport <span className="text-red-500">*</span>
                            </span>
                            <div className="relative">
                                <input
                                    className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors.idNumber
                                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                        }`}
                                    placeholder="12345678"
                                    type="text"
                                    value={data.idNumber}
                                    onChange={(e) => handleInputChange('idNumber', e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.idNumber && <span className="text-red-500 text-xs font-medium">{errors.idNumber}</span>}
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider flex items-center justify-between">
                                <span>Date of Birth <span className="text-red-500">*</span></span>
                                {data.dob && (
                                    <span className="text-primary normal-case font-bold bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                                        {calculateAge(data.dob)} years old
                                    </span>
                                )}
                            </span>
                            <div className="relative">
                                <input
                                    className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors.dob
                                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                        }`}
                                    type="date"
                                    value={data.dob}
                                    onChange={(e) => handleInputChange('dob', e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.dob && <span className="text-red-500 text-xs font-medium">{errors.dob}</span>}
                        </label>
                        <div className="flex flex-col gap-2">
                            <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                Gender <span className="text-red-500">*</span>
                            </span>
                            <div className="flex gap-6 items-center h-[42px] px-1">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            className="peer sr-only"
                                            name="gender"
                                            type="radio"
                                            value="male"
                                            checked={data.gender === 'male'}
                                            onChange={() => handleInputChange('gender', 'male')}
                                            disabled={isSubmitting}
                                        />
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 peer-checked:border-primary peer-checked:border-[5px] transition-all"></div>
                                    </div>
                                    <span className={`text-sm font-medium transition-colors ${data.gender === 'male' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>Male</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            className="peer sr-only"
                                            name="gender"
                                            type="radio"
                                            value="female"
                                            checked={data.gender === 'female'}
                                            onChange={() => handleInputChange('gender', 'female')}
                                            disabled={isSubmitting}
                                        />
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 peer-checked:border-primary peer-checked:border-[5px] transition-all"></div>
                                    </div>
                                    <span className={`text-sm font-medium transition-colors ${data.gender === 'female' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>Female</span>
                                </label>
                            </div>
                            {errors.gender && <span className="text-red-500 text-xs font-medium">{errors.gender}</span>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                T-shirt Size <span className="text-red-500">*</span>
                            </span>
                            <div className="relative">
                                <select
                                    className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all appearance-none cursor-pointer ${errors.tshirtSize
                                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                        }`}
                                    value={data.tshirtSize}
                                    onChange={(e) => handleInputChange('tshirtSize', e.target.value)}
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
                            {errors.tshirtSize && <span className="text-red-500 text-xs font-medium">{errors.tshirtSize}</span>}
                        </div>

                        <label className="flex flex-col gap-2">
                            <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                Emergency Contact Name <span className="text-red-500">*</span>
                            </span>
                            <div className="relative">
                                <input
                                    className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors.emergencyContactName
                                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                        }`}
                                    placeholder="Emergency Contact Name"
                                    type="text"
                                    value={data.emergencyContactName}
                                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.emergencyContactName && <span className="text-red-500 text-xs font-medium">{errors.emergencyContactName}</span>}
                        </label>

                        <label className="flex flex-col gap-2">
                            <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                Emergency Contact Phone <span className="text-red-500">*</span>
                            </span>
                            <div className="relative">
                                <input
                                    className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors.emergencyPhone
                                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                        }`}
                                    placeholder="07XX XXX XXX"
                                    type="tel"
                                    value={data.emergencyPhone}
                                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.emergencyPhone && <span className="text-red-500 text-xs font-medium">{errors.emergencyPhone}</span>}
                        </label>
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-[#e6e0d4] dark:border-[#2d332d]">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center h-12 px-6 rounded-lg text-gray-500 hover:text-[#1c170d] dark:text-gray-400 dark:hover:text-white font-bold transition-colors cursor-pointer"
                        type="button"
                        disabled={isSubmitting}
                    >
                        <AiOutlineArrowLeft className="mr-2 text-sm" />
                        Back
                    </button>
                    <button
                        onClick={onNext}
                        className="flex min-w-[200px] items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-primary hover:bg-green-600 active:bg-green-700 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-green-500/20 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        type="button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-3">
                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Saving Draft...</span>
                            </div>
                        ) : (
                            <>
                                <span className="truncate">Continue</span>
                                <AiOutlineArrowRight className="ml-2 text-xl" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default Step4RiderDetails;
