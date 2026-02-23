import { useState } from 'react';
import {
    AiOutlineArrowLeft,
    AiOutlineMobile,
    AiOutlineEnvironment,
    AiOutlineCalendar,
} from 'react-icons/ai';
import { API_BASE_URL } from '../config';

interface RafflePaymentPageProps {
    ticketId: string;
    email: string;
    phoneNumber?: string;
    onBack: () => void;
    onSuccess: () => void;
}

function formatKenyanPhone(raw: string): string {
    let phone = raw.trim().replace(/\s+/g, '');
    if (phone.startsWith('+')) phone = phone.slice(1);
    if (phone.startsWith('07') || phone.startsWith('01')) {
        phone = '254' + phone.slice(1);
    }
    return phone;
}

const RAFFLE_AMOUNT = 10;

const RafflePaymentPage = ({ ticketId, phoneNumber: prefilledPhone, onBack, onSuccess }: RafflePaymentPageProps) => {
    const [mpesaPhone, setMpesaPhone] = useState(prefilledPhone ? formatKenyanPhone(prefilledPhone) : '');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'initial' | 'pending' | 'error'>('initial');
    const [error, setError] = useState<string | null>(null);

    const startPolling = (id: string) => {
        let attempts = 0;
        const maxAttempts = 20; // 20 × 3s = 60s

        const poll = async () => {
            if (attempts >= maxAttempts) {
                setPaymentStatus('error');
                setError('Payment confirmation timed out. If you paid, please contact support with your Raffle Code.');
                return;
            }
            try {
                const res = await fetch(`${API_BASE_URL}/raffle/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    const t = data.ticket;
                    if (t?.status === 'PAID') { onSuccess(); return; }
                    if (t?.paymentFailed === true) {
                        setPaymentStatus('error');
                        setError('Payment was not completed. Please try again.');
                        return;
                    }
                }
            } catch { /* ignore polling errors */ }
            attempts++;
            setTimeout(poll, 3000);
        };
        poll();
    };

    const handleSendPrompt = async () => {
        const formatted = formatKenyanPhone(mpesaPhone);
        if (!formatted || formatted.length < 12) {
            setError('Please enter a valid Kenyan phone number (e.g. 0712345678)');
            return;
        }
        setIsProcessing(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/raffle/pay/stk-push`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId, phoneNumber: formatted }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setPaymentStatus('pending');
                setIsProcessing(false);
                startPolling(ticketId);
            } else {
                setError(data.error?.message || data.message || 'Failed to send M-Pesa prompt. Please try again.');
                setIsProcessing(false);
            }
        } catch {
            setError('Connection error. Please check your internet and try again.');
            setIsProcessing(false);
        }
    };

    const handleRetry = () => { setPaymentStatus('initial'); setError(null); };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4 font-sans text-neutral-900 dark:text-neutral-100">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-amber-400/10 mb-4">
                        <span className="text-4xl">🎟️</span>
                    </div>
                    <h1 className="text-4xl font-black text-neutral-900 dark:text-white mb-4">
                        Complete Your Entry
                    </h1>

                    {/* Summary card */}
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl px-6 py-4 shadow-sm mt-2">
                        <div className="flex items-center gap-2">
                            <AiOutlineCalendar className="text-amber-500 text-lg shrink-0" />
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Event</p>
                                <p className="font-black text-neutral-900 dark:text-white leading-none">RWTW 2026</p>
                            </div>
                        </div>
                        <div className="hidden sm:block h-8 w-px bg-neutral-100 dark:bg-neutral-700" />
                        <div className="flex items-center gap-2">
                            <AiOutlineEnvironment className="text-amber-500 text-lg shrink-0" />
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Type</p>
                                <p className="font-black text-neutral-900 dark:text-white leading-none">Raffle Ticket</p>
                            </div>
                        </div>
                        <div className="hidden sm:block h-8 w-px bg-neutral-100 dark:bg-neutral-700" />
                        <div className="text-left">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Amount</p>
                            <p className="font-black text-amber-500 text-lg leading-none">KES {RAFFLE_AMOUNT.toLocaleString()}</p>
                        </div>
                    </div>
                    <p className="text-xs text-neutral-400 mt-3 font-mono">
                        RAFFLE CODE: <span className="font-black text-amber-500">{ticketId}</span>
                    </p>
                </div>

                {/* Main card */}
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-neutral-800 rounded-[40px] shadow-2xl border border-neutral-100 dark:border-neutral-700 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Left: M-Pesa prompt */}
                            <div className="p-8 md:p-12 bg-neutral-50 dark:bg-neutral-900/50 border-b md:border-b-0 md:border-r border-neutral-100 dark:border-neutral-700">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="size-12 rounded-2xl bg-[#3fbb2d] flex items-center justify-center shadow-lg shadow-[#3fbb2d]/20">
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
                                            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm">
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                                                    Enter your M-Pesa number below and we'll send a payment prompt to your phone.
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">M-Pesa Phone Number</p>
                                                <input
                                                    type="tel"
                                                    value={mpesaPhone}
                                                    onChange={e => setMpesaPhone(e.target.value)}
                                                    placeholder="07XX XXX XXX or 254XXXXXXXXX"
                                                    className="w-full p-4 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-neutral-100 dark:border-neutral-700 focus:border-amber-400 outline-none transition-all font-mono font-black text-lg placeholder:font-sans placeholder:font-normal placeholder:text-neutral-300"
                                                />
                                                {error && (
                                                    <p className="text-xs font-bold text-red-500 animate-in fade-in slide-in-from-top-1">{error}</p>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-8 rounded-[32px] bg-amber-500/5 border-2 border-amber-500/20 flex flex-col items-center text-center space-y-6 animate-pulse">
                                            <div className="size-20 rounded-full bg-amber-400 flex items-center justify-center">
                                                <div className="size-10 border-4 border-white border-t-transparent animate-spin rounded-full" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-neutral-900 dark:text-white mb-2">Prompt Sent!</h3>
                                                <p className="text-neutral-600 dark:text-neutral-400 font-bold leading-relaxed">
                                                    Check your phone and enter your <span className="text-amber-500">M-Pesa PIN</span> to complete payment.
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

                            {/* Right: Steps + CTA */}
                            <div className="p-8 md:p-12 flex flex-col justify-between">
                                <div className="space-y-6">
                                    {[
                                        'Enter your phone number and click "Send Prompt".',
                                        'Check your phone for the M-Pesa prompt and enter your PIN.',
                                        'Wait here — your raffle ticket will be confirmed automatically.',
                                    ].map((step, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <span className="size-6 shrink-0 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-[10px]">
                                                {i + 1}
                                            </span>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">{step}</p>
                                        </div>
                                    ))}

                                </div>

                                <div className="pt-10 space-y-4">
                                    {paymentStatus === 'pending' ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center gap-3 py-4 text-amber-500 font-black animate-pulse">
                                                {[0, 150, 300].map(delay => (
                                                    <div key={delay} className="size-2 bg-current rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                                                ))}
                                                <span>AWAITING CONFIRMATION...</span>
                                            </div>
                                            <button onClick={handleRetry} className="w-full py-4 text-sm font-bold text-neutral-400 hover:text-primary transition-colors border-t border-neutral-100 dark:border-neutral-700">
                                                Didn't get the prompt? Retry
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleSendPrompt}
                                                disabled={isProcessing}
                                                className="w-full py-5 rounded-[24px] bg-amber-400 text-neutral-900 font-black text-lg shadow-xl hover:bg-amber-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                            >
                                                {isProcessing ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-5 border-4 border-neutral-900/30 border-t-neutral-900 animate-spin rounded-full" />
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

export default RafflePaymentPage;
