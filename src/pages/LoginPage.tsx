import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/account.css';

type Step = 'identify' | 'name' | 'code';
const RESEND_SECONDS = 30;

/** Only allow redirects back into this site. */
function safeNext(next: string | null): string {
    return next && next.startsWith('/') && !next.startsWith('//') ? next : '/account';
}

const LoginPage = () => {
    const { account, signIn, apiFetch } = useAuth();
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const next = safeNext(params.get('next'));

    const [step, setStep] = useState<Step>('identify');
    const [identifier, setIdentifier] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [code, setCode] = useState('');
    const [sentTo, setSentTo] = useState('');
    const [isNew, setIsNew] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [resendIn, setResendIn] = useState(0);
    const [devCode, setDevCode] = useState('');

    useEffect(() => {
        if (resendIn <= 0) return;
        const t = setTimeout(() => setResendIn(s => s - 1), 1000);
        return () => clearTimeout(t);
    }, [resendIn]);

    if (account) return <Navigate to={next} replace />;

    const start = async (withName: boolean) => {
        setBusy(true);
        setError('');
        try {
            const res = await apiFetch('/auth/start', {
                method: 'POST',
                body: JSON.stringify({
                    identifier: identifier.trim(),
                    ...(withName ? { firstName: firstName.trim(), lastName: lastName.trim() } : {}),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error?.message || 'Something went wrong. Please try again.');
            if (data.needsName) {
                setStep('name');
                return;
            }
            setIsNew(!!data.isNewAccount);
            setSentTo(data.sentTo || identifier.trim());
            setDevCode(data.devCode || '');
            setCode('');
            setStep('code');
            setResendIn(RESEND_SECONDS);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setBusy(false);
        }
    };

    const verify = async (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);
        setError('');
        try {
            const res = await apiFetch('/auth/verify', {
                method: 'POST',
                body: JSON.stringify({ identifier: identifier.trim(), code: code.trim() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error?.message || 'That code is not correct.');
            signIn(data.token, data.account);
            navigate(next, { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'That code is not correct.');
        } finally {
            setBusy(false);
        }
    };

    const isEmail = identifier.includes('@');

    return (
        <div className="acct-page acct-page--center">
            <div className="acct-wrap">
                <div className="acct-eyebrow">Ride With The Warriors</div>

                {step === 'identify' && (
                    <>
                        <h1 className="acct-title">Log in or sign up</h1>
                        <p className="acct-lead">
                            Enter the email address or phone number you used for Ride With The Warriors.
                            We'll send you a one-time code. No password needed.
                        </p>
                        <form className="acct-form" onSubmit={e => { e.preventDefault(); start(false); }}>
                            <div>
                                <label className="acct-label" htmlFor="identifier">Email or phone number</label>
                                <input
                                    id="identifier"
                                    className="acct-input"
                                    autoComplete="username"
                                    inputMode={isEmail ? 'email' : 'text'}
                                    placeholder="e.g. james@example.com or 0712 345 678"
                                    value={identifier}
                                    onChange={e => setIdentifier(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="acct-error" role="alert">{error}</p>}
                            <div className="acct-actions">
                                <button type="submit" className="shimmer-btn shimmer-btn--primary" disabled={busy} style={{ border: 'none', cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
                                    {busy ? 'Checking…' : 'Continue'}
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {step === 'name' && (
                    <>
                        <h1 className="acct-title">Create your account</h1>
                        <p className="acct-lead">
                            We don't have an account for <strong>{identifier.trim()}</strong> yet. Tell us your name and we'll send a code to confirm it's you.
                        </p>
                        <form className="acct-form" onSubmit={e => { e.preventDefault(); start(true); }}>
                            <div className="acct-row">
                                <div>
                                    <label className="acct-label" htmlFor="firstName">First name</label>
                                    <input id="firstName" className="acct-input" autoComplete="given-name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="acct-label" htmlFor="lastName">Last name</label>
                                    <input id="lastName" className="acct-input" autoComplete="family-name" value={lastName} onChange={e => setLastName(e.target.value)} required />
                                </div>
                            </div>
                            {error && <p className="acct-error" role="alert">{error}</p>}
                            <div className="acct-actions">
                                <button type="submit" className="shimmer-btn shimmer-btn--primary" disabled={busy} style={{ border: 'none', cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
                                    {busy ? 'Sending code…' : 'Send code'}
                                </button>
                                <button type="button" className="acct-link" onClick={() => { setStep('identify'); setError(''); }}>
                                    Use a different email or phone
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {step === 'code' && (
                    <>
                        <h1 className="acct-title">Enter your code</h1>
                        <p className="acct-lead">
                            We sent a 6-digit code to <strong>{sentTo}</strong>. It expires in 10 minutes.
                            {isNew && ' Entering it creates your account.'}
                        </p>
                        {devCode && (
                            <p className="acct-muted" style={{ marginTop: '-1rem', marginBottom: '1.5rem' }}>
                                Test mode: your code is <strong>{devCode}</strong>
                            </p>
                        )}
                        <form className="acct-form" onSubmit={verify}>
                            <div>
                                <label className="acct-label" htmlFor="code">6-digit code</label>
                                <input
                                    id="code"
                                    className="acct-input acct-input--code"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    pattern="\d{6}"
                                    maxLength={6}
                                    value={code}
                                    onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                                    required
                                    autoFocus
                                />
                            </div>
                            {error && <p className="acct-error" role="alert">{error}</p>}
                            <div className="acct-actions">
                                <button type="submit" className="shimmer-btn shimmer-btn--primary" disabled={busy || code.length !== 6} style={{ border: 'none', cursor: 'pointer', opacity: busy || code.length !== 6 ? 0.6 : 1 }}>
                                    {busy ? 'Checking…' : 'Log in'}
                                </button>
                                <button type="button" className="acct-link" disabled={resendIn > 0 || busy} onClick={() => start(isNew)}>
                                    {resendIn > 0 ? `Resend code in ${resendIn}s` : 'Resend code'}
                                </button>
                                <button type="button" className="acct-link" onClick={() => { setStep('identify'); setError(''); }}>
                                    Change email or phone
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
