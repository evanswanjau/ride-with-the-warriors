import '../../styles/registration/Step5Review.css';
import { useState } from 'react';
import { CIRCUITS } from '../../constants';
import type { RiderDetails, TeamDetails, FamilyDetails } from '../../types';
import { getClassification, calculateAge, getContrastText } from '../../utils';
import blitzIndividual from '../../assets/images/blitz-individual.jpeg';
import blitzTeam from '../../assets/images/blitz-team.jpeg';
import reconIndividual from '../../assets/images/recon-individual.jpeg';
import reconTeam from '../../assets/images/recon-team.jpeg';
import corporateIndividual from '../../assets/images/corporate-individual.jpeg';
import corporateTeam from '../../assets/images/corporate-team.jpeg';
import familyImage from '../../assets/images/family.jpeg';
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
const EditIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const CalIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const PinIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
);
const UserIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);
const StarIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);
const LockIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);
const SpinnerIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'rv5spin 0.8s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);
const MapIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
    </svg>
);

/* ── Small reusable detail row ────────────────────────────────────────── */
const Detail = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--rv5-text-3)' }}>
            {label}
        </span>
        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13.5, fontWeight: 700, color: 'var(--rv5-text-1)', lineHeight: 1.4 }}>
            {value}
        </span>
    </div>
);

/* ── Section header strip ─────────────────────────────────────────────── */
const SectionHead = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 14, marginBottom: 18, borderBottom: '1px solid var(--rv5-divider)' }}>
        <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--rv5-border-2)', color: 'var(--rv5-primary-lt)', clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)' }}>{icon}</div>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--rv5-text-3)' }}>{label}</span>
    </div>
);

interface Step5ReviewProps {
    onBack: () => void;
    onSubmit: () => void;
    registrationType: string;
    selectedCircuitId: string;
    riderData: RiderDetails;
    teamData: TeamDetails;
    familyData: FamilyDetails;
    isSubmitting?: boolean;
    registrationId: string | null;
    pricingCategories: any[];
    serverClassifications?: any[];
}

