import { Link } from 'react-router-dom';

const TopBar = () => {
    return (
        <>
            <style>{`
                .topbar-campaign {
                    transition: box-shadow 0.2s ease;
                }
                .topbar-campaign::before {
                    content: ''; position: absolute; top: 0; left: -80%;
                    width: 60%; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 50%, transparent 80%);
                    transform: skewX(-20deg); pointer-events: none;
                }
                .topbar-campaign:hover::before {
                    left: 140%;
                    transition: left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .topbar-campaign:hover {
                    box-shadow: 0 10px 28px rgba(245,158,11,0.35);
                }
            `}</style>
            <Link to="/donate" className="topbar-campaign absolute top-0 left-0 w-full bg-amber-500 h-[26px] flex items-center justify-center overflow-hidden z-[110] no-underline transition-colors">
                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-black text-center flex items-center gap-2">
                    Support the widows and families of our fallen heroes <span className="text-sm">❤️</span>
                </p>
            </Link>
        </>
    );
};

export default TopBar;
