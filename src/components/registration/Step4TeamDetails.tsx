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

                {/* Layout varies based on isMilitary */}
                {isMilitary ? (
                    <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                    </div>
                ) : (
                    <>
                        {/* Country + T-Shirt Row */}
                        <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <Field label="Country" error={e('country')}>
                                <div style={{ position: 'relative' }}>
                                    <select className={inp(!!e('country'))}
                                        value={member.country || 'Kenya'} onChange={ev => set('country', ev.target.value)} disabled={isSubmitting}>
                                        <option value="">Select country</option>
                                        <option value="Kenya">Kenya</option>
                                        <option disabled>──────────</option>
                                    <option value="Afghanistan">Afghanistan</option>
                                    <option value="Åland Islands">Åland Islands</option>
                                    <option value="Albania">Albania</option>
                                    <option value="Algeria">Algeria</option>
                                    <option value="American Samoa">American Samoa</option>
                                    <option value="Andorra">Andorra</option>
                                    <option value="Angola">Angola</option>
                                    <option value="Anguilla">Anguilla</option>
                                    <option value="Antarctica">Antarctica</option>
                                    <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                    <option value="Argentina">Argentina</option>
                                    <option value="Armenia">Armenia</option>
                                    <option value="Aruba">Aruba</option>
                                    <option value="Australia">Australia</option>
                                    <option value="Austria">Austria</option>
                                    <option value="Azerbaijan">Azerbaijan</option>
                                    <option value="Bahamas">Bahamas</option>
                                    <option value="Bahrain">Bahrain</option>
                                    <option value="Bangladesh">Bangladesh</option>
                                    <option value="Barbados">Barbados</option>
                                    <option value="Belarus">Belarus</option>
                                    <option value="Belgium">Belgium</option>
                                    <option value="Belize">Belize</option>
                                    <option value="Benin">Benin</option>
                                    <option value="Bermuda">Bermuda</option>
                                    <option value="Bhutan">Bhutan</option>
                                    <option value="Bolivia">Bolivia</option>
                                    <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                    <option value="Botswana">Botswana</option>
                                    <option value="Bouvet Island">Bouvet Island</option>
                                    <option value="Brazil">Brazil</option>
                                    <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                                    <option value="Brunei Darussalam">Brunei Darussalam</option>
                                    <option value="Bulgaria">Bulgaria</option>
                                    <option value="Burkina Faso">Burkina Faso</option>
                                    <option value="Burundi">Burundi</option>
                                    <option value="Cambodia">Cambodia</option>
                                    <option value="Cameroon">Cameroon</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Cape Verde">Cape Verde</option>
                                    <option value="Cayman Islands">Cayman Islands</option>
                                    <option value="Central African Republic">Central African Republic</option>
                                    <option value="Chad">Chad</option>
                                    <option value="Chile">Chile</option>
                                    <option value="China">China</option>
                                    <option value="Christmas Island">Christmas Island</option>
                                    <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                                    <option value="Colombia">Colombia</option>
                                    <option value="Comoros">Comoros</option>
                                    <option value="Congo">Congo</option>
                                    <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                                    <option value="Cook Islands">Cook Islands</option>
                                    <option value="Costa Rica">Costa Rica</option>
                                    <option value="Cote D'ivoire">Cote D'ivoire</option>
                                    <option value="Croatia">Croatia</option>
                                    <option value="Cuba">Cuba</option>
                                    <option value="Cyprus">Cyprus</option>
                                    <option value="Czech Republic">Czech Republic</option>
                                    <option value="Denmark">Denmark</option>
                                    <option value="Djibouti">Djibouti</option>
                                    <option value="Dominica">Dominica</option>
                                    <option value="Dominican Republic">Dominican Republic</option>
                                    <option value="Ecuador">Ecuador</option>
                                    <option value="Egypt">Egypt</option>
                                    <option value="El Salvador">El Salvador</option>
                                    <option value="Equatorial Guinea">Equatorial Guinea</option>
                                    <option value="Eritrea">Eritrea</option>
                                    <option value="Estonia">Estonia</option>
                                    <option value="Ethiopia">Ethiopia</option>
                                    <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                                    <option value="Faroe Islands">Faroe Islands</option>
                                    <option value="Fiji">Fiji</option>
                                    <option value="Finland">Finland</option>
                                    <option value="France">France</option>
                                    <option value="French Guiana">French Guiana</option>
                                    <option value="French Polynesia">French Polynesia</option>
                                    <option value="French Southern Territories">French Southern Territories</option>
                                    <option value="Gabon">Gabon</option>
                                    <option value="Gambia">Gambia</option>
                                    <option value="Georgia">Georgia</option>
                                    <option value="Germany">Germany</option>
                                    <option value="Ghana">Ghana</option>
                                    <option value="Gibraltar">Gibraltar</option>
                                    <option value="Greece">Greece</option>
                                    <option value="Greenland">Greenland</option>
                                    <option value="Grenada">Grenada</option>
                                    <option value="Guadeloupe">Guadeloupe</option>
                                    <option value="Guam">Guam</option>
                                    <option value="Guatemala">Guatemala</option>
                                    <option value="Guernsey">Guernsey</option>
                                    <option value="Guinea">Guinea</option>
                                    <option value="Guinea-bissau">Guinea-bissau</option>
                                    <option value="Guyana">Guyana</option>
                                    <option value="Haiti">Haiti</option>
                                    <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                                    <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                                    <option value="Honduras">Honduras</option>
                                    <option value="Hong Kong">Hong Kong</option>
                                    <option value="Hungary">Hungary</option>
                                    <option value="Iceland">Iceland</option>
                                    <option value="India">India</option>
                                    <option value="Indonesia">Indonesia</option>
                                    <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                                    <option value="Iraq">Iraq</option>
                                    <option value="Ireland">Ireland</option>
                                    <option value="Isle of Man">Isle of Man</option>
                                    <option value="Israel">Israel</option>
                                    <option value="Italy">Italy</option>
                                    <option value="Jamaica">Jamaica</option>
                                    <option value="Japan">Japan</option>
                                    <option value="Jersey">Jersey</option>
                                    <option value="Jordan">Jordan</option>
                                    <option value="Kazakhstan">Kazakhstan</option>
                                    <option value="Kenya">Kenya</option>
                                    <option value="Kiribati">Kiribati</option>
                                    <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
                                    <option value="Korea, Republic of">Korea, Republic of</option>
                                    <option value="Kuwait">Kuwait</option>
                                    <option value="Kyrgyzstan">Kyrgyzstan</option>
                                    <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
                                    <option value="Latvia">Latvia</option>
                                    <option value="Lebanon">Lebanon</option>
                                    <option value="Lesotho">Lesotho</option>
                                    <option value="Liberia">Liberia</option>
                                    <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                                    <option value="Liechtenstein">Liechtenstein</option>
                                    <option value="Lithuania">Lithuania</option>
                                    <option value="Luxembourg">Luxembourg</option>
                                    <option value="Macao">Macao</option>
                                    <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                                    <option value="Madagascar">Madagascar</option>
                                    <option value="Malawi">Malawi</option>
                                    <option value="Malaysia">Malaysia</option>
                                    <option value="Maldives">Maldives</option>
                                    <option value="Mali">Mali</option>
                                    <option value="Malta">Malta</option>
                                    <option value="Marshall Islands">Marshall Islands</option>
                                    <option value="Martinique">Martinique</option>
                                    <option value="Mauritania">Mauritania</option>
                                    <option value="Mauritius">Mauritius</option>
                                    <option value="Mayotte">Mayotte</option>
                                    <option value="Mexico">Mexico</option>
                                    <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                                    <option value="Moldova, Republic of">Moldova, Republic of</option>
                                    <option value="Monaco">Monaco</option>
                                    <option value="Mongolia">Mongolia</option>
                                    <option value="Montenegro">Montenegro</option>
                                    <option value="Montserrat">Montserrat</option>
                                    <option value="Morocco">Morocco</option>
                                    <option value="Mozambique">Mozambique</option>
                                    <option value="Myanmar">Myanmar</option>
                                    <option value="Namibia">Namibia</option>
                                    <option value="Nauru">Nauru</option>
                                    <option value="Nepal">Nepal</option>
                                    <option value="Netherlands">Netherlands</option>
                                    <option value="Netherlands Antilles">Netherlands Antilles</option>
                                    <option value="New Caledonia">New Caledonia</option>
                                    <option value="New Zealand">New Zealand</option>
                                    <option value="Nicaragua">Nicaragua</option>
                                    <option value="Niger">Niger</option>
                                    <option value="Nigeria">Nigeria</option>
                                    <option value="Niue">Niue</option>
                                    <option value="Norfolk Island">Norfolk Island</option>
                                    <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                                    <option value="Norway">Norway</option>
                                    <option value="Oman">Oman</option>
                                    <option value="Pakistan">Pakistan</option>
                                    <option value="Palau">Palau</option>
                                    <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                                    <option value="Panama">Panama</option>
                                    <option value="Papua New Guinea">Papua New Guinea</option>
                                    <option value="Paraguay">Paraguay</option>
                                    <option value="Peru">Peru</option>
                                    <option value="Philippines">Philippines</option>
                                    <option value="Pitcairn">Pitcairn</option>
                                    <option value="Poland">Poland</option>
                                    <option value="Portugal">Portugal</option>
                                    <option value="Puerto Rico">Puerto Rico</option>
                                    <option value="Qatar">Qatar</option>
                                    <option value="Reunion">Reunion</option>
                                    <option value="Romania">Romania</option>
                                    <option value="Russian Federation">Russian Federation</option>
                                    <option value="Rwanda">Rwanda</option>
                                    <option value="Saint Helena">Saint Helena</option>
                                    <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                    <option value="Saint Lucia">Saint Lucia</option>
                                    <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                                    <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                                    <option value="Samoa">Samoa</option>
                                    <option value="San Marino">San Marino</option>
                                    <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                    <option value="Saudi Arabia">Saudi Arabia</option>
                                    <option value="Senegal">Senegal</option>
                                    <option value="Serbia">Serbia</option>
                                    <option value="Seychelles">Seychelles</option>
                                    <option value="Sierra Leone">Sierra Leone</option>
                                    <option value="Singapore">Singapore</option>
                                    <option value="Slovakia">Slovakia</option>
                                    <option value="Slovenia">Slovenia</option>
                                    <option value="Solomon Islands">Solomon Islands</option>
                                    <option value="Somalia">Somalia</option>
                                    <option value="South Africa">South Africa</option>
                                    <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                                    <option value="Spain">Spain</option>
                                    <option value="Sri Lanka">Sri Lanka</option>
                                    <option value="Sudan">Sudan</option>
                                    <option value="Suriname">Suriname</option>
                                    <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                                    <option value="Swaziland">Swaziland</option>
                                    <option value="Sweden">Sweden</option>
                                    <option value="Switzerland">Switzerland</option>
                                    <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                                    <option value="Taiwan">Taiwan</option>
                                    <option value="Tajikistan">Tajikistan</option>
                                    <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                                    <option value="Thailand">Thailand</option>
                                    <option value="Timor-leste">Timor-leste</option>
                                    <option value="Togo">Togo</option>
                                    <option value="Tokelau">Tokelau</option>
                                    <option value="Tonga">Tonga</option>
                                    <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                                    <option value="Tunisia">Tunisia</option>
                                    <option value="Turkey">Turkey</option>
                                    <option value="Turkmenistan">Turkmenistan</option>
                                    <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                                    <option value="Tuvalu">Tuvalu</option>
                                    <option value="Uganda">Uganda</option>
                                    <option value="Ukraine">Ukraine</option>
                                    <option value="United Arab Emirates">United Arab Emirates</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="United States">United States</option>
                                    <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                                    <option value="Uruguay">Uruguay</option>
                                    <option value="Uzbekistan">Uzbekistan</option>
                                    <option value="Vanuatu">Vanuatu</option>
                                    <option value="Venezuela">Venezuela</option>
                                    <option value="Viet Nam">Viet Nam</option>
                                    <option value="Virgin Islands, British">Virgin Islands, British</option>
                                    <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                                    <option value="Wallis and Futuna">Wallis and Futuna</option>
                                    <option value="Western Sahara">Western Sahara</option>
                                    <option value="Yemen">Yemen</option>
                                    <option value="Zambia">Zambia</option>
                                    <option value="Zimbabwe">Zimbabwe</option>
                                    </select>
                                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--td4-text-3)' }}><ChevronDown /></span>
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
                        </div>

                        {/* Gender alone on left column */}
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
                        <div />
                    </>
                )}

                {/* Emergency contacts on same row */}
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
                emergencyContactName: '', emergencyPhone: '', isCaptain: false, country: 'Kenya',
            }],
        });
    };

    const removeMember = (id: string) => {
        if (data.members.length <= 1) return;
        onChange({ ...data, members: data.members.filter(m => m.id !== id) });
    };

    return (
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
    );
};

export default Step4TeamDetails;