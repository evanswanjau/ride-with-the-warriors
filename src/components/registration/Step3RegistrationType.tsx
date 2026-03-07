import RegistrationTypeCard from './RegistrationTypeCard';
import blitzIndividual from '../../assets/images/blitz-individual.jpeg';
import blitzTeam from '../../assets/images/blitz-team.jpeg';
import reconIndividual from '../../assets/images/recon-individual.jpeg';
import reconTeam from '../../assets/images/recon-team.jpeg';
import corporateIndividual from '../../assets/images/corporate-individual.jpeg';
import corporateTeam from '../../assets/images/corporate-team.jpeg';
import familyImage from '../../assets/images/family.jpeg';
import RegistrationStepLayout from './ui/RegistrationStepLayout';

/* ── Inline SVGs ──────────────────────────────────────────────────────── */
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
const ShieldIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

/* ── Image maps ───────────────────────────────────────────────────────── */
const INDIVIDUAL_IMAGES: Record<string, string> = {
    blitz: blitzIndividual,
    recon: reconIndividual,
    corporate: corporateIndividual,
    family: blitzIndividual,
};
const TEAM_IMAGES: Record<string, string> = {
    blitz: blitzTeam,
    recon: reconTeam,
    corporate: corporateTeam,
    family: blitzTeam,
};

