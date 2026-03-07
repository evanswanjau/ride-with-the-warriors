import type { TeamDetails, TeamMember } from '../../types';
import ErrorBanner from '../common/ErrorBanner';
import { calculateAge } from '../../utils';
import RegistrationStepLayout from './ui/RegistrationStepLayout';

/* ── Icons ────────────────────────────────────────────────────────────── */
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'td4spin 0.8s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);
const StarIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);
const UserIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);
const TrashIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
);
const PlusIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const TeamIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

/* ── Reusable field ───────────────────────────────────────────────────── */
const Field = ({ label, required, error, hint, children }: {
    label: string; required?: boolean; error?: string; hint?: React.ReactNode; children: React.ReactNode;
}) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'var(--td4-text-3)',
            }}>
                {label}{required && <span style={{ color: '#f87171', marginLeft: 3 }}>*</span>}
            </span>
            {hint}
        </div>
        {children}
        {error && <span style={{ fontSize: 11, fontWeight: 600, color: '#f87171', fontFamily: "'Barlow', sans-serif" }}>{error}</span>}
    </div>
);

/* ── Member card ──────────────────────────────────────────────────────── */
const MemberCard = ({ member, index, errors, isSubmitting, onUpdate, onRemove }: {
    member: TeamMember;
    index: number;
    errors: Record<string, string>;
    isSubmitting: boolean;
    onUpdate: (id: string, field: keyof TeamMember, value: string) => void;
    onRemove: (id: string) => void;
}) => {
    const e = (f: string) => errors[`${member.id}.${f}`];
    const inp = (hasErr: boolean) => `td4-input${hasErr ? ' td4-input-error' : ''}`;
    const set = (f: keyof TeamMember, v: string) => onUpdate(member.id, f, v);

    return (
        <div className={`td4-member-card${member.isCaptain ? ' td4-member-captain' : ''}`}>
            {/* Shimmer */}
            <div className="td4-card-shimmer" />

            {/* Header */}
            <div className="td4-member-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className={`td4-member-avatar${member.isCaptain ? ' td4-avatar-captain' : ''}`}>
                        {member.isCaptain ? <StarIcon /> : <UserIcon />}
                    </div>
                    <div>
                        <div style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: '1.1rem', letterSpacing: '0.06em',
                            color: member.isCaptain ? 'var(--td4-accent)' : 'var(--td4-text-1)',
                            lineHeight: 1,
                        }}>
                            {member.isCaptain ? 'Team Captain' : `Member #${index + 1}`}
                        </div>
                        <div style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                            color: member.isCaptain ? 'var(--td4-accent)' : 'var(--td4-text-3)',
                            marginTop: 2,
                        }}>
                            {member.isCaptain ? 'Primary Contact' : 'Rider'}
                        </div>
                    </div>
                </div>
                {!member.isCaptain && (
                    <button
                        type="button"
                        className="td4-remove-btn"
                        onClick={() => onRemove(member.id)}
                        title="Remove member"
                    >
                        <TrashIcon /> Remove
                    </button>
                )}
            </div>

            {/* Fields */}
            <div className="td4-member-body td4-grid">
                <Field label="First Name" required error={e('firstName')}>
                    <input className={inp(!!e('firstName'))} placeholder="Jane" type="text"
                        value={member.firstName} onChange={ev => set('firstName', ev.target.value)} disabled={isSubmitting} />
                </Field>
                <Field label="Last Name" required error={e('lastName')}>
                    <input className={inp(!!e('lastName'))} placeholder="Doe" type="text"
                        value={member.lastName} onChange={ev => set('lastName', ev.target.value)} disabled={isSubmitting} />
                </Field>
                <Field label="Email Address" required error={e('email')}>
                    <input className={inp(!!e('email'))} placeholder="jane.doe@example.com" type="email"
                        value={member.email} onChange={ev => set('email', ev.target.value)} disabled={isSubmitting} />
                </Field>
                <Field label="Phone Number" required error={e('phoneNumber')}>
                    <input className={inp(!!e('phoneNumber'))} placeholder="0712 345 678" type="tel"
                        value={member.phoneNumber} onChange={ev => set('phoneNumber', ev.target.value)} disabled={isSubmitting} />
                </Field>
                <Field label="National ID / Passport" required error={e('idNumber')}>
                    <input className={inp(!!e('idNumber'))} placeholder="12345678" type="text"
                        value={member.idNumber} onChange={ev => set('idNumber', ev.target.value)} disabled={isSubmitting} />
                </Field>
                <Field
                    label="Date of Birth" required error={e('dob')}
                    hint={member.dob ? (
                        <span style={{
                            display: 'inline-flex', alignItems: 'center',
                            padding: '2px 10px',
                            background: 'var(--td4-age-bg)', border: '1px solid var(--td4-age-bd)',
                            color: 'var(--td4-age-txt)',
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                            clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)',
                        }}>{calculateAge(member.dob)} yrs</span>
                    ) : undefined}
                >
                    <input className={inp(!!e('dob'))} type="date"
                        value={member.dob} onChange={ev => set('dob', ev.target.value)} disabled={isSubmitting} />
                </Field>
                <Field label="Gender" required error={e('gender')}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', height: 42 }}>
                        {(['male', 'female'] as const).map(g => (
                            <label
                                key={g}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    fontFamily: "'Barlow', sans-serif",
                                    fontSize: 13.5, fontWeight: 600,
                                    color: member.gender === g ? 'var(--td4-primary-lt)' : 'var(--td4-text-2)',
                                    transition: 'color 0.2s', userSelect: 'none',
                                }}
                                onClick={() => !isSubmitting && set('gender', g)}
                            >
                                <div style={{
                                    width: 18, height: 18, flexShrink: 0,
                                    border: `2px solid ${member.gender === g ? 'var(--td4-primary-lt)' : 'var(--td4-radio-bd)'}`,
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'border-color 0.2s',
                                }}>
                                    <div style={{
                                        width: 8, height: 8, borderRadius: '50%',
                                        background: 'var(--td4-primary-lt)',
                                        transform: member.gender === g ? 'scale(1)' : 'scale(0)',
                                        transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                                    }} />
                                </div>
                                {g.charAt(0).toUpperCase() + g.slice(1)}
                            </label>
                        ))}
                    </div>
                </Field>
                <Field label="T-Shirt Size" required error={e('tshirtSize')}>
                    <div style={{ position: 'relative' }}>
                        <select className={inp(!!e('tshirtSize'))}
                            value={member.tshirtSize} onChange={ev => set('tshirtSize', ev.target.value)} disabled={isSubmitting}>
                            <option value="">Select size</option>
                            {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                                <option key={s} value={s}>{s === 'S' ? 'Small (S)' : s === 'M' ? 'Medium (M)' : s === 'L' ? 'Large (L)' : s === 'XL' ? 'Extra Large (XL)' : 'Double XL (XXL)'}</option>
                            ))}
                        </select>
                        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--td4-text-3)' }}><ChevronDown /></span>
                    </div>
                </Field>
                <Field label="Emergency Contact Name" required error={e('emergencyContactName')}>
                    <input className={inp(!!e('emergencyContactName'))} placeholder="Full name" type="text"
                        value={member.emergencyContactName} onChange={ev => set('emergencyContactName', ev.target.value)} disabled={isSubmitting} />
                </Field>
                <Field label="Emergency Contact Phone" required error={e('emergencyPhone')}>
                    <input className={inp(!!e('emergencyPhone'))} placeholder="07XX XXX XXX" type="tel"
                        value={member.emergencyPhone} onChange={ev => set('emergencyPhone', ev.target.value)} disabled={isSubmitting} />
                </Field>
            </div>
        </div>
    );
};

