import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-transparent border-none py-8 px-4 mt-auto">
            <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-2 text-center">
                <div className="text-neutral-500 dark:text-neutral-400 text-xs font-normal">
                    © {currentYear} Ride With The Warriors. All rights reserved.
                </div>
                <div className="flex gap-6 text-xs font-normal">
                    <Link to="/privacy-policy" className="text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                        Privacy Policy
                    </Link>
                    <Link to="/terms-and-conditions" className="text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                        Terms & Conditions
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
