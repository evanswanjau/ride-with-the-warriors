import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { AiOutlineHeart, AiOutlineWarning, AiOutlineCheckCircle } from 'react-icons/ai';
import { API_BASE_URL } from '../config';
import '../styles/home.css';

function formatKenyanPhone(raw: string): string {
    let phone = raw.trim().replace(/\s+/g, '');
    if (phone.startsWith('+')) phone = phone.slice(1);
    if (phone.startsWith('07') || phone.startsWith('01')) {
        phone = '254' + phone.slice(1);
    }
    return phone;
}

const DonatePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const presetAmounts = ['100', '500', '1000', '5000'];
    const [amount, setAmount] = useState<string>(searchParams.get('amount') || '100');
    const [customAmount, setCustomAmount] = useState<string>('');
    const [isCustom, setIsCustom] = useState(searchParams.get('amount') ? !presetAmounts.includes(searchParams.get('amount')!) : false);


    // Donor Info
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Payment State
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'initial' | 'pending' | 'success' | 'error'>('initial');
    const [error, setError] = useState<string | null>(null);
    const [donationId, setDonationId] = useState<string | null>(null);

    useEffect(() => {
        const urlAmount = searchParams.get('amount');
        if (urlAmount) {
            if (presetAmounts.includes(urlAmount) && !isCustom) {
                setAmount(urlAmount);
                setIsCustom(false);
                setCustomAmount('');
            } else {
                setAmount('custom');
                setCustomAmount(urlAmount);
                setIsCustom(true);
            }
        } else {
            // Default to 100 if no amount in URL
            setAmount('100');
            setIsCustom(false);
            setCustomAmount('');
        }
    }, [searchParams]); // Note: isCustom is not in deps to prevent loop, but searchParams change will trigger it


    const handleAmountSelect = (val: string) => {
        if (val === 'custom') {
            setIsCustom(true);
            setAmount('custom');
            if (customAmount) setSearchParams({ amount: customAmount });
            else {
                const params = new URLSearchParams(searchParams);
                params.delete('amount');
                setSearchParams(params);
            }
        } else {
            setIsCustom(false);
            setAmount(val);
            setSearchParams({ amount: val });
        }
    };

    const handleCustomChange = (val: string) => {
        // Prevent negative or zero amounts immediately if they are numbers
        if (val && !isNaN(Number(val)) && Number(val) < 1) {
            setCustomAmount('1');
            setSearchParams({ amount: '1' });
            return;
        }
        setCustomAmount(val);
        if (val) setSearchParams({ amount: val });

        else {
            const params = new URLSearchParams(searchParams);
            params.delete('amount');
            setSearchParams(params);
        }
    };

    const startPolling = async (id: string) => {
        let attempts = 0;
        const maxAttempts = 20;
        const poll = async () => {
            if (attempts >= maxAttempts) {
                setPaymentStatus('error');
                setError('Payment confirmation timed out. If you have paid, please contact support with your Donation ID.');
                return;
            }
            try {
                const res = await fetch(`${API_BASE_URL}/donations/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.donation?.status === 'PAID') {
                        setPaymentStatus('success');
                        return;
                    }
                    if (data.donation?.status === 'FAILED') {
                        setPaymentStatus('error');
                        const reason = data.donation?.failureReason || 'Payment was not completed. Please try again.';
                        setError(reason);
                        return;
                    }
                }
            } catch (err) { console.error('Polling error:', err); }
            attempts++;
            setTimeout(poll, 3000);
        };
        poll();
    };

    const handleDonate = async () => {
        const finalAmount = isCustom ? customAmount : amount;
        if (!finalAmount || isNaN(Number(finalAmount)) || Number(finalAmount) < 1) {
            setError('Please enter a donation amount of at least KES 1.');
            return;
        }


        if (!name.trim()) {
            setError('Please enter your full name.');
            return;
        }

        if (!email.trim() || !email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

        const formattedPhone = formatKenyanPhone(phone);
        if (!formattedPhone || formattedPhone.length < 12) {
            setError('Please enter a valid M-Pesa phone number.');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // 1. Create Donation Record
            const res = await fetch(`${API_BASE_URL}/donations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: finalAmount, name, email, phone: formattedPhone }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || 'Failed to initialize donation');

            const id = data.donationId;
            setDonationId(id);

            // 2. Trigger STK Push
            const pushRes = await fetch(`${API_BASE_URL}/donations/pay/stk-push`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ donationId: id, phoneNumber: formattedPhone }),
            });
            const pushData = await pushRes.json();
            if (!pushRes.ok) throw new Error(pushData.error?.message || 'Failed to trigger M-Pesa prompt');

            setPaymentStatus('pending');
            startPolling(id);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
            setIsProcessing(false);
        } finally {
            setIsProcessing(false);
        }
    };

    if (paymentStatus === 'success') {
        return (
            <Layout isFullWidth>
                <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)] transition-colors duration-300">
                    <div className="max-w-md w-full px-6 text-center">
                        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                            <AiOutlineCheckCircle size={48} className="text-green-500" />
                        </div>
                        <h2 className="display-heading text-5xl text-[var(--text-1)] mb-4 uppercase tracking-wider">Thank You!</h2>
                        <p className="text-[var(--text-2)] mb-10 leading-relaxed font-light">
                            Your donation of <span className="text-white font-bold">KES {(isCustom ? customAmount : amount).toLocaleString()}</span> has been received.
                            Your support means the world to our widows and their families.
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="raffle-cta-btn w-full justify-center"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout isFullWidth>
            <div className="min-h-screen pt-32 pb-20 px-6 bg-[var(--page-bg)] transition-colors duration-300">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-px w-12 bg-amber-500" />
                        <span className="section-label" style={{ color: '#f59e0b' }}>Support The Cause</span>
                    </div>

                    <h1 className="display-heading text-[clamp(2.5rem,7vw,5.5rem)] mb-6 text-[var(--text-1)]">
                        Giving Back to <br />
                        Our <span className="text-amber-500">Heroes' Families.</span>
                    </h1>

                    <p className="text-lg text-[var(--text-2)] mb-12 leading-relaxed max-w-2xl font-light">
                        Every contribution helps us provide essential support, education, and welfare
                        for the widows and children of our fallen KDF Airborne paratroopers.
                        Your generosity ensures they are never forgotten.
                    </p>

                    <div className="bg-[var(--raised-bg)] border border-[var(--border-1)] p-8 md:p-12 relative overflow-hidden"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))' }}>

                        <div className="absolute top-0 right-0 p-8 text-amber-500 opacity-10 pointer-events-none">
                            <AiOutlineHeart size={140} />
                        </div>

                        {paymentStatus === 'pending' ? (
                            <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-8" />
                                <h3 className="font-['Bebas_Neue'] text-4xl text-white mb-4 tracking-widest">Awaiting Confirmation</h3>
                                <p className="text-[var(--text-2)] max-w-sm mx-auto font-light mb-4">
                                    Check your phone for the M-Pesa prompt and enter your PIN to complete the donation.
                                </p>
                                <p className="text-[var(--text-3)] text-xs uppercase tracking-widest font-bold">
                                    Donation ID: {donationId}
                                </p>
                            </div>
                        ) : (
                            <>
                                <h3 className="font-['Barlow_Condensed'] text-xl font-extrabold uppercase tracking-widest text-[var(--text-1)] mb-8">
                                    1. Select Amount (KES)
                                </h3>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    {presetAmounts.map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() => handleAmountSelect(amt)}
                                            className={`py-6 px-4 font-['Bebas_Neue'] text-3xl tracking-wider border transition-all duration-300 ${amount === amt
                                                ? 'bg-amber-500 border-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                                                : 'bg-transparent border-[var(--border-1)] text-[var(--text-1)] hover:border-amber-500/50'
                                                }`}
                                        >
                                            {amt}
                                        </button>
                                    ))}
                                </div>

                                <div className="mb-10">
                                    <button
                                        onClick={() => handleAmountSelect('custom')}
                                        className={`w-full py-4 mb-4 font-['Barlow_Condensed'] text-lg font-bold uppercase tracking-widest border transition-all duration-300 ${isCustom
                                            ? 'bg-[var(--text-1)] border-[var(--text-1)] text-[var(--page-bg)]'
                                            : 'bg-transparent border-[var(--border-1)] text-[var(--text-1)] hover:border-[var(--text-1)]/30'
                                            }`}
                                    >
                                        Custom Amount
                                    </button>

                                    {isCustom && (
                                        <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-3)] font-bold">KES</span>
                                            <input
                                                type="number"
                                                min="1"
                                                value={customAmount}
                                                onChange={(e) => handleCustomChange(e.target.value)}
                                                placeholder="Enter amount..."
                                                className="w-full bg-[var(--text-1)]/5 border border-[var(--border-1)] py-5 pl-16 pr-6 text-2xl text-[var(--text-1)] font-bold focus:outline-none focus:border-amber-500 transition-colors"
                                            />

                                        </div>
                                    )}
                                </div>

                                <h3 className="font-['Barlow_Condensed'] text-xl font-extrabold uppercase tracking-widest text-[var(--text-1)] mb-8">
                                    2. Your Information
                                </h3>

                                <div className="grid gap-6 mb-10">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-[var(--text-3)] font-bold mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                placeholder="John Doe"
                                                className="w-full bg-[var(--text-1)]/5 border border-[var(--border-1)] py-4 px-6 text-[var(--text-1)] focus:outline-none focus:border-amber-500/50 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-[var(--text-3)] font-bold mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                placeholder="john@example.com"
                                                className="w-full bg-[var(--text-1)]/5 border border-[var(--border-1)] py-4 px-6 text-[var(--text-1)] focus:outline-none focus:border-amber-500/50 transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-[var(--text-3)] font-bold mb-2">M-Pesa Phone Number</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            placeholder="07XX XXX XXX"
                                            className="w-full bg-[var(--text-1)]/5 border border-[var(--border-1)] py-4 px-6 text-[var(--text-1)] focus:outline-none focus:border-amber-500/50 transition-colors"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                        <AiOutlineWarning size={20} />
                                        <span className="text-sm font-medium">{error}</span>
                                    </div>
                                )}

                                <button
                                    onClick={handleDonate}
                                    disabled={isProcessing}
                                    className="shimmer-btn shimmer-btn--amber w-full py-6 text-xl justify-center font-black disabled:opacity-50"
                                >
                                    {isProcessing ? 'Processing...' : 'Complete Donation'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DonatePage;
