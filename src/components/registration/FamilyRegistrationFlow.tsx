import '../../styles/registration/FamilyRegistrationFlow.css';
import { useState } from 'react';
import type { FamilyDetails, JuniorRider } from '../../types';
import ErrorBanner from '../common/ErrorBanner';
import { calculateAge } from '../../utils';
import { useRegistration } from '../../context/RegistrationContext';

import RegistrationStepLayout from './ui/RegistrationStepLayout';
import { MdPedalBike, MdDirectionsBike } from 'react-icons/md';

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
const PlusIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const TrashIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

interface FamilyRegistrationFlowProps {
    data: FamilyDetails;
    onChange: (data: FamilyDetails) => void;
    onNext: () => void;
    onBack: () => void;
    errors: Record<string, string>;
    formErrors: string[];
    isSubmitting: boolean;
}

const FamilyRegistrationFlow = ({ data, onChange, onNext, onBack, formErrors, isSubmitting }: FamilyRegistrationFlowProps) => {
    const { isMilitary, hireBike, setHireBike } = useRegistration();
    const hasChildren = data.riders.cubs.length + data.riders.champs.length > 0;
    const categories = [
        { id: 'cubs', title: 'Cubs (Ages 4-8)', icon: MdPedalBike },
        { id: 'champs', title: 'Champs (Ages 9-13)', icon: MdDirectionsBike }
    ];

    const [activeCategory, setActiveCategory] = useState('cubs');

    const addRider = (category: string) => {
        onChange({
            ...data,
            riders: {
                ...data.riders,
                [category]: [
                    ...data.riders[category],
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        firstName: '',
                        lastName: '',
                        dob: '',
                        gender: category === 'tigers' ? 'female' : '',
                        tshirtSize: '',
                        idNumber: '',
                        emergencyContactName: '',
                        emergencyPhone: ''
                    }
                ]
            }
        });
    };

    const removeRider = (category: string, id: string) => {
        onChange({
            ...data,
            riders: {
                ...data.riders,
                [category]: data.riders[category].filter(r => r.id !== id)
            }
        });
    };

    const updateRider = (category: string, id: string, field: keyof JuniorRider, value: string) => {
        onChange({
            ...data,
            riders: {
                ...data.riders,
                [category]: data.riders[category].map(r => r.id === id ? { ...r, [field]: value } : r)
            }
        });
    };

    const updateGuardian = (field: string, value: string) => {
        const updatedGuardian = { ...data.guardian, [field]: value };

        // Sync fullName
        if (field === 'firstName' || field === 'lastName') {
            updatedGuardian.fullName = `${field === 'firstName' ? value : updatedGuardian.firstName} ${field === 'lastName' ? value : updatedGuardian.lastName}`.trim();
        }

        let updatedRiders = { ...data.riders };

        // Handle Parent syncing
        if (updatedGuardian.participation === 'mom') {
            const momRider: JuniorRider = {
                id: 'mom-rider-id', // Fixed ID for the synced mom
                firstName: updatedGuardian.firstName,
                lastName: updatedGuardian.lastName,
                dob: updatedGuardian.dob,
                idNumber: updatedGuardian.idNumber,
                gender: updatedGuardian.gender || 'female',
                tshirtSize: updatedGuardian.tshirtSize,
                emergencyContactName: '',
                emergencyPhone: updatedGuardian.phoneNumber
            };
            updatedRiders.tigers = [momRider];
        } else {
            updatedRiders.tigers = [];
        }

        onChange({
            ...data,
            guardian: updatedGuardian,
            riders: updatedRiders
        });
    };

    return (
        <RegistrationStepLayout
            stepLabel="Step 3 of 4"
            title="Family Warriors"
            subtitle="Adults can ride solo or bring their little champions along. Children are optional — add Cubs or Champs if you have them."
            footer={
                <>
                    <button className="fam-back-btn" onClick={onBack} type="button" disabled={isSubmitting}>
                        <ArrowLeft /> <span>Back</span>
                    </button>

                    <button className="fam-next-btn" onClick={onNext} type="button" disabled={isSubmitting}>
                        <span>{isSubmitting ? 'Processing...' : 'Next: Review'}</span>
                        <ArrowRight />
                    </button>
                </>
            }
        >


            <div className="flex flex-col gap-10 w-full" style={{ fontFamily: "'Barlow', sans-serif" }}>
                <ErrorBanner errors={formErrors} />

                {/* Tabs */}
                <div className="fam-tabs">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`fam-tab${activeCategory === cat.id ? ' active' : ''}`}
                            disabled={isSubmitting}
                        >
                            {cat.title}
                        </button>
                    ))}
                </div>

                {/* Rider List */}
                <div className="flex flex-col gap-4">
                    {data.riders[activeCategory].map((rider: JuniorRider, index: number) => (
                        <div key={rider.id} className="fam-rider-card">
                            <div className="fam-card-head">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 6, height: 6, background: 'var(--fam-primary-lt)', borderRadius: '50%' }} />
                                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fam-text-2)' }}>
                                        {activeCategory.slice(0, -1)} Rider #{index + 1}
                                    </span>
                                </div>
                                <button className="fam-delete-btn" onClick={() => removeRider(activeCategory, rider.id)} type="button">
                                    <TrashIcon /> Delete
                                </button>
                            </div>
                            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                                <div>
                                    <label className="fam-field-label">First Name *</label>
                                    <input
                                        className="fam-input"
                                        type="text"
                                        value={rider.firstName}
                                        onChange={(e) => updateRider(activeCategory, rider.id, 'firstName', e.target.value)}
                                        placeholder="e.g. Leo"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label className="fam-field-label">Last Name *</label>
                                    <input
                                        className="fam-input"
                                        type="text"
                                        value={rider.lastName}
                                        onChange={(e) => updateRider(activeCategory, rider.id, 'lastName', e.target.value)}
                                        placeholder="e.g. Walker"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label className="fam-field-label">Date of Birth *</label>
                                    <input
                                        className="fam-input"
                                        type="date"
                                        value={rider.dob}
                                        onChange={(e) => updateRider(activeCategory, rider.id, 'dob', e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                    {rider.dob && (
                                        <div style={{ marginTop: 6, fontSize: '10px', color: 'var(--fam-primary-lt)', fontWeight: 700 }}>
                                            {calculateAge(rider.dob)} YEARS OLD
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="fam-field-label">Full Cycling Kit Size *</label>
                                    <select
                                        className="fam-input"
                                        value={rider.tshirtSize}
                                        onChange={(e) => updateRider(activeCategory, rider.id, 'tshirtSize', e.target.value)}
                                        disabled={isSubmitting}
                                    >
                                        <option value="">Select Size</option>
                                        <option value="XS">Youth XS</option>
                                        <option value="S">Youth S</option>
                                        <option value="M">Youth M</option>
                                        <option value="L">Youth L</option>
                                        <option value="XL">Youth XL</option>
                                        <option value="S_ADULT">Adult S</option>
                                        <option value="M_ADULT">Adult M</option>
                                    </select>
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label className="fam-field-label">Gender *</label>
                                    <div style={{ display: 'flex', gap: '20px', height: '42px', alignItems: 'center' }}>
                                        {['male', 'female'].map(g => (
                                            <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                                <input
                                                    type="radio"
                                                    name={`rider_gender_${rider.id}`}
                                                    checked={rider.gender === g}
                                                    onChange={() => updateRider(activeCategory, rider.id, 'gender', g)}
                                                    style={{ accentColor: 'var(--fam-primary-lt)' }}
                                                    disabled={isSubmitting}
                                                />
                                                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--fam-text-2)', textTransform: 'capitalize' }}>{g}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        className="fam-add-btn"
                        onClick={() => addRider(activeCategory)}
                        disabled={isSubmitting || (activeCategory === 'tigers' && data.riders.tigers.length >= 1)}
                        type="button"
                    >
                        <PlusIcon />
                        <span>Add Another {activeCategory.slice(0, -1)}</span>
                    </button>
                </div>

                {/* Guardian Section */}
                <div style={{ marginTop: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <div style={{ height: 1, width: 32, background: 'var(--fam-primary)' }} />
                        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', color: 'var(--fam-text-1)', letterSpacing: '0.04em', margin: 0 }}>{hasChildren ? 'Guardian Details' : 'Your Details'}</h3>
                    </div>

                    <div style={{ background: 'var(--fam-raised-bg)', padding: '32px', border: '1px solid var(--fam-border)', clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                            {isMilitary ? (
                                <>
                                    <div>
                                        <label className="fam-field-label">Service *</label>
                                        <select
                                            className="fam-input"
                                            value={data.guardian.service || ''}
                                            onChange={(e) => updateGuardian('service', e.target.value)}
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Select Service</option>
                                            <option value="KA">Kenya Army (KA)</option>
                                            <option value="KAF">Kenya Air Force (KAF)</option>
                                            <option value="KN">Kenya Navy (KN)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="fam-field-label">Rank *</label>
                                        <input
                                            className="fam-input"
                                            type="text"
                                            value={data.guardian.rank || ''}
                                            onChange={(e) => updateGuardian('rank', e.target.value)}
                                            placeholder="Rank"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label className="fam-field-label">Service Number *</label>
                                        <input
                                            className="fam-input"
                                            type="text"
                                            value={data.guardian.idNumber}
                                            onChange={(e) => updateGuardian('idNumber', e.target.value)}
                                            placeholder="Service Number"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label className="fam-field-label">First Name *</label>
                                        <input
                                            className="fam-input"
                                            type="text"
                                            value={data.guardian.firstName}
                                            onChange={(e) => updateGuardian('firstName', e.target.value)}
                                            placeholder="First Name"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label className="fam-field-label">Last Name *</label>
                                        <input
                                            className="fam-input"
                                            type="text"
                                            value={data.guardian.lastName}
                                            onChange={(e) => updateGuardian('lastName', e.target.value)}
                                            placeholder="Last Name"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label className="fam-field-label">Email Address *</label>
                                        <input
                                            className="fam-input"
                                            type="email"
                                            value={data.guardian.email}
                                            onChange={(e) => updateGuardian('email', e.target.value)}
                                            placeholder="Email"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label className="fam-field-label">Phone Number *</label>
                                        <input
                                            className="fam-input"
                                            type="tel"
                                            value={data.guardian.phoneNumber}
                                            onChange={(e) => updateGuardian('phoneNumber', e.target.value)}
                                            placeholder="Phone"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    {hasChildren && (
                                    <div>
                                        <label className="fam-field-label">Relationship *</label>
                                        <select
                                            className="fam-input"
                                            value={data.guardian.relationship}
                                            onChange={(e) => updateGuardian('relationship', e.target.value)}
                                            disabled={isSubmitting}
                                        >
                                            <option value="" disabled>Select relationship</option>
                                            <option value="parent">Parent</option>
                                            <option value="legal_guardian">Legal Guardian</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    )}
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label className="fam-field-label">Participating in the ride? *</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: 8 }}>
                                            {[
                                                { id: 'none', label: 'Not riding' },
                                                { id: 'mom', label: 'Joining the Ride (5km)' },
                                                { id: 'other', label: 'Riding other circuit' }
                                            ].map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => updateGuardian('participation', opt.id)}
                                                    style={{
                                                        padding: '14px',
                                                        background: data.guardian.participation === opt.id ? 'var(--fam-primary)' : 'var(--fam-input-bg)',
                                                        border: '1px solid',
                                                        borderColor: data.guardian.participation === opt.id ? 'var(--fam-primary)' : 'var(--fam-border)',
                                                        color: data.guardian.participation === opt.id ? '#fff' : 'var(--fam-text-2)',
                                                        fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', fontWeight: 700,
                                                        letterSpacing: '0.1em', textTransform: 'uppercase',
                                                        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
                                                        cursor: 'pointer', transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {data.guardian.participation === 'mom' && (
                                        <>
                                            <div>
                                                <label className="fam-field-label">Full Cycling Kit Size *</label>
                                                <select
                                                    className="fam-input"
                                                    value={data.guardian.tshirtSize}
                                                    onChange={(e) => updateGuardian('tshirtSize', e.target.value)}
                                                    disabled={isSubmitting}
                                                >
                                                    <option value="">Select Size</option>
                                                    <option value="S">Small (S)</option>
                                                    <option value="M">Medium (M)</option>
                                                    <option value="L">Large (L)</option>
                                                    <option value="XL">Extra Large (XL)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="fam-field-label">Gender *</label>
                                                <div style={{ display: 'flex', gap: '20px', height: '42px', alignItems: 'center' }}>
                                                    {['male', 'female'].map(g => (
                                                        <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                                            <input
                                                                type="radio"
                                                                name="guardian_gender_military"
                                                                checked={data.guardian.gender === g}
                                                                onChange={() => updateGuardian('gender', g)}
                                                                style={{ accentColor: 'var(--fam-primary-lt)' }}
                                                            />
                                                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--fam-text-2)', textTransform: 'capitalize' }}>{g}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="fam-field-label">First Name *</label>
                                        <input
                                            className="fam-input"
                                            type="text"
                                            value={data.guardian.firstName}
                                            onChange={(e) => updateGuardian('firstName', e.target.value)}
                                            placeholder="Jane"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label className="fam-field-label">Last Name *</label>
                                        <input
                                            className="fam-input"
                                            type="text"
                                            value={data.guardian.lastName}
                                            onChange={(e) => updateGuardian('lastName', e.target.value)}
                                            placeholder="Doe"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label className="fam-field-label">Email Address *</label>
                                        <input
                                            className="fam-input"
                                            type="email"
                                            value={data.guardian.email}
                                            onChange={(e) => updateGuardian('email', e.target.value)}
                                            placeholder="email@example.com"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label className="fam-field-label">Phone Number *</label>
                                        <input
                                            className="fam-input"
                                            type="tel"
                                            value={data.guardian.phoneNumber}
                                            onChange={(e) => updateGuardian('phoneNumber', e.target.value)}
                                            placeholder="+254 7XX XXX XXX"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label className="fam-field-label">Country</label>
                                        <select
                                            className="fam-input"
                                            value={data.guardian.country || 'Kenya'}
                                            onChange={(e) => updateGuardian('country', e.target.value)}
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Select country</option>
                                            <option value="Kenya">Kenya</option>
                                            <option disabled>──────────</option>
                                            <option value="Uganda">Uganda</option>
                                            <option value="Tanzania">Tanzania</option>
                                            <option value="United Kingdom">United Kingdom</option>
                                            <option value="United States">United States</option>
                                        </select>
                                    </div>
                                    {hasChildren && (
                                    <div>
                                        <label className="fam-field-label">Relationship *</label>
                                        <select
                                            className="fam-input"
                                            value={data.guardian.relationship}
                                            onChange={(e) => updateGuardian('relationship', e.target.value)}
                                            disabled={isSubmitting}
                                        >
                                            <option value="" disabled>Select relationship</option>
                                            <option value="parent">Parent</option>
                                            <option value="legal_guardian">Legal Guardian</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    )}
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label className="fam-field-label">Participating in the ride? *</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: 8 }}>
                                            {[
                                                { id: 'none', label: 'Not riding' },
                                                { id: 'mom', label: 'Joining the Ride (5km)' },
                                                { id: 'other', label: 'Riding other circuit' }
                                            ].map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => updateGuardian('participation', opt.id)}
                                                    style={{
                                                        padding: '14px',
                                                        background: data.guardian.participation === opt.id ? 'var(--fam-primary)' : 'var(--fam-input-bg)',
                                                        border: '1px solid',
                                                        borderColor: data.guardian.participation === opt.id ? 'var(--fam-primary)' : 'var(--fam-border)',
                                                        color: data.guardian.participation === opt.id ? '#fff' : 'var(--fam-text-2)',
                                                        fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', fontWeight: 700,
                                                        letterSpacing: '0.1em', textTransform: 'uppercase',
                                                        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
                                                        cursor: 'pointer', transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {data.guardian.participation !== 'none' && (
                                        <>
                                            <div>
                                                <label className="fam-field-label">ID / Passport *</label>
                                                <input
                                                    className="fam-input"
                                                    type="text"
                                                    value={data.guardian.idNumber}
                                                    onChange={(e) => updateGuardian('idNumber', e.target.value)}
                                                    placeholder="12345678"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <div>
                                                <label className="fam-field-label">Date of Birth *</label>
                                                <input
                                                    className="fam-input"
                                                    type="date"
                                                    value={data.guardian.dob || ''}
                                                    onChange={(e) => updateGuardian('dob', e.target.value)}
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <div>
                                                <label className="fam-field-label">Full Cycling Kit Size *</label>
                                                <select
                                                    className="fam-input"
                                                    value={data.guardian.tshirtSize}
                                                    onChange={(e) => updateGuardian('tshirtSize', e.target.value)}
                                                    disabled={isSubmitting}
                                                >
                                                    <option value="">Select Size</option>
                                                    <option value="S">Small (S)</option>
                                                    <option value="M">Medium (M)</option>
                                                    <option value="L">Large (L)</option>
                                                    <option value="XL">Extra Large (XL)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="fam-field-label">Gender *</label>
                                                <div style={{ display: 'flex', gap: '20px', height: '42px', alignItems: 'center' }}>
                                                    {['male', 'female'].map(g => (
                                                        <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                                            <input
                                                                type="radio"
                                                                name="guardian_gender_civilian"
                                                                checked={data.guardian.gender === g}
                                                                onChange={() => updateGuardian('gender', g)}
                                                                style={{ accentColor: 'var(--fam-primary-lt)' }}
                                                            />
                                                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--fam-text-2)', textTransform: 'capitalize' }}>{g}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bike Hiring Section */}
                <div style={{ marginTop: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--fam-border)', color: 'var(--fam-primary-lt)', clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/>
                            </svg>
                        </div>
                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--fam-text-2)' }}>Equipment & Hire</span>
                    </div>
                    <label style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12, padding: 24,
                        background: hireBike ? 'rgba(45,106,45,0.05)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${hireBike ? 'var(--fam-primary-lt)' : 'var(--fam-border)'}`,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
                    }}>
                        <input
                            type="checkbox"
                            checked={hireBike}
                            onChange={e => setHireBike(e.target.checked)}
                            disabled={isSubmitting}
                            style={{
                                marginTop: 4, width: 18, height: 18, cursor: 'pointer',
                                accentColor: 'var(--fam-primary-lt)',
                            }}
                        />
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.04em', color: 'var(--fam-text-1)' }}>
                                    Hire a Bike for the Event
                                </span>
                                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--fam-primary-lt)' }}>
                                    KES 1,500
                                </span>
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--fam-text-2)', marginTop: 4, lineHeight: 1.5 }}>
                                Get a standard mountain bike ready for you at the starting line. Recommended for participants who don't have their own equipment.
                            </div>
                        </div>
                    </label>
                </div>
            </div>
        </RegistrationStepLayout>
    );
};

export default FamilyRegistrationFlow;
