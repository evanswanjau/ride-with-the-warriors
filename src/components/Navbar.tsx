import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import logo from '../assets/images/logo.png';

const Navbar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        // { name: 'Participants', path: '/participants' },
        // { name: 'Sponsors', path: '/sponsors' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'FAQs', path: '/faqs' },
        { name: 'Contact', path: '/contact' }
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Determine navbar classes based on route and scroll state
    const getNavbarClasses = () => {
        const baseClasses = "fixed top-0 w-full z-50 flex items-center justify-between whitespace-nowrap px-4 md:px-10 py-3 lg:px-40 transition-all duration-300";

        if (isHome) {
            if (isScrolled) {
                return `${baseClasses} bg-white/95 dark:bg-background-dark/95 backdrop-blur border-b border-solid border-border-light dark:border-border-dark shadow-sm`;
            }
            return `${baseClasses} bg-transparent border-b border-transparent`;
        }

        // Non-home pages
        return `${baseClasses} bg-white/95 dark:bg-background-dark/95 backdrop-blur border-b border-solid border-border-light dark:border-border-dark`;
    };

    // Determine text colors based on state
    const getTextColorClass = (isActive: boolean) => {
        // Special case for transparent navbar on home page: Active link should be white (or very light)
        if (isHome && !isScrolled && !isMenuOpen) {
            return isActive ? 'text-white border-b-2 border-primary' : 'text-white/80 hover:text-white';
        }

        if (isActive) return 'text-primary';

        return 'text-neutral-500 hover:text-primary dark:text-neutral-400 dark:hover:text-white';
    };

    return (
        <header className={getNavbarClasses()}>
            <Link to="/" className={`flex items-center gap-4 hover:opacity-80 transition-opacity ${isHome && !isScrolled && !isMenuOpen ? 'text-white' : 'text-text-light dark:text-text-dark'}`}>
                <img src={logo} alt="Ride With The Warriors" className="h-10 w-auto object-contain" />
                <h2 className="text-xl font-bold leading-tight uppercase hidden sm:block">
                    Ride With The Warriors
                </h2>
            </Link>
            <div className="flex flex-1 justify-end gap-8 items-center">
                <nav className="hidden md:flex items-center gap-7">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-bold uppercase tracking-widest transition-all ${getTextColorClass(location.pathname === link.path)}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        to="/search"
                        className={`text-xl transition-all ${getTextColorClass(location.pathname === '/search')} hover:scale-110 active:scale-95`}
                        title="Search Registrations"
                    >
                        <AiOutlineSearch />
                    </Link>
                    <Link
                        to="/register/step/1"
                        className="px-5 py-2.5 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-sm active:scale-95 ml-2"
                    >
                        Register
                    </Link>
                    <Link
                        to="/raffle/step/1"
                        className="px-5 py-2.5 bg-amber-400 text-neutral-900 text-sm font-black uppercase tracking-widest rounded-xl hover:bg-amber-500 transition-all shadow-sm active:scale-95"
                    >
                        Raffle
                    </Link>
                </nav>
                <div className="flex items-center gap-4 md:hidden">
                    <Link to="/search" className={`text-2xl hover:opacity-80 transition-opacity ${isHome && !isScrolled && !isMenuOpen ? 'text-white' : 'text-primary'}`}>
                        <AiOutlineSearch />
                    </Link>
                    <button
                        onClick={toggleMenu}
                        className={`text-2xl p-1 rounded-lg transition-colors ${isHome && !isScrolled && !isMenuOpen ? 'text-white hover:bg-white/10' : 'text-text-light dark:text-text-dark hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
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
                            <span className="text-xl font-bold uppercase text-text-light dark:text-white">RWTW</span>
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
                        <Link
                            to="/register/step/1"
                            onClick={() => setIsMenuOpen(false)}
                            className="px-6 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl text-center mt-4 active:scale-95 transition-all shadow-lg"
                        >
                            Register Now
                        </Link>
                        <Link
                            to="/raffle/step/1"
                            onClick={() => setIsMenuOpen(false)}
                            className="px-6 py-4 bg-amber-400 text-neutral-900 font-black uppercase tracking-widest rounded-2xl text-center active:scale-95 transition-all shadow-lg"
                        >
                            Get a Free Raffle Ticket
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
