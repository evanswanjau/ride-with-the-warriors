import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
    onClose: () => void;
}

const RegistrationClosedModal = ({ onClose }: Props) => {
    const navigate = useNavigate();

    const handleDismiss = () => {
        onClose();
        navigate('/register/closed');
    };

    const handleBuyTicket = () => {
        onClose();
        navigate('/raffle/step/1');
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
                    animation: 'rcmFadeUp 0.22s cubic-bezier(0.34,1.2,0.64,1) forwards',
                }}
                onClick={e => e.stopPropagation()}
            >
                <style>{`
                    @keyframes rcmFadeUp {
                        from { opacity: 0; transform: translateY(18px) scale(0.97); }
                        to   { opacity: 1; transform: translateY(0) scale(1); }
                    }
                `}</style>

                {/* Close button */}
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

                {/* Eyebrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                    <div style={{ height: '1px', width: '24px', background: 'var(--color-accent, #f59e0b)', flexShrink: 0 }} />
                    <span style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '0.6rem', fontWeight: 700,
                        letterSpacing: '0.28em', textTransform: 'uppercase',
                        color: 'var(--color-accent, #f59e0b)',
                    }}>
                        Registration Closed
                    </span>
                    <div style={{ height: '1px', width: '24px', background: 'var(--color-accent, #f59e0b)', flexShrink: 0 }} />
                </div>

                {/* Heading */}
                <h2 style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '1.7rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                    color: 'var(--p-text-1, #fff)',
                    marginBottom: '1rem', lineHeight: 1.2,
                }}>
                    Cyclist Registration<br />Is Now Closed
                </h2>

                {/* Body */}
                <p style={{
                    color: 'var(--p-text-2, rgba(255,255,255,0.58))',
                    lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '0.6rem',
                }}>
                    Cyclist registration for Ride With The Warriors 2026 has closed.
                </p>
                <p style={{
                    color: 'var(--p-text-2, rgba(255,255,255,0.58))',
                    lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '2rem',
                }}>
                    You can still be part of the excitement — purchase a raffle ticket and participate for fun!
                </p>

                {/* CTAs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                        onClick={handleBuyTicket}
                        className="shimmer-btn shimmer-btn--amber"
                        style={{ width: '100%', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                    >
                        Purchase a Raffle Ticket
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="shimmer-btn shimmer-btn--ghost"
                        style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--p-border-2)', cursor: 'pointer' }}
                    >
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationClosedModal;
