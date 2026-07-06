import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { API_BASE_URL } from '../config';

type Role = 'CYCLIST' | 'ATTENDEE' | 'SPONSOR' | 'ORGANISER';

const ROLES: { value: Role; label: string; description: string }[] = [
    { value: 'CYCLIST', label: 'Cyclist', description: 'I rode one of the circuits' },
    { value: 'ATTENDEE', label: 'Attendee', description: 'I came to cheer & enjoy the day' },
    { value: 'SPONSOR', label: 'Sponsor', description: 'I partnered with the event' },
    { value: 'ORGANISER', label: 'Organiser', description: 'I helped run the event' },
];

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Outstanding'];

const FeedbackPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [notifyFor2027, setNotifyFor2027] = useState(false);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Role | null>(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [highlights, setHighlights] = useState('');
    const [improvements, setImprovements] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [notifyRegistered, setNotifyRegistered] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!role) {
            setErrorMsg('Please tell us how you took part in the event.');
            setStatus('error');
            return;
        }
        if (!rating) {
            setErrorMsg('Please rate your overall experience.');
            setStatus('error');
            return;
        }
        if (notifyFor2027 && !email.trim()) {
            setErrorMsg('Please enter your email to be notified for 2027.');
            setStatus('error');
            return;
        }
        setStatus('submitting');
        setErrorMsg('');
        try {
            const res = await fetch(`${API_BASE_URL}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role,
                    rating,
                    firstName: firstName.trim() || undefined,
                    lastName: lastName.trim() || undefined,
                    highlights: highlights.trim() || undefined,
                    improvements: improvements.trim() || undefined,
                    notifyEmail: notifyFor2027 ? email.trim() : undefined,
                }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || 'Something went wrong');
            }
            const data = await res.json().catch(() => ({}));
            setNotifyRegistered(Boolean(data?.notifyRegistered));
            setStatus('done');
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
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

    const textareaStyle: React.CSSProperties = {
        ...inputStyle,
        minHeight: '96px',
        resize: 'vertical',
        lineHeight: 1.6,
    };

    const labelStyle: React.CSSProperties = {
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: '0.65rem', fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--p-text-1, #fff)',
        display: 'block', marginBottom: '6px',
    };

    const displayedRating = hoverRating || rating;

    return (
        <div style={{
            fontFamily: "'Barlow', sans-serif",
            background: 'var(--p-bg, #0a0a0a)',
            color: 'var(--p-text-1, #fff)',
            minHeight: '100vh',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '64px 24px 96px',
        }}>
            <div style={{ maxWidth: '600px', width: '100%' }}>

                {/* Eyebrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                    <div style={{ height: '1px', width: '32px', background: 'var(--color-primary-light, #4caf50)', flexShrink: 0 }} />
                    <span style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '0.6rem', fontWeight: 700,
                        letterSpacing: '0.28em', textTransform: 'uppercase',
                        color: 'var(--color-primary-light, #4caf50)',
                    }}>
                        Ride With The Warriors 2026
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
                    How Was Your Experience?
                </h1>

                <p style={{
                    color: 'var(--p-text-2, rgba(255,255,255,0.58))',
                    fontSize: '0.95rem', lineHeight: 1.75,
                    marginBottom: '2.5rem',
                }}>
                    Thank you for being part of Ride With The Warriors 2026. Whether you rode, cheered,
                    sponsored or organised — your honest feedback shapes a better ride in 2027.
                    It takes less than a minute, and every answer is read.
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
                                Thank you, Warrior!
                            </p>
                            <p style={{ color: 'var(--p-text-2, rgba(255,255,255,0.58))', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                Your feedback has been received. It goes straight to the team planning
                                Ride With The Warriors 2027 — riding with honour, and getting better every year.
                                {notifyRegistered && (
                                    <> We'll also email you when registration opens for 2027.</>
                                )}
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {!notifyRegistered && (
                                <Link to="/register/notify" className="shimmer-btn shimmer-btn--primary">
                                    Notify Me for 2027
                                </Link>
                            )}
                            <Link to="/" className="shimmer-btn shimmer-btn--ghost">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Optional name */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                            <div>
                                <label style={labelStyle}>First Name <span style={{ color: 'var(--p-text-3, rgba(255,255,255,0.33))', fontWeight: 400 }}>(optional)</span></label>
                                <input
                                    type="text"
                                    placeholder="e.g. James"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    maxLength={100}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Last Name <span style={{ color: 'var(--p-text-3, rgba(255,255,255,0.33))', fontWeight: 400 }}>(optional)</span></label>
                                <input
                                    type="text"
                                    placeholder="e.g. Mwangi"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    maxLength={100}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Stakeholder role */}
                        <div>
                            <label style={labelStyle}>I took part as a… <span style={{ color: 'var(--color-accent, #f59e0b)' }}>*</span></label>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                                gap: '10px',
                            }}>
                                {ROLES.map(r => {
                                    const selected = role === r.value;
                                    return (
                                        <button
                                            key={r.value}
                                            type="button"
                                            onClick={() => setRole(r.value)}
                                            style={{
                                                textAlign: 'left',
                                                padding: '14px 16px',
                                                background: selected ? 'rgba(45,106,45,0.14)' : 'var(--p-input-bg, #0e0e0e)',
                                                border: selected
                                                    ? '1px solid var(--color-primary-light, #4caf50)'
                                                    : '1px solid var(--p-input-bd, rgba(255,255,255,0.09))',
                                                cursor: 'pointer',
                                                transition: 'border-color 0.15s ease, background 0.15s ease',
                                            }}
                                        >
                                            <span style={{
                                                display: 'block',
                                                fontFamily: "'Barlow Condensed', sans-serif",
                                                fontSize: '0.95rem', fontWeight: 700,
                                                textTransform: 'uppercase', letterSpacing: '0.08em',
                                                color: selected ? 'var(--color-primary-light, #4caf50)' : 'var(--p-text-1, #fff)',
                                                marginBottom: '2px',
                                            }}>
                                                {r.label}
                                            </span>
                                            <span style={{
                                                display: 'block',
                                                fontSize: '0.78rem',
                                                color: 'var(--p-text-2, rgba(255,255,255,0.58))',
                                                lineHeight: 1.4,
                                            }}>
                                                {r.description}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Overall rating */}
                        <div>
                            <label style={labelStyle}>Rate your overall experience <span style={{ color: 'var(--color-accent, #f59e0b)' }}>*</span></label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        aria-label={`${star} star${star > 1 ? 's' : ''} — ${RATING_LABELS[star]}`}
                                        style={{
                                            background: 'none', border: 'none', padding: '4px',
                                            cursor: 'pointer', lineHeight: 0,
                                            color: star <= displayedRating
                                                ? 'var(--color-accent, #f59e0b)'
                                                : 'rgba(255,255,255,0.18)',
                                            transition: 'color 0.1s ease',
                                        }}
                                    >
                                        {star <= displayedRating
                                            ? <AiFillStar size={32} />
                                            : <AiOutlineStar size={32} />}
                                    </button>
                                ))}
                                {displayedRating > 0 && (
                                    <span style={{
                                        marginLeft: '10px',
                                        fontFamily: "'Barlow Condensed', sans-serif",
                                        fontSize: '0.85rem', fontWeight: 700,
                                        textTransform: 'uppercase', letterSpacing: '0.1em',
                                        color: 'var(--color-accent, #f59e0b)',
                                    }}>
                                        {RATING_LABELS[displayedRating]}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Highlights */}
                        <div>
                            <label style={labelStyle}>What did we get right?</label>
                            <textarea
                                value={highlights}
                                onChange={e => setHighlights(e.target.value)}
                                placeholder="The moments, people or details that made your day…"
                                maxLength={2000}
                                style={textareaStyle}
                            />
                        </div>

                        {/* Improvements */}
                        <div>
                            <label style={labelStyle}>What should we improve for 2027?</label>
                            <textarea
                                value={improvements}
                                onChange={e => setImprovements(e.target.value)}
                                placeholder="Be honest — this is what helps us most…"
                                maxLength={2000}
                                style={textareaStyle}
                            />
                        </div>

                        {/* Notify for 2027 */}
                        <div style={{
                            padding: '16px',
                            border: '1px solid var(--p-input-bd, rgba(255,255,255,0.09))',
                            background: notifyFor2027 ? 'rgba(45,106,45,0.08)' : 'var(--p-input-bg, #0e0e0e)',
                            transition: 'background 0.15s ease, border-color 0.15s ease',
                        }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '16px',
                                cursor: 'pointer',
                                marginBottom: notifyFor2027 ? '14px' : 0,
                            }}>
                                <span style={{
                                    fontFamily: "'Barlow Condensed', sans-serif",
                                    fontSize: '0.85rem', fontWeight: 700,
                                    letterSpacing: '0.1em', textTransform: 'uppercase',
                                    color: 'var(--p-text-1, #fff)',
                                }}>
                                    Notify Me for 2027
                                </span>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={notifyFor2027}
                                    onClick={() => setNotifyFor2027(v => !v)}
                                    style={{
                                        position: 'relative',
                                        width: '44px',
                                        height: '24px',
                                        flexShrink: 0,
                                        border: '1px solid',
                                        borderColor: notifyFor2027
                                            ? 'var(--color-primary-light, #4caf50)'
                                            : 'var(--p-input-bd, rgba(255,255,255,0.09))',
                                        background: notifyFor2027
                                            ? 'var(--color-primary, #2d6a2d)'
                                            : 'var(--p-input-bg, #0e0e0e)',
                                        cursor: 'pointer',
                                        transition: 'background 0.15s ease, border-color 0.15s ease',
                                        padding: 0,
                                    }}
                                >
                                    <span style={{
                                        position: 'absolute',
                                        top: '2px',
                                        left: notifyFor2027 ? '22px' : '2px',
                                        width: '18px',
                                        height: '18px',
                                        background: '#fff',
                                        transition: 'left 0.15s ease',
                                    }} />
                                </button>
                            </label>
                            {notifyFor2027 && (
                                <div>
                                    <label style={labelStyle}>Email Address <span style={{ color: 'var(--color-accent, #f59e0b)' }}>*</span></label>
                                    <input
                                        type="email"
                                        placeholder="e.g. james@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required={notifyFor2027}
                                        style={inputStyle}
                                    />
                                    <p style={{
                                        margin: '8px 0 0',
                                        fontSize: '0.78rem',
                                        lineHeight: 1.5,
                                        color: 'var(--p-text-2, rgba(255,255,255,0.58))',
                                    }}>
                                        We'll let you know when registration opens for the 2027 edition.
                                    </p>
                                </div>
                            )}
                        </div>

                        {status === 'error' && (
                            <p style={{ color: '#f87171', fontSize: '0.85rem', margin: 0 }}>
                                {errorMsg}
                            </p>
                        )}

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
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
                                {status === 'submitting' ? 'Sending...' : 'Submit Feedback'}
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>
    );
};

export default FeedbackPage;
