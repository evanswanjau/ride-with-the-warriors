import type { ReactNode } from 'react';

export const REG_TITLE_CLASSES =
    'text-text-light dark:text-white tracking-tight text-[32px] md:text-4xl font-bold leading-tight';

export const REG_SUBTITLE_CLASSES =
    'text-text-muted-light dark:text-gray-400 text-base font-normal leading-normal max-w-2xl';

export const REG_FOOTER_CLASSES =
    'flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-[#e6e0d4] dark:border-[#2d332d]';

export const REG_LABEL_CLASSES =
    'text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider';

export const REG_INPUT_CLASSES =
    'w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400';

export const REG_SELECT_CLASSES =
    'w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all appearance-none cursor-pointer';

interface RegistrationStepLayoutProps {
    stepLabel?: string;
    title: string;
    subtitle?: string;
    headerRight?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    variant?: 'form' | 'cards';
}

const RegistrationStepLayout = ({
    stepLabel,
    title,
    subtitle,
    headerRight,
    children,
    footer,
    variant = 'form',
}: RegistrationStepLayoutProps) => {
    const containerClasses =
        'layout-content-container flex flex-col flex-1 w-full gap-8';

    return (
        <div className={containerClasses} data-variant={variant}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    {stepLabel && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-[0.18em] uppercase">
                            {stepLabel}
                        </span>
                    )}
                    <h1 className={REG_TITLE_CLASSES}>{title}</h1>
                    {subtitle && <p className={REG_SUBTITLE_CLASSES}>{subtitle}</p>}
                </div>
                {headerRight && <div className="flex items-center">{headerRight}</div>}
            </div>

            <div className="flex flex-col gap-8">
                {children}
            </div>

            {footer && (
                <div className={REG_FOOTER_CLASSES}>
                    {footer}
                </div>
            )}
        </div>
    );
};

export default RegistrationStepLayout;

