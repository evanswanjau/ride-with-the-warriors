import '../../../styles/registration/RegistrationStepLayout.css';
import type { ReactNode } from 'react';

/* ── Shared Constants for Inputs ───────────────────────────────────────── */
export const REG_TITLE_CLASSES =
    'rs-title';

export const REG_SUBTITLE_CLASSES =
    'rs-subtitle';

export const REG_FOOTER_CLASSES =
    'rs-footer';

export const REG_LABEL_CLASSES =
    'rs-label';

export const REG_INPUT_CLASSES =
    'rs-input';

export const REG_SELECT_CLASSES =
    'rs-input rs-select';

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

    return (
        <>
            

            <div className="rs-container" data-variant={variant}>
                <div className="rs-header-row">
                    <div className="flex flex-col">
                        {stepLabel && (
                            <div className="rs-step-pill">
                                <div className="rs-pill-line" />
                                <span className="rs-pill-text">{stepLabel}</span>
                            </div>
                        )}
                        <h1 className={REG_TITLE_CLASSES}>{title}</h1>
                        {subtitle && <p className={REG_SUBTITLE_CLASSES}>{subtitle}</p>}
                    </div>
                    {headerRight && <div className="flex items-center">{headerRight}</div>}
                </div>

                <div className="flex flex-col">
                    {children}
                </div>

                {footer && (
                    <div className={REG_FOOTER_CLASSES}>
                        {footer}
                    </div>
                )}
            </div>
        </>
    );
};

export default RegistrationStepLayout;

