const Header = () => {
    return (
        <header className="w-full px-4 pt-8 pb-4 md:px-10 lg:px-40 flex flex-col items-center border-b border-[#e6e0d4] dark:border-[#2d332d] bg-white dark:bg-[#151715]">
            <div className="max-w-[1200px] w-full">
                <div className="flex flex-col gap-2 mb-6 text-center md:text-left">
                    <h1 className="text-[#1c170d] dark:text-white text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                        Ride With The Warriors
                    </h1>
                    <p className="text-primary font-normal text-base md:text-lg leading-normal">
                        Registration 2026 - Riding with honour
                    </p>
                </div>
            </div>
        </header>
    );
};

export default Header;
