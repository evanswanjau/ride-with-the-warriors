import { Link } from 'react-router-dom';
import logo from '../../assets/logos/logo.png';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'FAQs', path: '/faqs' },
        { name: 'Contact', path: '/contact' },
    ];

    const legalLinks = [
        { name: 'Privacy Policy', path: '/privacy-policy' },
        { name: 'Terms & Conditions', path: '/terms-and-conditions' },
    ];

    return (
        <>
            <style>{`
                

                /* ── Theme vars (inherits from global, fallback here) ── */
                .rwtw-footer {
                    --f-bg:        #0a0a0a;
                    --f-top-border:#2d6a2d;
                    --f-border:    rgba(255,255,255,0.07);
                    --f-text-1:    rgba(255,255,255,0.85);
                    --f-text-2:    rgba(255,255,255,0.40);
                    --f-text-3:    rgba(255,255,255,0.25);
                    --f-link-hover:#4caf50;
                    --f-logo-text: #ffffff;
                    --f-tagline:   rgba(255,255,255,0.38);
                }
                [data-theme="light"] .rwtw-footer {
                    --f-bg:        #e8e5dd;
                    --f-top-border:#245924;
                    --f-border:    rgba(0,0,0,0.10);
                    --f-text-1:    rgba(20,20,20,0.85);
                    --f-text-2:    rgba(20,20,20,0.45);
                    --f-text-3:    rgba(20,20,20,0.28);
                    --f-link-hover:#245924;
                    --f-logo-text: #111111;
                    --f-tagline:   rgba(20,20,20,0.42);
                }

                .rwtw-footer {
                    font-family: 'Barlow', sans-serif;
                    background: var(--f-bg);
                    border-top: 2px solid var(--f-top-border);
                    transition: background 0.3s;
                }

                /* ── Main grid ── */
                .footer-main {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 64px 48px 48px;
                    display: grid;
                    grid-template-columns: 1.6fr 1fr 1fr;
                    gap: 56px;
                }
                @media (max-width: 900px) {
                    .footer-main {
                        grid-template-columns: 1fr 1fr;
                        gap: 40px;
                        padding: 48px 24px 40px;
                    }
                }
                @media (max-width: 560px) {
                    .footer-main {
                        grid-template-columns: 1fr;
                        gap: 36px;
                        padding: 40px 20px 32px;
                    }
                }

                /* ── Brand column ── */
                .footer-brand { display: flex; flex-direction: column; gap: 20px; }
                .footer-logo  { display: flex; align-items: center; gap: 12px; text-decoration: none; }
                .footer-logo img { height: 50px; width: auto; object-fit: contain; }
                .footer-logo-text {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-weight: 800; font-size: 1.2rem;
                    letter-spacing: 0.1em; text-transform: uppercase;
                    line-height: 1.2; color: var(--f-logo-text);
                    transition: color 0.3s;
                }
                .footer-logo-sub {
                    display: block; font-size: 0.75rem;
                    letter-spacing: 0.22em; opacity: 0.5; margin-top: 1px;
                }
                .footer-tagline {
                    font-size: 0.88rem; line-height: 1.7; font-weight: 300;
                    color: var(--f-tagline); max-width: 280px;
                    transition: color 0.3s;
                }
                .footer-event-badge {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 6px 14px;
                    border: 1px solid var(--f-border);
                    align-self: flex-start;
                    transition: border-color 0.3s;
                }
                .footer-event-badge:hover { border-color: var(--f-top-border); }
                .footer-badge-dot {
                    width: 6px; height: 6px;
                    background: var(--f-top-border);
                    flex-shrink: 0;
                    animation: footerPulse 2s ease-in-out infinite;
                }
                @keyframes footerPulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.4; }
                }
                .footer-badge-text {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.65rem; font-weight: 700;
                    letter-spacing: 0.2em; text-transform: uppercase;
                    color: var(--f-text-2);
                }

                /* ── Nav columns ── */
                .footer-col-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.65rem; font-weight: 800;
                    letter-spacing: 0.28em; text-transform: uppercase;
                    color: var(--f-text-2);
                    margin-bottom: 20px;
                    display: flex; align-items: center; gap: 10px;
                }
                .footer-col-label::after {
                    content: ''; flex: 1; height: 1px;
                    background: var(--f-border);
                }
                .footer-nav-list { display: flex; flex-direction: column; gap: 0; }
                .footer-nav-link {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 9px 0;
                    border-bottom: 1px solid var(--f-border);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.82rem; font-weight: 700;
                    letter-spacing: 0.1em; text-transform: uppercase;
                    color: var(--f-text-1); text-decoration: none;
                    transition: color 0.2s, padding-left 0.2s;
                }
                .footer-nav-link:hover {
                    color: var(--f-link-hover);
                    padding-left: 6px;
                }
                .footer-nav-arrow {
                    font-size: 0.7rem; opacity: 0;
                    transform: translateX(-6px);
                    transition: opacity 0.2s, transform 0.2s;
                    color: var(--f-link-hover);
                }
                .footer-nav-link:hover .footer-nav-arrow {
                    opacity: 1; transform: translateX(0);
                }

                /* ── Going Green Badge ── */
                .footer-eco-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 9px 16px;
                    background: rgba(76, 175, 80, 0.05);
                    border: 1px dashed rgba(76, 175, 80, 0.3);
                    margin-top: 14px;
                    transition: all 0.3s ease;
                    width: fit-content;
                    max-width: 280px;
                    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
                }
                .footer-eco-badge:hover {
                    background: rgba(76, 175, 80, 0.1);
                    border-color: rgba(76, 175, 80, 0.6);
                    transform: translateY(-2px);
                }
                .footer-eco-icon {
                    font-size: 1.1rem;
                    filter: drop-shadow(0 0 8px rgba(76, 175, 80, 0.4));
                }
                .footer-eco-text {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: var(--f-top-border);
                }
                [data-theme="light"] .footer-eco-badge {
                    background: rgba(36, 89, 36, 0.05);
                    border-color: rgba(36, 89, 36, 0.2);
                }
                [data-theme="light"] .footer-eco-text {
                    color: #1b4d1b;
                }

                /* ── CTA column ── */
                .footer-cta-col { display: flex; flex-direction: column; gap: 12px; }
                .footer-cta-btn {
                    position: relative;
                    display: flex; align-items: center; justify-content: center;
                    padding: 13px 24px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.8rem; font-weight: 800;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    text-decoration: none; overflow: hidden;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
                }
                .footer-cta-btn::before {
                    content: ''; position: absolute; top: 0; left: -80%;
                    width: 60%; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 50%, transparent 80%);
                    transform: skewX(-20deg); pointer-events: none;
                }
                .footer-cta-btn:hover::before {
                    left: 140%;
                    transition: left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .footer-cta-btn:hover { transform: translateY(-2px); }
                .footer-cta-btn.green {
                    background: var(--f-top-border); color: #fff;
                }
                .footer-cta-btn.green:hover { box-shadow: 0 10px 28px rgba(45,106,45,0.35); }
                .footer-cta-btn.amber {
                    background: #f59e0b; color: #111;
                }
                .footer-cta-btn.amber:hover { box-shadow: 0 10px 28px rgba(245,158,11,0.35); }
                .footer-search-btn {
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    padding: 10px 24px;
                    border: 1px solid var(--f-border);
                    background: transparent;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.75rem; font-weight: 700;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    color: var(--f-text-2); text-decoration: none;
                    transition: border-color 0.2s, color 0.2s;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
                }
                .footer-search-btn:hover {
                    border-color: var(--f-top-border);
                    color: var(--f-link-hover);
                }

                /* ── Bottom bar ── */
                .footer-bottom {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 20px 48px;
                    border-top: 1px solid var(--f-border);
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    align-items: center;
                    justify-content: space-between;
                    transition: border-color 0.3s;
                }
                @media (min-width: 640px) {
                    .footer-bottom { flex-direction: row; }
                }
                @media (max-width: 560px) {
                    .footer-bottom { padding: 20px; }
                }
                .footer-copy {
                    font-size: 0.72rem; color: var(--f-text-3);
                    letter-spacing: 0.04em; transition: color 0.3s;
                }
                .footer-legal {
                    display: flex; align-items: center; gap: 0;
                }
                .footer-legal-link {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.68rem; font-weight: 700;
                    letter-spacing: 0.14em; text-transform: uppercase;
                    color: var(--f-text-3); text-decoration: none;
                    padding: 0 14px;
                    transition: color 0.2s;
                }
                .footer-legal-link:first-child { padding-left: 0; }
                .footer-legal-link:hover { color: var(--f-link-hover); }
                .footer-legal-sep {
                    width: 1px; height: 12px;
                    background: var(--f-border);
                }
                .footer-made {
                    font-size: 0.68rem; color: var(--f-text-3);
                    letter-spacing: 0.05em; transition: color 0.3s;
                    white-space: nowrap;
                }
            `}</style>

            <footer className="rwtw-footer">
                <div className="footer-main">

                    {/* ── Brand ── */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <img src={logo} alt="RWTW" />
                            <span className="footer-logo-text">
                                Ride With The Warriors
                                <span className="footer-logo-sub">KDF • Airborne Fraternity</span>
                            </span>
                        </Link>
                        <p className="footer-tagline">
                            A premier multi-national cycling event uniting civilians and soldiers
                            — riding with honour, supporting the widows of our fallen heroes.
                        </p>
                        <div className="footer-event-badge">
                            <div className="footer-badge-dot" />
                            <span className="footer-badge-text">2nd Edition — 05 July 2026 · Nairobi</span>
                        </div>
                        <Link to="/about#going-green" className="footer-eco-badge" style={{ textDecoration: 'none' }}>
                            <span className="footer-eco-text">Going Green: Promoting sustainable transport & eco-conservation</span>
                        </Link>
                    </div>

                    {/* ── Nav ── */}
                    <div>
                        <div className="footer-col-label">Navigation</div>
                        <nav className="footer-nav-list">
                            {navLinks.map((link) => (
                                <Link key={link.path} to={link.path} className="footer-nav-link">
                                    {link.name}
                                    <span className="footer-nav-arrow">→</span>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* ── CTAs ── */}
                    <div className="footer-cta-col">
                        <div className="footer-col-label">Get Involved</div>
                        <Link to="/register/step/1" className="footer-cta-btn green">
                            Register to Cycle
                        </Link>
                        <Link to="/raffle/step/1" className="footer-cta-btn amber">
                            Buy Raffle Tickets
                        </Link>
                        <Link to="/donate" className="footer-cta-btn amber">
                            Donate
                        </Link>
                        <Link to="/search" className="footer-search-btn">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            Search Registrations
                        </Link>
                    </div>

                </div>

                {/* ── Bottom bar ── */}
                <div className="footer-bottom">
                    <span className="footer-copy">© {currentYear} Ride With The Warriors. All rights reserved.</span>
                    <div className="footer-legal" style={{ marginLeft: 'auto' }}>
                        {legalLinks.map((link, i) => (
                            <span key={link.path} style={{ display: 'flex', alignItems: 'center' }}>
                                {i > 0 && <div className="footer-legal-sep" />}
                                <Link to={link.path} className="footer-legal-link">{link.name}</Link>
                            </span>
                        ))}
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;