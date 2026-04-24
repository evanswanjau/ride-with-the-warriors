import { Link } from 'react-router-dom';
import '../styles/about-us.css';
import { AiOutlineAim, AiOutlineHeart, AiOutlineGlobal, AiOutlineStar } from 'react-icons/ai';
import storyImage from '../assets/images/296A0186-34-min.jpeg';
import teamImage from '../assets/images/296A0075-30-min.jpeg';
import collageImage1 from '../assets/images/collage1.jpeg';
import collageImage2 from '../assets/images/collage2.jpeg';
import collageImage3 from '../assets/images/collage3.jpeg';
import reconImage from '../assets/images/recon-team.jpeg';
import goingGreenImage from '../assets/images/going-green.jpg';

const AboutUs = () => {
    const pillars = [
        { icon: <AiOutlineGlobal />, title: 'Military Diplomacy', number: '01', description: "Enhancing 'Esprit de Corps' and partnerships between the military and civilian world through healthy competition." },
        { icon: <AiOutlineHeart />, title: 'Health & Wellness', number: '02', description: 'Advocating for cycling as a sustainable lifestyle choice for military personnel and their families, aligning with the military\'s focus on combat readiness.' },
        { icon: <AiOutlineAim />, title: 'Community Engagement', number: '03', description: 'Bridging the gap between the military and the public by inviting sponsors, families, and civilians to participate in a shared national event.' },
        { icon: <AiOutlineStar />, title: 'Integrity & Discipline', number: '04', description: 'Adherence to international cycling standards and fair play, reflecting the core values of the Kenya Defence Forces in every aspect of execution.' },
    ];

    const stats = [
        { value: '500+', label: 'Riders Expected' },
        { value: '4', label: 'Race Circuits' },
        { value: 'July 5', label: '2026 Edition' },
        { value: '120 KM', label: 'Longest Route' },
    ];

    return (
        <>


            <div className="page" style={{ padding: '96px 48px 80px' }}>
                <div className="page-inner">

                    {/* ── Header ── */}
                    <div className="page-section">
                        <div className="page-label-row">
                            <div className="page-label-line" />
                            <span className="page-eyebrow">Our Story</span>
                        </div>
                        <h1 className="page-display page-title">About <span className="page-accent">Us.</span></h1>
                        <p className="page-subtitle">A premier multi-national cycling movement rooted in service, unity, fitness, and honour.</p>
                    </div>

                    {/* ── Mission Quote ── */}
                    <div className="page-section ab-quote-panel">
                        <div className="ab-quote-mark">"</div>
                        <div className="ab-quote-text">
                            Ride with Honour —{' '}
                            <span className="ab-accent">Supporting the Widows</span>
                        </div>
                        <p className="ab-quote-sub">
                            The powerful theme for RWTW 2026 — raising awareness and support for military widows,
                            ensuring the families of fallen warriors are never forgotten.
                        </p>
                    </div>

                    {/* ── Our Story ── */}
                    <div className="page-section ab-story-grid">
                        {/* Text — sticky */}
                        <div className="ab-sticky">
                            <div className="page-label-row">
                                <div className="page-label-line" />
                                <span className="page-eyebrow">Our Story</span>
                            </div>
                            <h2 className="ab-display" style={{ fontSize: 'clamp(2.8rem,5vw,4.5rem)', marginBottom: 28 }}>
                                From the Barracks<br />to the <span className="ab-accent">Open Road</span>
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                <p className="ab-body">
                                    Ride With The Warriors (RWTW) is a premier multi-national cycling event hosted by the Kenya Defence Forces (KDF) Airborne Fraternity. Designed to be more than just a race, it serves as a strategic platform to strengthen regional military cooperation and promote physical fitness.
                                </p>
                                <p className="ab-body">
                                    It fosters a spirit of inclusivity through the participation of military families, civilians, and corporate partners, creating a unique bond through sport.
                                </p>
                            </div>
                        </div>

                        {/* Mosaic */}
                        <div className="ab-story-mosaic">
                            <div className="ab-img-frame ab-mosaic-main">
                                <img src={storyImage} alt="RWTW riders in action" />
                            </div>
                            <div className="ab-mosaic-row">
                                {[collageImage1, collageImage2, collageImage3].map((src, i) => (
                                    <div key={i} className="ab-img-frame ab-mosaic-thumb">
                                        <img src={src} alt="RWTW collage" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── History ── */}
                    <div className="page-section ab-two-col">
                        <div className="ab-img-frame ab-img-hero">
                            <img src={reconImage} alt="RWTW history" />
                        </div>
                        <div>
                            <div className="page-label-row">
                                <div className="page-label-line" />
                                <span className="page-eyebrow">History</span>
                            </div>
                            <h2 className="ab-display" style={{ fontSize: 'clamp(2.8rem,5vw,4.5rem)', marginBottom: 24 }}>
                                Building a <span className="ab-accent">Legacy.</span>
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <p className="ab-body">
                                    The first edition took place in July 2025 in preparation for the Airborne at 60 years celebration.
                                    It was a resounding success, uniting soldiers and civilians on the roads of Nairobi.
                                </p>
                                <p className="ab-body">
                                    The 2026 edition is scheduled for{' '}
                                    <strong style={{ color: 'var(--ab-text-1)', fontWeight: 700 }}>05 July 2026</strong>{' '}
                                    at the <strong style={{ color: 'var(--ab-text-1)', fontWeight: 700 }}>Ulinzi Sports Complex (USCL)</strong> in Nairobi, set against Kenya's scenic terrain.
                                </p>
                            </div>
                            <div className="ab-event-meta">
                                <div>
                                    <div className="ab-meta-value">05</div>
                                    <div className="ab-meta-label">July 2026</div>
                                </div>
                                <div className="ab-meta-divider" />
                                <div>
                                    <div className="ab-meta-value">USCL</div>
                                    <div className="ab-meta-label">Nairobi, Kenya</div>
                                </div>
                                <div className="ab-meta-divider" />
                                <div>
                                    <div className="ab-meta-value">2nd</div>
                                    <div className="ab-meta-label">Edition</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Stats ── */}
                    <div className="page-section ab-stats">
                        <div className="ab-stat-glow" />
                        {stats.map((s, i) => (
                            <div key={i} className="ab-stat-cell">
                                <div className="ab-stat-value">{s.value}</div>
                                <div className="ab-stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* ── Pillars ── */}
                    <div className="page-section">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 52 }}>
                            <div className="ab-label-row" style={{ marginBottom: 10 }}>
                                <div className="page-label-line" />
                                <span className="page-eyebrow">Our Pillars</span>
                            </div>
                            <h2 className="ab-display" style={{ fontSize: 'clamp(2.8rem,5.5vw,5rem)' }}>
                                What We <span className="ab-accent">Stand For.</span>
                            </h2>
                            <p style={{ fontSize: '0.9rem', color: 'var(--ab-text-3)', maxWidth: 380, lineHeight: 1.75 }}>
                                Four foundational values that drive every aspect of the Ride With The Warriors experience.
                            </p>
                        </div>
                        <div className="ab-pillars-grid">
                            {pillars.map((p, i) => (
                                <div key={i} className="ab-pillar-card">
                                    <div className="ab-pillar-num">{p.number}</div>
                                    <div className="ab-pillar-icon">{p.icon}</div>
                                    <div className="ab-pillar-title">{p.title}</div>
                                    <p className="ab-pillar-desc">{p.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Impact & Legacy ── */}
                    <div className="page-section ab-two-col">
                        <div style={{ order: 2 }}>
                            <div className="page-label-row">
                                <div className="page-label-line" />
                                <span className="page-eyebrow">Impact & Legacy</span>
                            </div>
                            <h2 className="ab-display" style={{ fontSize: 'clamp(2.8rem,5vw,4.5rem)', marginBottom: 24 }}>
                                Setting a New <span className="ab-accent">Benchmark.</span>
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <p className="ab-body">
                                    RWTW 2026 aims to set a new benchmark for military-organized sporting events in East Africa. By combining high-stakes professional racing with family-oriented activities, the event provides sponsors with a unique audience while reinforcing Kenya's position as a regional hub for sports diplomacy.
                                </p>
                                <p className="ab-body">
                                    Four main circuits — Blitz (120km), Recon (60km), Corporate Challenge (30km), and Family Fun Ride (5km) — with 12 races across ages, genders, teams, and classifications.
                                </p>
                                <p className="ab-body">
                                    Beyond competition, RWTW serves as a powerful platform to honour and support military widows, ensuring the families of fallen warriors are never forgotten.
                                </p>
                            </div>
                        </div>
                        <div className="ab-img-frame ab-img-hero" style={{ order: 1 }}>
                            <img src={teamImage} alt="KDF Airborne Fraternity" />
                        </div>
                    </div>

                    {/* ── Going Green ── */}
                    <div id="going-green" className="page-section ab-two-col">
                        <div>
                            <div className="page-label-row">
                                <div className="page-label-line" />
                                <span className="page-eyebrow">Going Green</span>
                            </div>
                            <h2 className="ab-display" style={{ fontSize: 'clamp(2.8rem,5vw,4.5rem)', marginBottom: 24 }}>
                                A <span className="ab-accent">Greener</span> Future.
                            </h2>
                            <p className="ab-body" style={{ lineHeight: '1.8' }}>
                                Climate change is a major threat multiplier and has profound implications on national, regional and global security. This threat continues to destabilize societies across the world by exacerbating poverty, resource scarcity and political instability leading to conflict and social unrest. Cycling is a powerful tool in combating climate change that provides many benefits to the environment and the entire society by reducing emission of greenhouses gases and providing an alternative sustainable and cheap transport system. When linked with a structured urban mobility plan that factors cycling infrastructure the effects will significantly decrease vehicular traffic and lead to lower emissions. By embracing cycling this community seeks actively contribute towards a sustainable, emission free and eco-friendly environment.
                            </p>
                        </div>
                        <div className="ab-img-frame ab-img-hero">
                            <img src={goingGreenImage} alt="Going Green Initiative" />
                        </div>
                    </div>

                    {/* ── CTA ── */}
                    <div className="ab-cta">
                        <div className="ab-cta-glow-a" />
                        <div className="ab-cta-glow-b" />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div className="ab-cta-eyebrow">
                                <div className="ab-cta-dot" />
                                Join the Movement
                            </div>
                        </div>
                        <h2 className="ab-display ab-cta-title">
                            Ready to <span className="ab-accent">Ride?</span>
                        </h2>
                        <p className="ab-cta-body">
                            Join hundreds of riders on July 5th, 2026 at the <strong style={{ color: '#fff', fontWeight: 700 }}>Ulinzi Sports Complex</strong>.
                            Whether you're a pro cyclist or bringing the family, there's a circuit for you.
                        </p>
                        <div className="ab-cta-btns">
                            <Link to="/register/step/1" className="shimmer-btn shimmer-btn--primary">
                                Register for RWTW 2026 →
                            </Link>
                            <Link to="/circuits" className="shimmer-btn shimmer-btn--ghost">
                                Explore Circuits
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default AboutUs;