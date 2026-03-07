import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import '../styles/legal.css';

const sections = [
    {
        number: '01',
        title: 'Acknowledgment of Risk',
        tag: 'Mandatory',
        body: 'I acknowledge that cycling is a potentially hazardous activity involving significant risks. I voluntarily assume all risks associated with my participation, including but not limited to personal injury, illness, disability, death, and property damage. This acknowledgment extends to all circuits — the 5KM Family Fun route through the 120KM Blitz Circuit.',
    },
    {
        number: '02',
        title: 'Physical Fitness & Medical Health',
        tag: 'Mandatory',
        body: 'I confirm that I am physically and mentally fit to take part in the Event. I am solely responsible for ensuring I am capable of completing the distance I have selected. I agree to seek medical advice if I have any concerns about my health before participating. The organisers reserve the right to withdraw any participant deemed unfit to continue safely.',
    },
    {
        number: '03',
        title: 'Equipment & Safety',
        tag: 'Mandatory',
        body: 'I agree to wear a safety-certified bicycle helmet at all times while cycling during the Event. I am responsible for ensuring my bicycle is in roadworthy condition and safe for use. I will comply with all road traffic laws and instructions from Event marshals. Failure to comply may result in immediate disqualification.',
    },
    {
        number: '04',
        title: 'Liability Waiver & Release',
        tag: 'Legal',
        body: 'To the maximum extent permitted by law, I release and discharge the organisers, sponsors, volunteers, and affiliates of Ride With The Warriors from any and all claims, liabilities, or damages arising out of my participation in the Event, including those caused by negligence. This waiver is binding upon my heirs, executors, and personal representatives.',
    },
    {
        number: '05',
        title: 'Media Release',
        tag: 'Consent',
        body: 'I grant permission to Ride With The Warriors and the KDF Airborne Fraternity to use my name, likeness, and any photographs or video footage taken during the Event for promotional and marketing purposes across any media worldwide, without compensation. This includes social media, print, broadcast, and online publications.',
    },
    {
        number: '06',
        title: 'Refund Policy',
        tag: 'Financial',
        body: 'Registration fees are non-refundable once payment has been processed. In the event of cancellation due to circumstances beyond the organisers\' control — including acts of God, government directives, or security concerns — no refunds will be issued, though registration may be transferred to a future edition at the organisers\' discretion.',
    },
    {
        number: '07',
        title: 'Conduct & Fair Play',
        tag: 'Conduct',
        body: 'All participants are expected to uphold the spirit of the Event: respect fellow riders, volunteers, and marshals; follow designated routes and do not cut circuits; and honour the mission of supporting our fallen heroes\' families. Any unsportsmanlike conduct may result in disqualification and a ban from future editions.',
    },
    {
        number: '08',
        title: 'Governing Law',
        tag: 'Legal',
        body: 'These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of Kenya. Any dispute arising from participation in the Event shall be subject to the exclusive jurisdiction of the Kenyan courts.',
    },
];

const tagColors: Record<string, { bg: string; bd: string; txt: string }> = {
    Mandatory: { bg: 'rgba(239,68,68,0.08)', bd: 'rgba(239,68,68,0.22)', txt: '#f87171' },
    Legal: { bg: 'rgba(245,158,11,0.08)', bd: 'rgba(245,158,11,0.22)', txt: '#fbbf24' },
    Consent: { bg: 'rgba(45,106,45,0.08)', bd: 'rgba(45,106,45,0.22)', txt: '#4caf50' },
    Financial: { bg: 'rgba(99,102,241,0.08)', bd: 'rgba(99,102,241,0.22)', txt: '#a5b4fc' },
    Conduct: { bg: 'rgba(255,255,255,0.05)', bd: 'rgba(255,255,255,0.15)', txt: 'rgba(255,255,255,0.6)' },
};

