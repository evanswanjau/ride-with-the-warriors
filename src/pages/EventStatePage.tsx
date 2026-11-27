import { Link } from 'react-router-dom';
import type { LifecycleState, PublicEvent } from '../publicApi';
import { stateCopy, type GatedFlow } from './eventStateCopy';

const text2: React.CSSProperties = {
    color: 'var(--p-text-2, rgba(255,255,255,0.58))',
    fontSize: '1rem', lineHeight: 1.75,
    marginBottom: '0.75rem', maxWidth: '440px',
};

/** The register or raffle page while it is not open: upcoming, closed or finished. */
const EventStatePage = ({ what, state, event }: { what: GatedFlow; state: Exclude<LifecycleState, 'open'>; event: PublicEvent | null }) => {
    const copy = stateCopy(what, state, event);
    return (
        <div data-testid={`${what}-${state}`} style={{
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                    <div style={{ height: '1px', width: '32px', background: 'var(--color-accent, #f59e0b)', flexShrink: 0 }} />
                    <span style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '0.6rem', fontWeight: 700,
                        letterSpacing: '0.28em', textTransform: 'uppercase',
                        color: 'var(--color-accent, #f59e0b)',
                    }}>
                        {copy.eyebrow}
                    </span>
                    <div style={{ height: '1px', width: '32px', background: 'var(--color-accent, #f59e0b)', flexShrink: 0 }} />
                </div>

                <h1 style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                    fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.04em', lineHeight: 1.15,
                    marginBottom: '1.25rem',
                    color: 'var(--p-text-1, #fff)',
                }}>
                    {copy.heading[0]}<br />{copy.heading[1]}
                </h1>

                <div style={{ width: '40px', height: '2px', background: 'var(--color-primary-light, #4caf50)', marginBottom: '1.5rem' }} />

                {copy.lines.map((line, i) => (
                    <p key={line} style={i === copy.lines.length - 1 ? { ...text2, marginBottom: '2.5rem' } : text2}>{line}</p>
                ))}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '3rem' }}>
                    {copy.actions.map((a, i) => (
                        <Link key={a.to} to={a.to} className={`shimmer-btn ${i === 0 ? 'shimmer-btn--primary' : 'shimmer-btn--ghost'}`}>
                            {a.label}
                        </Link>
                    ))}
                </div>

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

export default EventStatePage;
