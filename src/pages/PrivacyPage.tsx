import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import '../styles/legal.css';

const sections = [
    {
        number: '01',
        title: 'Information We Collect',
        body: 'We collect personal information provided by you during registration, including your name, email address, phone number, date of birth, gender, and emergency contact details. We may also collect technical data such as IP address and browser type when you visit our website.',
    },
    {
        number: '02',
        title: 'How We Use Your Data',
        body: 'Your personal data is used to manage your entry into the Event, communicate essential event information, ensure participant safety on the course, and provide timing and results services. We may also use anonymised aggregate data to improve future editions of Ride With The Warriors.',
    },
    {
        number: '03',
        title: 'Data Sharing',
        body: 'We share your data only with essential third parties required to deliver the event — including medical teams, chip timing providers, and official photography partners. We do not sell, rent, or trade your personal information to any third party for commercial purposes.',
    },
    {
        number: '04',
        title: 'Data Security',
        body: 'We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, accidental loss, or alteration. Data is stored on encrypted servers and access is restricted to authorised personnel only.',
    },
    {
        number: '05',
        title: 'Your Rights',
        body: 'You have the right to access, correct, or request the deletion of your personal data at any time. You may also object to or restrict certain processing. To exercise any of these rights, please contact our data officer at privacy@ridewiththewarriors.com.',
    },
    {
        number: '06',
        title: 'Cookies & Tracking',
        body: 'Our website uses cookies to improve your browsing experience and analyse traffic patterns. You may disable cookies through your browser settings; however, some features of the site may not function correctly as a result.',
    },
    {
        number: '07',
        title: 'Policy Updates',
        body: 'We may update this Privacy Policy from time to time. Any material changes will be communicated via email or a prominent notice on our website. Continued use of our services after such notice constitutes acceptance of the revised policy.',
    },
];

const PrivacyPage = () => {
    return (
        <Layout isFullWidth>


            <div className="legal-page">

                {/* ── Hero ── */}
                <div className="legal-hero" style={{ background: 'var(--raised-bg)', transition: 'background 0.3s' }}>
                    <div className="legal-hero-bg" />
                    <div className="legal-hero-accent" />
                    <div className="legal-hero-watermark">PRIVACY</div>

                    <div className="max-w-4xl mx-auto relative z-10">
                        <Link to="/" className="back-link" style={{ gap: '6px' }}>
                            ← Back to Home
                        </Link>

                        <div style={{ marginTop: 32 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <div style={{ height: 1, width: 48, background: 'var(--color-primary)', flexShrink: 0 }} />
                                <span className="section-label">KDF Airborne Fraternity · 2026 Edition</span>
                            </div>
                            <h1 className="display-heading" style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)', color: 'var(--text-1)' }}>
                                Privacy <span style={{ color: 'var(--color-primary-light)' }}>Policy.</span>
                            </h1>
                            <p style={{ marginTop: 20, fontSize: '1rem', color: 'var(--text-2)', maxWidth: 520, lineHeight: 1.72 }}>
                                Your privacy is important to us. This policy explains how we handle your
                                personal data during the registration and event process.
                            </p>
                        </div>

                        <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <span style={{ fontSize: '0.65rem', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Last Updated</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-2)' }}>July 2025</span>
                            </div>
                            <div style={{ width: 1, background: 'var(--border-2)' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <span style={{ fontSize: '0.65rem', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Applies To</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-2)' }}>Ride With The Warriors 2026</span>
                            </div>
                            <div style={{ width: 1, background: 'var(--border-2)' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <span style={{ fontSize: '0.65rem', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Sections</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-2)' }}>{sections.length} Articles</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="max-w-4xl mx-auto px-6 lg:px-12 py-20" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {sections.map((s) => (
                        <div key={s.number} className="legal-section-card">
                            <div className="legal-section-number">{s.number}</div>
                            <div className="legal-section-title">{s.title}</div>
                            <p className="legal-section-body">{s.body}</p>
                        </div>
                    ))}

                    {/* Contact block */}
                    <div style={{ marginTop: 24, padding: '36px', border: '1px solid var(--border-1)', background: 'var(--raised-bg)', clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ height: 1, width: 36, background: 'var(--color-primary)', flexShrink: 0 }} />
                            <span className="section-label">Get In Touch</span>
                        </div>
                        <h2 className="display-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-1)' }}>
                            Questions About <span style={{ color: 'var(--color-primary-light)' }}>Your Data?</span>
                        </h2>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.72, maxWidth: 480 }}>
                            Reach out to our data officer and we'll respond within 48 hours.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 4 }}>
                            <a href="mailto:privacy@ridewiththewarriors.com" className="contact-pill">
                                ✉ privacy@ridewiththewarriors.com
                            </a>
                            <Link to="/terms-and-conditions" className="shimmer-btn shimmer-btn--amber">
                                View Terms & Conditions →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PrivacyPage;