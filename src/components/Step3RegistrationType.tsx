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
            title: 'INDIVIDUAL',
            description: selectedCircuit === 'family'
                ? 'Adult parent (Tiger). Compete as an individual in the 5KM circuit.'
                : selectedCircuit === 'corporate'
                    ? 'Represent your organization in this individual 30KM challenge. Compete for company glory and showcase your corporate spirit.'
                    : 'Push your limits and develop your skills in this competitive solo entry. Compete for individual glory and a chance to win prize money based on your category.',
            imageUrl: getIndividualImage(),
        },
        {
            id: 'team',
            title: 'TEAM',
            description: 'Create or join a team. Compete for the group trophy and collective timing.',
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
                    <AiOutlineArrowLeft className="mr-2 text-sm" />
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
                    <AiOutlineArrowRight className="ml-2 text-xl" />
                </button>
            </div>
        </div>
    );
};

export default Step3RegistrationType;
