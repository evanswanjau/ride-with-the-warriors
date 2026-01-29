import { useState } from 'react';

interface PaymentPageProps {
    registrationId: string;
    amount: number;
    email: string;
    onBack: () => void;
    onSuccess: () => void;
}


const PaymentPage = ({ registrationId, amount, email, onBack, onSuccess }: PaymentPageProps) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirm = () => {
        setIsProcessing(true);
        // Simulate a brief loading state before success
        setTimeout(() => {
            setIsProcessing(false);
            onSuccess();
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4 font-sans text-neutral-900 dark:text-neutral-100">
            <div className="max-w-4xl mx-auto text-neutral-900 dark:text-neutral-100">
                {/* Header */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-green-500/10 mb-4">
                        <span className="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
                    </div>
                    <h1 className="text-4xl font-black text-neutral-900 dark:text-white mb-2">Registration Successful!</h1>
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                            Registration ID: <span className="font-mono font-bold text-primary tracking-wider">{registrationId}</span>
                        </p>
                        <div className="h-1 w-12 bg-primary/20 rounded-full"></div>
                        <p className="text-neutral-500 dark:text-neutral-500 font-medium">
                            Total amount to pay: <span className="text-neutral-900 dark:text-white font-bold">KES {amount.toLocaleString()}</span>
                        </p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-neutral-800 rounded-[40px] shadow-2xl border border-neutral-100 dark:border-neutral-700 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Left Column: Business Details */}
                            <div className="p-8 md:p-12 bg-neutral-50 dark:bg-neutral-900/50 border-b md:border-b-0 md:border-r border-neutral-100 dark:border-neutral-700">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="size-12 rounded-2xl bg-[#3fbb2d] flex items-center justify-center shadow-lg shadow-[#3fbb2d]/20">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa" className="h-6 invert brightness-0" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-neutral-900 dark:text-white">M-Pesa Paybill</h2>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Payment Summary</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Business No.</span>
                                                <span className="text-2xl font-black text-primary font-mono tracking-tight">400200</span>
                                            </div>
                                            <div className="h-px bg-neutral-100 dark:bg-neutral-700"></div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Account No.</span>
                                                <span className="text-2xl font-black text-primary font-mono tracking-tight uppercase">01116046086300</span>
                                            </div>
                                            <div className="h-px bg-neutral-100 dark:bg-neutral-700"></div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Amount</span>
                                                <span className="text-2xl font-black text-primary font-mono tracking-tight uppercase">KES {amount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden md:block pt-4">
                                        <button onClick={onBack} className="py-4 text-sm font-bold text-neutral-400 hover:text-primary transition-colors flex items-center gap-2 group">
                                            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
                                            Change Details
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Steps */}
                            <div className="p-8 md:p-12 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Payment Steps:</p>
                                    <ol className="space-y-4">
                                        {[
                                            { s: "Lipa na M-PESA", d: "Open M-Pesa Menu" },
                                            { s: "Paybill", d: "Select Payment Services" },
                                            { s: "400200", d: "Enter Business Number" },
                                            { s: "01116046086300", d: "Enter Account Number" },
                                            { s: "KES " + amount.toLocaleString(), d: "Enter Amount & PIN" }
                                        ].map((step, i) => (
                                            <li key={i} className="flex items-center gap-4 group">
                                                <span className="size-6 shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-neutral-500 flex items-center justify-center font-black text-[10px] group-hover:bg-primary group-hover:text-white transition-colors">{i + 1}</span>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight leading-none mb-1">{step.d}</span>
                                                    <span className="text-sm font-bold text-neutral-900 dark:text-white leading-none">{step.s}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </div>

                                <div className="pt-10 space-y-4">
                                    <button
                                        onClick={handleConfirm}
                                        disabled={isProcessing}
                                        className="w-full py-5 rounded-[24px] bg-[#1a1a1a] dark:bg-white text-white dark:text-black font-black text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isProcessing ? (
                                            <div className="size-6 border-4 border-current/30 border-t-current animate-spin rounded-full" />
                                        ) : (
                                            <>
                                                <span>COMPLETE ORDER</span>
                                                <span className="material-symbols-outlined font-bold">arrow_forward</span>
                                            </>
                                        )}
                                    </button>

                                    <button onClick={onBack} className="md:hidden w-full py-2 text-sm font-bold text-neutral-400 hover:text-primary transition-colors flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                                        Back to Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
