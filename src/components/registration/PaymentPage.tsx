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
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

                :root, [data-theme="dark"] {
                    --color-primary: #2d6a2d;
                    --color-primary-dark: #1e4d1e;
                    --color-primary-light: #4caf50;
                    --py-bg:         #0a0a0a;
                    --py-raised:     #111111;
                    --py-card:       #141414;
                    --py-card-alt:   #0e0e0e;
                    --py-border:     rgba(255,255,255,0.07);
                    --py-border-2:   rgba(255,255,255,0.13);
                    --py-text-1:     #ffffff;
                    --py-text-2:     rgba(255,255,255,0.58);
                    --py-text-3:     rgba(255,255,255,0.32);
                    --py-input-bg:   #0a0a0a;
                    --py-input-bd:   rgba(255,255,255,0.09);
                    --py-divider:    rgba(255,255,255,0.05);
                    --py-step-bg:    rgba(45,106,45,0.10);
                    --py-pending-bg: rgba(45,106,45,0.06);
                    --py-error-bg:   rgba(220,38,38,0.06);
                    --py-error-bd:   rgba(220,38,38,0.25);
                }
                [data-theme="light"] {
                    --color-primary: #245924;
                    --color-primary-dark: #1a421a;
                    --color-primary-light: #2d6a2d;
                    --py-bg:         #f5f2eb;
                    --py-raised:     #edeae2;
                    --py-card:       #ffffff;
                    --py-card-alt:   #f9f7f3;
                    --py-border:     rgba(0,0,0,0.09);
                    --py-border-2:   rgba(0,0,0,0.15);
                    --py-text-1:     #111111;
                    --py-text-2:     rgba(20,20,20,0.60);
                    --py-text-3:     rgba(20,20,20,0.38);
                    --py-input-bg:   #f9f7f3;
                    --py-input-bd:   rgba(0,0,0,0.11);
                    --py-divider:    rgba(0,0,0,0.06);
                    --py-step-bg:    rgba(36,89,36,0.08);
                    --py-pending-bg: rgba(36,89,36,0.05);
                    --py-error-bg:   rgba(220,38,38,0.04);
                    --py-error-bd:   rgba(220,38,38,0.2);
                }

                .py-page {
                    font-family: 'Barlow', sans-serif;
                    background: var(--py-bg);
                    color: var(--py-text-1);
                    min-height: 100vh;
                    padding: 64px 24px 80px;
                    transition: background 0.3s, color 0.3s;
                }
                .py-inner { max-width: 960px; margin: 0 auto; }

                /* ── Label row ── */
                .py-label-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
                .py-label-line { height: 1px; width: 36px; background: var(--color-primary); flex-shrink: 0; }
                .py-eyebrow {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.65rem; font-weight: 700;
                    letter-spacing: 0.28em; text-transform: uppercase;
                    color: var(--color-primary-light);
                }

                /* ── Header ── */
                .py-header { text-align: center; margin-bottom: 52px; }
                .py-header-icon {
                    width: 60px; height: 60px; margin: 0 auto 20px;
                    border: 1px solid rgba(45,106,45,0.3);
                    background: rgba(45,106,45,0.08);
                    display: flex; align-items: center; justify-content: center;
                    color: var(--color-primary-light); font-size: 1.8rem;
                    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
                }
                .py-header-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(2.5rem, 6vw, 4rem);
                    letter-spacing: 0.03em; line-height: 0.95;
                    color: var(--py-text-1); margin-bottom: 24px;
                }
                .py-header-title span { color: var(--color-primary-light); }

                /* ── Summary strip ── */
                .py-summary {
                    display: inline-flex; flex-wrap: wrap;
                    align-items: center; justify-content: center; gap: 0;
                    background: var(--py-card);
                    border: 1px solid var(--py-border);
                    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
                    overflow: hidden;
                }
                .py-summary-cell {
                    display: flex; align-items: center; gap: 12px;
                    padding: 18px 28px;
                    border-right: 1px solid var(--py-border);
                }
                .py-summary-cell:last-child { border-right: none; }
                @media (max-width: 640px) {
                    .py-summary { flex-direction: column; width: 100%; }
                    .py-summary-cell { border-right: none; border-bottom: 1px solid var(--py-border); width: 100%; }
                    .py-summary-cell:last-child { border-bottom: none; }
                }
                .py-summary-icon { color: var(--color-primary-light); font-size: 1.1rem; flex-shrink: 0; }
                .py-summary-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.6rem; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase;
                    color: var(--py-text-3); margin-bottom: 3px;
                }
                .py-summary-value { font-size: 0.9rem; font-weight: 700; color: var(--py-text-1); }
                .py-summary-amount { color: var(--color-primary-light); font-size: 1.1rem; }

                /* ── Reg ID ── */
                .py-reg-id {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.72rem; color: var(--py-text-3); margin-top: 14px;
                    display: flex; align-items: center; justify-content: center; gap: 6px;
                }
                .py-reg-id span { color: var(--color-primary-light); font-weight: 700; }

                /* ── Main panel ── */
                .py-panel {
                    background: var(--py-card);
                    border: 1px solid var(--py-border);
                    overflow: hidden;
                    clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%);
                    display: grid; grid-template-columns: 1fr;
                }
                @media (min-width: 768px) {
                    .py-panel { grid-template-columns: 1fr 1fr; }
                }

                /* ── Left col ── */
                .py-left {
                    background: var(--py-card-alt);
                    border-right: 1px solid var(--py-border);
                    padding: 44px 40px;
                    display: flex; flex-direction: column; gap: 32px;
                }
                @media (max-width: 640px) { .py-left { padding: 28px 24px; } }

                .py-mpesa-header { display: flex; align-items: center; gap: 14px; }
                .py-mpesa-logo-box {
                    width: 48px; height: 48px; flex-shrink: 0;
                    background: var(--color-primary);
                    display: flex; align-items: center; justify-content: center;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
                }
                .py-mpesa-logo-box img { height: 22px; filter: brightness(0) invert(1); }
                .py-mpesa-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.6rem; letter-spacing: 0.03em;
                    color: var(--py-text-1); line-height: 1;
                }
                .py-mpesa-sub {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.62rem; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase;
                    color: var(--py-text-3); margin-top: 3px;
                }

                /* ── Input area ── */
                .py-input-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.68rem; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase;
                    color: var(--py-text-3); margin-bottom: 8px; display: block;
                }
                .py-phone-input {
                    width: 100%;
                    background: var(--py-input-bg);
                    border: 1px solid var(--py-input-bd);
                    padding: 14px 18px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 1.05rem; font-weight: 700;
                    color: var(--py-text-1);
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
                }
                .py-phone-input::placeholder { font-family: 'Barlow', sans-serif; font-weight: 400; font-size: 0.85rem; color: var(--py-text-3); }
                .py-phone-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(45,106,45,0.12); }
                .py-input-hint { font-size: 0.72rem; color: var(--py-text-3); margin-top: 6px; }

                /* ── Error ── */
                .py-error {
                    display: flex; align-items: flex-start; gap: 10px;
                    background: var(--py-error-bg);
                    border: 1px solid var(--py-error-bd);
                    padding: 12px 16px;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
                }
                .py-error-icon { color: #ef4444; font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
                .py-error-text { font-size: 0.82rem; color: #ef4444; line-height: 1.5; }

                /* ── Pending state ── */
                .py-pending-box {
                    background: var(--py-pending-bg);
                    border: 1px solid rgba(45,106,45,0.2);
                    padding: 32px 28px;
                    display: flex; flex-direction: column; align-items: center; gap: 20px;
                    text-align: center;
                    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%);
                }
                .py-pending-spinner {
                    width: 56px; height: 56px;
                    border: 3px solid rgba(45,106,45,0.2);
                    border-top-color: var(--color-primary-light);
                    border-radius: 50%;
                    animation: pySpin 0.8s linear infinite;
                }
                @keyframes pySpin { to { transform: rotate(360deg); } }
                .py-pending-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.6rem; letter-spacing: 0.03em;
                    color: var(--py-text-1);
                }
                .py-pending-body { font-size: 0.88rem; color: var(--py-text-2); line-height: 1.65; }
                .py-pending-body strong { color: var(--color-primary-light); font-weight: 700; }

                /* ── Back link ── */
                .py-back-link {
                    display: inline-flex; align-items: center; gap: 8px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.75rem; font-weight: 700;
                    letter-spacing: 0.14em; text-transform: uppercase;
                    color: var(--py-text-3); background: none; border: none; cursor: pointer;
                    transition: color 0.2s;
                }
                .py-back-link:hover { color: var(--color-primary-light); }
                .py-back-link svg { transition: transform 0.2s; }
                .py-back-link:hover svg { transform: translateX(-3px); }

                /* ── Right col ── */
                .py-right {
                    padding: 44px 40px;
                    display: flex; flex-direction: column; justify-content: space-between; gap: 32px;
                }
                @media (max-width: 640px) { .py-right { padding: 28px 24px; } }

                /* ── Steps ── */
                .py-steps { display: flex; flex-direction: column; gap: 0; }
                .py-step {
                    display: flex; align-items: flex-start; gap: 16px;
                    padding: 18px 0;
                    border-bottom: 1px solid var(--py-divider);
                }
                .py-step:first-child { border-top: 1px solid var(--py-divider); }
                .py-step-num {
                    width: 28px; height: 28px; flex-shrink: 0;
                    background: var(--py-step-bg);
                    border: 1px solid rgba(45,106,45,0.2);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Bebas Neue', sans-serif; font-size: 0.9rem;
                    color: var(--color-primary-light);
                    clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%);
                }
                .py-step-text { font-size: 0.88rem; color: var(--py-text-2); line-height: 1.65; padding-top: 3px; }

                /* ── Amount display ── */
                .py-amount-box {
                    background: var(--py-raised);
                    border: 1px solid var(--py-border);
                    padding: 22px 24px;
                    display: flex; align-items: center; justify-content: space-between;
                    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
                }
                .py-amount-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.65rem; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase;
                    color: var(--py-text-3);
                }
                .py-amount-value {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 2.2rem; letter-spacing: 0.02em;
                    color: var(--color-primary-light);
                }

                /* ── Shimmer submit button ── */
                .py-submit {
                    position: relative; overflow: hidden;
                    width: 100%;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    padding: 17px 32px;
                    background: var(--color-primary); color: #fff;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.92rem; font-weight: 800;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    border: none; cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
                    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
                }
                .py-submit::before {
                    content: ''; position: absolute; top: 0; left: -80%;
                    width: 60%; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.42) 50%, transparent 80%);
                    transform: skewX(-20deg); pointer-events: none;
                }
                .py-submit:hover:not(:disabled)::before { left: 140%; transition: left 0.55s cubic-bezier(0.25,0.46,0.45,0.94); }
                .py-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(45,106,45,0.38); background: var(--color-primary-dark); }
                .py-submit:active:not(:disabled) { transform: translateY(0); }
                .py-submit:disabled { opacity: 0.55; cursor: not-allowed; }
                .py-submit.error { background: #b91c1c; }
                .py-submit.error:hover:not(:disabled) { background: #991b1b; box-shadow: 0 12px 32px rgba(185,28,28,0.35); }

                .py-btn-spinner {
                    width: 16px; height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff; border-radius: 50%;
                    animation: pySpin 0.7s linear infinite;
                }

                /* ── Retry / awaiting row ── */
                .py-awaiting {
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    padding: 14px 0;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.78rem; font-weight: 700;
                    letter-spacing: 0.18em; text-transform: uppercase;
                    color: var(--color-primary-light);
                }
                .py-awaiting-dot {
                    width: 6px; height: 6px; background: currentColor;
                    animation: pyBounce 1s ease-in-out infinite;
                }
                .py-awaiting-dot:nth-child(2) { animation-delay: 0.15s; }
                .py-awaiting-dot:nth-child(3) { animation-delay: 0.3s; }
                @keyframes pyBounce {
                    0%,100% { transform: translateY(0); opacity: 1; }
                    50%      { transform: translateY(-4px); opacity: 0.4; }
                }
                .py-retry-btn {
                    width: 100%; padding: 13px;
                    background: none; border: 1px solid var(--py-border);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.75rem; font-weight: 700;
                    letter-spacing: 0.16em; text-transform: uppercase;
                    color: var(--py-text-3); cursor: pointer;
                    transition: border-color 0.2s, color 0.2s;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
                }
                .py-retry-btn:hover { border-color: var(--color-primary); color: var(--color-primary-light); }
            `}</style>

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