/* ── Circuit display labels ───────────────────────────────────────────── */
const CIRCUIT_LABELS: Record<string, { name: string; distance: string; color: string; bg: string; border: string }> = {
    blitz: { name: 'Blitz Circuit', distance: '120 KM', color: '#f87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
    recon: { name: 'Recon Circuit', distance: '60 KM', color: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
    corporate: { name: 'Corporate Ride', distance: '30 KM', color: '#4caf50', bg: 'rgba(45,106,45,0.08)', border: 'rgba(45,106,45,0.25)' },
    family: { name: 'Family Fun Ride', distance: '5 KM', color: '#a5b4fc', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.25)' },
};

interface Step3RegistrationTypeProps {
    selectedCircuit: string;
    selectedType: string | null;
    onSelect: (id: string) => void;
    onNext: () => void;
    onBack: () => void;
}

const Step3RegistrationType = ({
    selectedCircuit,
    selectedType,
    onSelect,
    onNext,
    onBack,
}: Step3RegistrationTypeProps) => {
    const circuitInfo = CIRCUIT_LABELS[selectedCircuit];

    const types = [
        {
            id: 'individual',
            title: 'Individual Entry',
            subtitle: 'Solo Rider',
            description:
                selectedCircuit === 'family'
                    ? 'Adult parent (Tiger). Compete as an individual in the 5KM circuit.'
                    : selectedCircuit === 'corporate'
                        ? 'Represent your organisation in this individual 30KM challenge. Compete for company glory and showcase your corporate spirit.'
                        : 'Push your limits in this competitive solo entry. Compete for individual glory and a chance to win prize money based on your category.',
            imageUrl: INDIVIDUAL_IMAGES[selectedCircuit] ?? blitzIndividual,
        },
        {
            id: 'team',
            title: 'Team Entry',
            subtitle: 'Group Squad',
            description: 'Create or join a team. Compete for the group trophy and collective timing. Strength lies in numbers.',
            imageUrl: TEAM_IMAGES[selectedCircuit] ?? blitzTeam,
            rules:
                selectedCircuit === 'corporate'
                    ? [
                        'Min of 3 riders, max of 5 riders.',
                        'A 45-minute penalty if the team does not have a female rider.',
                    ]
                    : [
                        'Team must consist of 5 riders.',
                        'All teams must include at least one female rider.',
                        'A 60-minute time penalty will be applied for any rule violations.',
                    ],
        },
        {
            id: 'family',
            title: 'Family Group',
            subtitle: 'Fun & Fitness',
            description:
                'Register multiple children (Cubs & Champs) under one guardian. A fun ride for the little ones. Parents can also join as riders.',
            imageUrl: familyImage,
        },
    ];

    const visibleTypes = types.filter(t =>
        selectedCircuit === 'family'
            ? t.id === 'family'
            : t.id === 'individual' || t.id === 'team'
    );

    const selectedTypeMeta = selectedType ? visibleTypes.find(t => t.id === selectedType) : null;

    return (
        <RegistrationStepLayout
            stepLabel="Step 2 of 4"
            title="Registration Type"
            subtitle={`Choose how you want to participate in the ${selectedCircuit?.toUpperCase()} circuit.`}
            footer={(
                <>
                    {/* Back button */}
                    <button className="s3-back-btn" onClick={onBack} type="button">
                        <ArrowLeft />
                        <span>Back</span>
                    </button>

                    {/* Selected type summary */}
                    <div className="s3-summary">
                        {selectedTypeMeta ? (
                            <>
                                <div className="s3-summary-dot" />
                                <span className="s3-summary-label">Type:</span>
                                <span className="s3-summary-value">{selectedTypeMeta.title}</span>
                            </>
                        ) : (
                            <span className="s3-summary-none">No type selected</span>
                        )}
                    </div>

                    {/* Continue button */}
                    <button
                        className={`s3-cta-btn${!selectedType ? ' s3-cta-disabled' : ''}`}
                        onClick={onNext}
                        disabled={!selectedType}
                        type="button"
                    >
                        <span className="s3-cta-shimmer" />
                        <span>Continue</span>
                        <ArrowRight />
                    </button>
                </>
            )}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700;800&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');

                :root, [data-theme="dark"] {
                    --s3-text-1:     #ffffff;
                    --s3-text-2:     rgba(255,255,255,0.55);
                    --s3-text-3:     rgba(255,255,255,0.32);
                    --s3-border-1:   rgba(255,255,255,0.08);
                    --s3-border-2:   rgba(255,255,255,0.14);
                    --s3-primary:    #2d6a2d;
                    --s3-primary-lt: #4caf50;
                    --s3-accent:     #f59e0b;
                    --s3-raised-bg:  #111111;
                    --s3-pill-bg:    rgba(255,255,255,0.04);
                    --s3-btn-shadow: rgba(45,106,45,0.38);
                    --s3-back-color: rgba(255,255,255,0.55);
                    --s3-back-bd:    rgba(255,255,255,0.10);
                    --s3-back-hover: #ffffff;
                    --s3-none-color: rgba(255,255,255,0.28);
                }
                [data-theme="light"] {
                    --s3-text-1:     #111111;
                    --s3-text-2:     rgba(20,20,20,0.60);
                    --s3-text-3:     rgba(20,20,20,0.40);
                    --s3-border-1:   rgba(0,0,0,0.09);
                    --s3-border-2:   rgba(0,0,0,0.15);
                    --s3-primary:    #245924;
                    --s3-primary-lt: #2d6a2d;
                    --s3-accent:     #d97706;
                    --s3-raised-bg:  #ffffff;
                    --s3-pill-bg:    rgba(0,0,0,0.03);
                    --s3-btn-shadow: rgba(36,89,36,0.28);
                    --s3-back-color: rgba(20,20,20,0.50);
                    --s3-back-bd:    rgba(0,0,0,0.12);
                    --s3-back-hover: #111111;
                    --s3-none-color: rgba(20,20,20,0.30);
                }

                .s3-wrapper { font-family: 'Barlow', sans-serif; }

                /* ── Info strip ── */
                .s3-info-strip {
                    display: flex; flex-wrap: wrap; align-items: center;
                    gap: 8px; margin-bottom: 28px; padding: 0 2px;
                }
                .s3-pill {
                    display: inline-flex; align-items: center; gap: 7px;
                    padding: 6px 14px;
                    border: 1px solid var(--s3-border-1);
                    background: var(--s3-pill-bg);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 10px; font-weight: 700;
                    letter-spacing: 0.2em; text-transform: uppercase;
                    color: var(--s3-text-3);
                    clip-path: polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 0 100%);
                }
                .s3-pill-green {
                    color: var(--s3-primary-lt);
                    border-color: rgba(45,106,45,0.2);
                    background: rgba(45,106,45,0.06);
                }
                .s3-strip-divider { width: 1px; height: 20px; background: var(--s3-border-1); flex-shrink: 0; }

                /* ── Grid ── */
                .s3-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px; margin-bottom: 8px;
                }
                @media (max-width: 700px) { .s3-grid { grid-template-columns: 1fr; } }

                /* ── Circuit context banner ── */
                .s3-circuit-banner {
                    display: flex; align-items: center; gap: 14px;
                    padding: 14px 20px;
                    margin-bottom: 20px;
                    border: 1px solid var(--s3-border-1);
                    background: var(--s3-pill-bg);
                    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
                }
                .s3-banner-icon {
                    width: 28px; height: 28px; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    border: 1px solid var(--s3-border-2); color: var(--s3-primary-lt);
                    clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%);
                }
                .s3-banner-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 9px; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase;
                    color: var(--s3-text-3); margin-bottom: 2px;
                }
                .s3-banner-name {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.15rem; letter-spacing: 0.06em;
                    color: var(--s3-text-1); line-height: 1;
                }
                .s3-banner-dist {
                    margin-left: auto;
                    padding: 4px 12px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 11px; font-weight: 800;
                    letter-spacing: 0.16em; text-transform: uppercase;
                    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
                }

                /* ── Footer elements ── */
                .s3-back-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 12px 22px;
                    background: transparent;
                    color: var(--s3-back-color);
                    border: 1px solid var(--s3-back-bd);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.85rem; font-weight: 700;
                    letter-spacing: 0.14em; text-transform: uppercase;
                    cursor: pointer;
                    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
                    transition: color 0.2s, border-color 0.2s;
                }
                .s3-back-btn:hover { color: var(--s3-back-hover); border-color: var(--s3-border-2); }

                .s3-summary {
                    display: flex; align-items: center; gap: 8px;
                    font-family: 'Barlow Condensed', sans-serif;
                }
                .s3-summary-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: var(--s3-primary-lt); flex-shrink: 0;
                    animation: s3pulse 1.8s ease-in-out infinite;
                }
                @keyframes s3pulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.65)} }
                .s3-summary-label {
                    font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
                    color: var(--s3-text-3);
                }
                .s3-summary-value {
                    font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
                    color: var(--s3-text-1);
                }
                .s3-summary-none {
                    font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
                    color: var(--s3-none-color);
                }

                .s3-cta-btn {
                    position: relative;
                    display: inline-flex; align-items: center; gap: 10px;
                    padding: 13px 32px;
                    background: var(--s3-primary); color: #ffffff;
                    border: 2px solid var(--s3-primary);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.9rem; font-weight: 800;
                    letter-spacing: 0.14em; text-transform: uppercase;
                    cursor: pointer; overflow: hidden;
                    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
                    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s;
                    min-width: 160px; justify-content: center;
                }
                .s3-cta-btn:hover:not(.s3-cta-disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px var(--s3-btn-shadow);
                    background: var(--s3-primary-lt); border-color: var(--s3-primary-lt);
                }
                .s3-cta-btn:active:not(.s3-cta-disabled) { transform: translateY(0); }
                .s3-cta-disabled { opacity: 0.38; cursor: not-allowed; }
                .s3-cta-shimmer {
                    position: absolute; top: 0; left: -80%;
                    width: 60%; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.35) 50%, transparent 80%);
                    transform: skewX(-20deg); pointer-events: none;
                }
                .s3-cta-btn:hover:not(.s3-cta-disabled) .s3-cta-shimmer {
                    left: 140%;
                    transition: left 0.55s cubic-bezier(0.25,0.46,0.45,0.94);
                }
            `}</style>

            <div className="s3-wrapper">
                {/* ── Circuit context banner ── */}
                {circuitInfo && (
                    <div className="s3-circuit-banner">
                        <div className="s3-banner-icon">
                            <ShieldIcon />
                        </div>
                        <div>
                            <div className="s3-banner-label">Selected Circuit</div>
                            <div className="s3-banner-name">{circuitInfo.name}</div>
                        </div>
                        <div
                            className="s3-banner-dist"
                            style={{ background: circuitInfo.bg, border: `1px solid ${circuitInfo.border}`, color: circuitInfo.color }}
                        >
                            {circuitInfo.distance}
                        </div>
                    </div>
                )}

                {/* ── Type cards grid ── */}
                <div className="s3-grid">
                    {visibleTypes.map((type) => (
                        <div key={type.id} style={{ display: 'flex' }}>
                            <RegistrationTypeCard
                                {...type}
                                isSelected={selectedType === type.id}
                                onSelect={onSelect}
                            />
                        </div>
                    ))}
                </div>

            </div>
        </RegistrationStepLayout>
    );
};

export default Step3RegistrationType;