const Step5Review = ({
    onBack, onSubmit,
    registrationType, selectedCircuitId,
    riderData, teamData, familyData,
    isSubmitting = false,
    registrationId,
    pricingCategories = [],
    serverClassifications = [],
}: Step5ReviewProps) => {
    const { isMilitary } = useRegistration();
    const [termsAgreed, setTermsAgreed] = useState(false);

    const circuit = CIRCUITS.find(c => c.id === selectedCircuitId) || CIRCUITS[0];

    const getReviewImage = () => {
        if (registrationType === 'family') return familyImage;
        if (registrationType === 'individual') {
            switch (selectedCircuitId) {
                case 'blitz': return blitzIndividual;
                case 'recon': return reconIndividual;
                case 'corporate': return corporateIndividual;
                default: return blitzIndividual;
            }
        }
        switch (selectedCircuitId) {
            case 'blitz': return blitzTeam;
            case 'recon': return reconTeam;
            case 'corporate': return corporateTeam;
            default: return blitzTeam;
        }
    };

    /* ── Pricing ── */
    let totalCost = 0;
    const lineItems: { label: string; amount: number; category?: string; regRange?: string; color?: string }[] = [];

    if (registrationType === 'individual') {
        const age = calculateAge(riderData.dob || '');
        const cls = serverClassifications?.length ? serverClassifications[0] : getClassification(pricingCategories, selectedCircuitId, 'individual', age);
        totalCost = isMilitary ? 0 : cls.price;
        lineItems.push({ label: `${riderData.firstName} ${riderData.lastName}${isMilitary ? ' (Military)' : ''}`, amount: totalCost, category: cls.category, regRange: registrationId ?? cls.regRange, color: cls.hexColor });
    } else if (registrationType === 'team') {
        const cls = serverClassifications?.length ? serverClassifications[0] : getClassification(pricingCategories, selectedCircuitId, 'team');
        totalCost = isMilitary ? 0 : cls.price;
        lineItems.push({ label: `${teamData.teamName}${isMilitary ? ' (Military Team)' : ''}`, amount: totalCost, category: cls.category, regRange: registrationId ?? cls.regRange, color: cls.hexColor });
    } else if (registrationType === 'family') {
        Object.entries(familyData.riders).forEach(([catId, riders]) => {
            if (!riders.length) return;
            const cls = serverClassifications?.find(c => (catId === 'cubs' && c.category === 'Cubs') || (catId === 'champs' && c.category === 'Champs') || (catId === 'tigers' && c.category === 'Parent'))
                ?? getClassification(pricingCategories, 'family', 'family', null, catId);
            
            let cost = riders.length * cls.price;
            if (catId === 'tigers' && isMilitary) {
                cost = Math.max(0, (riders.length - 1) * cls.price);
            }
            
            totalCost += cost;
            lineItems.push({ 
                label: `${cls.category} ×${riders.length}${catId === 'tigers' && isMilitary ? ' (Military Member Free)' : ''}`, 
                amount: cost, 
                category: cls.category, 
                regRange: registrationId ?? cls.regRange, 
                color: cls.hexColor 
            });
        });
    }

    const fmt = (n: number) => n.toLocaleString() + '/=';

    /* ── Registration details ── */
    const renderDetails = () => {
        if (registrationType === 'individual') {
            const age = calculateAge(riderData.dob || '');
            return (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
                    <Detail label="Full Name" value={`${riderData.firstName} ${riderData.lastName}`} />
                    <Detail label="Gender" value={<span style={{ textTransform: 'capitalize' }}>{riderData.gender}</span>} />
                    <Detail label="Email" value={riderData.email} />
                    <Detail label="Phone" value={riderData.phoneNumber} />
                    <Detail label={isMilitary ? "Service Number" : "ID / Passport"} value={riderData.idNumber} />
                    {isMilitary && (
                        <>
                            <Detail label="Rank" value={riderData.rank || '—'} />
                            <Detail label="Service" value={riderData.service || '—'} />
                            <Detail label="Unit / FMN" value={riderData.unit || '—'} />
                        </>
                    )}
                    <Detail label="Date of Birth" value={`${riderData.dob} · ${age} yrs`} />
                    <Detail label="T-Shirt Size" value={riderData.tshirtSize || '—'} />
                    <Detail label="Emergency Contact" value={`${riderData.emergencyContactName} · ${riderData.emergencyPhone}`} />
                </div>
            );
        }

        if (registrationType === 'team') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
                        <Detail label="Team Name" value={teamData.teamName} />
                        <Detail label="Team Size" value={`${teamData.members.length} Members`} />
                    </div>
                    <div>
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--rv5-text-3)', marginBottom: 10 }}>Team Roster</div>
                        <div style={{ border: '1px solid var(--rv5-border-1)', clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)', overflow: 'hidden' }}>
                            {teamData.members.map((member, idx) => (
                                <div key={member.id || idx} className="rv5-roster-row">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div className={`rv5-roster-avatar${member.isCaptain ? ' rv5-avatar-captain' : ''}`}>
                                            {member.isCaptain ? <StarIcon /> : <UserIcon />}
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--rv5-text-1)', lineHeight: 1.2 }}>{member.firstName} {member.lastName}</div>
                                            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: member.isCaptain ? 'var(--rv5-accent)' : 'var(--rv5-text-3)', marginTop: 1 }}>
                                                {member.isCaptain ? 'Captain' : 'Rider'}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--rv5-primary-lt)' }}>{member.tshirtSize}</span>
                                        <span style={{ width: 1, height: 16, background: 'var(--rv5-divider)', display: 'inline-block' }} />
                                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--rv5-text-2)' }}>
                                            {member.gender === 'male' ? 'M' : 'F'} · {calculateAge(member.dob)} yrs
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        if (registrationType === 'family') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
                        <Detail label="Guardian" value={`${familyData.guardian.firstName} ${familyData.guardian.lastName}`} />
                        <Detail label="Participation" value={familyData.guardian.participation === 'none' ? 'Not riding' : familyData.guardian.participation === 'mom' ? 'Parent (5km)' : 'Riding another circuit'} />
                        {isMilitary && (
                            <>
                                <Detail label="Service Number" value={familyData.guardian.idNumber} />
                                <Detail label="Rank" value={familyData.guardian.rank || '—'} />
                                <Detail label="Service" value={familyData.guardian.service || '—'} />
                                <Detail label="Unit / FMN" value={familyData.guardian.unit || '—'} />
                            </>
                        )}
                        {!isMilitary && <Detail label="ID / Passport" value={familyData.guardian.idNumber} />}
                        <Detail label="Email" value={familyData.guardian.email} />
                        <Detail label="Emergency" value={familyData.guardian.emergencyPhone} />
                    </div>
                    {Object.entries(familyData.riders).map(([category, riders]) => {
                        if (!riders.length) return null;
                        const cls = serverClassifications?.find(c => (category === 'cubs' && c.category === 'Cubs') || (category === 'champs' && c.category === 'Champs') || (category === 'tigers' && c.category === 'Parent'))
                            ?? getClassification(pricingCategories, 'family', 'family', null, category);
                        return (
                            <div key={category}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                    <span style={{ padding: '3px 10px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', background: cls.hexColor, color: getContrastText(cls.hexColor), clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)' }}>{cls.category}</span>
                                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--rv5-text-3)' }}>Reg: {cls.regRange}</span>
                                </div>
                                <div style={{ border: '1px solid var(--rv5-border-1)', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)', overflow: 'hidden' }}>
                                    {riders.map((rider, idx) => (
                                        <div key={rider.id || idx} className="rv5-roster-row">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div className="rv5-roster-avatar"><UserIcon /></div>
                                                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--rv5-text-1)' }}>{rider.firstName} {rider.lastName}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, color: 'var(--rv5-primary-lt)' }}>{rider.tshirtSize}</span>
                                                <span style={{ width: 1, height: 16, background: 'var(--rv5-divider)', display: 'inline-block' }} />
                                                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--rv5-text-2)' }}>
                                                    {rider.gender || '—'} · {calculateAge(rider.dob)} yrs
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }
    };

    const age = registrationType === 'individual' ? calculateAge(riderData.dob || '') : null;
    const classification = serverClassifications?.length
        ? serverClassifications[0]
        : getClassification(pricingCategories, selectedCircuitId, registrationType, age);
    return (
        <RegistrationStepLayout
            stepLabel="Step 4 of 4"
            title="Review Your Registration"
            subtitle="Verify all information is correct before proceeding to payment."
        >
            

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

                {/* ── Left: main card ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Circuit hero card */}
                    <div className="rv5-card">
                        <div className="rv5-img-wrap">
                            <img src={getReviewImage()} alt={circuit.title} />
                            <div className="rv5-img-overlay" />

                            {/* Edit button */}
                            <button className="rv5-edit-btn" onClick={onBack} type="button">
                                <EditIcon /> Refine Choice
                            </button>

                            {/* Bottom badges */}
                            <div style={{ position: 'absolute', bottom: 14, left: 14, display: 'flex', gap: 8, zIndex: 3 }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100)', color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                    <MapIcon /> {circuit.distance}
                                </div>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'rgba(45,106,45,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(76,175,80,0.45)', clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)', color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4caf50', animation: 'rv5pulse 1.8s ease-in-out infinite' }} />
                                    Confirmed
                                </div>
                            </div>
                        </div>

                        {/* Circuit title */}
                        <div style={{ padding: '20px 24px 0' }}>
                            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--rv5-primary-lt)', marginBottom: 4 }}>Official Entry</div>
                            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '0.04em', lineHeight: 0.95, color: 'var(--rv5-text-1)' }}>{circuit.title}</div>
                        </div>

                        {/* Meta cells */}
                        <div className="rv5-meta-row" style={{ marginTop: 16 }}>
                            <div className="rv5-meta-cell">
                                <div className="rv5-meta-icon"><CalIcon /></div>
                                <div>
                                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--rv5-text-3)', marginBottom: 2 }}>Event Date</div>
                                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--rv5-text-1)' }}>{circuit.date}</div>
                                </div>
                            </div>
                            <div className="rv5-meta-cell">
                                <div className="rv5-meta-icon"><PinIcon /></div>
                                <div>
                                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--rv5-text-3)', marginBottom: 2 }}>Location</div>
                                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--rv5-text-1)' }}>{circuit.location}</div>
                                </div>
                            </div>
                        </div>

                        {/* Classification band */}
                        {(registrationType === 'individual' || registrationType === 'team') && (
                            <div className="rv5-cls-band" style={{ margin: '0 0 0', background: classification.hexColor || 'var(--rv5-primary)' }}>
                                <div>
                                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: getContrastText(classification.hexColor), opacity: 0.7, marginBottom: 2 }}>Category</div>
                                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '0.06em', color: getContrastText(classification.hexColor), lineHeight: 1 }}>{classification.category}</div>
                                </div>
                                <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: getContrastText(classification.hexColor), opacity: 0.7, marginBottom: 2 }}>Bib / Registration</div>
                                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '0.06em', color: getContrastText(classification.hexColor), lineHeight: 1 }}>{registrationId ?? classification.regRange}</div>
                                </div>
                            </div>
                        )}

                        {registrationType === 'family' && (
                            <div style={{ margin: 0, padding: '12px 24px', background: 'var(--rv5-raised-bg)', borderTop: '1px solid var(--rv5-divider)' }}>
                                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--rv5-text-3)' }}>Family Unit — </span>
                                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--rv5-primary-lt)' }}>{Object.values(familyData.riders).flat().length} Riders Registered</span>
                            </div>
                        )}
                    </div>

                    {/* Personnel details card */}
                    <div className="rv5-card" style={{ padding: '24px 24px' }}>
                        <SectionHead icon={<UserIcon />} label="Full Personnel Details" />
                        {renderDetails()}
                    </div>
                </div>

                {/* ── Right: order summary + actions ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 24 }}>

                    {/* Order summary */}
                    <div className="rv5-sidebar-card">
                        <div className="rv5-sidebar-head">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ height: 1, width: 28, background: 'var(--rv5-primary)', flexShrink: 0 }} />
                                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--rv5-text-3)' }}>Order Summary</span>
                            </div>
                        </div>
                        <div style={{ padding: '16px 20px' }}>
                            {lineItems.map((item, i) => (
                                <div key={i} className="rv5-line-item">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--rv5-text-1)', lineHeight: 1.3 }}>{item.label}</span>
                                            {item.category && (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                                    {item.color && <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.color, display: 'inline-block', flexShrink: 0 }} />}
                                                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--rv5-text-3)' }}>{item.category}</span>
                                                </span>
                                            )}
                                            {item.regRange && (
                                                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--rv5-text-3)' }}>Reg: {item.regRange}</span>
                                            )}
                                        </div>
                                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 800, color: 'var(--rv5-text-1)', whiteSpace: 'nowrap' }}>{fmt(item.amount)}</span>
                                    </div>
                                </div>
                            ))}
                            <div style={{ paddingTop: 14, marginTop: 4, borderTop: '1px solid var(--rv5-divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--rv5-text-3)' }}>Total</span>
                                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.04em', color: 'var(--rv5-primary-lt)', lineHeight: 1 }}>{fmt(totalCost)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Terms checkbox */}
                    <div
                        className={`rv5-checkbox-wrap${termsAgreed ? ' rv5-checked' : ''}`}
                        onClick={() => setTermsAgreed(v => !v)}
                    >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                            <div className={`rv5-checkbox-box${termsAgreed ? ' rv5-box-checked' : ''}`}>
                                {termsAgreed && (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>
                            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'var(--rv5-text-2)', lineHeight: 1.6 }}>
                                I agree to the{' '}
                                <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: 'var(--rv5-primary-lt)', fontWeight: 700, textDecoration: 'none' }}>Terms & Conditions</a>
                                {' '}and{' '}
                                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: 'var(--rv5-primary-lt)', fontWeight: 700, textDecoration: 'none' }}>Privacy Policy</a>.
                            </span>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--rs-divider)' }}>
                        <button type="button" className="rv5-cta-btn" onClick={onSubmit} disabled={isSubmitting || !termsAgreed}>
                            <span className="rv5-cta-shimmer" />
                            {isSubmitting ? (
                                <><SpinnerIcon /><span>Processing…</span></>
                            ) : (
                                <>
                                    <span>{totalCost === 0 ? 'Complete Registration' : 'Proceed to Payment'}</span>
                                    <ArrowRight />
                                </>
                            )}
                        </button>

                        <button type="button" className="rv5-back-btn" onClick={onBack}>
                            <ArrowLeft /> Back
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, color: 'var(--rv5-text-3)' }}>
                            <LockIcon />
                            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Secured by SSL Encryption</span>
                        </div>
                    </div>
                </div>
            </div>
        </RegistrationStepLayout>
    );
};

export default Step5Review;