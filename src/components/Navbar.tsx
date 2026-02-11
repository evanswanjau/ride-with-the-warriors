import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import logo from '../assets/images/logo.png';

const Navbar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/register/step/1' },
        { name: 'Search', path: '/search' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'FAQs', path: '/faqs' }
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark bg-white/95 dark:bg-background-dark/95 backdrop-blur px-4 md:px-10 py-3 lg:px-40">
            <Link to="/" className="flex items-center gap-4 text-text-light dark:text-text-dark hover:opacity-80 transition-opacity">
                <img src={logo} alt="Ride With The Warriors" className="h-10 w-auto object-contain" />
                <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] hidden sm:block">
                    Ride With The Warriors
                </h2>
            </Link>
            <div className="flex flex-1 justify-end gap-8 items-center">
                <nav className="hidden md:flex items-center gap-9">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-bold uppercase tracking-widest transition-all ${location.pathname === link.path
                                ? 'text-primary'
                                : 'text-neutral-500 hover:text-primary dark:text-neutral-400 dark:hover:text-white'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-4 md:hidden">
                    <Link to="/search" className="text-primary text-2xl hover:opacity-80 transition-opacity">
                        <AiOutlineSearch />
                    </Link>
                    <button
                        onClick={toggleMenu}
                        className="text-text-light dark:text-text-dark text-2xl p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-50 md:hidden bg-white dark:bg-background-dark transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4">
                            <img src={logo} alt="Logo" className="h-8 w-auto" />
                        </Link>
                        <button
                            onClick={toggleMenu}
                            className="text-text-light dark:text-text-dark text-2xl p-1 rounded-lg transition-colors"
                        >
                            <AiOutlineClose />
                        </button>
                    </div>
                    <nav className="flex flex-col p-6 gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`text-lg font-bold uppercase tracking-widest transition-all ${location.pathname === link.path
                                    ? 'text-primary'
                                    : 'text-neutral-500 hover:text-primary dark:text-neutral-400 dark:hover:text-white'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
