import RegistrationTypeCard from './RegistrationTypeCard';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import blitzIndividual from '../../assets/images/blitz-individual.jpeg';
import blitzTeam from '../../assets/images/blitz-team.jpeg';
import reconIndividual from '../../assets/images/recon-individual.jpeg';
import reconTeam from '../../assets/images/recon-team.jpeg';
import corporateIndividual from '../../assets/images/corporate-individual.jpeg';
import corporateTeam from '../../assets/images/corporate-team.jpeg';
import familyImage from '../../assets/images/family.jpeg';
import RegistrationStepLayout from './ui/RegistrationStepLayout';
import { PrimaryButton, SecondaryButton } from './ui/Buttons';

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
        <RegistrationStepLayout
            title="Registration Type"
            subtitle={`Choose how you want to participate in the ${selectedCircuit?.toUpperCase()} circuit.`}
            footer={(
                <>
                    <SecondaryButton onClick={onBack} type="button" className="min-w-[120px]">
                        <AiOutlineArrowLeft className="mr-2 text-xl" />
                        Back
                    </SecondaryButton>
                    <PrimaryButton
                        onClick={onNext}
                        disabled={!selectedType}
                        type="button"
                        className="min-w-[180px]"
                    >
                        <span className="truncate">Continue</span>
                        <AiOutlineArrowRight className="ml-2 text-xl" />
                    </PrimaryButton>
                </>
            )}
        >
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
        </RegistrationStepLayout>
    );
};

export default Step3RegistrationType;
