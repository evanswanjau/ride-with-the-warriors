import RegistrationTypeCard from './RegistrationTypeCard';
import militaryImg from '../assets/military.jpg';
import civilianImg from '../assets/civilian.jpg';

interface Step1ParticipationCategoryProps {
    selectedCategory: string;
    onSelect: (id: string) => void;
    onNext: () => void;
}

const Step1ParticipationCategory = ({
    selectedCategory,
    onSelect,
    onNext,
}: Step1ParticipationCategoryProps) => {
    const categories = [
        {
            id: 'military',
            title: 'Military',
            description: 'For active and veteran military personnel. Standard registration fees apply.',
            icon: 'military_tech',
            imageUrl: militaryImg,
        },
        {
            id: 'civilian',
            title: 'Civilian',
            description: 'Open to all civilian participants. Join the challenge alongside our heroes.',
            icon: 'person',
            imageUrl: civilianImg,
        },
    ];

    return (
        <div className="flex flex-col gap-8 md:px-0">
            <div className="flex flex-col gap-2">
                <h1 className="text-text-light dark:text-white tracking-tight text-[32px] md:text-4xl font-bold leading-tight">Select Category</h1>
                <p className="text-text-muted-light dark:text-gray-400 text-base font-normal leading-normal max-w-2xl">
                    Please choose your participation category to proceed.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category) => (
                    <RegistrationTypeCard
                        key={category.id}
                        {...category}
                        isSelected={selectedCategory === category.id}
                        onSelect={onSelect}
                    />
                ))}
            </div>

            <div className="mt-8 flex items-end justify-end pt-4 border-t border-[#e6e0d4] dark:border-[#1b4332]">
                <button
                    onClick={onNext}
                    disabled={!selectedCategory}
                    className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary-accent shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="mr-2">Continue</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

export default Step1ParticipationCategory;
