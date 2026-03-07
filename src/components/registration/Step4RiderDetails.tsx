import type { RiderDetails } from '../../types';
import ErrorBanner from '../common/ErrorBanner';
import { calculateAge } from '../../utils';
import RegistrationStepLayout from './ui/RegistrationStepLayout';

/* ── Inline icons ─────────────────────────────────────────────────────── */
const ArrowLeft = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
);
const ArrowRight = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
);
const FlaskIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6M9 3v7l-4 8h14l-4-8V3" />
    </svg>
);
const ChevronDown = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
const SpinnerIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'rd4spin 0.8s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

/* ── Section header ───────────────────────────────────────────────────── */
const SectionLabel = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        paddingBottom: 14, marginBottom: 20,
        borderBottom: '1px solid var(--rd4-divider)',
    }}>
        <div style={{
            width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--rd4-border-2)',
            color: 'var(--rd4-primary-lt)',
            clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)',
        }}>{icon}</div>
        <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--rd4-text-3)',
        }}>{label}</span>
    </div >
);

/* ── Field wrapper ────────────────────────────────────────────────────── */
const Field = ({ label, required, error, hint, children }: {
    label: string; required?: boolean; error?: string; hint?: React.ReactNode; children: React.ReactNode;
}) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 9, fontWeight: 700,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'var(--rd4-text-3)',
            }}>
                {label}{required && <span style={{ color: '#f87171', marginLeft: 3 }}>*</span>}
            </span>
            {hint}
        </div>
        {children}
        {error && (
            <span style={{
                fontSize: 11, fontWeight: 600, color: '#f87171',
                fontFamily: "'Barlow', sans-serif",
            }}>{error}</span>
        )}
    </div>
);

interface Step4RiderDetailsProps {
    data: RiderDetails;
    onChange: (data: RiderDetails) => void;
    onNext: () => void;
    onBack: () => void;
    errors: Record<string, string>;
    formErrors: string[];
    isSubmitting: boolean;
}

