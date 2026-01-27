import RegistrationTypeCard from './RegistrationTypeCard';
import individualImage from '../assets/images/296A0066-27-min.jpeg';
import teamImage from '../assets/images/296A0184-33-min.jpeg';
import familyImage from '../assets/images/296A0224-41-min.jpeg';

interface Step3RegistrationTypeProps {
    selectedCircuit: string;
    selectedType: string;
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
    const types = [
        {
            id: 'individual',
            title: 'INDIVIDUAL',
            description: selectedCircuit === 'family'
                ? 'Adult Women (Tigers). Compete as an individual in the 5KM circuit.'
                : 'Solo entry. Push your limits and compete for individual placement and time trials for a chance to win.',
            imageUrl: individualImage,
        },
        {
            id: 'team',
            title: 'Team',
            description: 'Create or join a team (5 riders). Compete for the group trophy and collective timing.',
            imageUrl: teamImage,
            rules: [
                'Group must have a female rider.',
                '60 minutes deducted if the team does not meet the requirements. (warning)',
                'Min of 3 riders, max of 5 riders.',
                '60 minutes deducted for each missing rider.',
            ],
        },
        {
            id: 'family',
            title: 'Family Group',
            description: 'Register multiple children (Cubs & Champs) under one guardian. A fun ride for the little ones.',
            imageUrl: familyImage, // Reusing family image or import another one if available, using familyImage from imports (need to import it)
        }
    ];

    // Filter types based on circuit
    const visibleTypes = types.filter(type => {
        if (selectedCircuit === 'family') {
            return type.id === 'individual' || type.id === 'family';
        }
        return type.id === 'individual' || type.id === 'team';
    });

    return (
        <div className="flex flex-col gap-8 md:px-0">
            {/* Header section code... using same layout */}
            <div className="flex flex-col gap-2">
                <h1 className="text-text-light dark:text-white tracking-tight text-[32px] md:text-4xl font-bold leading-tight">Registration Type</h1>
                <p className="text-text-muted-light dark:text-gray-400 text-base font-normal leading-normal max-w-2xl">
                    Choose how you want to participate.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visibleTypes.map((type) => (
                    <RegistrationTypeCard
                        key={type.id}
                        {...type}
                        isSelected={selectedType === type.id}
                        onSelect={onSelect}
                    />
                ))}
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
                    disabled={!selectedType}
                    className={`flex min-w-[180px] items-center justify-center overflow-hidden rounded-lg h-12 px-8 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg transition-all ${selectedType
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

export default Step3RegistrationType;
