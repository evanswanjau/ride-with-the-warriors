import { MdCheck, MdMap, MdEmojiEvents } from 'react-icons/md';

interface CircuitCardProps {
    id: string;
    title: string;
    distance: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    isSelected: boolean;
    onSelect: (id: string) => void;
    isCompetitive?: boolean;
}

const CircuitCard = ({
    id,
    title,
    distance,
    subtitle,
    description,
    imageUrl,
    isSelected,
    onSelect,
    isCompetitive,
}: CircuitCardProps) => {
    return (
        <div
            onClick={() => onSelect(id)}
            className={`group relative flex flex-col h-full bg-white dark:bg-[#232623] rounded-3xl overflow-hidden shadow-none transition-all cursor-pointer transform ${isSelected
                ? 'ring-4 ring-primary -translate-y-1'
                : 'ring-2 ring-transparent hover:ring-primary/50'
                }`}
        >
            {isSelected && (
                <div className="absolute top-3 right-3 z-10 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                    <MdCheck size={20} className="font-bold" />
                </div>
            )}
            <div
                className="h-48 bg-cover bg-center relative"
                style={{
                    backgroundImage: `url("${imageUrl}")`
                }}
            >
                <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-white/90 dark:bg-black/80 text-gray-900 dark:text-gray-100 backdrop-blur-sm shadow-sm">
                        <MdMap size={18} className="mr-1" />
                        {distance}
                    </span>
                    {isCompetitive && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary text-white backdrop-blur-sm shadow-sm uppercase tracking-wider">
                            <MdEmojiEvents size={16} className="mr-1" />
                            Competitive
                        </span>
                    )}
                </div>
            </div>
            <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-[#1c170d] dark:text-white leading-tight">
                        {title}
                    </h3>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{subtitle}</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default CircuitCard;
