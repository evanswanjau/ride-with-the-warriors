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
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700;800&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');

                :root, [data-theme="dark"] {
                    --rs-text-1:      #ffffff;
                    --rs-text-2:      rgba(255,255,255,0.60);
                    --rs-text-3:      rgba(255,255,255,0.35);
                    --rs-primary:     #2d6a2d;
                    --rs-primary-lt:  #4caf50;
                    --rs-accent:      #f59e0b;
                    --rs-border-1:    rgba(255,255,255,0.08);
                    --rs-border-2:    rgba(255,255,255,0.14);
                    --rs-input-bg:    #0d0d0d;
                    --rs-input-hv:    rgba(255,255,255,0.03);
                    --rs-divider:     rgba(255,255,255,0.07);
                }
                [data-theme="light"] {
                    --rs-text-1:      #111111;
                    --rs-text-2:      rgba(20,20,20,0.60);
                    --rs-text-3:      rgba(20,20,20,0.42);
                    --rs-primary:     #245924;
                    --rs-primary-lt:  #2d6a2d;
                    --rs-accent:      #d97706;
                    --rs-border-1:    rgba(0,0,0,0.09);
                    --rs-border-2:    rgba(0,0,0,0.15);
                    --rs-input-bg:    #ffffff;
                    --rs-input-hv:    rgba(0,0,0,0.02);
                    --rs-divider:     rgba(0,0,0,0.07);
                }

                .rs-container {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    width: 100%;
                    gap: 24px;
                    font-family: 'Barlow', sans-serif;
                }

                .rs-header-row {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                @media (min-width: 768px) {
                    .rs-header-row {
                        flex-direction: row;
                        align-items: flex-end;
                        justify-content: space-between;
                    }
                }

                .rs-step-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 4px;
                }
                .rs-pill-line { width: 32px; height: 1px; background: var(--rs-primary); }
                .rs-pill-text {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 9px; font-weight: 700;
                    letter-spacing: 0.25em; text-transform: uppercase;
                    color: var(--rs-primary-lt);
                }

                .rs-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(2rem, 5vw, 3.2rem);
                    letter-spacing: 0.04em;
                    line-height: 0.95;
                    color: var(--rs-text-1);
                    margin: 0;
                }

                .rs-subtitle {
                    margin-top: 8px;
                    font-size: 14px;
                    line-height: 1.7;
                    color: var(--rs-text-2);
                    max-width: 480px;
                }

                .rs-input {
                    width: 100%;
                    background: var(--rs-input-bg);
                    border: 1px solid var(--rs-border-1);
                    color: var(--rs-text-1);
                    padding: 12px 16px;
                    font-family: 'Barlow', sans-serif;
                    font-size: 14px;
                    font-weight: 600;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s;
                    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
                }
                .rs-input:focus { border-color: var(--rs-primary-lt); }
                .rs-input:hover:not(:focus) { background: var(--rs-input-hv); }

                .rs-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: var(--rs-text-3);
                    margin-bottom: 6px;
                    display: block;
                }

                .rs-footer {
                    display: flex;
                    flex-direction: column-reverse;
                    gap: 16px;
                    margin-top: 32px;
                    padding-top: 24px;
                    border-top: 1px solid var(--rs-divider);
                }
                @media (min-width: 640px) {
                    .rs-footer {
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                    }
                }
            `}</style>

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

