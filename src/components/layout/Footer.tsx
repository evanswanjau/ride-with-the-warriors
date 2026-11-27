import { Link } from 'react-router-dom';
import logo from '../../assets/logos/web/logo-sm.webp';
import { primaryCta, raffleCta } from '../../config/cta';
import { ARCHIVE, editionOrdinal } from '../../config/edition';
import { isOn } from '../../config/features';
import '../../styles/footer.css';
import { useCurrentEvent } from '../../hooks/useCurrentEvent';
import { rideDayLabel } from '../../utils/eventDates';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const current = useCurrentEvent();
    const cta = primaryCta(current);
    const raffle = raffleCta(current);
    const { event } = current;
    const rideDay = rideDayLabel(event?.date ?? null);

    const columns = [
        {
            label: 'The Ride',
            links: [
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Circuits', path: '/circuits' },
                { name: 'FAQs', path: '/faqs' },
                { name: 'Contact', path: '/contact' },
            ],
        },
        {
            label: ARCHIVE.label,
            links: [
                { name: 'Highlights', path: ARCHIVE.recap },
                { name: 'Photos', path: ARCHIVE.photos },
                { name: 'Race Results', path: '/results' },
                { name: 'Raffle Winners', path: '/raffle-winners' },
            ],
        },
        {
            label: 'Get involved',
            links: [
                { name: cta.label, path: cta.to },
                ...(raffle ? [{ name: raffle.label, path: raffle.to }] : []),
                { name: 'Give feedback', path: '/feedback' },
                ...(isOn('donate') ? [{ name: 'Donate', path: '/donate' }] : []),
            ],
        },
    ];

    const legalLinks = [
        { name: 'Privacy Policy', path: '/privacy-policy' },
        { name: 'Terms & Conditions', path: '/terms-and-conditions' },
    ];

    return (
        <>
            <footer className="rwtw-footer">
                <div className="footer-main">

                    {/* ── Brand ── */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <img src={logo} alt="RWTW" width={48} height={50} loading="lazy" decoding="async" />
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
                            <span className="footer-badge-text">{event ? `${editionOrdinal(event.year)} Edition${rideDay ? ` — ${rideDay}` : ''}` : 'Ride With The Warriors'}</span>
                        </div>
                        <Link to="/about#going-green" className="footer-eco-badge" style={{ textDecoration: 'none' }}>
                            <span className="footer-eco-text">Going Green: Promoting sustainable transport & eco-conservation</span>
                        </Link>
                    </div>

                    {/* ── Link columns ── */}
                    {columns.map((col) => (
                        <div key={col.label}>
                            <div className="footer-col-label">{col.label}</div>
                            <nav className="footer-nav-list" aria-label={col.label}>
                                {col.links.map((link) => (
                                    <Link key={link.path} to={link.path} className="footer-nav-link">
                                        {link.name}
                                        <span className="footer-nav-arrow">→</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    ))}

                </div>

                {/* ── Bottom bar ── */}
                <div className="footer-bottom">
                    <span className="footer-copy">© {currentYear} Ride With The Warriors. All rights reserved.</span>
                    <span className="footer-made">
                        Designed &amp; maintained by{' '}
                        <a href="https://wa.me/254707837313" target="_blank" rel="noopener noreferrer">
                            Cody Developers
                        </a>
                    </span>
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