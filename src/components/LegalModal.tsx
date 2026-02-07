import React, { useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const LegalModal = ({ isOpen, onClose, title, children }: LegalModalProps) => {
    // Handle ESC key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#1c170d] rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800 flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
                    <h2 className="text-xl font-bold text-text-light dark:text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="size-10 rounded-xl flex items-center justify-center text-neutral-400 hover:text-text-light dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        <AiOutlineClose />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 h-12 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all cursor-pointer"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LegalModal;
