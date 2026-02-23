import { AiOutlineArrowLeft, AiOutlineCheckCircle, AiOutlineMail, AiOutlinePhone, AiOutlineUser, AiOutlineShopping } from 'react-icons/ai';

interface RaffleReviewProps {
    data: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
        idNumber: string;
        gender: string;
        acceptedTerms: boolean;
    };
    onBack: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    error?: string | null;
}

const RaffleReview = ({ data, onBack, onSubmit, isSubmitting, error }: RaffleReviewProps) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-neutral-900 dark:text-white mb-2">Review Your Entry</h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                    Almost there! Double-check your details before proceeding to payment.
                </p>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl overflow-hidden border border-neutral-100 dark:border-neutral-700">
                {/* Summary Header */}
                <div className="bg-amber-50 dark:bg-amber-900/20 px-6 py-4 border-b border-amber-100 dark:border-amber-900/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AiOutlineShopping className="text-amber-500 text-xl" />
                        <span className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider">Order Summary</span>
                    </div>
                    <span className="text-lg font-black text-amber-600 dark:text-amber-400">KES 1,000</span>
                </div>

                <div className="p-6 space-y-6">
                    {/* Participant Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center shrink-0">
                                <AiOutlineUser className="text-primary text-xl" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-0.5">Full Name</p>
                                <p className="text-sm font-bold text-neutral-900 dark:text-white">{data.firstName} {data.lastName}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center shrink-0">
                                <AiOutlineMail className="text-primary text-xl" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-0.5">Email Address</p>
                                <p className="text-sm font-bold text-neutral-900 dark:text-white">{data.email}</p>
                            </div>
                        </div>

                        {data.phoneNumber && (
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center shrink-0">
                                    <AiOutlinePhone className="text-primary text-xl" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-0.5">Phone Number</p>
                                    <p className="text-sm font-bold text-neutral-900 dark:text-white">{data.phoneNumber}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center shrink-0">
                                <AiOutlineCheckCircle className="text-primary text-xl" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-0.5">National ID / Passport</p>
                                <p className="text-sm font-bold text-neutral-900 dark:text-white">{data.idNumber}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center shrink-0">
                                <AiOutlineUser className="text-primary text-xl" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-0.5">Gender</p>
                                <p className="text-sm font-bold text-neutral-900 dark:text-white capitalize">{data.gender}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                    {error}
                </div>
            )}

            <div className="mt-8 flex flex-col gap-4">
                <button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="w-full h-16 rounded-[24px] bg-neutral-900 dark:bg-amber-400 text-white dark:text-neutral-900 font-black text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <div className="size-5 border-4 border-white/20 dark:border-neutral-900/20 border-t-white dark:border-t-neutral-900 animate-spin rounded-full" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <span>Proceed to Payment</span>
                            <AiOutlineCheckCircle className="text-xl" />
                        </>
                    )}
                </button>

                <button
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="w-full py-4 text-sm font-bold text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                    <AiOutlineArrowLeft />
                    <span>Go Back & Edit</span>
                </button>
            </div>
        </div>
    );
};

export default RaffleReview;

