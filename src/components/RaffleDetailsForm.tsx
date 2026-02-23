import { AiOutlineExperiment, AiOutlineArrowRight, AiOutlineCheckCircle } from 'react-icons/ai';

interface RaffleDetailsFormProps {
    data: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        idNumber: string;
        gender: string;
        acceptedTerms: boolean;
    };
    onChange: (data: any) => void;
    onNext: () => void;
    errors: Record<string, string>;
}

const RaffleDetailsForm = ({ data, onChange, onNext, errors }: RaffleDetailsFormProps) => {
    const handleInputChange = (field: string, value: string) => {
        onChange({ ...data, [field]: value });
    };

    const inputClass = (field: string) =>
        `w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors[field]
            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
        }`;

    return (
        <div className="layout-content-container flex flex-col flex-1 w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-text-light dark:text-white tracking-tight text-[32px] md:text-4xl font-bold leading-tight">
                        Raffle Entry Details
                    </h1>
                    <p className="text-text-muted-light dark:text-gray-400 text-base font-normal leading-normal max-w-2xl">
                        Please provide your information to enter the raffle.
                    </p>
                </div>
                <button
                    onClick={() => {
                        onChange({
                            firstName: 'Evans',
                            lastName: 'Wanjau',
                            email: `evans.${Math.floor(Math.random() * 1000)}@example.com`,
                            phoneNumber: '0712345678',
                            idNumber: '12345678',
                            gender: 'male',
                            acceptedTerms: true,
                        });
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all font-semibold text-sm w-fit"
                    type="button"
                >
                    <AiOutlineExperiment className="text-lg" />
                    Fill with Test Data
                </button>
            </div>

            <div className="bg-white dark:bg-[#2a2418] rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    {/* First Name */}
                    <label className="flex flex-col gap-2">
                        <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                            First Name <span className="text-red-500">*</span>
                        </span>
                        <input
                            className={inputClass('firstName')}
                            placeholder="Evans"
                            type="text"
                            value={data.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                        {errors.firstName && <span className="text-red-500 text-xs font-medium">{errors.firstName}</span>}
                    </label>

                    {/* Last Name */}
                    <label className="flex flex-col gap-2">
                        <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                            Last Name <span className="text-red-500">*</span>
                        </span>
                        <input
                            className={inputClass('lastName')}
                            placeholder="Wanjau"
                            type="text"
                            value={data.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                        {errors.lastName && <span className="text-red-500 text-xs font-medium">{errors.lastName}</span>}
                    </label>

                    {/* Email */}
                    <label className="flex flex-col gap-2">
                        <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                            Email Address <span className="text-red-500">*</span>
                        </span>
                        <input
                            className={inputClass('email')}
                            placeholder="evans@example.com"
                            type="email"
                            value={data.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                        {errors.email && <span className="text-red-500 text-xs font-medium">{errors.email}</span>}
                    </label>

                    {/* Phone */}
                    <label className="flex flex-col gap-2">
                        <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                            Phone Number <span className="text-red-500">*</span>
                        </span>
                        <input
                            className={inputClass('phoneNumber')}
                            placeholder="0712 345 678"
                            type="tel"
                            value={data.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        />
                        {errors.phoneNumber && <span className="text-red-500 text-xs font-medium">{errors.phoneNumber}</span>}
                    </label>

                    {/* ID Number */}
                    <label className="flex flex-col gap-2">
                        <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                            National ID / Passport <span className="text-red-500">*</span>
                        </span>
                        <input
                            className={inputClass('idNumber')}
                            placeholder="12345678"
                            type="text"
                            value={data.idNumber}
                            onChange={(e) => handleInputChange('idNumber', e.target.value)}
                        />
                        {errors.idNumber && <span className="text-red-500 text-xs font-medium">{errors.idNumber}</span>}
                    </label>

                    {/* Gender */}
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
                                        onChange={() => onChange({ ...data, gender: 'male' })}
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
                                        onChange={() => onChange({ ...data, gender: 'female' })}
                                    />
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 peer-checked:border-primary peer-checked:border-[5px] transition-all"></div>
                                </div>
                                <span className={`text-sm font-medium transition-colors ${data.gender === 'female' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>Female</span>
                            </label>
                        </div>
                        {errors.gender && <span className="text-red-500 text-xs font-medium">{errors.gender}</span>}
                    </div>
                </div>

                {/* Terms Acceptance */}
                <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800">
                    <label className="flex gap-3 cursor-pointer group max-w-2xl">
                        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                            <input
                                className="peer sr-only"
                                type="checkbox"
                                checked={data.acceptedTerms}
                                onChange={(e) => onChange({ ...data, acceptedTerms: e.target.checked })}
                            />
                            <div className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                                <AiOutlineCheckCircle className="text-white text-xs opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            I agree to the <a href="/terms" target="_blank" className="text-primary hover:underline font-semibold">Terms and Conditions</a> and represent that I am at least 18 years of age or have parent/guardian consent.
                        </span>
                    </label>
                    {errors.acceptedTerms && <span className="text-red-500 text-xs font-medium block mt-2 ml-8">{errors.acceptedTerms}</span>}
                </div>
            </div>

            <div className="flex justify-end mt-4">
                <button
                    onClick={onNext}
                    className="flex min-w-[200px] items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-primary hover:bg-green-600 active:bg-green-700 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-green-500/20 transition-all cursor-pointer"
                    type="button"
                >
                    <span className="truncate">Continue</span>
                    <AiOutlineArrowRight className="ml-2 text-xl" />
                </button>
            </div>
        </div>
    );
};

export default RaffleDetailsForm;
