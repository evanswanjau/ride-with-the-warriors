
interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    stepTitle: string;
    onStepClick?: (step: number) => void;
}

const ProgressBar = ({ currentStep, totalSteps, stepTitle, onStepClick }: ProgressBarProps) => {
    const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    const labels = ["Circuit", "Type", "Details", "Review"];

    return (
        <div className="flex flex-col gap-3 pb-8 w-full">
            <div className="flex gap-6 justify-between items-center">
                <p className="text-text-light dark:text-text-dark text-base font-bold uppercase tracking-wide">
                    {stepTitle}
                </p>
                <span className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium">
                    {Math.round(progressPercent)}% Complete
                </span>
            </div>
            <div className="w-full h-2.5 bg-border-light dark:bg-border-dark rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark pt-1 hidden sm:flex">
                {labels.map((label, index) => {
                    const stepNum = index + 1;
                    const isActive = stepNum <= currentStep;
                    const isCurrent = stepNum === currentStep;

                    return (
                        <button
                            key={label}
                            onClick={() => onStepClick?.(stepNum)}
                            className={`transition-colors ${isCurrent ? "text-primary font-bold" : isActive ? "text-text-light dark:text-text-dark hover:text-primary cursor-pointer" : "hover:text-primary cursor-pointer"}`}
                            type="button"
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressBar;
