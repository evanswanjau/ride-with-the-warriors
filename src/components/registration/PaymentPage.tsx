import '../../styles/registration/PaymentPage.css';
import { useState, useEffect } from 'react';
import {
    AiOutlineCheckCircle,
    AiOutlineArrowLeft,
    AiOutlineMobile,
    AiOutlineUser,
    AiOutlineEnvironment,
    AiOutlineWarning,
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

function formatKenyanPhone(raw: string): string {
    let phone = raw.trim().replace(/\s+/g, '');
    if (phone.startsWith('+')) phone = phone.slice(1);
    if (phone.startsWith('07') || phone.startsWith('01')) {
        phone = '254' + phone.slice(1);
    }
    return phone;
}

const PaymentPage = ({ registrationId, amount, phoneNumber: registrationPhone, onBack, onSuccess }: PaymentPageProps) => {
    const [isProcessing, setIsProcessing] = useState(false);
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
                if (!mpesaPhone && r.phoneNumber) setMpesaPhone(formatKenyanPhone(r.phoneNumber));
                let name = '';
                if (r.type === 'individual') name = `${p.riderDetails?.firstName || ''} ${p.riderDetails?.lastName || ''}`.trim();
                else if (r.type === 'team') name = p.teamDetails?.teamName || 'Team';
                else name = `${p.familyDetails?.guardian?.firstName || ''} ${p.familyDetails?.guardian?.lastName || ''} (Family)`.trim();
                const classification = r.classifications?.[0];
                setRegInfo({ name, circuit: (r.circuitId || '').toUpperCase(), category: classification?.category || r.type, amount: r.pricing?.totalAmount || amount });
            } catch { /* silent */ }
        };
        fetchReg();
    }, [registrationId, amount]);

    const startPolling = async (regId: string) => {
        let attempts = 0;
        const maxAttempts = 20;
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
                    if (reg?.status === 'PAID' || reg?.status === 'CONFIRMED') { onSuccess(); return; }
                    if (reg?.payload?.paymentFailed === true) {
                        const reason = reg?.payload?.paymentFailureReason || 'Payment was not completed.';
                        setPaymentStatus('error');
                        setError(`Payment failed: ${reason}. Please try again.`);
                        return;
                    }
                }
            } catch (err) { console.error('Polling error:', err); }
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
                body: JSON.stringify({ registrationId, amount: regInfo?.amount || amount, phoneNumber: formatted }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setPaymentStatus('pending');
                setIsProcessing(false);
                startPolling(registrationId);
            } else {
                setError(data.message || 'STK Push failed. Please try again.');
                setIsProcessing(false);
            }
        } catch {
            setError('Connection error. Please try again.');
            setIsProcessing(false);
        }
    };

    const handleRetry = () => { setPaymentStatus('initial'); setError(null); };

    const isPending = paymentStatus === 'pending';
    const isError = paymentStatus === 'error';

    return (
        <>
            

            <div className="py-page">
                <div className="py-inner">

                    {/* ── Header ── */}
                    <div className="py-header">
                        <div className="py-label-row" style={{ justifyContent: 'center' }}>
                            <div className="py-label-line" />
                            <span className="py-eyebrow">Payment Processing</span>
                            <div className="py-label-line" />
                        </div>

                        <div className="py-header-icon">
                            <AiOutlineCheckCircle />
                        </div>

                        <h1 className="py-header-title">
                            Complete  <span>Payment!</span>
                        </h1>

                        {/* Summary strip */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className="py-summary">
                                <div className="py-summary-cell">
                                    <AiOutlineUser className="py-summary-icon" />
                                    <div>
                                        <div className="py-summary-label">Registrant</div>
                                        <div className="py-summary-value">{regInfo?.name || '—'}</div>
                                    </div>
                                </div>
                                <div className="py-summary-cell">
                                    <AiOutlineEnvironment className="py-summary-icon" />
                                    <div>
                                        <div className="py-summary-label">Circuit / Category</div>
                                        <div className="py-summary-value">
                                            {regInfo?.circuit || '—'}{regInfo?.category ? ` · ${regInfo.category}` : ''}
                                        </div>
                                    </div>
                                </div>
                                <div className="py-summary-cell">
                                    <div>
                                        <div className="py-summary-label">Amount Due</div>
                                        <div className="py-summary-value py-summary-amount">
                                            KES {(regInfo?.amount ?? amount).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="py-reg-id">
                            REG ID: <span>{registrationId}</span>
                        </div>
                    </div>

                    {/* ── Main panel ── */}
                    <div className="py-panel">

                        {/* Left — M-Pesa */}
                        <div className="py-left">
                            {/* M-Pesa header */}
                            <div className="py-mpesa-header">
                                <div className="py-mpesa-logo-box">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa" />
                                </div>
                                <div>
                                    <div className="py-mpesa-title">M-Pesa Prompt</div>
                                    <div className="py-mpesa-sub">
                                        {isPending ? 'Waiting for PIN entry' : 'Instant mobile payment'}
                                    </div>
                                </div>
                            </div>

                            {/* Input or pending */}
                            {!isPending ? (
                                <div>
                                    <label className="py-input-label">M-Pesa Phone Number</label>
                                    <input
                                        type="tel"
                                        value={mpesaPhone}
                                        onChange={e => setMpesaPhone(e.target.value)}
                                        placeholder="07XX XXX XXX  or  254XXXXXXXXX"
                                        className="py-phone-input"
                                    />
                                    <p className="py-input-hint">Accepts 07XX, +254, or 254 format</p>

                                    {error && (
                                        <div className="py-error" style={{ marginTop: 14 }}>
                                            <AiOutlineWarning className="py-error-icon" />
                                            <span className="py-error-text">{error}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="py-pending-box">
                                    <div className="py-pending-spinner" />
                                    <div className="py-pending-title">Prompt Sent!</div>
                                    <p className="py-pending-body">
                                        Check your phone and enter your{' '}
                                        <strong>M-Pesa PIN</strong> to complete the payment.
                                        This page will update automatically.
                                    </p>
                                </div>
                            )}

                            {/* Back link — desktop */}
                            <div className="hidden md:block">
                                <button onClick={onBack} className="py-back-link">
                                    <AiOutlineArrowLeft />
                                    Change Details
                                </button>
                            </div>
                        </div>

                        {/* Right — Steps + CTA */}
                        <div className="py-right">
                            {/* Steps */}
                            <div>
                                <div className="py-label-row" style={{ marginBottom: 20 }}>
                                    <div className="py-label-line" />
                                    <span className="py-eyebrow">How It Works</span>
                                </div>
                                <div className="py-steps">
                                    {[
                                        'Enter your phone number below and tap Send Prompt.',
                                        'Check your phone for the prompt and enter your PIN.',
                                        'Stay on this page for your payment confirmation.',
                                    ].map((text, i) => (
                                        <div key={i} className="py-step">
                                            <div className="py-step-num">{i + 1}</div>
                                            <p className="py-step-text">{text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Amount + CTA */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {/* Amount box */}
                                <div className="py-amount-box">
                                    <div>
                                        <div className="py-amount-label">Total Due</div>
                                        <div className="py-amount-value">
                                            KES {(regInfo?.amount ?? amount).toLocaleString()}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div className="py-amount-label">Via</div>
                                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '0.85rem', color: 'var(--py-text-2)', letterSpacing: '0.1em' }}>M-PESA STK</div>
                                    </div>
                                </div>

                                {/* Submit / Awaiting */}
                                {isPending ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <div className="py-awaiting">
                                            <div className="py-awaiting-dot" />
                                            <div className="py-awaiting-dot" />
                                            <div className="py-awaiting-dot" />
                                            Awaiting Confirmation
                                        </div>
                                        <button onClick={handleRetry} className="py-retry-btn">
                                            Didn't receive prompt? Retry
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleConfirm}
                                        disabled={isProcessing}
                                        className={`py-submit${isError ? ' error' : ''}`}
                                    >
                                        {isProcessing ? (
                                            <><div className="py-btn-spinner" /><span>Sending Prompt…</span></>
                                        ) : isError ? (
                                            <><span>Retry Send Prompt</span><AiOutlineMobile /></>
                                        ) : (
                                            <><span>Send M-Pesa Prompt</span><AiOutlineMobile /></>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default PaymentPage;