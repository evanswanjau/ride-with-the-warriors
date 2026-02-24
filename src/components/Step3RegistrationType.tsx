import RegistrationTypeCard from './RegistrationTypeCard';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import blitzIndividual from '../assets/images/blitz-individual.jpeg';
import blitzTeam from '../assets/images/blitz-team.jpeg';
import reconIndividual from '../assets/images/recon-individual.jpeg';
import reconTeam from '../assets/images/recon-team.jpeg';
import corporateIndividual from '../assets/images/corporate-individual.jpeg';
import corporateTeam from '../assets/images/corporate-team.jpeg';
import familyImage from '../assets/images/family.jpeg';

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

    const getIndividualImage = () => {
        switch (selectedCircuit) {
            case 'blitz': return blitzIndividual;
            case 'recon': return reconIndividual;
            case 'corporate': return corporateIndividual;
            default: return blitzIndividual;
        }
    };

    const getTeamImage = () => {
        switch (selectedCircuit) {
            case 'blitz': return blitzTeam;
            case 'recon': return reconTeam;
            case 'corporate': return corporateTeam;
            default: return blitzTeam;
        }
    };

    const types = [
        {
            id: 'individual',
            title: 'Individual Entry',
            subtitle: 'Solo Rider',
            description: selectedCircuit === 'family'
                ? 'Adult parent (Tiger). Compete as an individual in the 5KM circuit.'
                : selectedCircuit === 'corporate'
                    ? 'Represent your organization in this individual 30KM challenge. Compete for company glory and showcase your corporate spirit.'
                    : 'Push your limits and develop your skills in this competitive solo entry. Compete for individual glory and a chance to win prize money based on your category.',
            imageUrl: getIndividualImage(),
        },
        {
            id: 'team',
            title: 'Team Entry',
            subtitle: 'Group Squad',
            description: 'Create or join a team. Compete for the group trophy and collective timing. Strength lies in numbers.',
            imageUrl: getTeamImage(),
            rules: selectedCircuit === 'corporate'
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
            description: 'Register multiple children (Cubs & Champs) under one guardian. A fun ride for the little ones. Parents can also join as riders.',
            imageUrl: familyImage,
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
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 style={{
                    fontSize: "clamp(28px, 5vw, 42px)",
                    fontWeight: 900,
                    color: "#111",
                    lineHeight: 1.1,
                    margin: "0 0 10px",
                    letterSpacing: "-0.02em",
                }}>Registration Type</h1>
                <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.65, margin: 0, flex: 1 }}>Choose how you want to participate in the {selectedCircuit?.toUpperCase()} circuit.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visibleTypes.map((type) => (
                    <div key={type.id} className="relative flex">
                        <RegistrationTypeCard
                            {...type}
                            isSelected={selectedType === type.id}
                            onSelect={onSelect}
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center gap-4 mt-8 pt-6 border-t border-[#e6e0d4] dark:border-[#2d332d]">
                <button
                    onClick={onBack}
                    className="flex min-w-[120px] items-center justify-center rounded-lg h-12 px-6 text-gray-600 border border-gray-300 hover:bg-gray-50 transition-all font-bold"
                >
                    <AiOutlineArrowLeft className="mr-2 text-xl" />
                    Back
                </button>

                <button
                    onClick={onNext}
                    disabled={!selectedType}
                    className={`flex min-w-[180px] items-center justify-center overflow-hidden rounded-lg h-12 px-8 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg transition-all ${selectedType
                        ? 'bg-primary hover:bg-primary-dark active:bg-primary/80 shadow-primary/20 cursor-pointer'
                        : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed shadow-none'
                        }`}
                >
                    <span className="truncate">Continue</span>
                    <AiOutlineArrowRight className="ml-2 text-xl" />
                </button>
            </div>
        </div>
    );
};

export default Step3RegistrationType;
