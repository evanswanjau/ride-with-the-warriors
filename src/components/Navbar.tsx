import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
    registrationType?: string;
}

const Navbar = ({ registrationType }: NavbarProps) => {
    const location = useLocation();
    const isTeam = registrationType === 'team';

    const navLinks = [
        { name: 'Home', path: '/register/step/1' },
        { name: 'Search', path: '/search' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Rules', path: '/rules' },
        { name: 'Admin', path: '/admin' }
    ];

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark bg-white/95 dark:bg-background-dark/95 backdrop-blur px-4 md:px-10 py-3 lg:px-40">
            <Link to="/" className="flex items-center gap-4 text-text-light dark:text-text-dark hover:opacity-80 transition-opacity">
                <div className="size-8 text-primary">
                    <span className="material-symbols-outlined text-3xl">directions_bike</span>
                </div>
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
                <div className="md:hidden">
                    {/* Mobile Menu Icon or simplified links could go here if needed */}
                    <Link to="/search" className="text-primary material-symbols-outlined">search</Link>
                </div>
                {isTeam ? (
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary-dark transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]">
                        <span className="truncate">Sign In</span>
                    </button>
                ) : (
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-border-light dark:hover:bg-border-dark text-text-light dark:text-text-dark text-sm font-bold leading-normal transition-colors">
                        <span className="truncate">Active Route</span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Navbar;
