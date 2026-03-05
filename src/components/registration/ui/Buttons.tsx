import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    size?: ButtonSize;
};

const mergeClasses = (base: string, extra?: string) =>
    extra ? `${base} ${extra}` : base;

const sizeClasses = (size: ButtonSize = 'md') => {
    switch (size) {
        case 'sm':
            return 'h-10 px-4 text-sm';
        case 'lg':
            return 'h-14 px-10 text-lg';
        case 'md':
        default:
            return 'h-12 px-8 text-base';
    }
};

export const PrimaryButton = ({ children, className, size = 'md', ...rest }: ButtonProps) => {
    const base =
        'flex items-center justify-center overflow-hidden rounded-lg bg-primary hover:bg-primary-dark active:bg-primary/80 text-white font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed';
    return (
        <button
            {...rest}
            className={mergeClasses(`${base} ${sizeClasses(size)}`, className)}
        >
            {children}
        </button>
    );
};

export const SecondaryButton = ({ children, className, size = 'md', ...rest }: ButtonProps) => {
    const base =
        'flex items-center justify-center rounded-lg text-gray-600 border border-gray-300 hover:bg-gray-50 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-neutral-800 font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed';
    return (
        <button
            {...rest}
            className={mergeClasses(`${base} ${sizeClasses(size)}`, className)}
        >
            {children}
        </button>
    );
};

export const GhostButton = ({ children, className, size = 'md', ...rest }: ButtonProps) => {
    const base =
        'flex items-center justify-center rounded-lg text-neutral-400 hover:text-primary transition-colors font-bold disabled:opacity-70 disabled:cursor-not-allowed';
    return (
        <button
            {...rest}
            className={mergeClasses(`${base} ${sizeClasses(size)}`, className)}
        >
            {children}
        </button>
    );
};

