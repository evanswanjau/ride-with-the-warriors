import { AiOutlineExperiment, AiOutlineArrowRight, AiOutlineCheckCircle } from 'react-icons/ai';
import RegistrationStepLayout, { REG_INPUT_CLASSES, REG_LABEL_CLASSES } from '../registration/ui/RegistrationStepLayout';

interface RaffleDetailsFormProps {
    data: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        idNumber: string;
        gender: string;
        quantity: string;
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
        `${REG_INPUT_CLASSES} ${errors[field] ? '!border-red-500 focus:!ring-red-500' : ''}`;

    const TestDataButton = (
        <button
            onClick={() => {
                onChange({
                    ...data,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: `john.doe.${Math.floor(Math.random() * 1000)}@example.com`,
                    phoneNumber: '0712345678',
                    idNumber: '12345678',
                    gender: 'male',
                    quantity: data.quantity || '1',
                    acceptedTerms: true,
                });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-all font-bold text-[10px] tracking-widest uppercase"
            type="button"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
            <AiOutlineExperiment className="text-sm" />
            Fill Test Data
        </button>
    );

    const Footer = (
        <div className="flex justify-end w-full">
            <button
                onClick={onNext}
                className="group relative flex items-center justify-center gap-3 bg-primary hover:bg-primary-lt text-white px-10 py-4 font-black transition-all hover:gap-5"
                type="button"
                style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    letterSpacing: '0.15em',
                    clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15% 100%, 0 calc(100% - 15px))'
                }}
            >
                CONTINUE
                <AiOutlineArrowRight className="text-xl" />
            </button>
        </div>
    );

    return (
        <RegistrationStepLayout
            stepLabel="DETAILS"
            title="RAFFLE ENTRY"
            subtitle="Please provide your information to enter the raffle."
            headerRight={TestDataButton}
            footer={Footer}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* First Name */}
                <div className="flex flex-col gap-1.5">
                    <label className={REG_LABEL_CLASSES}>
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        className={inputClass('firstName')}
                        placeholder="John"
                        type="text"
                        value={data.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                    {errors.firstName && <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">{errors.firstName}</span>}
                </div>

                {/* Last Name */}
                <div className="flex flex-col gap-1.5">
                    <label className={REG_LABEL_CLASSES}>
                        Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        className={inputClass('lastName')}
                        placeholder="Doe"
                        type="text"
                        value={data.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                    {errors.lastName && <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">{errors.lastName}</span>}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                    <label className={REG_LABEL_CLASSES}>
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        className={inputClass('email')}
                        placeholder="john@example.com"
                        type="email"
                        value={data.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                    {errors.email && <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">{errors.email}</span>}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                    <label className={REG_LABEL_CLASSES}>
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        className={inputClass('phoneNumber')}
                        placeholder="0712 345 678"
                        type="tel"
                        value={data.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                    {errors.phoneNumber && <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">{errors.phoneNumber}</span>}
                </div>

                {/* ID Number */}
                <div className="flex flex-col gap-1.5">
                    <label className={REG_LABEL_CLASSES}>
                        National ID / Passport <span className="text-red-500">*</span>
                    </label>
                    <input
                        className={inputClass('idNumber')}
                        placeholder="12345678"
                        type="text"
                        value={data.idNumber}
                        onChange={(e) => handleInputChange('idNumber', e.target.value)}
                    />
                    {errors.idNumber && <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">{errors.idNumber}</span>}
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1.5">
                    <label className={REG_LABEL_CLASSES}>
                        Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4 items-center h-[46px]">
                        {['male', 'female'].map((g) => (
                            <button
                                key={g}
                                type="button"
                                onClick={() => onChange({ ...data, gender: g })}
                                className={`flex-1 h-full font-bold text-xs uppercase tracking-widest transition-all ${data.gender === g
                                    ? 'bg-primary text-white'
                                    : 'bg-rs-input-bg border border-rs-border-1 text-rs-text-2 hover:border-rs-primary'
                                    }`}
                                style={{
                                    fontFamily: "'Barlow Condensed', sans-serif",
                                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)'
                                }}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                    {errors.gender && <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">{errors.gender}</span>}
                </div>

                {/* Quantity */}
                <div className="flex flex-col gap-1.5">
                    <label className={REG_LABEL_CLASSES}>
                        Number of Tickets <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-6 h-[46px]">
                        <div className="flex items-center border border-rs-border-1 h-full aspect-[2/1] overflow-hidden">
                            <button
                                type="button"
                                onClick={() => handleInputChange('quantity', Math.max(1, (parseInt(data.quantity) || 1) - 1).toString())}
                                disabled={parseInt(data.quantity) <= 1 || !data.quantity}
                                className="flex-1 h-full bg-rs-input-hv hover:bg-rs-divider text-rs-text-1 font-bold disabled:opacity-30 transition-colors"
                            >-</button>
                            <input
                                className="w-12 h-full text-center bg-transparent border-none outline-none font-black text-primary text-lg"
                                style={{ fontFamily: "'Barlow', sans-serif" }}
                                type="number"
                                min="1"
                                value={data.quantity}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '') handleInputChange('quantity', '');
                                    else {
                                        const num = parseInt(val);
                                        if (!isNaN(num)) handleInputChange('quantity', Math.max(1, num).toString());
                                    }
                                }}
                                onBlur={() => {
                                    const num = parseInt(data.quantity);
                                    if (isNaN(num) || num < 1) handleInputChange('quantity', '1');
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => handleInputChange('quantity', ((parseInt(data.quantity) || 1) + 1).toString())}
                                className="flex-1 h-full bg-rs-input-hv hover:bg-rs-divider text-rs-text-1 font-bold transition-colors"
                            >+</button>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-rs-text-3 uppercase tracking-widest">Total Amount</span>
                            <span className="text-xl font-black text-primary leading-none" style={{ fontFamily: "'Barlow', sans-serif" }}>
                                KSH {((parseInt(data.quantity) || 1) * 1000).toLocaleString()}
                            </span>
                        </div>
                    </div>
                    {errors.quantity && <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">{errors.quantity}</span>}
                </div>
            </div>

            {/* Terms Acceptance */}
            <div className="mt-10 pt-8 border-t border-rs-divider">
                <label className="flex gap-4 cursor-pointer group max-w-2xl">
                    <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                        <input
                            className="peer sr-only"
                            type="checkbox"
                            checked={data.acceptedTerms}
                            onChange={(e) => onChange({ ...data, acceptedTerms: e.target.checked })}
                        />
                        <div className="w-5 h-5 border-2 border-rs-border-2 peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                            <AiOutlineCheckCircle className="text-white text-xs opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                    </div>
                    <span className="text-sm text-rs-text-2 leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
                        I agree to the <a href="/terms-and-conditions" target="_blank" className="text-primary hover:underline font-bold">Terms and Conditions</a> and represent that I am at least 18 years of age or have parent/guardian consent.
                    </span>
                </label>
                {errors.acceptedTerms && <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider block mt-2 ml-9">{errors.acceptedTerms}</span>}
            </div>
        </RegistrationStepLayout>
    );
};

export default RaffleDetailsForm;
