import '../../styles/registration/Step2ChooseCircuit.css';
import CircuitCard from "./CircuitCard";
import { CIRCUITS } from "../../constants";
import blitzImage from "../../assets/images/blitz.jpeg";
import intermediateImage from "../../assets/images/recon.jpeg";
import corporateImage from "../../assets/images/corporate.jpeg";
import familyImage from "../../assets/images/family.jpeg";
import RegistrationStepLayout from "./ui/RegistrationStepLayout";

const CIRCUIT_IMAGES: Record<string, string> = {
    blitz: blitzImage,
    recon: intermediateImage,
    corporate: corporateImage,
    family: familyImage,
};

interface Step2ChooseCircuitProps {
    selectedCircuit: string;
    onSelect: (id: string) => void;
    onNext: () => void;
}

const Step2ChooseCircuit = ({ selectedCircuit, onSelect, onNext }: Step2ChooseCircuitProps) => {
    const selected = CIRCUITS.find(c => c.id === selectedCircuit);

    return (
        <RegistrationStepLayout
            stepLabel="Step 1 of 4"
            title="Choose Your Circuit"
            subtitle="Select the course that matches your pace and ambition."
            footer={(
                <>
                    {/* Selected circuit summary */}
                    <div className="s2-selected-summary">
                        {selected ? (
                            <>
                                <div className="s2-summary-dot" />
                                <span className="s2-summary-label">Selected:</span>
                                <span className="s2-summary-value">{selected.title}</span>
                                <span className="s2-summary-dist">{selected.distance}</span>
                            </>
                        ) : (
                            <span className="s2-summary-none">No circuit selected</span>
                        )}
                    </div>

                    {/* CTA button */}
                    <button
                        className={`s2-cta-btn${!selectedCircuit ? " s2-cta-disabled" : ""}`}
                        onClick={onNext}
                        disabled={!selectedCircuit}
                        type="button"
                    >
                        <span className="s2-cta-shimmer" />
                        <span>Continue to Registration</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </>
            )}
        >
            

            <div className="s2-wrapper">
                {/* ── Circuit grid ── */}
                <div className="s2-grid">
                    {CIRCUITS.map((circuit) => (
                        <CircuitCard
                            key={circuit.id}
                            id={circuit.id}
                            title={circuit.title}
                            distance={circuit.distance}
                            subtitle={circuit.subtitle}
                            description={circuit.description}
                            imageUrl={CIRCUIT_IMAGES[circuit.id] ?? circuit.imageUrl ?? ""}
                            isSelected={selectedCircuit === circuit.id}
                            onSelect={onSelect}
                            isCompetitive={circuit.isCompetitive}
                        />
                    ))}
                </div>
            </div>
        </RegistrationStepLayout>
    );
};

export default Step2ChooseCircuit;