import CircuitCard from "./CircuitCard";
import { CIRCUITS } from "../../constants";
import blitzImage from "../../assets/images/blitz.jpeg";
import intermediateImage from "../../assets/images/recon.jpeg";
import corporateImage from "../../assets/images/corporate.jpeg";
import familyImage from "../../assets/images/family.jpeg";
import { AiOutlineArrowRight } from "react-icons/ai";
import RegistrationStepLayout from "./ui/RegistrationStepLayout";
import { PrimaryButton } from "./ui/Buttons";

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
    return (
        <RegistrationStepLayout
            title="Choose Your Circuit"
            subtitle="Select the course that matches your pace and ambition."
            footer={(
                <>
                    <div />
                    <PrimaryButton
                        onClick={onNext}
                        disabled={!selectedCircuit}
                        className="min-w-[200px]"
                        type="button"
                    >
                        <span className="truncate">Continue to Registration</span>
                        <AiOutlineArrowRight className="ml-2 text-xl" />
                    </PrimaryButton>
                </>
            )}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mb-4">
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
        </RegistrationStepLayout>
    );
};

export default Step2ChooseCircuit;