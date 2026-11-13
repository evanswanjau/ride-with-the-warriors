import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import logoRegular from '../../assets/logos/web/logo-sm.webp';
import logoWhite from '../../assets/logos/web/logo_white.webp';
import { useAuth } from '../../context/AuthContext';
import { isOn } from '../../config/features';
import { primaryCta } from '../../config/cta';

const RECAP_ITEMS = [
    { name: 'Highlights', path: '/2026', desc: 'The day in numbers and moments' },
    { name: 'Photos', path: '/gallery?year=2026', desc: 'Every album from race day' },
    { name: 'Race Results', path: '/results', desc: 'Times and positions by circuit' },
    { name: 'Raffle Winners', path: '/raffle-winners', desc: 'Including the car, ticket AA130' },
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
    const cta = primaryCta();
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
    useEffect(() => { setIsMenuOpen(false); setRecapOpen(false); }, [location.pathname, location.search]);

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

    const isActive = (path: string) => location.pathname === path;
    const recapActive =
        ['/2026', '/results', '/raffle-winners'].includes(location.pathname) ||
        (location.pathname === '/gallery' && new URLSearchParams(location.search).get('year') === '2026');

    return (
        <>
            <style>{`
                

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
                @media (max-width: 1023px) { .nav-links { display: none; } }

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
                @media (max-width: 1023px) { .nav-actions { display: none; } }

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
                    overflow: visible;
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
                .nav-cta.nav-cta-red-shadow {
                    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5), 0 0 30px rgba(239, 68, 68, 0.3);
                }
                .nav-cta.amber {
                    background: #f59e0b;
                    color: #111;
                }
                .nav-cta.amber:hover { box-shadow: 0 8px 20px rgba(245,158,11,0.35); }

                /* ── CTA Glow Effect ── */
                .nav-cta-glow {
                    position: relative;
                    animation: glow-pulse 2s ease-in-out infinite;
                }
                .nav-cta-glow::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    background: linear-gradient(45deg, #2d6a2d, #4caf50, #2d6a2d, #1e4d1e, #2d6a2d);
                    background-size: 400% 400%;
                    border-radius: inherit;
                    z-index: -1;
                    animation: glow-border 3s ease infinite;
                    opacity: 0.7;
                }
                @keyframes glow-pulse {
                    0%, 100% { box-shadow: 0 0 25px rgba(45, 106, 45, 0.5), 0 0 50px rgba(45, 106, 45, 0.3); }
                    50% { box-shadow: 0 0 35px rgba(45, 106, 45, 0.7), 0 0 70px rgba(45, 106, 45, 0.5); }
                }
                @keyframes glow-border {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

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
                @media (max-width: 1023px) { .nav-mobile-controls { display: flex; } }

                /* ── Mobile overlay ── */
                .nav-mobile-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 120;
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

                /* ── Mobile CTA Glow Effect ── */
                .nav-mobile-cta-glow {
                    position: relative;
                    animation: glow-pulse 2s ease-in-out infinite;
                }
                .nav-mobile-cta-glow::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    background: linear-gradient(45deg, #2d6a2d, #4caf50, #2d6a2d, #1e4d1e, #2d6a2d);
                    background-size: 400% 400%;
                    border-radius: inherit;
                    z-index: -1;
                    animation: glow-border 3s ease infinite;
                    opacity: 0.7;
                }

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

                /* ── Tighter spacing on mid-size desktops so everything fits ── */
                @media (min-width: 1024px) and (max-width: 1439px) {
                    .nav-inner { padding: 0 20px; gap: 14px; }
                    .nav-logo-sub { display: none; }
                    .nav-logo-label { font-size: 1.05rem; }
                    .nav-link { padding: 7px 8px; font-size: 0.95rem; letter-spacing: 0.1em; }
                    .nav-link::after { left: 8px; right: 8px; }
                    .nav-actions { gap: 8px; }
                    .nav-cta { padding: 9px 16px; font-size: 0.85rem; letter-spacing: 0.1em; }
                    .nav-text-link { font-size: 0.9rem; letter-spacing: 0.1em; }
                    .theme-toggle span { display: none; }
                }

                /* ── Plain text links in the right-hand actions ── */
                .nav-text-link {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 1rem; font-weight: 700;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    text-decoration: none; white-space: nowrap;
                    padding: 6px 4px;
                    transition: color 0.2s;
                }
                .is-transparent .nav-text-link { color: rgba(255,255,255,0.8); }
                .is-solid .nav-text-link { color: var(--nav-text); }
                .is-transparent .nav-text-link:hover { color: #fff; }
                .is-solid .nav-text-link:hover { color: var(--nav-text-active); }

                /* ── 2026 Recap dropdown ── */
                .nav-dropdown { position: relative; }
                .nav-dropdown-btn {
                    background: none; border: 0; cursor: pointer;
                    display: inline-flex; align-items: center; gap: 6px;
                }
                .nav-dropdown-caret { font-size: 0.7rem; transition: transform 0.2s; }
                .nav-dropdown.open .nav-dropdown-caret { transform: rotate(180deg); }
                .nav-dropdown-menu {
                    position: absolute; top: 100%; left: 0; min-width: 290px;
                    padding: 8px 0; margin-top: 6px;
                    background: var(--nav-mobile-bg);
                    border: 1px solid var(--nav-border);
                    box-shadow: 0 16px 40px rgba(0,0,0,0.35);
                    z-index: 130;
                }
                .nav-dropdown-menu::before { /* hover bridge over the gap */
                    content: ''; position: absolute; top: -8px; left: 0; right: 0; height: 8px;
                }
                .nav-dropdown-item {
                    display: block; padding: 10px 18px; text-decoration: none;
                    color: var(--nav-text-active);
                    transition: background 0.15s;
                }
                .nav-dropdown-item:hover, .nav-dropdown-item:focus-visible {
                    background: var(--nav-toggle-bg); outline: none;
                }
                .nav-dropdown-item-name {
                    display: block; font-family: 'Barlow Condensed', sans-serif;
                    font-size: 1.05rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
                }
                .nav-dropdown-item-desc { display: block; font-size: 0.78rem; opacity: 0.6; margin-top: 2px; }

                /* ── Mobile accordion + text links ── */
                .nav-mobile-accordion-btn {
                    width: 100%; background: none; border-left: 0; border-right: 0; border-top: 0; cursor: pointer; text-align: left;
                }
                .nav-mobile-sub { display: flex; flex-direction: column; padding: 4px 0 10px 16px; border-bottom: 1px solid var(--nav-mobile-border); }
                .nav-mobile-sub a {
                    padding: 12px 0; text-decoration: none; color: var(--nav-mobile-link);
                    font-family: 'Barlow Condensed', sans-serif; font-size: 1.2rem; font-weight: 700;
                    letter-spacing: 0.08em; text-transform: uppercase;
                }
                .nav-mobile-sub a small {
                    display: block; font-family: 'Barlow', sans-serif; font-size: 0.75rem;
                    text-transform: none; letter-spacing: 0; opacity: 0.65; font-weight: 400;
                }
                .nav-mobile-sub a:hover { color: var(--nav-mobile-link-active); }
                .nav-mobile-text-link {
                    text-align: center; padding: 8px; text-decoration: none; color: var(--nav-mobile-link-active);
                    font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem; font-weight: 700;
                    letter-spacing: 0.12em; text-transform: uppercase;
                }
            `}</style>

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
                                2026 Recap <span className="nav-dropdown-caret" aria-hidden="true">▾</span>
                            </button>
                            {recapOpen && (
                                <div className="nav-dropdown-menu" role="menu" aria-label="2026 Recap">
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
                                2026 Recap
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
                    <Link to={cta.to} className="nav-mobile-cta green" onClick={() => setIsMenuOpen(false)}>
                        {cta.label}
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Navbar;