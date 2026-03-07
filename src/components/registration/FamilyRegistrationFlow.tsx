import { useState } from 'react';
import type { FamilyDetails, JuniorRider } from '../../types';
import ErrorBanner from '../common/ErrorBanner';
import { calculateAge } from '../../utils';


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
            subtitle="Register your little champions for their specific age groups. Strength lies in numbers."
            headerRight={
                <button
                    onClick={() => {
                        onChange({
                            guardian: {
                                firstName: 'Jane',
                                lastName: 'Doe',
                                fullName: 'Jane Doe',
                                dob: '1985-06-20',
                                email: `jane.doe.${Math.floor(Math.random() * 1000)}@example.com`,
                                phoneNumber: '0712345678',
                                idNumber: '12345678',
                                gender: 'female',
                                participation: 'mom',
                                tshirtSize: 'M',
                                relationship: 'Mother',
                                emergencyPhone: '0788990011',
                                emergencyContactName: 'John Doe'
                            },
                            riders: {
                                cubs: [{
                                    id: Math.random().toString(36).substr(2, 9),
                                    firstName: 'Leo',
                                    lastName: 'Doe',
                                    dob: '2020-01-01',
                                    gender: 'male',
                                    tshirtSize: 'S',
                                    idNumber: '',
                                    emergencyContactName: '',
                                    emergencyPhone: ''
                                }],
                                champs: [{
                                    id: Math.random().toString(36).substr(2, 9),
                                    firstName: 'Maya',
                                    lastName: 'Doe',
                                    dob: '2015-01-01',
                                    gender: 'female',
                                    tshirtSize: 'L',
                                    idNumber: '',
                                    emergencyContactName: '',
                                    emergencyPhone: ''
                                }],
                                tigers: [
                                    {
                                        id: 'mom-rider-id',
                                        firstName: 'Jane',
                                        lastName: 'Doe',
                                        dob: '1985-06-20',
                                        idNumber: '12345678',
                                        gender: 'female',
                                        tshirtSize: 'M',
                                        emergencyContactName: '',
                                        emergencyPhone: '0712345678'
                                    }
                                ]
                            }
                        });
                    }}
                    style={{
                        padding: '6px 12px',
                        background: 'rgba(76,175,80,0.1)',
                        border: '1px solid rgba(76,175,80,0.2)',
                        color: '#4caf50',
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)',
                        cursor: 'pointer'
                    }}
                    type="button"
                >
                    Quick Test Data
                </button>
            }
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
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700;800&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');

                :root, [data-theme="dark"] {
                    --fam-border:     rgba(255,255,255,0.08);
                    --fam-input-bg:   #0d0d0d;
                    --fam-raised-bg:  #111111;
                    --fam-text-1:     #ffffff;
                    --fam-text-2:     rgba(255,255,255,0.60);
                    --fam-text-3:     rgba(255,255,255,0.35);
                    --fam-primary:    #2d6a2d;
                    --fam-primary-lt: #4caf50;
                    --fam-accent:     #f59e0b;
                    --fam-divider:    rgba(255,255,255,0.07);
                    --fam-card-bg:    #0d0d0d;
                }
                [data-theme="light"] {
                    --fam-border:     rgba(0,0,0,0.09);
                    --fam-input-bg:   #ffffff;
                    --fam-raised-bg:  #f8f8f8;
                    --fam-text-1:     #111111;
                    --fam-text-2:     rgba(20,20,20,0.60);
                    --fam-text-3:     rgba(20,20,20,0.42);
                    --fam-primary:    #245924;
                    --fam-primary-lt: #2d6a2d;
                    --fam-accent:     #d97706;
                    --fam-divider:    rgba(0,0,0,0.07);
                    --fam-card-bg:    #ffffff;
                }



                .fam-tabs { display: flex; gap: 8px; border-bottom: 1px solid var(--fam-divider); margin-bottom: 8px; }
                .fam-tab {
                    flex: 1; padding: 12px;
                    background: transparent; border: none; border-bottom: 2px solid transparent;
                    font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700;
                    color: var(--fam-text-3); text-transform: uppercase; letter-spacing: 0.15em;
                    cursor: pointer; transition: all 0.2s;
                }
                .fam-tab.active { color: var(--fam-primary-lt); border-bottom-color: var(--fam-primary-lt); }

                .fam-rider-card {
                    background: var(--fam-card-bg); border: 1px solid var(--fam-border);
                    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%);
                    margin-bottom: 20px;
                }
                .fam-card-head {
                    padding: 14px 20px; background: var(--fam-raised-bg); border-bottom: 1px solid var(--fam-divider);
                    display: flex; justify-content: space-between; align-items: center;
                }
                .fam-field-label {
                    display: block; font-family: 'Barlow Condensed', sans-serif; font-size: 9px; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase; color: var(--fam-text-3); margin-bottom: 6px;
                }
                .fam-input {
                    width: 100%; padding: 10px 14px; background: var(--fam-input-bg);
                    border: 1px solid var(--fam-border); color: var(--fam-text-1);
                    font-size: 14px; font-weight: 600; outline: none; transition: border-color 0.2s;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
                }
                .fam-input:focus { border-color: var(--fam-primary-lt); }

                .fam-add-btn {
                    width: 100%; padding: 20px; border: 2px dashed var(--fam-border); background: transparent;
                    color: var(--fam-text-3); font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 0.2em; cursor: pointer; transition: all 0.2s;
                    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                }
                .fam-add-btn:hover { border-color: var(--fam-primary-lt); color: var(--fam-primary-lt); background: rgba(76,175,80,0.02); }

                .fam-delete-btn {
                    display: flex; align-items: center; gap: 6px; padding: 5px 12px;
                    background: rgba(239,68,68,0.1); color: #ef4444; border: none;
                    font-family: 'Barlow Condensed', sans-serif; font-size: 9px; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer;
                    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
                }

                .fam-next-btn {
                    position: relative; overflow: hidden;
                    display: inline-flex; align-items: center; gap: 10px; padding: 13px 32px;
                    background: var(--fam-primary); color: #fff; border: 2px solid var(--fam-primary);
                    font-family: 'Barlow Condensed', sans-serif; font-size: 0.95rem; font-weight: 800;
                    letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer;
                    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
                    transition: all 0.2s;
                }
                .fam-next-btn:hover { background: var(--fam-primary-lt); border-color: var(--fam-primary-lt); transform: translateY(-2px); }

                .fam-back-btn {
                    display: inline-flex; align-items: center; gap: 8px; padding: 11px 24px;
                    background: transparent; color: var(--fam-text-3); border: 1px solid var(--fam-border);
                    font-family: 'Barlow Condensed', sans-serif; font-size: 0.85rem; font-weight: 700;
                    letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer;
                    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
                    transition: all 0.2s;
                }
                .fam-back-btn:hover { color: var(--fam-text-1); border-color: var(--fam-text-2); }
            `}</style>

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
                                    <label className="fam-field-label">T-Shirt Size *</label>
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
                                <div>
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
                        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', color: 'var(--fam-text-1)', letterSpacing: '0.04em', margin: 0 }}>Guardian Details</h3>
                    </div>

                    <div style={{ background: 'var(--fam-raised-bg)', padding: '32px', border: '1px solid var(--fam-border)', clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
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
                            <div style={{ gridColumn: '1 / -1' }}>
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

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="fam-field-label">Participating in the ride? *</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: 8 }}>
                                    {[
                                        { id: 'none', label: 'Not riding' },
                                        { id: 'mom', label: 'Riding as Parent (5km)' },
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
                                            value={data.guardian.dob}
                                            onChange={(e) => updateGuardian('dob', e.target.value)}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label className="fam-field-label">T-Shirt Size *</label>
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
                                                        name="guardian_gender"
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
                        </div>
                    </div>
                </div>
            </div>
        </RegistrationStepLayout>
    );
};

export default FamilyRegistrationFlow;
