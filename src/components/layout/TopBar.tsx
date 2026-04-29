import { Link } from 'react-router-dom';

const TopBar = () => {
    return (
        <Link to="/donate" className="fixed top-0 left-0 w-full bg-amber-500 h-8 flex items-center justify-center overflow-hidden z-[110] no-underline hover:bg-amber-400 transition-colors">
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-black text-center flex items-center gap-2">
                Support our widows <span className="text-sm">❤️</span>
            </p>
        </Link>
    );
};

export default TopBar;
