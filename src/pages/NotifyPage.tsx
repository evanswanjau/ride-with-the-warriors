import { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const NotifyPage = () => {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setStatus('submitting');
        setErrorMsg('');
        try {
            const res = await fetch(`${API_BASE_URL}/notify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    firstName: firstName.trim() || undefined,
                }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || 'Something went wrong');
            }
            setStatus('done');
        } catch (err: any) {
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
            setStatus('error');
        }
    };

    const inputStyle: React.CSSProperties = {
        background: 'var(--p-input-bg, #0e0e0e)',
        border: '1px solid var(--p-input-bd, rgba(255,255,255,0.09))',
        color: 'var(--p-text-1, #fff)',
        padding: '13px 16px',
        fontSize: '0.95rem',
        fontFamily: "'Barlow', sans-serif",
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
    };

    const labelStyle: React.CSSProperties = {
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: '0.65rem', fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--p-label, rgba(255,255,255,0.55))',
        display: 'block', marginBottom: '6px',
    };

    return (
        <div style={{
            fontFamily: "'Barlow', sans-serif",
            background: 'var(--p-bg, #0a0a0a)',
            color: 'var(--p-text-1, #fff)',
            minHeight: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '48px 24px 80px',
        }}>
            <div style={{ maxWidth: '480px', width: '100%' }}>

                {/* Eyebrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                    <div style={{ height: '1px', width: '32px', background: 'var(--color-primary-light, #4caf50)', flexShrink: 0 }} />
                    <span style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '0.6rem', fontWeight: 700,
                        letterSpacing: '0.28em', textTransform: 'uppercase',
                        color: 'var(--color-primary-light, #4caf50)',
                    }}>
                        Ride With The Warriors 2027
                    </span>
                    <div style={{ height: '1px', width: '32px', background: 'var(--color-primary-light, #4caf50)', flexShrink: 0 }} />
                </div>

                {/* Heading */}
                <h1 style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                    fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.04em', lineHeight: 1.15,
                    marginBottom: '1rem',
                }}>
                    Be the First to Know
                </h1>

                <p style={{
                    color: 'var(--p-text-2, rgba(255,255,255,0.58))',
                    fontSize: '0.95rem', lineHeight: 1.75,
                    marginBottom: '2.5rem',
                }}>
                    Registration for 2026 is closed, but the next edition is coming. Leave your details and we'll let you know when registration opens for 2027.
                </p>

                {status === 'done' ? (
                    <div>
                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(45,106,45,0.12)',
                            border: '1px solid rgba(76,175,80,0.25)',
                            marginBottom: '2rem',
                        }}>
                            <p style={{
                                fontFamily: "'Barlow Condensed', sans-serif",
                                fontSize: '1rem', fontWeight: 700,
                                textTransform: 'uppercase', letterSpacing: '0.08em',
                                color: 'var(--color-primary-light, #4caf50)',
                                marginBottom: '0.4rem',
                            }}>
                                You're on the list!
                            </p>
                            <p style={{ color: 'var(--p-text-2, rgba(255,255,255,0.58))', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                We'll be in touch when registration opens for Ride With The Warriors 2027.
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            <Link to="/feedback" className="shimmer-btn shimmer-btn--primary">
                                Share Feedback
                            </Link>
                            <Link to="/" className="shimmer-btn shimmer-btn--ghost">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={labelStyle}>First Name</label>
                            <input
                                type="text"
                                placeholder="e.g. James"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Email Address <span style={{ color: 'var(--color-accent, #f59e0b)' }}>*</span></label>
                            <input
                                type="email"
                                placeholder="e.g. james@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>

                        {status === 'error' && (
                            <p style={{ color: '#f87171', fontSize: '0.85rem', margin: 0 }}>
                                {errorMsg}
                            </p>
                        )}

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '0.5rem' }}>
                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="shimmer-btn shimmer-btn--primary"
                                style={{
                                    border: 'none',
                                    cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                                    opacity: status === 'submitting' ? 0.6 : 1,
                                }}
                            >
                                {status === 'submitting' ? 'Saving...' : 'Notify Me for 2027'}
                            </button>
                            </div>
                    </form>
                )}

            </div>
        </div>
    );
};

export default NotifyPage;
