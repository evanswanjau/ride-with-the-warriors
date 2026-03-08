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

                {/* ── Header ── */}
                <div className="page" style={{ padding: '100px 0 80px' }}>
                    <div className="page-inner--narrow">
                        <div style={{ textAlign: 'center', marginBottom: 40 }}>
                            <div className="page-label-row--center" style={{ marginBottom: 20 }}>
                                <div className="page-label-line--short" />
                                <span className="page-eyebrow">Legal</span>
                                <div className="page-label-line--short" />
                            </div>
                            <h1 className="page-display page-title" style={{ textAlign: 'center' }}>Privacy <span className="page-accent">Policy.</span></h1>
                            <p className="page-subtitle--center">
                                Your privacy is important to us. This policy explains how we handle your
                                personal data during the registration and event process.
                            </p>
                        </div>
                        {/* ── Content ── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {sections.map((s) => (
                                <div key={s.number} className="terms-section-card">
                                    <div className="terms-number-col">
                                        <span className="terms-number">{s.number}</span>
                                        <div className="terms-number-line" />
                                    </div>
                                    <div>
                                        <div className="terms-section-title">{s.title}</div>
                                        <p className="terms-section-body">{s.body}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Contact block */}
                            <div style={{ marginTop: 24, padding: '36px', border: '1px solid var(--border-1)', background: 'var(--raised-bg)', clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ height: 1, width: 36, background: 'var(--color-primary)', flexShrink: 0 }} />
                                    <span className="section-label" style={{ color: 'var(--color-primary)' }}>Get In Touch</span>
                                </div>
                                <h2 className="display-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-1)' }}>
                                    Questions About <span style={{ color: 'var(--color-primary-light)' }}>Your Data?</span>
                                </h2>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.72, maxWidth: 480 }}>
                                    Reach out to our data officer and we'll respond within 48 hours.
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 4 }}>
                                    <Link to="/register/step/1" className="shimmer-btn shimmer-btn--primary">Register Now</Link>
                                    <a href="mailto:info@ridewiththewarriors.com" className="shimmer-btn shimmer-btn--ghost">Contact Us</a>
                                    <Link to="/terms-and-conditions" className="shimmer-btn shimmer-btn--ghost">Terms & Conditions →</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PrivacyPage;