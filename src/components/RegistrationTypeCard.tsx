interface RegistrationTypeCardProps {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    isSelected: boolean;
    onSelect: (id: string) => void;
    rules?: string[];
}

const RegistrationTypeCard = ({
    id,
    title,
    description,
    imageUrl,
    isSelected,
    onSelect,
    rules,
}: RegistrationTypeCardProps) => {
    return (
        <div
            onClick={() => onSelect(id)}
            className={`group relative flex flex-col bg-white dark:bg-[#232623] rounded-3xl overflow-hidden shadow-none transition-all cursor-pointer transform ${isSelected
                ? 'ring-4 ring-primary -translate-y-1'
                : 'ring-2 ring-transparent hover:ring-primary/50'
                }`}
        >
            {isSelected && (
                <div className="absolute top-3 right-3 z-10 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-[20px] font-bold">check</span>
                </div>
            )}
            <div
                className="h-48 bg-cover bg-center relative"
                style={{
                    backgroundImage: `url("${imageUrl}")`
                }}
            >
            </div>
            <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-[#1c170d] dark:text-white leading-tight">
                                {title}
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                {rules && rules.length > 0 && (
                    <div className="bg-primary/5 dark:bg-primary/10 p-3 rounded-lg mt-1">
                        <ul className="text-[12px] leading-relaxed text-gray-700 dark:text-[#d8f3dc] space-y-1 font-medium list-disc pl-4">
                            {rules.map((rule, index) => (
                                <li key={index}>
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegistrationTypeCard;
