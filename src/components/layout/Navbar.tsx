import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import logoRegular from '../../assets/logos/logo.png';
import logoWhite from '../../assets/logos/logo_white.png';

/* ─── Theme toggle icon ──────────────────────────────────────────────────── */
const SunIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);
const MoonIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
const Navbar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('rwtw-theme') || 'dark';
        }
        return 'dark';
    });

    const isHome = location.pathname === '/';
    const isTransparent = isHome && !isScrolled && !isMenuOpen;

    let currentLogo = logoWhite;
    if (theme === 'light') {
        if (isHome && !isScrolled && !isMenuOpen) {
            currentLogo = logoWhite; // Visible on hero section
        } else {
            currentLogo = logoRegular; // Default light mode logo, and used on scroll
        }
    } else {
        // Dark mode
        currentLogo = logoWhite;
    }

    /* Apply theme to root */
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('rwtw-theme', theme);
    }, [theme]);

    /* Scroll listener */
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    /* Close menu on route change */
    useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'FAQs', path: '/faqs' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap');

                /* ── Theme Variables ── */
                :root, [data-theme="dark"] {
                    --nav-bg-solid: rgba(10, 10, 10, 0.97);
                    --nav-border: rgba(255,255,255,0.07);
                    --nav-text: rgba(255,255,255,0.75);
                    --nav-text-active: #ffffff;
                    --nav-text-hover: #ffffff;
                    --nav-logo-text: #ffffff;
                    --nav-icon: rgba(255,255,255,0.6);
                    --nav-icon-hover: #ffffff;
                    --nav-toggle-bg: rgba(255,255,255,0.06);
                    --nav-toggle-border: rgba(255,255,255,0.1);
                    --nav-toggle-color: rgba(255,255,255,0.7);
                    --nav-mobile-bg: #0a0a0a;
                    --nav-mobile-border: rgba(255,255,255,0.07);
                    --nav-mobile-link: rgba(255,255,255,0.6);
                    --nav-mobile-link-active: #ffffff;
                    --nav-active-bar: var(--color-primary-light, #4caf50);
                }
                [data-theme="light"] {
                    --nav-bg-solid: rgba(250, 248, 244, 0.97);
                    --nav-border: rgba(0,0,0,0.09);
                    --nav-text: rgba(30,30,30,0.65);
                    --nav-text-active: #111111;
                    --nav-text-hover: #111111;
                    --nav-logo-text: #111111;
                    --nav-icon: rgba(30,30,30,0.5);
                    --nav-icon-hover: #111111;
                    --nav-toggle-bg: rgba(0,0,0,0.05);
                    --nav-toggle-border: rgba(0,0,0,0.12);
                    --nav-toggle-color: rgba(30,30,30,0.65);
                    --nav-mobile-bg: #faf8f4;
                    --nav-mobile-border: rgba(0,0,0,0.08);
                    --nav-mobile-link: rgba(30,30,30,0.55);
                    --nav-mobile-link-active: #111111;
                    --nav-active-bar: var(--color-primary, #2d6a2d);
                }

                /* ── Navbar base ── */
                .rwtw-nav {
                    position: fixed;
                    top: 0;
                    width: 100%;
                    z-index: 100;
                    transition: background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease;
                    font-family: 'Barlow', sans-serif;
                }
                .rwtw-nav.is-solid {
                    background: var(--nav-bg-solid);
                    border-bottom: 1px solid var(--nav-border);
                    backdrop-filter: blur(16px);
                }
                .rwtw-nav.is-transparent {
                    background: transparent;
                    border-bottom: 1px solid transparent;
                }

                .nav-inner {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 44px;
                    height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 32px;
                }

                /* ── Logo ── */
                .nav-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    text-decoration: none;
                    flex-shrink: 0;
                }
                .nav-logo img {
                    height: 40px;
                    width: auto;
                    object-fit: contain;
                }
                .nav-logo-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-weight: 800;
                    font-size: 1.2rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    line-height: 1.2;
                    transition: color 0.3s;
                }
                .nav-logo-sub {
                    font-size: 0.75rem;
                    letter-spacing: 0.2em;
                    opacity: 0.55;
                    display: block;
                }
                .is-transparent .nav-logo-label { color: rgba(255,255,255,0.95); }
                .is-solid .nav-logo-label { color: var(--nav-logo-text); }

                /* ── Nav links ── */
                .nav-links {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    flex: 1;
                    justify-content: center;
                }
                @media (max-width: 900px) { .nav-links { display: none; } }

                .nav-link {
                    position: relative;
                    padding: 7px 15px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 1.05rem;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    text-decoration: none;
                    transition: color 0.2s;
                    white-space: nowrap;
                }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: 0; left: 14px; right: 14px;
                    height: 2px;
                    background: var(--nav-active-bar);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.25s ease;
                }
                .nav-link.active::after,
                .nav-link:hover::after { transform: scaleX(1); }

                .is-transparent .nav-link { color: rgba(255,255,255,0.72); }
                .is-transparent .nav-link:hover,
                .is-transparent .nav-link.active { color: rgba(255,255,255,1); }
                .is-solid .nav-link { color: var(--nav-text); }
                .is-solid .nav-link:hover,
                .is-solid .nav-link.active { color: var(--nav-text-active); }

                /* ── Right actions ── */
                .nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-shrink: 0;
                }
                @media (max-width: 900px) { .nav-actions { display: none; } }

                /* ── Icon button ── */
                .nav-icon-btn {
                    width: 34px; height: 34px;
                    display: flex; align-items: center; justify-content: center;
                    border: 1px solid var(--nav-toggle-border);
                    background: var(--nav-toggle-bg);
                    color: var(--nav-toggle-color);
                    cursor: pointer;
                    transition: color 0.2s, border-color 0.2s, background 0.2s;
                    text-decoration: none;
                    flex-shrink: 0;
                }
                .nav-icon-btn:hover {
                    color: var(--nav-icon-hover);
                    border-color: var(--color-primary, #2d6a2d);
                }
                .is-transparent .nav-icon-btn {
                    border-color: rgba(255,255,255,0.2);
                    background: rgba(255,255,255,0.06);
                    color: rgba(255,255,255,0.7);
                }
                .is-transparent .nav-icon-btn:hover {
                    border-color: rgba(255,255,255,0.5);
                    color: #fff;
                }

                /* ── CTA buttons (shimmer) ── */
                .nav-cta {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    padding: 9px 24px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.95rem;
                    font-weight: 800;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    text-decoration: none;
                    overflow: hidden;
                    transition: transform 0.2s, box-shadow 0.2s;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
                    white-space: nowrap;
                }
                .nav-cta::before {
                    content: '';
                    position: absolute;
                    top: 0; left: -80%;
                    width: 60%; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 50%, transparent 80%);
                    transform: skewX(-20deg);
                    pointer-events: none;
                }
                .nav-cta:hover::before {
                    left: 140%;
                    transition: left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .nav-cta:hover { transform: translateY(-1px); }
                .nav-cta.green {
                    background: var(--color-primary, #2d6a2d);
                    color: #fff;
                    box-shadow: 0 0 0 transparent;
                }
                .nav-cta.green:hover { box-shadow: 0 8px 20px rgba(45,106,45,0.35); }
                .nav-cta.amber {
                    background: #f59e0b;
                    color: #111;
                }
                .nav-cta.amber:hover { box-shadow: 0 8px 20px rgba(245,158,11,0.35); }

                .nav-cta.black-white {
                    background: #111;
                    color: #fff;
                }
                [data-theme="dark"] .nav-cta.black-white {
                    background: #fff;
                    color: #111;
                }
                .nav-cta.black-white:hover { 
                    box-shadow: 0 8px 20px rgba(0,0,0,0.25); 
                }
                [data-theme="dark"] .nav-cta.black-white:hover {
                    box-shadow: 0 8px 20px rgba(255,255,255,0.15);
                }

                /* ── Divider ── */
                .nav-divider {
                    width: 1px; height: 22px;
                    background: var(--nav-toggle-border);
                    flex-shrink: 0;
                }
                .is-transparent .nav-divider { background: rgba(255,255,255,0.15); }

                /* ── Mobile controls ── */
                .nav-mobile-controls {
                    display: none;
                    align-items: center;
                    gap: 8px;
                }
                @media (max-width: 900px) { .nav-mobile-controls { display: flex; } }

                /* ── Mobile overlay ── */
                .nav-mobile-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 99;
                    background: var(--nav-mobile-bg);
                    transform: translateX(100%);
                    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    font-family: 'Barlow', sans-serif;
                }
                .nav-mobile-overlay.open { transform: translateX(0); }

                .nav-mobile-header {
                    height: 64px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 24px;
                    border-bottom: 1px solid var(--nav-mobile-border);
                    flex-shrink: 0;
                }

                .nav-mobile-links {
                    flex: 1;
                    padding: 32px 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    overflow-y: auto;
                }

                .nav-mobile-link {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 18px 0;
                    border-bottom: 1px solid var(--nav-mobile-border);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 1.6rem;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    text-decoration: none;
                    color: var(--nav-mobile-link);
                    transition: color 0.2s, padding-left 0.2s;
                }
                .nav-mobile-link.active { color: var(--nav-mobile-link-active); }
                .nav-mobile-link:hover {
                    color: var(--nav-mobile-link-active);
                    padding-left: 8px;
                }
                .nav-mobile-link .link-arrow {
                    font-size: 1rem;
                    opacity: 0;
                    transform: translateX(-8px);
                    transition: opacity 0.2s, transform 0.2s;
                    color: var(--color-primary-light, #4caf50);
                }
                .nav-mobile-link:hover .link-arrow,
                .nav-mobile-link.active .link-arrow {
                    opacity: 1;
                    transform: translateX(0);
                }

                .nav-mobile-ctas {
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    border-top: 1px solid var(--nav-mobile-border);
                }

                .nav-mobile-cta {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 1rem;
                    font-weight: 800;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    text-decoration: none;
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.2s, box-shadow 0.2s;
                    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
                }
                .nav-mobile-cta.green { background: var(--color-primary, #2d6a2d); color: #fff; }
                .nav-mobile-cta.amber { background: #f59e0b; color: #111; }
                .nav-mobile-cta.black-white {
                    background: #111;
                    color: #fff;
                }
                [data-theme="dark"] .nav-mobile-cta.black-white {
                    background: #fff;
                    color: #111;
                }
                .nav-mobile-cta:active { transform: scale(0.98); }

                /* ── Mobile logo text ── */
                .nav-mobile-logo-text {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-weight: 800;
                    font-size: 0.9rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: var(--nav-logo-text);
                }

                /* ── Theme toggle ── */
                .theme-toggle {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 5px 10px;
                    border: 1px solid var(--nav-toggle-border);
                    background: var(--nav-toggle-bg);
                    color: var(--nav-toggle-color);
                    cursor: pointer;
                    transition: all 0.2s;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    white-space: nowrap;
                }
                .theme-toggle:hover {
                    border-color: var(--color-primary, #2d6a2d);
                    color: var(--nav-text-active);
                }
                .is-transparent .theme-toggle {
                    border-color: rgba(255,255,255,0.2);
                    background: rgba(255,255,255,0.06);
                    color: rgba(255,255,255,0.7);
                }
                .is-transparent .theme-toggle:hover {
                    border-color: rgba(255,255,255,0.5);
                    color: #fff;
                }
            `}</style>

            {/* ── Main nav ── */}
            <header className={`rwtw-nav ${isTransparent ? 'is-transparent' : 'is-solid'}`}>
                <div className="nav-inner">
                    {/* Logo */}
                    <Link to="/" className="nav-logo">
                        <img src={currentLogo} alt="RWTW" />
                        <span className="nav-logo-label hidden sm:block">
                            Ride With The Warriors
                            <span className="nav-logo-sub">KDF • Airborne Fraternity</span>
                        </span>
                    </Link>

                    {/* Center links */}
                    <nav className="nav-links">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right actions */}
                    <div className="nav-actions">
                        {/* Theme toggle */}
                        <button
                            className="theme-toggle"
                            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                        </button>

                        {/* Search */}
                        <Link to="/search" className="nav-icon-btn" title="Search Registrations">
                            <AiOutlineSearch size={16} />
                        </Link>

                        <div className="nav-divider" />

                        {/* CTAs */}
                        <Link to="/register/step/1" className="nav-cta green">Register</Link>
                        <Link to="/military" className="nav-cta black-white">Military</Link>
                        <Link to="/raffle/step/1" className="nav-cta amber">Raffle Tickets</Link>
                    </div>

                    {/* Mobile controls */}
                    <div className="nav-mobile-controls">
                        {/* Theme toggle (mobile) */}
                        <button
                            className="nav-icon-btn"
                            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        </button>
                        {/* Search */}
                        <Link to="/search" className="nav-icon-btn">
                            <AiOutlineSearch size={16} />
                        </Link>
                        {/* Hamburger */}
                        <button
                            className="nav-icon-btn"
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <AiOutlineMenu size={16} />
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Mobile overlay ── */}
            <div className={`nav-mobile-overlay ${isMenuOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="nav-mobile-header">
                    <Link to="/" className="nav-logo" onClick={() => setIsMenuOpen(false)}>
                        <img src={currentLogo} alt="RWTW" style={{ height: 32 }} />
                        <span className="nav-mobile-logo-text">RWTW</span>
                    </Link>
                    <button
                        className="nav-icon-btn"
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <AiOutlineClose size={16} />
                    </button>
                </div>

                {/* Links */}
                <nav className="nav-mobile-links">
                    {navLinks.map((link, i) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`nav-mobile-link ${isActive(link.path) ? 'active' : ''}`}
                            style={{ transitionDelay: isMenuOpen ? `${i * 40}ms` : '0ms' }}
                        >
                            {link.name}
                            <span className="link-arrow">→</span>
                        </Link>
                    ))}
                </nav>

                {/* CTAs */}
                <div className="nav-mobile-ctas">
                    <Link
                        to="/register/step/1"
                        className="nav-mobile-cta green"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Register to Cycle
                    </Link>
                    <Link
                        to="/raffle/step/1"
                        className="nav-mobile-cta amber"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Buy Raffle Tickets
                    </Link>
                    <Link
                        to="/military"
                        className="nav-mobile-cta black-white"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Military Registration
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Navbar;