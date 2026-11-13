import { Link } from 'react-router-dom';
import { EDITION } from '../config/edition';

const RegistrationClosedPage = () => {
    return (
        <div style={{
            fontFamily: "'Barlow', sans-serif",
            background: 'var(--p-bg, #0a0a0a)',
            color: 'var(--p-text-1, #fff)',
            minHeight: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '48px 24px 80px',
        }}>
            <div style={{
                maxWidth: '560px', width: '100%',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center',
            }}>

                {/* Eyebrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                    <div style={{ height: '1px', width: '32px', background: 'var(--color-accent, #f59e0b)', flexShrink: 0 }} />
                    <span style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '0.6rem', fontWeight: 700,
                        letterSpacing: '0.28em', textTransform: 'uppercase',
                        color: 'var(--color-accent, #f59e0b)',
                    }}>
                        Registration Closed
                    </span>
                    <div style={{ height: '1px', width: '32px', background: 'var(--color-accent, #f59e0b)', flexShrink: 0 }} />
                </div>

                {/* Heading */}
                <h1 style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                    fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.04em', lineHeight: 1.15,
                    marginBottom: '1.25rem',
                    color: 'var(--p-text-1, #fff)',
                }}>
                    Cyclist Registration<br />Is Now Closed
                </h1>

                {/* Divider */}
                <div style={{ width: '40px', height: '2px', background: 'var(--color-primary-light, #4caf50)', marginBottom: '1.5rem' }} />

                {/* Body */}
                <p style={{
                    color: 'var(--p-text-2, rgba(255,255,255,0.58))',
                    fontSize: '1rem', lineHeight: 1.75,
                    marginBottom: '0.75rem', maxWidth: '440px',
                }}>
                    Registration opens {EDITION.registrationOpensLabel}.
                </p>
                <p style={{
                    color: 'var(--p-text-2, rgba(255,255,255,0.58))',
                    fontSize: '1rem', lineHeight: 1.75,
                    marginBottom: '2.5rem', maxWidth: '440px',
                }}>
                    Pre-register now and we'll tell you first when {EDITION.shortName} registration opens.
                </p>

                {/* CTAs */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '3rem' }}>
                    <Link to="/register/notify" className="shimmer-btn shimmer-btn--primary">
                        Pre-register
                    </Link>
                    <Link to="/2026" className="shimmer-btn shimmer-btn--ghost">
                        See 2026 highlights
                    </Link>
                </div>

                {/* Footer note */}
                <p style={{
                    color: 'var(--p-text-3, rgba(255,255,255,0.33))',
                    fontSize: '0.8rem', letterSpacing: '0.04em',
                }}>
                    Questions?{' '}
                    <a
                        href="mailto:ridesupport@airbornefraternity.org"
                        style={{ color: 'var(--color-primary-light, #4caf50)', textDecoration: 'none' }}
                    >
                        Contact us
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegistrationClosedPage;
