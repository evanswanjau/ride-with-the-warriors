import { AiOutlineArrowLeft, AiOutlineCheckCircle, AiOutlineUser, AiOutlineShopping, AiOutlineCheck } from 'react-icons/ai';
import RegistrationStepLayout from '../registration/ui/RegistrationStepLayout';

/* ── Inline Design Components ────────────────────────────────────────── */
const Detail = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex flex-col gap-1">
        <span className="font-['Barlow_Condensed'] text-[9px] font-bold uppercase tracking-[0.22em] text-rs-text-3">
            {label}
        </span>
        <span className="font-['Barlow'] text-sm font-bold text-rs-text-1 leading-tight">
            {value}
        </span>
    </div>
);

const SectionHead = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-rs-divider">
        <div className="w-7 h-7 flex items-center justify-center border border-rs-border-2 text-primary [clip-path:polygon(0_0,calc(100%-5_px)_0,100%_5px,100%_100%,0_100%)]">
            {icon}
        </div>
        <span className="font-['Barlow_Condensed'] text-[10px] font-bold uppercase tracking-[0.22em] text-rs-text-3">
            {label}
        </span>
    </div>
);

interface RaffleReviewProps {
    data: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
        idNumber: string;
        gender: string;
        quantity: string;
        acceptedTerms: boolean;
    };
    onBack: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    error?: string | null;
}

const RaffleReview = ({ data, onBack, onSubmit, isSubmitting, error }: RaffleReviewProps) => {
    const Footer = (
        <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
            <button
                onClick={onBack}
                disabled={isSubmitting}
                className="flex items-center gap-2 text-rs-text-3 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
                <AiOutlineArrowLeft />
                Go Back
            </button>

            <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="group relative flex items-center justify-center gap-3 bg-neutral-900 dark:bg-amber-400 text-white dark:text-neutral-900 px-10 py-4 font-black transition-all hover:gap-5 disabled:opacity-50"
                type="button"
                style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    letterSpacing: '0.15em',
                    clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15% 100%, 0 calc(100% - 15px))'
                }}
            >
                {isSubmitting ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/20 dark:border-neutral-900/20 border-t-white dark:border-t-neutral-900 animate-spin rounded-full" />
                        PROCESSING...
                    </>
                ) : (
                    <>
                        CONFIRM & PAY
                        <AiOutlineCheckCircle className="text-xl" />
                    </>
                )}
            </button>
        </div>
    );

    return (
        <RegistrationStepLayout
            stepLabel="REVIEW"
            title="CONFIRM ENTRY"
            subtitle="Almost there! Double-check your details before proceeding to payment."
            footer={Footer}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Summary Card */}
                <div className="lg:col-span-12">
                    <div className="bg-rs-input-bg border border-rs-border-1 p-6 md:p-8 relative overflow-hidden [clip-path:polygon(0_0,calc(100%-24px)_0,100%_24px,100%_100%,0_100%)]">
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl" />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                            {/* Personal Info */}
                            <div className="md:col-span-2">
                                <SectionHead icon={<AiOutlineUser />} label="PARTICIPANT" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Detail label="Full Name" value={`${data.firstName} ${data.lastName}`} />
                                    <Detail label="Gender" value={<span className="capitalize">{data.gender}</span>} />
                                    <Detail label="ID / Passport" value={data.idNumber} />
                                    <Detail label="Email" value={data.email} />
                                    {data.phoneNumber && <Detail label="Phone" value={data.phoneNumber} />}
                                </div>
                            </div>

                            {/* Ticket Info */}
                            <div className="md:col-span-2">
                                <SectionHead icon={<AiOutlineShopping />} label="RAFFLE TICKETS" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Detail
                                        label="Quantity"
                                        value={<div className="flex items-center gap-2 text-primary">
                                            <AiOutlineCheck className="text-sm" />
                                            {data.quantity} {parseInt(data.quantity) === 1 ? 'Ticket' : 'Tickets'}
                                        </div>}
                                    />
                                    <Detail
                                        label="Total Price"
                                        value={<span className="text-lg font-black text-primary">
                                            KES {(parseInt(data.quantity) * 1000).toLocaleString()}
                                        </span>}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest text-center" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {error}
                </div>
            )}
        </RegistrationStepLayout>
    );
};

export default RaffleReview;
