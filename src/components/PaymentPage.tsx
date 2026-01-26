import { useState } from 'react';

interface PaymentPageProps {
    registrationId: string;
    amount: number;
    email: string;
    onBack: () => void;
    onSuccess: () => void;
}

type PaymentMethod = 'mpesa_paybill' | 'mpesa_stk' | 'card';

const PaymentPage = ({ registrationId, amount, email, onBack, onSuccess }: PaymentPageProps) => {
    const [method, setMethod] = useState<PaymentMethod>('mpesa_stk');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [stkSent, setStkSent] = useState(false);

    const handleStkPush = async () => {
        if (!phoneNumber) {
            alert('Please enter your M-Pesa phone number');
            return;
        }
        setIsProcessing(true);
        // Simulate STK Push request
        setTimeout(() => {
            setIsProcessing(false);
            setStkSent(true);
        }, 2000);
    };

    const handleCardPayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate card processing
        setTimeout(() => {
            setIsProcessing(false);
            onSuccess();
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-green-500/10 mb-4">
                        <span className="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
                    </div>
                    <h1 className="text-4xl font-black text-neutral-900 dark:text-white mb-2">Registration Successful!</h1>
                    <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                        Registration ID: <span className="font-mono font-bold text-primary">{registrationId}</span>
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-500 mt-2">
                        Total Amount: <span className="font-bold text-neutral-900 dark:text-white">KES {amount.toLocaleString()}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Method Selection Sidebar */}
                    <div className="md:col-span-1 space-y-3">
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 ml-1">Payment Method</p>

                        <button
                            onClick={() => { setMethod('mpesa_stk'); setStkSent(false); }}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${method === 'mpesa_stk'
                                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5'
                                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                                }`}
                        >
                            <div className={`size-10 rounded-xl flex items-center justify-center ${method === 'mpesa_stk' ? 'bg-primary text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                                <span className="material-symbols-outlined">send_to_mobile</span>
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm">M-Pesa Express</p>
                                <p className="text-[10px] text-neutral-500">STK Push to Phone</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setMethod('mpesa_paybill')}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${method === 'mpesa_paybill'
                                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5'
                                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                                }`}
                        >
                            <div className={`size-10 rounded-xl flex items-center justify-center ${method === 'mpesa_paybill' ? 'bg-primary text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm">M-Pesa Paybill</p>
                                <p className="text-[10px] text-neutral-500">Manual Instructions</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setMethod('card')}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${method === 'card'
                                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5'
                                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                                }`}
                        >
                            <div className={`size-10 rounded-xl flex items-center justify-center ${method === 'card' ? 'bg-primary text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                                <span className="material-symbols-outlined">credit_card</span>
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm">Credit Card</p>
                                <p className="text-[10px] text-neutral-500">Global Coverage</p>
                            </div>
                        </button>

                        <div className="pt-8">
                            <button onClick={onBack} className="text-sm font-bold text-neutral-500 hover:text-primary transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Back to Review
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-2">
                        <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl p-8 border border-neutral-100 dark:border-neutral-700 h-full">

                            {method === 'mpesa_stk' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center gap-4 mb-8">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa" className="h-10" />
                                        <h2 className="text-2xl font-bold">M-Pesa Express</h2>
                                    </div>

                                    {!stkSent ? (
                                        <>
                                            <p className="text-neutral-600 dark:text-neutral-400">
                                                Receive an instant payment prompt (STK Push) on your phone. Just enter your M-Pesa number and confirm on your device.
                                            </p>
                                            <div className="space-y-4 pt-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        placeholder="e.g. 0712345678"
                                                        className="w-full px-5 py-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xl font-bold focus:border-primary outline-none transition-all"
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleStkPush}
                                                    disabled={isProcessing}
                                                    className="w-full py-5 rounded-2xl bg-green-600 text-white font-black text-lg shadow-xl shadow-green-600/20 hover:bg-green-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                                >
                                                    {isProcessing ? <div className="size-6 border-4 border-white/30 border-t-white animate-spin rounded-full" /> : <span>Request STK Push</span>}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-12 space-y-6">
                                            <div className="relative inline-block">
                                                <div className="size-24 rounded-full bg-green-500/10 border-4 border-green-500 border-t-transparent animate-spin"></div>
                                                <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-green-500 text-4xl">smartphone</span>
                                            </div>
                                            <h3 className="text-xl font-bold">Waiting for Confirmation...</h3>
                                            <p className="text-neutral-500">An STK prompt has been sent to <span className="text-neutral-900 dark:text-white font-bold">{phoneNumber}</span>. Enter your PIN on your phone to complete payment.</p>
                                            <div className="flex flex-col gap-3 pt-6">
                                                <button onClick={() => onSuccess()} className="text-primary font-bold hover:underline">I have completed payment</button>
                                                <button onClick={() => setStkSent(false)} className="text-sm text-neutral-500 hover:text-neutral-900">Try again / Change number</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {method === 'mpesa_paybill' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center gap-4 mb-4">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa" className="h-10" />
                                        <h2 className="text-2xl font-bold">M-Pesa Paybill</h2>
                                    </div>
                                    <p className="text-neutral-600 dark:text-neutral-400">Follow these steps manually on your phone to complete the payment for registration:</p>

                                    <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-700">
                                        <div className="flex items-center justify-between">
                                            <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest">Paybill Number</span>
                                            <span className="font-mono font-black text-xl text-primary">247247</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest">Account Number</span>
                                            <span className="font-mono font-black text-xl text-primary uppercase">{registrationId.substring(0, 8)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest">Amount</span>
                                            <span className="font-mono font-black text-xl text-primary">KES {amount.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <ol className="space-y-4 pt-4">
                                        <li className="flex gap-4">
                                            <span className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">1</span>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Go to M-PESA menu, select <span className="font-bold text-neutral-900 dark:text-white">Lipa na M-PESA</span></p>
                                        </li>
                                        <li className="flex gap-4">
                                            <span className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">2</span>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Select <span className="font-bold text-neutral-900 dark:text-white">Paybill</span></p>
                                        </li>
                                        <li className="flex gap-4">
                                            <span className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">3</span>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Enter <span className="font-bold text-neutral-900 dark:text-white">247247</span> (Paybill Number)</p>
                                        </li>
                                        <li className="flex gap-4">
                                            <span className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">4</span>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Enter <span className="font-bold text-neutral-900 dark:text-white uppercase">{registrationId.substring(0, 8)}</span> (Account Number)</p>
                                        </li>
                                        <li className="flex gap-4">
                                            <span className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">5</span>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Enter your M-PESA <span className="font-bold text-neutral-900 dark:text-white">PIN</span> and confirm</p>
                                        </li>
                                    </ol>

                                    <button onClick={() => onSuccess()} className="w-full mt-6 py-4 rounded-xl bg-neutral-900 text-white font-bold hover:bg-black transition-all">I have sent the payment</button>
                                </div>
                            )}

                            {method === 'card' && (
                                <form onSubmit={handleCardPayment} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="material-symbols-outlined text-primary text-4xl">credit_card</span>
                                        <h2 className="text-2xl font-bold">Credit / Debit Card</h2>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">Card Number</label>
                                            <input type="text" placeholder="#### #### #### ####" className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-sm focus:border-primary outline-none" required />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">Expiry Date</label>
                                            <input type="text" placeholder="MM / YY" className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-sm focus:border-primary outline-none" required />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">CVV</label>
                                            <input type="password" placeholder="***" className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-sm focus:border-primary outline-none" required />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isProcessing ? <div className="size-5 border-4 border-white/30 border-t-white animate-spin rounded-full" /> : <span>Pay KES {amount.toLocaleString()}</span>}
                                    </button>
                                    <p className="text-center text-[10px] text-neutral-500 flex items-center justify-center gap-1">
                                        <span className="material-symbols-outlined text-xs">lock</span>
                                        Secure transaction powered by Stripe
                                    </p>
                                </form>
                            )}

                        </div>
                    </div>
                </div>

                {/* Info Footer */}
                <div className="mt-12 p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 flex items-start gap-4">
                    <span className="material-symbols-outlined text-blue-500">info</span>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Once your payment is received, your registration status will be updated within <span className="font-bold text-neutral-900 dark:text-white">24 hours</span> and you will receive a confirmation email at <span className="font-bold text-neutral-900 dark:text-white">{email}</span>. Please keep your Registration ID safe.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