const Step4RiderDetails = ({ data, onChange, onNext, onBack, errors, formErrors, isSubmitting }: Step4RiderDetailsProps) => {
    const set = (field: keyof RiderDetails, value: string) => onChange({ ...data, [field]: value });

    const inputClass = (hasError: boolean) => `rd4-input${hasError ? ' rd4-input-error' : ''}`;

    return (
        <RegistrationStepLayout
            stepLabel="Step 3 of 4"
            title="Rider Details"
            subtitle="Provide your personal information to complete the registration."
            headerRight={
                <button
                    type="button"
                    className="rd4-test-btn"
                    onClick={() => onChange({
                        firstName: 'Jane', lastName: 'Doe',
                        email: `jane.doe.${Math.floor(Math.random() * 1000)}@example.com`,
                        phoneNumber: '0712345678', idNumber: '12345678',
                        dob: '1995-05-15', gender: 'female',
                        tshirtSize: 'M',
                        emergencyContactName: 'John Smith', emergencyPhone: '0787654321',
                    })}
                >
                    <FlaskIcon /> Fill Test Data
                </button>
            }
            footer={
                <>
                    <button type="button" className="rd4-back-btn" onClick={onBack} disabled={isSubmitting}>
                        <ArrowLeft /> Back
                    </button>

                    <button type="button" className="rd4-cta-btn" onClick={onNext} disabled={isSubmitting}>
                        <span className="rd4-cta-shimmer" />
                        {isSubmitting ? (
                            <><SpinnerIcon /><span>Saving…</span></>
                        ) : (
                            <><span>Continue</span><ArrowRight /></>
                        )}
                    </button>
                </>
            }
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700;800&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');

                :root, [data-theme="dark"] {
                    --rd4-bg:          #111111;
                    --rd4-page-bg:     #0a0a0a;
                    --rd4-border-1:    rgba(255,255,255,0.08);
                    --rd4-border-2:    rgba(255,255,255,0.14);
                    --rd4-divider:     rgba(255,255,255,0.07);
                    --rd4-text-1:      #ffffff;
                    --rd4-text-2:      rgba(255,255,255,0.60);
                    --rd4-text-3:      rgba(255,255,255,0.35);
                    --rd4-primary:     #2d6a2d;
                    --rd4-primary-lt:  #4caf50;
                    --rd4-accent:      #f59e0b;
                    --rd4-input-bg:    #0d0d0d;
                    --rd4-input-bd:    rgba(255,255,255,0.10);
                    --rd4-input-focus: #4caf50;
                    --rd4-input-err:   #f87171;
                    --rd4-placeholder: rgba(255,255,255,0.22);
                    --rd4-radio-bd:    rgba(255,255,255,0.20);
                    --rd4-radio-sel:   #4caf50;
                    --rd4-age-bg:      rgba(45,106,45,0.08);
                    --rd4-age-bd:      rgba(45,106,45,0.25);
                    --rd4-age-txt:     #4caf50;
                    --rd4-btn-shadow:  rgba(45,106,45,0.38);
                    --rd4-back-color:  rgba(255,255,255,0.50);
                    --rd4-back-bd:     rgba(255,255,255,0.10);
                    --rd4-back-hover:  #ffffff;
                    --rd4-section-bg:  #0d0d0d;
                    --rd4-test-bg:     rgba(45,106,45,0.07);
                    --rd4-test-bd:     rgba(45,106,45,0.22);
                    --rd4-test-txt:    #4caf50;
                }
                [data-theme="light"] {
                    --rd4-bg:          #ffffff;
                    --rd4-page-bg:     #ffffff;
                    --rd4-border-1:    rgba(0,0,0,0.09);
                    --rd4-border-2:    rgba(0,0,0,0.15);
                    --rd4-divider:     rgba(0,0,0,0.07);
                    --rd4-text-1:      #111111;
                    --rd4-text-2:      rgba(20,20,20,0.60);
                    --rd4-text-3:      rgba(20,20,20,0.42);
                    --rd4-primary:     #245924;
                    --rd4-primary-lt:  #2d6a2d;
                    --rd4-accent:      #d97706;
                    --rd4-input-bg:    #ffffff;
                    --rd4-input-bd:    rgba(0,0,0,0.12);
                    --rd4-input-focus: #2d6a2d;
                    --rd4-input-err:   #ef4444;
                    --rd4-placeholder: rgba(20,20,20,0.28);
                    --rd4-radio-bd:    rgba(0,0,0,0.22);
                    --rd4-radio-sel:   #245924;
                    --rd4-age-bg:      rgba(36,89,36,0.07);
                    --rd4-age-bd:      rgba(36,89,36,0.22);
                    --rd4-age-txt:     #245924;
                    --rd4-btn-shadow:  rgba(36,89,36,0.28);
                    --rd4-back-color:  rgba(20,20,20,0.50);
                    --rd4-back-bd:     rgba(0,0,0,0.12);
                    --rd4-back-hover:  #111111;
                    --rd4-section-bg:  #fafaf8;
                    --rd4-test-bg:     rgba(36,89,36,0.06);
                    --rd4-test-bd:     rgba(36,89,36,0.18);
                    --rd4-test-txt:    #245924;
                }

                @keyframes rd4spin { to { transform: rotate(360deg); } }

                /* ── Inputs ── */
                .rd4-input {
                    width: 100%;
                    background: var(--rd4-input-bg);
                    border: 1px solid var(--rd4-input-bd);
                    color: var(--rd4-text-1);
                    padding: 10px 14px;
                    font-family: 'Barlow', sans-serif;
                    font-size: 13.5px; font-weight: 500;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
                    appearance: none;
                    box-sizing: border-box;
                }
                .rd4-input::placeholder { color: var(--rd4-placeholder); }
                .rd4-input:focus {
                    border-color: var(--rd4-input-focus);
                    box-shadow: 0 0 0 3px rgba(76,175,80,0.12);
                }
                .rd4-input:disabled { opacity: 0.45; cursor: not-allowed; }
                .rd4-input-error { border-color: var(--rd4-input-err) !important; }
                .rd4-input-error:focus { box-shadow: 0 0 0 3px rgba(248,113,113,0.12) !important; }

                /* select arrow */
                .rd4-select-wrap { position: relative; }
                .rd4-select-wrap .rd4-chevron {
                    position: absolute; right: 12px; top: 50%;
                    transform: translateY(-50%); pointer-events: none;
                    color: var(--rd4-text-3);
                }

                /* ── Section card ── */
                .rd4-card {
                    background: var(--rd4-section-bg);
                    border: 1px solid var(--rd4-border-1);
                    padding: 28px 28px 24px;
                    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);
                    transition: background 0.3s;
                }

                /* ── Grid ── */
                .rd4-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px 24px;
                }
                @media (max-width: 640px) { .rd4-grid { grid-template-columns: 1fr; } }

                /* ── Radio buttons ── */
                .rd4-radio-group { display: flex; gap: 16px; align-items: center; height: 42px; }
                .rd4-radio-label {
                    display: flex; align-items: center; gap: 8px;
                    cursor: pointer;
                    font-family: 'Barlow', sans-serif;
                    font-size: 13.5px; font-weight: 600;
                    color: var(--rd4-text-2);
                    transition: color 0.2s;
                    user-select: none;
                }
                .rd4-radio-label.rd4-radio-checked { color: var(--rd4-primary-lt); }
                .rd4-radio-outer {
                    width: 18px; height: 18px; flex-shrink: 0;
                    border: 2px solid var(--rd4-radio-bd);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    transition: border-color 0.2s;
                }
                .rd4-radio-label.rd4-radio-checked .rd4-radio-outer { border-color: var(--rd4-radio-sel); }
                .rd4-radio-inner {
                    width: 8px; height: 8px; border-radius: 50%;
                    background: var(--rd4-radio-sel);
                    transform: scale(0); transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
                }
                .rd4-radio-label.rd4-radio-checked .rd4-radio-inner { transform: scale(1); }

                /* ── Test data pill ── */
                .rd4-test-btn {
                    display: inline-flex; align-items: center; gap: 7px;
                    padding: 8px 16px;
                    background: var(--rd4-test-bg);
                    border: 1px solid var(--rd4-test-bd);
                    color: var(--rd4-test-txt);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 10px; font-weight: 700;
                    letter-spacing: 0.2em; text-transform: uppercase;
                    cursor: pointer;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
                    transition: background 0.2s, border-color 0.2s;
                    flex-shrink: 0;
                }
                .rd4-test-btn:hover { background: rgba(45,106,45,0.14); border-color: rgba(45,106,45,0.38); }

                /* ── Age badge ── */
                .rd4-age-badge {
                    display: inline-flex; align-items: center;
                    padding: 2px 10px;
                    background: var(--rd4-age-bg);
                    border: 1px solid var(--rd4-age-bd);
                    color: var(--rd4-age-txt);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 9px; font-weight: 700;
                    letter-spacing: 0.2em; text-transform: uppercase;
                    clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%);
                }

                /* ── Footer buttons ── */
                .rd4-back-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 12px 22px;
                    background: transparent;
                    color: var(--rd4-back-color);
                    border: 1px solid var(--rd4-back-bd);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.85rem; font-weight: 700;
                    letter-spacing: 0.14em; text-transform: uppercase;
                    cursor: pointer;
                    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
                    transition: color 0.2s, border-color 0.2s;
                }
                .rd4-back-btn:hover:not(:disabled) { color: var(--rd4-back-hover); border-color: var(--rd4-border-2); }
                .rd4-back-btn:disabled { opacity: 0.38; cursor: not-allowed; }

                .rd4-cta-btn {
                    position: relative;
                    display: inline-flex; align-items: center; gap: 10px;
                    padding: 13px 36px;
                    background: var(--rd4-primary); color: #ffffff;
                    border: 2px solid var(--rd4-primary);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.9rem; font-weight: 800;
                    letter-spacing: 0.14em; text-transform: uppercase;
                    cursor: pointer; overflow: hidden;
                    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
                    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s;
                    min-width: 180px; justify-content: center;
                }
                .rd4-cta-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px var(--rd4-btn-shadow);
                    background: var(--rd4-primary-lt); border-color: var(--rd4-primary-lt);
                }
                .rd4-cta-btn:active:not(:disabled) { transform: translateY(0); }
                .rd4-cta-btn:disabled { opacity: 0.45; cursor: not-allowed; }
                .rd4-cta-shimmer {
                    position: absolute; top: 0; left: -80%;
                    width: 60%; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.35) 50%, transparent 80%);
                    transform: skewX(-20deg); pointer-events: none;
                }
                .rd4-cta-btn:hover:not(:disabled) .rd4-cta-shimmer {
                    left: 140%;
                    transition: left 0.55s cubic-bezier(0.25,0.46,0.45,0.94);
                }
            `}</style>

            <ErrorBanner errors={formErrors} />

            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* ── Personal Information ── */}
                <div className="rd4-card">
                    <SectionLabel
                        label="Personal Information"
                        icon={
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                        }
                    />
                    <div className="rd4-grid">
                        <Field label="First Name" required error={errors.firstName}>
                            <input className={inputClass(!!errors.firstName)} placeholder="Jane" type="text"
                                value={data.firstName} onChange={e => set('firstName', e.target.value)} disabled={isSubmitting} />
                        </Field>
                        <Field label="Last Name" required error={errors.lastName}>
                            <input className={inputClass(!!errors.lastName)} placeholder="Doe" type="text"
                                value={data.lastName} onChange={e => set('lastName', e.target.value)} disabled={isSubmitting} />
                        </Field>
                        <Field label="Email Address" required error={errors.email}>
                            <input className={inputClass(!!errors.email)} placeholder="jane.doe@example.com" type="email"
                                value={data.email} onChange={e => set('email', e.target.value)} disabled={isSubmitting} />
                        </Field>
                        <Field label="Phone Number" required error={errors.phoneNumber}>
                            <input className={inputClass(!!errors.phoneNumber)} placeholder="0712 345 678" type="tel"
                                value={data.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} disabled={isSubmitting} />
                        </Field>
                        <Field label="National ID / Passport" required error={errors.idNumber}>
                            <input className={inputClass(!!errors.idNumber)} placeholder="12345678" type="text"
                                value={data.idNumber} onChange={e => set('idNumber', e.target.value)} disabled={isSubmitting} />
                        </Field>
                        <Field
                            label="Date of Birth" required error={errors.dob}
                            hint={data.dob ? (
                                <span className="rd4-age-badge">{calculateAge(data.dob)} yrs old</span>
                            ) : undefined}
                        >
                            <input className={inputClass(!!errors.dob)} type="date"
                                value={data.dob} onChange={e => set('dob', e.target.value)} disabled={isSubmitting} />
                        </Field>
                    </div>
                </div>

                {/* ── Preferences ── */}
                <div className="rd4-card">
                    <SectionLabel
                        label="Preferences & Safety"
                        icon={
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        }
                    />
                    <div className="rd4-grid">
                        <Field label="Gender" required error={errors.gender}>
                            <div className="rd4-radio-group">
                                {(['male', 'female'] as const).map(g => (
                                    <label
                                        key={g}
                                        className={`rd4-radio-label${data.gender === g ? ' rd4-radio-checked' : ''}`}
                                        onClick={() => !isSubmitting && set('gender', g)}
                                    >
                                        <div className="rd4-radio-outer">
                                            <div className="rd4-radio-inner" />
                                        </div>
                                        {g.charAt(0).toUpperCase() + g.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </Field>
                        <Field label="T-Shirt Size" required error={errors.tshirtSize}>
                            <div className="rd4-select-wrap">
                                <select
                                    className={inputClass(!!errors.tshirtSize)}
                                    value={data.tshirtSize}
                                    onChange={e => set('tshirtSize', e.target.value)}
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select size</option>
                                    {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                                        <option key={s} value={s}>{s === 'S' ? 'Small (S)' : s === 'M' ? 'Medium (M)' : s === 'L' ? 'Large (L)' : s === 'XL' ? 'Extra Large (XL)' : 'Double XL (XXL)'}</option>
                                    ))}
                                </select>
                                <span className="rd4-chevron"><ChevronDown /></span>
                            </div>
                        </Field>
                        <Field label="Emergency Contact Name" required error={errors.emergencyContactName}>
                            <input className={inputClass(!!errors.emergencyContactName)} placeholder="Full name" type="text"
                                value={data.emergencyContactName} onChange={e => set('emergencyContactName', e.target.value)} disabled={isSubmitting} />
                        </Field>
                        <Field label="Emergency Contact Phone" required error={errors.emergencyPhone}>
                            <input className={inputClass(!!errors.emergencyPhone)} placeholder="07XX XXX XXX" type="tel"
                                value={data.emergencyPhone} onChange={e => set('emergencyPhone', e.target.value)} disabled={isSubmitting} />
                        </Field>
                    </div>
                </div>
            </form>
        </RegistrationStepLayout>
    );
};

export default Step4RiderDetails;
