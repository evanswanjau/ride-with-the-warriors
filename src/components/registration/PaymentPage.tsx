import { useState, useEffect } from 'react';
import {
    AiOutlineCheckCircle,
    AiOutlineArrowLeft,
    AiOutlineMobile,
    AiOutlineUser,
    AiOutlineEnvironment
} from 'react-icons/ai';
import { API_BASE_URL } from '../../config';

interface PaymentPageProps {
    registrationId: string;
    amount: number;
    email: string;
    phoneNumber?: string;
    onBack: () => void;
    onSuccess: () => void;
}

/** Normalises any Kenyan phone format to 2547XXXXXXXX or 2541XXXXXXXX */
function formatKenyanPhone(raw: string): string {
    let phone = raw.trim().replace(/\s+/g, '');
    if (phone.startsWith('+')) phone = phone.slice(1);   // +254… → 254…
    if (phone.startsWith('07') || phone.startsWith('01')) {
        phone = '254' + phone.slice(1);                   // 07… → 2547…
    }
    return phone;
}

const PaymentPage = ({ registrationId, amount, phoneNumber: registrationPhone, onBack, onSuccess }: PaymentPageProps) => {
    const [isProcessing, setIsProcessing] = useState(false);
    // Pre-fill with registration phone, formatted to 254 prefix
    const [mpesaPhone, setMpesaPhone] = useState(registrationPhone ? formatKenyanPhone(registrationPhone) : '');
    const [error, setError] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<'initial' | 'pending' | 'error'>('initial');
    const [regInfo, setRegInfo] = useState<{ name: string; circuit: string; category: string; amount: number } | null>(null);

    useEffect(() => {
        const fetchReg = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/registrations/${registrationId}`);
                if (!res.ok) return;
                const { registration: r } = await res.json();
                const p = r.payload;
                let name = '';
                if (r.type === 'individual') {
                    name = `${p.riderDetails?.firstName || ''} ${p.riderDetails?.lastName || ''}`.trim();
                } else if (r.type === 'team') {
                    name = p.teamDetails?.teamName || 'Team';
                } else {
                    name = `${p.familyDetails?.guardian?.firstName || ''} ${p.familyDetails?.guardian?.lastName || ''} (Family)`.trim();
                }
                const classification = r.classifications?.[0];
                setRegInfo({
                    name,
                    circuit: (r.circuitId || '').toUpperCase(),
                    category: classification?.category || r.type,
                    amount: r.pricing?.totalAmount || amount,
                });
            } catch {
                // silently ignore — we already have amount from props
            }
        };
        fetchReg();
    }, [registrationId, amount]);

    const startPolling = async (regId: string) => {
        let attempts = 0;
        const maxAttempts = 20; // 20 * 3s = 60s

        const poll = async () => {
            if (attempts >= maxAttempts) {
                setPaymentStatus('error');
                setError('Payment confirmation timed out. If you have paid, please contact support with your Registration ID.');
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/registrations/${regId}`);
                if (res.ok) {
                    const data = await res.json();
                    const reg = data.registration;

                    // Success: redirect
                    if (reg?.status === 'PAID' || reg?.status === 'CONFIRMED') {
                        onSuccess();
                        return;
                    }

                    // Failure: surface error immediately, allow retry
                    if (reg?.payload?.paymentFailed === true) {
                        const reason = reg?.payload?.paymentFailureReason || 'Payment was not completed.';
                        setPaymentStatus('error');
                        setError(`Payment failed: ${reason}. Please try again.`);
                        return;
                    }
                }
            } catch (err) {
                console.error('Polling error:', err);
            }

            attempts++;
            setTimeout(poll, 3000);
        };

        poll();
    };

    const handleConfirm = async () => {
        const formatted = formatKenyanPhone(mpesaPhone);
        if (!formatted || formatted.length < 12) {
            setError('Please enter a valid Kenyan phone number (e.g. 0712345678 or 254712345678)');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/registrations/pay/stk-push`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    registrationId,
                    amount,
                    phoneNumber: formatted  // always 254XXXXXXXXX
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setPaymentStatus('pending');
                setIsProcessing(false);
                startPolling(registrationId);
            } else {
                setError(data.message || 'STK Push failed. Please try again or ensure your phone is on.');
                setIsProcessing(false);
            }
        } catch (err) {
            setError('Connection error. Please try again.');
            setIsProcessing(false);
        }
    };

    const handleRetry = () => {
        setPaymentStatus('initial');
        setError(null);
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4 font-sans text-neutral-900 dark:text-neutral-100">
            <div className="max-w-4xl mx-auto text-neutral-900 dark:text-neutral-100">
                {/* Header */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary/10 mb-4">
                        <AiOutlineCheckCircle className="text-primary text-4xl" />
                    </div>
                    <h1 className="text-4xl font-black text-neutral-900 dark:text-white mb-4">Registration Successful!</h1>

                    {/* Summary card with real details */}
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl px-6 py-4 shadow-sm mt-2">
                        {/* Registrant */}
                        <div className="flex items-center gap-2">
                            <AiOutlineUser className="text-primary text-lg shrink-0" />
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Registrant</p>
                                <p className="font-black text-neutral-900 dark:text-white leading-none">{regInfo?.name || '—'}</p>
                            </div>
                        </div>
                        <div className="hidden sm:block h-8 w-px bg-neutral-100 dark:bg-neutral-700" />
                        {/* Circuit & Category */}
                        <div className="flex items-center gap-2">
                            <AiOutlineEnvironment className="text-primary text-lg shrink-0" />
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Circuit / Category</p>
                                <p className="font-black text-neutral-900 dark:text-white leading-none">
                                    {regInfo?.circuit || '—'}{regInfo?.category ? ` · ${regInfo.category}` : ''}
                                </p>
                            </div>
                        </div>
                        <div className="hidden sm:block h-8 w-px bg-neutral-100 dark:bg-neutral-700" />
                        {/* Amount */}
                        <div className="text-left">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Amount Due</p>
                            <p className="font-black text-primary text-lg leading-none">KES {(regInfo?.amount ?? amount).toLocaleString()}</p>
                        </div>
                    </div>

                    <p className="text-xs text-neutral-400 mt-3 font-mono">
                        REG ID: <span className="font-bold text-primary">{registrationId}</span>
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-neutral-800 rounded-[40px] shadow-2xl border border-neutral-100 dark:border-neutral-700 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">

                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Left Column: Business Details */}
                            <div className="p-8 md:p-12 bg-neutral-50 dark:bg-neutral-900/50 border-b md:border-b-0 md:border-r border-neutral-100 dark:border-neutral-700">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="size-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa" className="h-6 invert brightness-0" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-neutral-900 dark:text-white">M-Pesa Prompt</h2>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                                                {paymentStatus === 'pending' ? 'Waiting for PIN' : 'Instant Payment'}
                                            </p>
                                        </div>
                                    </div>

                                    {paymentStatus === 'initial' || paymentStatus === 'error' ? (
                                        <>
                                            <div className="space-y-4">
                                                <div className="p-6 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm space-y-4">
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                                                        Enter your M-Pesa phone number below and we'll send a payment prompt to your phone.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">M-Pesa Phone Number</p>
                                                <input
                                                    type="tel"
                                                    value={mpesaPhone}
                                                    onChange={(e) => setMpesaPhone(e.target.value)}
                                                    placeholder="07XX XXX XXX or 254XXXXXXXXX"
                                                    className="w-full p-4 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-neutral-100 dark:border-neutral-700 focus:border-primary outline-none transition-all font-mono font-black text-lg placeholder:font-sans placeholder:font-normal placeholder:text-neutral-300"
                                                />
                                                <p className="text-[10px] text-neutral-400">You can use 07XX, +254, or 254 format</p>
                                                {error && (
                                                    <p className="text-xs font-bold text-red-500 animate-in fade-in slide-in-from-top-1">{error}</p>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-8 rounded-[32px] bg-primary/5 border-2 border-primary/20 flex flex-col items-center text-center space-y-6 animate-pulse">
                                            <div className="size-20 rounded-full bg-primary flex items-center justify-center">
                                                <div className="size-10 border-4 border-white border-t-transparent animate-spin rounded-full" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-neutral-900 dark:text-white mb-2">Prompt Sent!</h3>
                                                <p className="text-neutral-600 dark:text-neutral-400 font-bold leading-relaxed">
                                                    Kindly check your phone and enter your <span className="text-primary">M-Pesa PIN</span> to complete the payment.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="hidden md:block pt-4">
                                        <button onClick={onBack} className="py-4 text-sm font-bold text-neutral-400 hover:text-primary transition-colors flex items-center gap-2 group">
                                            <AiOutlineArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
                                            Change Details
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Steps */}
                            <div className="p-8 md:p-12 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <span className="size-6 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-[10px]">1</span>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                                                Enter your phone number and click 'Send Prompt'.
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <span className="size-6 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-[10px]">2</span>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                                                Check your phone for the M-Pesa prompt and enter your PIN.
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <span className="size-6 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-[10px]">3</span>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                                                Wait here for your registration to be confirmed.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10 space-y-4">
                                    {paymentStatus === 'pending' ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center gap-3 py-4 text-primary font-black animate-pulse">
                                                <div className="size-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="size-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="size-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                <span>AWAITING CONFIRMATION...</span>
                                            </div>
                                            <button
                                                onClick={handleRetry}
                                                className="w-full py-4 text-sm font-bold text-neutral-400 hover:text-primary transition-colors border-t border-neutral-100 dark:border-neutral-700"
                                            >
                                                Didn't get the prompt? Retry
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleConfirm}
                                                disabled={isProcessing}
                                                className="w-full py-5 rounded-[24px] text-white font-black text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 bg-primary hover:bg-primary-dark"
                                            >
                                                {isProcessing ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-5 border-3 border-current/30 border-t-current animate-spin rounded-full" />
                                                        <span>SENDING...</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span>{paymentStatus === 'error' ? 'RETRY SEND PROMPT' : 'SEND PROMPT'}</span>
                                                        <AiOutlineMobile className="font-bold" />
                                                    </>
                                                )}
                                            </button>

                                            <button onClick={onBack} className="md:hidden w-full py-2 text-sm font-bold text-neutral-400 hover:text-primary transition-colors flex items-center justify-center gap-2">
                                                <AiOutlineArrowLeft className="text-sm" />
                                                Back to Review
                                            </button>
                                        </>
                                    )}
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
