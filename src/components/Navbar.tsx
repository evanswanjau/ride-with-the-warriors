interface NavbarProps {
    registrationType?: string;
}

const Navbar = ({ registrationType }: NavbarProps) => {
    const isTeam = registrationType === 'team';

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark bg-white/95 dark:bg-background-dark/95 backdrop-blur px-4 md:px-10 py-3 lg:px-40">
            <div className="flex items-center gap-4 text-text-light dark:text-text-dark">
                <div className="size-8 text-primary">
                    <span className="material-symbols-outlined text-3xl">directions_bike</span>
                </div>
                <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] hidden sm:block">
                    Ride With The Warriors
                </h2>
            </div>
            <div className="flex flex-1 justify-end gap-8 items-center">
                <div className="hidden md:flex items-center gap-9">
                    <a className="text-text-light dark:text-neutral-300 text-sm font-medium hover:text-primary transition-colors" href="#">Home</a>
                    <a className="text-text-light dark:text-neutral-300 text-sm font-medium hover:text-primary transition-colors" href="#">Tournaments</a>
                    <a className="text-text-light dark:text-neutral-300 text-sm font-medium hover:text-primary transition-colors" href="#">Rules</a>
                </div>
                {isTeam ? (
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary-dark transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]">
                        <span className="truncate">Sign In</span>
                    </button>
                ) : (
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-border-light dark:hover:bg-border-dark text-text-light dark:text-text-dark text-sm font-bold leading-normal transition-colors">
                        <span className="truncate">Save & Exit</span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Navbar;
