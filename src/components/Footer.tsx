import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-transparent border-none py-8 px-4 mt-auto">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-x-6 gap-y-2 text-center text-neutral-500 dark:text-neutral-400 text-[11px] font-light">
                <p>© {currentYear} Ride With The Warriors. All rights reserved.</p>
                <div className="flex items-center gap-6">
                    <Link to="/privacy-policy" className="hover:text-primary transition-colors">
                        Privacy Policy
                    </Link>
                    <Link to="/terms-and-conditions" className="hover:text-primary transition-colors">
                        Terms & Conditions
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
