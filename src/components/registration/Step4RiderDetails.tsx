import '../../styles/registration/Step4RiderDetails.css';
import type { RiderDetails } from '../../types';
import { useRegistration } from '../../context/RegistrationContext';
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

const MILITARY_RANKS = [
    'Gen', 'Lt Gen', 'Maj Gen', 'Brig', 'Col', 'Lt Col', 'Maj', 'Capt',
    'Lt', '2Lt', 'WOI', 'WOII', 'Ssgt', 'Sgt', 'Cpl', 'Pte',
];

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
    const { isMilitary } = useRegistration();
    const set = (field: keyof RiderDetails, value: string) => onChange({ ...data, [field]: value });

    const inputClass = (hasError: boolean) => `rd4-input${hasError ? ' rd4-input-error' : ''}`;

    return (
        <RegistrationStepLayout
            stepLabel="Step 3 of 4"
            title="Rider Details"
            subtitle="Provide your personal information to complete the registration."
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

                {/* ── All Information In One Card ── */}
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
                        {isMilitary ? (
                            <>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <Field label="Service" required error={errors.service}>
                                        <div className="rd4-select-wrap">
                                            <select
                                                className={inputClass(!!errors.service)}
                                                value={data.service || ''}
                                                onChange={e => set('service', e.target.value)}
                                                disabled={isSubmitting}
                                            >
                                                <option value="">Select service</option>
                                                <option value="KA">Kenya Army (KA)</option>
                                                <option value="KAF">Kenya Air Force (KAF)</option>
                                                <option value="KN">Kenya Navy (KN)</option>
                                            </select>
                                            <span className="rd4-chevron"><ChevronDown /></span>
                                        </div>
                                    </Field>
                                </div>
                                <Field label="Service Number" required error={errors.idNumber}>
                                    <input className={inputClass(!!errors.idNumber)} placeholder="123456" type="text"
                                        value={data.idNumber} onChange={e => set('idNumber', e.target.value)} disabled={isSubmitting} />
                                </Field>
                                <Field label="Rank" required error={errors.rank}>
                                    <div className="rd4-select-wrap">
                                        <select
                                            className={inputClass(!!errors.rank)}
                                            value={data.rank || ''}
                                            onChange={e => set('rank', e.target.value)}
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Select rank</option>
                                            {MILITARY_RANKS.map(r => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                        <span className="rd4-chevron"><ChevronDown /></span>
                                    </div>
                                </Field>
                                <Field label="First Name" required error={errors.firstName}>
                                    <input className={inputClass(!!errors.firstName)} placeholder="Jane" type="text"
                                        value={data.firstName} onChange={e => set('firstName', e.target.value)} disabled={isSubmitting} />
                                </Field>
                                <Field label="Last Name" required error={errors.lastName}>
                                    <input className={inputClass(!!errors.lastName)} placeholder="Doe" type="text"
                                        value={data.lastName} onChange={e => set('lastName', e.target.value)} disabled={isSubmitting} />
                                </Field>
                                <Field label="Unit / FMN" required error={errors.unit}>
                                    <input className={inputClass(!!errors.unit)} placeholder="e.g. 1st Battalion" type="text"
                                        value={data.unit || ''} onChange={e => set('unit', e.target.value)} disabled={isSubmitting} />
                                </Field>
                                <Field
                                    label="Date of Birth" required error={errors.dob}
                                    hint={data.dob ? <span className="rd4-age-badge">{calculateAge(data.dob)} yrs old</span> : undefined}
                                >
                                    <input className={inputClass(!!errors.dob)} type="date"
                                        value={data.dob} onChange={e => set('dob', e.target.value)} disabled={isSubmitting} />
                                </Field>
                                <Field label="Email Address" required error={errors.email}>
                                    <input className={inputClass(!!errors.email)} placeholder="jane.doe@example.com" type="email"
                                        value={data.email} onChange={e => set('email', e.target.value)} disabled={isSubmitting} />
                                </Field>
                                <Field label="Phone Number" required error={errors.phoneNumber}>
                                    <input className={inputClass(!!errors.phoneNumber)} placeholder="0712 345 678" type="tel"
                                        value={data.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} disabled={isSubmitting} />
                                </Field>
                            </>
                        ) : (
                            <>
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
                                    hint={data.dob ? <span className="rd4-age-badge">{calculateAge(data.dob)} yrs old</span> : undefined}
                                >
                                    <input className={inputClass(!!errors.dob)} type="date"
                                        value={data.dob} onChange={e => set('dob', e.target.value)} disabled={isSubmitting} />
                                </Field>
                            </>
                        )}

                        {/* Country + T-Shirt on same row */}
                        <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {!isMilitary ? (
                                <Field label="Country" error={errors.country}>
                                    <div className="rd4-select-wrap">
                                        <select
                                            className={inputClass(!!errors.country)}
                                            value={data.country || 'Kenya'}
                                            onChange={e => set('country', e.target.value)}
                                            disabled={isSubmitting}
                                        >
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
                                        <span className="rd4-chevron"><ChevronDown /></span>
                                    </div>
                                </Field>
                            ) : (
                                <div />
                            )}
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
                        </div>

                        {/* Gender alone on left column */}
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
                        <div />{/* spacer — keeps Gender in left column only */}

                        {/* Emergency contacts on same row */}
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
