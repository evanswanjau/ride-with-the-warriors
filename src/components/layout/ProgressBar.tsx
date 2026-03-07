
interface ProgressBarProps {
    currentStep: number;
    stepTitle: string;
    labels?: string[];
    onStepClick?: (step: number) => void;
}

const ProgressBar = ({ currentStep, stepTitle, labels = ["CIRCUIT", "TYPE", "DETAILS", "REVIEW"], onStepClick }: ProgressBarProps) => {
    const progressPercent = ((currentStep - 1) / (labels.length - 1)) * 100;

    return (
        <div className="flex flex-col gap-3 pb-8 w-full" style={{ fontFamily: "'Barlow', sans-serif" }}>
            <div className="flex gap-6 justify-between items-end">
                <p className="text-text-muted-light dark:text-text-muted-dark text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    {stepTitle}
                </p>
                <span className="text-text-muted-light dark:text-text-muted-dark text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {Math.round(progressPercent)}% COMPLETE
                </span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-1.5 bg-border-light dark:bg-border-dark overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-700 ease-out"
                    style={{
                        width: `${progressPercent}%`,
                        boxShadow: '0 0 10px rgba(45, 106, 45, 0.3)'
                    }}
                ></div>
            </div>

            <div className="flex justify-between items-center pt-2 px-1">
                {labels.map((label, index) => {
                    const stepNum = index + 1;
                    const isActive = stepNum <= currentStep;
                    const isCurrent = stepNum === currentStep;

                    return (
                        <button
                            key={label}
                            onClick={() => onStepClick?.(stepNum)}
                            className={`flex flex-col items-center gap-1 transition-all ${isCurrent
                                ? "text-primary opacity-100"
                                : isActive
                                    ? "text-text-light dark:text-text-dark hover:text-primary cursor-pointer opacity-80"
                                    : "text-text-muted-light dark:text-text-muted-dark hover:text-primary cursor-pointer opacity-50"
                                }`}
                            type="button"
                            style={{
                                fontFamily: "'Barlow Condensed', sans-serif",
                                minWidth: '60px'
                            }}
                        >
                            <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${isCurrent ? "scale-105" : "scale-100"} transition-transform`}>
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressBar;