/* ── Main component ───────────────────────────────────────────────────── */
interface Step4TeamDetailsProps {
    data: TeamDetails;
    onChange: (data: TeamDetails) => void;
    onNext: () => void;
    onBack: () => void;
    errors: Record<string, string>;
    formErrors: string[];
    isSubmitting: boolean;
}

const Step4TeamDetails = ({ data, onChange, onNext, onBack, errors, formErrors, isSubmitting }: Step4TeamDetailsProps) => {
    const updateMember = (id: string, field: keyof TeamMember, value: string) =>
        onChange({ ...data, members: data.members.map(m => m.id === id ? { ...m, [field]: value } : m) });

    const addMember = () => {
        if (data.members.length >= 5) return;
        onChange({
            ...data, members: [...data.members, {
                id: Math.random().toString(36).substr(2, 9),
                firstName: '', lastName: '', email: '', phoneNumber: '',
                idNumber: '', dob: '', gender: '', tshirtSize: '',
                emergencyContactName: '', emergencyPhone: '', isCaptain: false,
            }],
        });
    };

    const removeMember = (id: string) => {
        if (data.members.length <= 1) return;
        onChange({ ...data, members: data.members.filter(m => m.id !== id) });
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700;800&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');

                :root, [data-theme="dark"] {
                    --td4-bg:          #0a0a0a;
                    --td4-section-bg:  #0a0a0a;
                    --td4-card-bg:     #111111;
                    --td4-border-1:    rgba(255,255,255,0.08);
                    --td4-border-2:    rgba(255,255,255,0.14);
                    --td4-divider:     rgba(255,255,255,0.07);
                    --td4-text-1:      #ffffff;
                    --td4-text-2:      rgba(255,255,255,0.60);
                    --td4-text-3:      rgba(255,255,255,0.35);
                    --td4-primary:     #2d6a2d;
                    --td4-primary-lt:  #4caf50;
                    --td4-accent:      #f59e0b;
                    --td4-input-bg:    #0d0d0d;
                    --td4-input-bd:    rgba(255,255,255,0.10);
                    --td4-input-focus: #4caf50;
                    --td4-input-err:   #f87171;
                    --td4-placeholder: rgba(255,255,255,0.22);
                    --td4-radio-bd:    rgba(255,255,255,0.20);
                    --td4-age-bg:      rgba(45,106,45,0.08);
                    --td4-age-bd:      rgba(45,106,45,0.25);
                    --td4-age-txt:     #4caf50;
                    --td4-captain-bg:  rgba(245,158,11,0.06);
                    --td4-captain-bd:  rgba(245,158,11,0.22);
                    --td4-remove-bg:   rgba(248,113,113,0.07);
                    --td4-remove-bd:   rgba(248,113,113,0.22);
                    --td4-remove-txt:  #f87171;
                    --td4-add-bg:      rgba(255,255,255,0.02);
                    --td4-add-bd:      rgba(255,255,255,0.08);
                    --td4-add-txt:     rgba(255,255,255,0.35);
                    --td4-add-hover-bd: rgba(45,106,45,0.45);
                    --td4-add-hover-txt: #4caf50;
                    --td4-btn-shadow:  rgba(45,106,45,0.38);
                    --td4-back-color:  rgba(255,255,255,0.50);
                    --td4-back-bd:     rgba(255,255,255,0.10);
                    --td4-back-hover:  #ffffff;
                    --td4-test-bg:     rgba(45,106,45,0.07);
                    --td4-test-bd:     rgba(45,106,45,0.22);
                    --td4-test-txt:    #4caf50;
                    --td4-roster-bg:   rgba(255,255,255,0.03);
                    --td4-roster-bd:   rgba(255,255,255,0.07);
                }
                [data-theme="light"] {
                    --td4-bg:          #ffffff;
                    --td4-section-bg:  #ffffff;
                    --td4-card-bg:     #fafaf8;
                    --td4-border-1:    rgba(0,0,0,0.09);
                    --td4-border-2:    rgba(0,0,0,0.15);
                    --td4-divider:     rgba(0,0,0,0.07);
                    --td4-text-1:      #111111;
                    --td4-text-2:      rgba(20,20,20,0.60);
                    --td4-text-3:      rgba(20,20,20,0.42);
                    --td4-primary:     #245924;
                    --td4-primary-lt:  #2d6a2d;
                    --td4-accent:      #d97706;
                    --td4-input-bg:    #ffffff;
                    --td4-input-bd:    rgba(0,0,0,0.12);
                    --td4-input-focus: #2d6a2d;
                    --td4-input-err:   #ef4444;
                    --td4-placeholder: rgba(20,20,20,0.28);
                    --td4-radio-bd:    rgba(0,0,0,0.22);
                    --td4-age-bg:      rgba(36,89,36,0.07);
                    --td4-age-bd:      rgba(36,89,36,0.22);
                    --td4-age-txt:     #245924;
                    --td4-captain-bg:  rgba(217,119,6,0.05);
                    --td4-captain-bd:  rgba(217,119,6,0.18);
                    --td4-remove-bg:   rgba(239,68,68,0.05);
                    --td4-remove-bd:   rgba(239,68,68,0.18);
                    --td4-remove-txt:  #dc2626;
                    --td4-add-bg:      rgba(0,0,0,0.02);
                    --td4-add-bd:      rgba(0,0,0,0.08);
                    --td4-add-txt:     rgba(20,20,20,0.38);
                    --td4-add-hover-bd: rgba(36,89,36,0.40);
                    --td4-add-hover-txt: #245924;
                    --td4-btn-shadow:  rgba(36,89,36,0.28);
                    --td4-back-color:  rgba(20,20,20,0.50);
                    --td4-back-bd:     rgba(0,0,0,0.12);
                    --td4-back-hover:  #111111;
                    --td4-test-bg:     rgba(36,89,36,0.06);
                    --td4-test-bd:     rgba(36,89,36,0.18);
                    --td4-test-txt:    #245924;
                    --td4-roster-bg:   rgba(0,0,0,0.02);
                    --td4-roster-bd:   rgba(0,0,0,0.06);
                }

                @keyframes td4spin { to { transform: rotate(360deg); } }

                /* ── Inputs ── */
                .td4-input {
                    width: 100%; background: var(--td4-input-bg);
                    border: 1px solid var(--td4-input-bd);
                    color: var(--td4-text-1);
                    padding: 10px 14px;
                    font-family: 'Barlow', sans-serif; font-size: 13.5px; font-weight: 500;
                    outline: none; appearance: none; box-sizing: border-box;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .td4-input::placeholder { color: var(--td4-placeholder); }
                .td4-input:focus { border-color: var(--td4-input-focus); box-shadow: 0 0 0 3px rgba(76,175,80,0.12); }
                .td4-input:disabled { opacity: 0.45; cursor: not-allowed; }
                .td4-input-error { border-color: var(--td4-input-err) !important; }
                .td4-input-error:focus { box-shadow: 0 0 0 3px rgba(248,113,113,0.12) !important; }

                /* ── Grid ── */
                .td4-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 20px 24px;
                }
                @media (max-width: 640px) { .td4-grid { grid-template-columns: 1fr; } }

                /* ── Team name card ── */
                .td4-name-card {
                    background: var(--td4-section-bg);
                    border: 1px solid var(--td4-border-1);
                    padding: 24px 28px;
                    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);
                }

                /* ── Roster section header ── */
                .td4-roster-header {
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 12px;
                    padding: 16px 20px;
                    background: var(--td4-roster-bg);
                    border: 1px solid var(--td4-roster-bd);
                    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%);
                }

                /* ── Member card ── */
                .td4-member-card {
                    position: relative;
                    background: var(--td4-card-bg);
                    border: 1px solid var(--td4-border-1);
                    overflow: hidden;
                    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);
                    transition: border-color 0.25s;
                }
                .td4-member-card:hover { border-color: rgba(45,106,45,0.30); }
                .td4-member-captain { border-color: var(--td4-captain-bd) !important; background: var(--td4-captain-bg); }

                /* Shimmer on hover */
                .td4-card-shimmer {
                    position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.04) 50%, transparent 80%);
                    transform: skewX(-20deg); pointer-events: none; z-index: 1;
                    transition: left 0s;
                }
                .td4-member-card:hover .td4-card-shimmer {
                    left: 150%; transition: left 0.65s cubic-bezier(0.25,0.46,0.45,0.94);
                }

                /* Member header bar */
                .td4-member-header {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 16px 22px;
                    border-bottom: 1px solid var(--td4-divider);
                    position: relative; z-index: 2;
                }
                .td4-member-avatar {
                    width: 34px; height: 34px; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    background: var(--td4-roster-bg);
                    border: 1px solid var(--td4-border-2);
                    color: var(--td4-text-3);
                    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
                }
                .td4-avatar-captain {
                    background: rgba(245,158,11,0.10);
                    border-color: rgba(245,158,11,0.28);
                    color: var(--td4-accent);
                }

                .td4-member-body { padding: 20px 22px 22px; position: relative; z-index: 2; }

                /* Remove button */
                .td4-remove-btn {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 6px 12px;
                    background: var(--td4-remove-bg);
                    border: 1px solid var(--td4-remove-bd);
                    color: var(--td4-remove-txt);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
                    cursor: pointer;
                    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
                    transition: background 0.2s, border-color 0.2s;
                }
                .td4-remove-btn:hover { background: rgba(248,113,113,0.14); border-color: rgba(248,113,113,0.45); }

                /* Add member button */
                .td4-add-btn {
                    width: 100%;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    padding: 20px;
                    background: var(--td4-add-bg);
                    border: 1px dashed var(--td4-add-bd);
                    color: var(--td4-add-txt);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase;
                    cursor: pointer;
                    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%);
                    transition: color 0.2s, border-color 0.2s, background 0.2s;
                }
                .td4-add-btn:hover { color: var(--td4-add-hover-txt); border-color: var(--td4-add-hover-bd); background: rgba(45,106,45,0.08); }

                /* Footer */
                .td4-footer {
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 12px;
                    margin-top: 28px; padding-top: 20px;
                    border-top: 1px solid var(--td4-divider);
                }
                .td4-back-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 12px 22px;
                    background: transparent; color: var(--td4-back-color);
                    border: 1px solid var(--td4-back-bd);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.85rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
                    cursor: pointer;
                    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
                    transition: color 0.2s, border-color 0.2s;
                }
                .td4-back-btn:hover:not(:disabled) { color: var(--td4-back-hover); border-color: var(--td4-border-2); }
                .td4-back-btn:disabled { opacity: 0.38; cursor: not-allowed; }
                .td4-cta-btn {
                    position: relative;
                    display: inline-flex; align-items: center; gap: 10px;
                    padding: 13px 36px;
                    background: var(--td4-primary); color: #ffffff;
                    border: 2px solid var(--td4-primary);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.9rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
                    cursor: pointer; overflow: hidden; min-width: 180px; justify-content: center;
                    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
                    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s;
                }
                .td4-cta-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px var(--td4-btn-shadow);
                    background: var(--td4-primary-lt); border-color: var(--td4-primary-lt);
                }
                .td4-cta-btn:active:not(:disabled) { transform: translateY(0); }
                .td4-cta-btn:disabled { opacity: 0.45; cursor: not-allowed; }
                .td4-cta-shimmer {
                    position: absolute; top: 0; left: -80%; width: 60%; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.35) 50%, transparent 80%);
                    transform: skewX(-20deg); pointer-events: none;
                }
                .td4-cta-btn:hover:not(:disabled) .td4-cta-shimmer {
                    left: 140%; transition: left 0.55s cubic-bezier(0.25,0.46,0.45,0.94);
                }

                /* Test data pill */
                .td4-test-btn {
                    display: inline-flex; align-items: center; gap: 7px;
                    padding: 8px 16px;
                    background: var(--td4-test-bg); border: 1px solid var(--td4-test-bd);
                    color: var(--td4-test-txt);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
                    cursor: pointer;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
                    transition: background 0.2s, border-color 0.2s;
                }
                .td4-test-btn:hover { background: rgba(45,106,45,0.14); border-color: rgba(45,106,45,0.38); }

                /* Roster count badge */
                .td4-count-badge {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 4px 14px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
                    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
                }
            `}</style>

            <RegistrationStepLayout
                stepLabel="Step 3 of 4"
                title="Build Your Squad"
                subtitle="Enter your team name and add your fellow warriors. Minimum 2 members required."
                headerRight={
                    <button type="button" className="td4-test-btn" onClick={() => {
                        const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
                        const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson'];
                        const genders: Array<'male' | 'female'> = ['female', 'male', 'male', 'female', 'female'];
                        onChange({
                            teamName: 'Warriors United',
                            members: firstNames.map((fn, i) => ({
                                id: Math.random().toString(36).substr(2, 9),
                                firstName: fn, lastName: lastNames[i],
                                email: `${fn.toLowerCase()}.${lastNames[i].toLowerCase()}.${Math.floor(Math.random() * 1000)}@example.com`,
                                phoneNumber: `07${Math.floor(10000000 + Math.random() * 90000000)}`,
                                idNumber: `${Math.floor(10000000 + Math.random() * 90000000)}`,
                                dob: `${1985 + i}-01-01`, gender: genders[i],
                                tshirtSize: ['S', 'M', 'L', 'XL', 'M'][i],
                                emergencyContactName: 'Emergency Contact', emergencyPhone: '0711223344',
                                isCaptain: i === 0,
                            })),
                        });
                    }}>
                        <FlaskIcon /> Fill Test Data
                    </button>
                }
                footer={
                    <>
                        <button type="button" className="td4-back-btn" onClick={onBack} disabled={isSubmitting}>
                            <ArrowLeft /> Back
                        </button>
                        <button type="button" className="td4-cta-btn" onClick={onNext} disabled={isSubmitting}>
                            <span className="td4-cta-shimmer" />
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

                /* CSS Variables chunks would be here if I didn't replace them above */

                @keyframes td4spin { to { transform: rotate(360deg); } }

                /* ── Inputs ── */
                .td4-input {
                    width: 100%; background: var(--td4-input-bg);
                    border: 1px solid var(--td4-input-bd);
                    color: var(--td4-text-1);
                    padding: 10px 14px;
                    font-family: 'Barlow', sans-serif; font-size: 13.5px; font-weight: 500;
                    outline: none; appearance: none; box-sizing: border-box;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .td4-input::placeholder { color: var(--td4-placeholder); }
                .td4-input:focus { border-color: var(--td4-input-focus); box-shadow: 0 0 0 3px rgba(76,175,80,0.12); }
                .td4-input:disabled { opacity: 0.45; cursor: not-allowed; }
                .td4-input-error { border-color: var(--td4-input-err) !important; }
                .td4-input-error:focus { box-shadow: 0 0 0 3px rgba(248,113,113,0.12) !important; }

                /* ── Grid ── */
                .td4-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 20px 24px;
                }
                @media (max-width: 640px) { .td4-grid { grid-template-columns: 1fr; } }

                /* ── Team name card ── */
                .td4-name-card {
                    background: var(--td4-section-bg);
                    border: 1px solid var(--td4-border-1);
                    padding: 24px 28px;
                    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);
                }

                /* ── Roster section header ── */
                .td4-roster-header {
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 12px;
                    padding: 16px 20px;
                    background: var(--td4-roster-bg);
                    border: 1px solid var(--td4-roster-bd);
                    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%);
                }

                /* ── Member card ── */
                .td4-member-card {
                    position: relative;
                    background: var(--td4-card-bg);
                    border: 1px solid var(--td4-border-1);
                    overflow: hidden;
                    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);
                    transition: border-color 0.25s;
                }
                .td4-member-card:hover { border-color: rgba(45,106,45,0.30); }
                .td4-member-captain { border-color: var(--td4-captain-bd) !important; background: var(--td4-captain-bg); }

                /* Shimmer on hover */
                .td4-card-shimmer {
                    position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.04) 50%, transparent 80%);
                    transform: skewX(-20deg); pointer-events: none; z-index: 1;
                    transition: left 0s;
                }
                .td4-member-card:hover .td4-card-shimmer {
                    left: 150%; transition: left 0.65s cubic-bezier(0.25,0.46,0.45,0.94);
                }

                /* Member header bar */
                .td4-member-header {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 16px 22px;
                    border-bottom: 1px solid var(--td4-divider);
                    position: relative; z-index: 2;
                }
                .td4-member-avatar {
                    width: 34px; height: 34px; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    background: var(--td4-roster-bg);
                    border: 1px solid var(--td4-border-2);
                    color: var(--td4-text-3);
                    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
                }
                .td4-avatar-captain {
                    background: rgba(245,158,11,0.10);
                    border-color: rgba(245,158,11,0.28);
                    color: var(--td4-accent);
                }

                .td4-member-body { padding: 20px 22px 22px; position: relative; z-index: 2; }

                /* Remove button */
                .td4-remove-btn {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 6px 12px;
                    background: var(--td4-remove-bg);
                    border: 1px solid var(--td4-remove-bd);
                    color: var(--td4-remove-txt);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
                    cursor: pointer;
                    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
                    transition: background 0.2s, border-color 0.2s;
                }
                .td4-remove-btn:hover { background: rgba(248,113,113,0.14); border-color: rgba(248,113,113,0.45); }

                /* Add member button */
                .td4-add-btn {
                    width: 100%;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    padding: 20px;
                    background: var(--td4-add-bg);
                    border: 1px dashed var(--td4-add-bd);
                    color: var(--td4-add-txt);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase;
                    cursor: pointer;
                    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%);
                    transition: color 0.2s, border-color 0.2s, background 0.2s;
                }
                .td4-add-btn:hover { color: var(--td4-add-hover-txt); border-color: var(--td4-add-hover-bd); background: rgba(45,106,45,0.08); }

                /* Roster count badge */
                .td4-count-badge {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 4px 14px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
                    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
                }
            `}</style>

                <ErrorBanner errors={formErrors} />

                <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Team name */}
                    <div className="td4-name-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, marginBottom: 18, borderBottom: '1px solid var(--td4-divider)' }}>
                            <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--td4-border-2)', color: 'var(--td4-primary-lt)', clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)' }}>
                                <TeamIcon />
                            </div>
                            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--td4-text-3)' }}>Team Identity</span>
                        </div>
                        <Field label="Team Name" required error={errors.teamName}>
                            <input className={`td4-input${errors.teamName ? ' td4-input-error' : ''}`}
                                placeholder="e.g. Thunder Bolts" type="text"
                                value={data.teamName} onChange={e => onChange({ ...data, teamName: e.target.value })} />
                        </Field>
                    </div>

                    {/* Roster header */}
                    <div className="td4-roster-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ height: 1, width: 28, background: 'var(--td4-primary)', flexShrink: 0 }} />
                            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--td4-text-3)' }}>Team Roster</span>
                        </div>
                        <span
                            className="td4-count-badge"
                            style={{
                                background: data.members.length >= 5 ? 'rgba(245,158,11,0.08)' : 'rgba(45,106,45,0.08)',
                                border: `1px solid ${data.members.length >= 5 ? 'rgba(245,158,11,0.25)' : 'rgba(45,106,45,0.25)'}`,
                                color: data.members.length >= 5 ? 'var(--td4-accent)' : 'var(--td4-primary-lt)',
                            }}
                        >
                            {data.members.length} / 5 Members
                        </span>
                    </div>

                    {/* Member cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {data.members.map((member, index) => (
                            <MemberCard
                                key={member.id}
                                member={member}
                                index={index}
                                errors={errors}
                                isSubmitting={isSubmitting}
                                onUpdate={updateMember}
                                onRemove={removeMember}
                            />
                        ))}

                        {data.members.length < 5 && (
                            <button type="button" className="td4-add-btn" onClick={addMember}>
                                <PlusIcon />
                                Add Team Member
                            </button>
                        )}
                    </div>
                </form>
            </RegistrationStepLayout>
        </>
    );
};

export default Step4TeamDetails;