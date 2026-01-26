import CircuitCard from './CircuitCard';
import { CIRCUITS } from '../constants';
import blitzImage from '../assets/blitz.jpg';
import intermediateImage from '../assets/intermediate.jpg';
import corporateImage from '../assets/corporate.jpg';
import familyImage from '../assets/family.jpg';

const CIRCUIT_IMAGES: Record<string, string> = {
    blitz: blitzImage,
    intermediate: intermediateImage,
    corporate: corporateImage,
    family: familyImage,
};

interface Step2ChooseCircuitProps {
    selectedCircuit: string;
    onSelect: (id: string) => void;
    onNext: () => void;
    onBack: () => void;
}

const Step2ChooseCircuit = ({
    selectedCircuit,
    onSelect,
    onNext,
    onBack,
}: Step2ChooseCircuitProps) => {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-text-light dark:text-white tracking-tight text-[32px] md:text-4xl font-bold leading-tight">Choose Your Circuit</h1>
                Select a circuit to begin your registration.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CIRCUITS.map((circuit) => {
                    return (
                        <div key={circuit.id} className="relative flex">
                            <CircuitCard
                                id={circuit.id}
                                title={circuit.title}
                                distance={circuit.distance}
                                subtitle={circuit.subtitle}
                                description={circuit.description}
                                imageUrl={CIRCUIT_IMAGES[circuit.id] || circuit.imageUrl}
                                isSelected={selectedCircuit === circuit.id}
                                onSelect={onSelect}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-[#e6e0d4] dark:border-[#2d332d]">
                <button
                    onClick={onBack}
                    className="flex items-center justify-center h-12 px-6 rounded-lg text-gray-500 hover:text-[#1c170d] dark:text-gray-400 dark:hover:text-white font-bold transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined mr-2 text-sm">arrow_back</span>
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!selectedCircuit}
                    className={`flex min-w-[180px] items-center justify-center overflow-hidden rounded-lg h-12 px-8 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg transition-all ${selectedCircuit
                        ? 'bg-primary hover:bg-green-600 active:bg-green-700 shadow-green-500/20 cursor-pointer'
                        : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed shadow-none'
                        }`}
                >
                    <span className="truncate">Continue</span>
                    <span className="material-symbols-outlined ml-2 text-xl">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

export default Step2ChooseCircuit;
