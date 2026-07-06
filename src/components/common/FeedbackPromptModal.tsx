import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const FEEDBACK_PROMPT_STORAGE_KEY = 'rwtw-feedback-prompt-dismissed';

interface Props {
    onClose: () => void;
}

const FeedbackPromptModal = ({ onClose }: Props) => {
    const navigate = useNavigate();

    const handleDismiss = () => {
        localStorage.setItem(FEEDBACK_PROMPT_STORAGE_KEY, '1');
        onClose();
    };

    const handleGoToFeedback = () => {
        localStorage.setItem(FEEDBACK_PROMPT_STORAGE_KEY, '1');
        onClose();
        navigate('/feedback');
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleDismiss();
        };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem',
                background: 'rgba(0,0,0,0.78)',
                backdropFilter: 'blur(6px)',
            }}
            onClick={handleDismiss}
        >
            <div
                style={{
                    position: 'relative',
                    maxWidth: '440px', width: '100%',
                    background: 'var(--p-card, #141414)',
                    border: '1px solid var(--p-border-2, rgba(255,255,255,0.13))',
                    padding: '2.5rem 2rem 2rem',
                    animation: 'fpmFadeUp 0.22s cubic-bezier(0.34,1.2,0.64,1) forwards',
                }}
                onClick={e => e.stopPropagation()}
            >
                <style>{`
                    @keyframes fpmFadeUp {
                        from { opacity: 0; transform: translateY(18px) scale(0.97); }
                        to   { opacity: 1; transform: translateY(0) scale(1); }
                    }
                `}</style>

                <button
                    onClick={handleDismiss}
                    aria-label="Close"
                    style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--p-text-3, rgba(255,255,255,0.33))',
                        fontSize: '1.1rem', lineHeight: 1, padding: '4px',
                        transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--p-text-1, #fff)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--p-text-3, rgba(255,255,255,0.33))')}
                >
                    ✕
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                    <div style={{ height: '1px', width: '24px', background: 'var(--color-primary-light, #4caf50)', flexShrink: 0 }} />
                    <span style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '0.6rem', fontWeight: 700,
                        letterSpacing: '0.28em', textTransform: 'uppercase',
                        color: 'var(--color-primary-light, #4caf50)',
                    }}>
                        Post-Event Survey
                    </span>
                    <div style={{ height: '1px', width: '24px', background: 'var(--color-primary-light, #4caf50)', flexShrink: 0 }} />
                </div>

                <h2 style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '1.7rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                    color: 'var(--p-text-1, #fff)',
                    marginBottom: '1rem', lineHeight: 1.2,
                }}>
                    How Was Your<br />Experience?
                </h2>

                <p style={{
                    color: 'var(--p-text-2, rgba(255,255,255,0.58))',
                    lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '2rem',
                }}>
                    Thank you for being part of Ride With The Warriors 2026. Whether you rode,
                    cheered, sponsored or organised — your honest feedback shapes a better ride in 2027.
                    It takes less than a minute.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                        onClick={handleGoToFeedback}
                        className="shimmer-btn shimmer-btn--primary"
                        style={{ width: '100%', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                    >
                        Share Feedback
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="shimmer-btn shimmer-btn--ghost"
                        style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--p-border-2)', cursor: 'pointer' }}
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPromptModal;
