
interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    stepTitle: string;
    onStepClick?: (step: number) => void;
}

const ProgressBar = ({ currentStep, totalSteps, stepTitle, onStepClick }: ProgressBarProps) => {
    const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    const labels = ["CIRCUIT", "TYPE", "DETAILS", "REVIEW"];

    return (
        <div className="flex flex-col gap-3 pb-8 w-full">
            <div className="flex gap-6 justify-between items-center">
                <p className="text-text-light dark:text-text-dark text-base font-bold uppercase tracking-wide">
                    {stepTitle}
                </p>
                <span className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium">
                    {Math.round(progressPercent)}% COMPLETE
                </span>
            </div>
            <div className="w-full h-2.5 bg-border-light dark:bg-border-dark rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>
            <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold uppercase tracking-wider pt-2 px-1">
                {labels.map((label, index) => {
                    const stepNum = index + 1;
                    const isActive = stepNum <= currentStep;
                    const isCurrent = stepNum === currentStep;

                    return (
                        <button
                            key={label}
                            onClick={() => onStepClick?.(stepNum)}
                            className={`flex flex-col items-center gap-1.5 transition-all ${isCurrent
                                ? "text-primary"
                                : isActive
                                    ? "text-text-light dark:text-text-dark hover:text-primary cursor-pointer"
                                    : "text-text-muted-light dark:text-text-muted-dark hover:text-primary cursor-pointer"
                                }`}
                            type="button"
                        >
                            <span className="sm:hidden text-[8px] opacity-70">STEP 0{stepNum}</span>
                            <span className={`${isCurrent ? "scale-110" : "scale-100"} transition-transform`}>{label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressBar;
