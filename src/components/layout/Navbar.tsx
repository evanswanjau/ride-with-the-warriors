import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import logoRegular from '../../assets/logos/web/logo-sm.webp';
import logoWhite from '../../assets/logos/web/logo_white.webp';
import { useAuth } from '../../context/AuthContext';
import { isOn } from '../../config/features';
import { primaryCta, raffleCta } from '../../config/cta';
import { useCurrentEvent } from '../../hooks/useCurrentEvent';
import '../../styles/navbar.css';
import { ARCHIVE, PAST_EDITION } from '../../config/edition';

const RECAP_ITEMS = [
    { name: 'Highlights', path: ARCHIVE.recap, desc: 'The day in numbers and moments' },
    { name: 'Photos', path: ARCHIVE.photos, desc: 'Every album from race day' },
    { name: 'Race Results', path: '/results', desc: 'Times and positions by circuit' },
    { name: 'Raffle Winners', path: '/raffle-winners', desc: 'Including the Nissan Sylphy, ticket AA130' },
];

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
    const { account } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [recapOpen, setRecapOpen] = useState(false);
    const [mobileRecapOpen, setMobileRecapOpen] = useState(false);
    const recapRef = useRef<HTMLDivElement>(null);
    const recapBtnRef = useRef<HTMLButtonElement>(null);
    const openedByHover = useRef(false);
    const accountOn = isOn('account');
    const current = useCurrentEvent();
    const cta = primaryCta(current);
    const raffle = raffleCta(current);
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


    /* Close the Recap dropdown on outside click */
    useEffect(() => {
        if (!recapOpen) return;
        const onDown = (e: MouseEvent) => {
            if (recapRef.current && !recapRef.current.contains(e.target as Node)) setRecapOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [recapOpen]);

    const onRecapKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setRecapOpen(false);
            recapBtnRef.current?.focus();
            return;
        }
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        e.preventDefault();
        const items = Array.from(recapRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
        if (!recapOpen) { setRecapOpen(true); return; }
        const i = items.indexOf(document.activeElement as HTMLElement);
        const next = e.key === 'ArrowDown' ? (i + 1) % items.length : (i <= 0 ? items.length - 1 : i - 1);
        items[next]?.focus();
    };

    const navLinksBefore = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Circuits', path: '/circuits' },
    ];
    const navLinksAfter = [
        { name: 'FAQs', path: '/faqs' },
        { name: 'Contact', path: '/contact' },
    ];

    /* Close the menus when the route changes (adjusted during render, not in an effect) */
    const route = location.pathname + location.search;
    const [lastRoute, setLastRoute] = useState(route);
    if (route !== lastRoute) {
        setLastRoute(route);
        setIsMenuOpen(false);
        setRecapOpen(false);
    }

    const isActive = (path: string) => location.pathname === path;
    const recapActive =
        [ARCHIVE.recap, '/results', '/raffle-winners'].includes(location.pathname) ||
        (location.pathname === '/gallery' && new URLSearchParams(location.search).get('year') === String(PAST_EDITION.year));

    return (
        <>
            {/* ── Main nav ── */}
            <header className={`rwtw-nav ${isTransparent ? 'is-transparent' : 'is-solid'}`}>
                <div className="nav-inner">
                    {/* Logo */}
                    <Link to="/" className="nav-logo">
                        <img src={currentLogo} alt="RWTW" width={39} height={40} />
                        <span className="nav-logo-label hidden sm:block">
                            Ride With The Warriors
                            <span className="nav-logo-sub">KDF • Airborne Fraternity</span>
                        </span>
                    </Link>

                    {/* Center links */}
                    <nav className="nav-links">
                        {navLinksBefore.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div
                            className={`nav-dropdown ${recapOpen ? 'open' : ''}`}
                            ref={recapRef}
                            onMouseEnter={() => { if (!recapOpen) openedByHover.current = true; setRecapOpen(true); }}
                            onMouseLeave={() => { openedByHover.current = false; setRecapOpen(false); }}
                            onKeyDown={onRecapKeyDown}
                        >
                            <button
                                ref={recapBtnRef}
                                type="button"
                                className={`nav-link nav-dropdown-btn ${recapActive ? 'active' : ''}`}
                                aria-haspopup="menu"
                                aria-expanded={recapOpen}
                                onClick={() => {
                                    // A click right after hover-opening keeps the menu open instead of toggling it shut.
                                    if (openedByHover.current) { openedByHover.current = false; setRecapOpen(true); }
                                    else setRecapOpen((v) => !v);
                                }}
                            >
                                {ARCHIVE.label} <span className="nav-dropdown-caret" aria-hidden="true">▾</span>
                            </button>
                            {recapOpen && (
                                <div className="nav-dropdown-menu" role="menu" aria-label={ARCHIVE.label}>
                                    {RECAP_ITEMS.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            role="menuitem"
                                            className="nav-dropdown-item"
                                            onClick={() => setRecapOpen(false)}
                                        >
                                            <span className="nav-dropdown-item-name">{item.name}</span>
                                            <span className="nav-dropdown-item-desc">{item.desc}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {navLinksAfter.map((link) => (
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

                        <div className="nav-divider" />

                        {accountOn && (
                            <Link to={account ? '/account' : '/login'} className="nav-text-link">
                                {account ? 'My Account' : 'Log in'}
                            </Link>
                        )}
                        <Link to="/feedback" className="nav-text-link">Feedback</Link>
                        {raffle && <Link to={raffle.to} className="nav-cta amber">{raffle.label}</Link>}
                        <Link to={cta.to} className="nav-cta green">{cta.label}</Link>
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
                    {[...navLinksBefore, null, ...navLinksAfter].map((link, i) => link ? (
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
                    ) : (
                        <div key="recap">
                            <button
                                type="button"
                                className={`nav-mobile-link nav-mobile-accordion-btn ${recapActive ? 'active' : ''}`}
                                aria-expanded={mobileRecapOpen}
                                aria-controls="mobile-recap-sub"
                                onClick={() => setMobileRecapOpen((v) => !v)}
                            >
                                {ARCHIVE.label}
                                <span aria-hidden="true" style={{ fontSize: '1rem' }}>{mobileRecapOpen ? '−' : '+'}</span>
                            </button>
                            {mobileRecapOpen && (
                                <div className="nav-mobile-sub" id="mobile-recap-sub">
                                    {RECAP_ITEMS.map((item) => (
                                        <Link key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)}>
                                            {item.name}
                                            <small>{item.desc}</small>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* CTAs */}
                <div className="nav-mobile-ctas">
                    {accountOn && (
                        <Link
                            to={account ? '/account' : '/login'}
                            className="nav-mobile-text-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {account ? 'My Account' : 'Log in'}
                        </Link>
                    )}
                    <Link to="/feedback" className="nav-mobile-text-link" onClick={() => setIsMenuOpen(false)}>
                        Feedback
                    </Link>
                    {raffle && (
                        <Link to={raffle.to} className="nav-mobile-cta amber" onClick={() => setIsMenuOpen(false)}>
                            {raffle.label}
                        </Link>
                    )}
                    <Link to={cta.to} className="nav-mobile-cta green" onClick={() => setIsMenuOpen(false)}>
                        {cta.label}
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Navbar;