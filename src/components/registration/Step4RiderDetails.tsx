import '../../styles/registration/Step4RiderDetails.css';
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
