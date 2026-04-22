import '../../styles/registration/Step3RegistrationType.css';
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

    const visibleTypes = types.filter(t => {
        if (selectedCircuit === 'family') return t.id === 'family';
        return t.id === 'individual' || t.id === 'team';
    });

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