const TermsPage = () => {
    return (
        <Layout isFullWidth>


            <div className="legal-page">

                {/* ── Hero ── */}
                <div className="legal-hero" style={{ background: 'var(--raised-bg)', transition: 'background 0.3s' }}>
                    <div className="legal-hero-bg" />
                    <div className="legal-hero-accent" />
                    <div className="legal-hero-watermark">TERMS</div>

                    <div className="max-w-4xl mx-auto relative z-10">
                        <Link to="/" className="back-link">← Back to Home</Link>

                        <div style={{ marginTop: 32 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <div style={{ height: 1, width: 48, background: 'var(--color-accent)', flexShrink: 0 }} />
                                <span className="section-label" style={{ color: 'var(--color-accent)' }}>KDF Airborne Fraternity · 2026 Edition</span>
                            </div>
                            <h1 className="display-heading" style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)', color: 'var(--text-1)' }}>
                                Terms &amp; <span style={{ color: 'var(--color-accent)' }}>Conditions.</span>
                            </h1>
                            <p style={{ marginTop: 20, fontSize: '1rem', color: 'var(--text-2)', maxWidth: 540, lineHeight: 1.72 }}>
                                By registering for Ride With The Warriors, you agree to the following terms.
                                Please read them carefully before completing your entry.
                            </p>
                        </div>

                        {/* Meta strip */}
                        <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                            {[
                                { label: 'Effective Date', value: 'January 2026' },
                                { label: 'Event Date', value: 'July 5, 2026' },
                                { label: 'Jurisdiction', value: 'Republic of Kenya' },
                                { label: 'Articles', value: String(sections.length) },
                            ].map((item, i, arr) => (
                                <>
                                    <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <span style={{ fontSize: '0.65rem', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-3)' }}>{item.label}</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-2)' }}>{item.value}</span>
                                    </div>
                                    {i < arr.length - 1 && <div key={`d${i}`} style={{ width: 1, background: 'var(--border-2)' }} />}
                                </>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Ticker ── */}
                <div className="legal-ticker-wrap" style={{ paddingTop: 10, paddingBottom: 10 }}>
                    <div className="legal-ticker-track">
                        {Array(2).fill(['READ CAREFULLY', 'BINDING AGREEMENT', 'RIDE WITH THE WARRIORS 2026', 'KDF AIRBORNE FRATERNITY', 'KENYA · EAST AFRICA', 'HONOUR THE FALLEN']).flat().map((item, i) => (
                            <span key={i} style={{ padding: '0 32px', fontSize: '0.65rem', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap' }}>
                                {item} <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 8px' }}>◆</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── Sections ── */}
                <div className="max-w-4xl mx-auto px-6 lg:px-12 py-20" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {sections.map((s) => {
                        const tag = tagColors[s.tag] ?? tagColors['Conduct'];
                        return (
                            <div key={s.number} className="terms-section-card">
                                <div className="terms-number-col">
                                    <span className="terms-number">{s.number}</span>
                                    <div className="terms-number-line" />
                                </div>
                                <div>
                                    <div className="terms-section-title">
                                        {s.title}
                                        <span className="terms-tag" style={{ background: tag.bg, border: `1px solid ${tag.bd}`, color: tag.txt }}>
                                            {s.tag}
                                        </span>
                                    </div>
                                    <p className="terms-section-body">{s.body}</p>
                                </div>
                            </div>
                        );
                    })}

                    {/* Agreement block */}
                    <div style={{ marginTop: 24, padding: '36px', border: '1px solid var(--border-1)', background: 'var(--raised-bg)', clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <div style={{ height: 1, width: 36, background: 'var(--color-accent)', flexShrink: 0 }} />
                            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Your Agreement</span>
                        </div>
                        <h2 className="display-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-1)', marginBottom: 16 }}>
                            Ready to <span style={{ color: 'var(--color-primary-light)' }}>Ride?</span>
                        </h2>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.72, maxWidth: 520, marginBottom: 24 }}>
                            By completing registration you confirm you have read, understood, and agree to
                            these Terms & Conditions in full. Questions? Reach out to our team.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                            <Link to="/register/step/1" className="shimmer-btn shimmer-btn--primary">Register Now</Link>
                            <a href="mailto:info@ridewiththewarriors.com" className="shimmer-btn shimmer-btn--ghost">Contact Us</a>
                            <Link to="/privacy" className="shimmer-btn shimmer-btn--ghost">Privacy Policy →</Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default TermsPage;