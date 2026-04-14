import '../../styles/registration/Step4TeamDetails.css';
import type { TeamDetails, TeamMember } from '../../types';
import ErrorBanner from '../common/ErrorBanner';
import { calculateAge } from '../../utils';
import RegistrationStepLayout from './ui/RegistrationStepLayout';
import { useRegistration } from '../../context/RegistrationContext';

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

const MILITARY_RANKS = [
    'Gen', 'Lt Gen', 'Maj Gen', 'Brig', 'Col', 'Lt Col', 'Maj', 'Capt',
    'Lt', '2Lt', 'WOI', 'WOII', 'Ssgt', 'Sgt', 'Cpl', 'Pte',
];
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
    const { isMilitary } = useRegistration();
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
                {isMilitary ? (
                    <>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <Field label="Service" required error={e('service')}>
                                <div style={{ position: 'relative' }}>
                                    <select className={inp(!!e('service'))}
                                        value={member.service || ''} onChange={ev => set('service', ev.target.value)} disabled={isSubmitting}>
                                        <option value="">Select service</option>
                                        <option value="KA">Kenya Army (KA)</option>
                                        <option value="KAF">Kenya Air Force (KAF)</option>
                                        <option value="KN">Kenya Navy (KN)</option>
                                    </select>
                                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--td4-text-3)' }}><ChevronDown /></span>
                                </div>
                            </Field>
                        </div>
                        <Field label="Service Number" required error={e('idNumber')}>
                            <input className={inp(!!e('idNumber'))} placeholder="123456" type="text"
                                value={member.idNumber} onChange={ev => set('idNumber', ev.target.value)} disabled={isSubmitting} />
                        </Field>
                        <Field label="Rank" required error={e('rank')}>
                            <div style={{ position: 'relative' }}>
                                <select
                                    className={inp(!!e('rank'))}
                                    value={member.rank || ''}
                                    onChange={ev => set('rank', ev.target.value)}
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select rank</option>
                                    {MILITARY_RANKS.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--td4-text-3)' }}><ChevronDown /></span>
                            </div>
                        </Field>
                        <Field label="First Name" required error={e('firstName')}>
                            <input className={inp(!!e('firstName'))} placeholder="Jane" type="text"
                                value={member.firstName} onChange={ev => set('firstName', ev.target.value)} disabled={isSubmitting} />
                        </Field>
                        <Field label="Last Name" required error={e('lastName')}>
                            <input className={inp(!!e('lastName'))} placeholder="Doe" type="text"
                                value={member.lastName} onChange={ev => set('lastName', ev.target.value)} disabled={isSubmitting} />
                        </Field>
                        <Field label="Unit / FMN" required error={e('unit')}>
                            <input className={inp(!!e('unit'))} placeholder="e.g. 1st Battalion" type="text"
                                value={member.unit || ''} onChange={ev => set('unit', ev.target.value)} disabled={isSubmitting} />
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
                        <Field label="Email Address" required error={e('email')}>
                            <input className={inp(!!e('email'))} placeholder="jane.doe@example.com" type="email"
                                value={member.email} onChange={ev => set('email', ev.target.value)} disabled={isSubmitting} />
                        </Field>
                        <Field label="Phone Number" required error={e('phoneNumber')}>
                            <input className={inp(!!e('phoneNumber'))} placeholder="0712 345 678" type="tel"
                                value={member.phoneNumber} onChange={ev => set('phoneNumber', ev.target.value)} disabled={isSubmitting} />
                        </Field>
                    </>
                ) : (
                    <>
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
                    </>
                )}
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
            

            <RegistrationStepLayout
                stepLabel="Step 3 of 4"
                title="Build Your Squad"
                subtitle="Enter your team name and add your fellow warriors. Minimum 2 members required."
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