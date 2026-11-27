import type { CSSProperties } from 'react';

interface Props {
    on: boolean;
    onToggle: () => void;
    email: string;
    onEmail: (email: string) => void;
    /** The ride people sign up to hear about; null until the event is known. */
    nextYear: number | null;
    labelStyle: CSSProperties;
    inputStyle: CSSProperties;
}

/** "Notify me for next year" switch with its email field, on the feedback form. */
const NotifyNextToggle = ({ on, onToggle, email, onEmail, nextYear, labelStyle, inputStyle }: Props) => {
    const forNext = nextYear ? ` for ${nextYear}` : '';
    return (
        <div style={{
            padding: '16px',
            border: '1px solid var(--p-input-bd, rgba(255,255,255,0.09))',
            background: on ? 'rgba(45,106,45,0.08)' : 'var(--p-input-bg, #0e0e0e)',
            transition: 'background 0.15s ease, border-color 0.15s ease',
        }}>
            <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                cursor: 'pointer',
                marginBottom: on ? '14px' : 0,
            }}>
                <span style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '0.85rem', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--p-text-1, #fff)',
                }}>
                    Notify Me{forNext}
                </span>
                <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    onClick={onToggle}
                    style={{
                        position: 'relative',
                        width: '44px',
                        height: '24px',
                        flexShrink: 0,
                        border: '1px solid',
                        borderColor: on
                            ? 'var(--color-primary-light, #4caf50)'
                            : 'var(--p-input-bd, rgba(255,255,255,0.09))',
                        background: on
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
                        left: on ? '22px' : '2px',
                        width: '18px',
                        height: '18px',
                        background: '#fff',
                        transition: 'left 0.15s ease',
                    }} />
                </button>
            </label>
            {on && (
                <div>
                    <label style={labelStyle}>Email Address <span style={{ color: 'var(--color-accent, #f59e0b)' }}>*</span></label>
                    <input
                        type="email"
                        placeholder="e.g. james@example.com"
                        value={email}
                        onChange={e => onEmail(e.target.value)}
                        required={on}
                        style={inputStyle}
                    />
                    <p style={{
                        margin: '8px 0 0',
                        fontSize: '0.78rem',
                        lineHeight: 1.5,
                        color: 'var(--p-text-2, rgba(255,255,255,0.58))',
                    }}>
                        We'll let you know when registration opens{nextYear ? ` for the ${nextYear} edition` : ''}.
                    </p>
                </div>
            )}
        </div>
    );
};

export default NotifyNextToggle;
