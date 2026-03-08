import { Link } from 'react-router-dom';
import { AiOutlineArrowRight, AiOutlineClockCircle, AiOutlineDollar, AiOutlineEnvironment } from 'react-icons/ai';
import { MdEmojiEvents } from 'react-icons/md';
import blitzImage from '../assets/images/blitz.jpeg';
import reconImage from '../assets/images/recon.jpeg';
import corporateImage from '../assets/images/corporate.jpeg';
import familyImage from '../assets/images/family.jpeg';

interface CategoryCard {
    id: string;
    title: string;
    distance: string;
    subtitle: string;
    description: string;
    image: string;
    isCompetitive?: boolean;
    price: string;
    time: string;
    route: string;
    accentColor: string;
}

const categories: CategoryCard[] = [
    {
        id: 'blitz',
        title: 'Blitz Circuit',
        distance: '120 KM',
        subtitle: 'Team / Individual — Competitive',
        description: 'The premier competitive long-distance category. Sub-categories include Vanguard/Junior (under 25), Airborne/Elite (25–39), Commanders (40–49), and Veterans (50+). Teams must include at least one lady.',
        image: blitzImage,
        isCompetitive: true,
        price: 'KES 2,000 (Individual) / KES 9,000 (Team)',
        time: '06:00 AM',
        route: 'USCL → Kibiko → Kimuka → Enkang Sidai Resort → USCL',
        accentColor: '#2d6a2d',
    },
    {
        id: 'recon',
        title: 'Recon Circuit',
        distance: '60 KM',
        subtitle: 'Team / Individual — Competitive',
        description: 'The intermediate competitive mid-distance category featuring experienced classification. Teams (must include a lady) and Individuals (male/female). Prize money available.',
        image: reconImage,
        isCompetitive: true,
        price: 'KES 2,000 (Individual) / KES 9,000 (Team)',
        time: '07:30 AM',
        route: 'USCL → Kibiko → Kimuka → USCL',
        accentColor: '#1a6b3a',
    },
    {
        id: 'corporate',
        title: 'Corporate Challenge',
        distance: '30 KM',
        subtitle: 'Team / Individual — Non-Competitive',
        description: 'A non-competitive ride for corporate teams and individuals. Showcase your corporate branding while supporting a great cause. Teams of up to 5 members, must include at least one lady.',
        image: corporateImage,
        price: 'KES 2,000 (Individual) / KES 9,000 (Team)',
        time: '07:00 AM',
        route: 'USCL → Galleria Mall → Langata Rd → Ebul Bul Station → USCL',
        accentColor: '#b45309',
    },
    {
        id: 'family',
        title: 'Family Fun Ride',
        distance: '5 KM',
        subtitle: 'Kids & Parents — Leisure',
        description: 'A safe and fun 5KM ride within the USCL stadium grounds. Sub-categories: Cubs (ages 4–8), Champs (ages 9–13), and Tigers (parents/guardians cycling with kids).',
        image: familyImage,
        price: 'KES 1,000 (Cubs/Champs) / KES 2,000 (Tigers)',
        time: '09:00 AM',
        route: 'Within USCL Stadium',
        accentColor: '#0e7490',
    },
];

const kitSteps = [
    {
        num: '01',
        title: 'Collection Dates',
        body: 'Event kits (bibs, jerseys, and race materials) will be available for collection 2–3 days before the event at the designated venue.',
    },
    {
        num: '02',
        title: 'What You Receive',
        body: 'Your kit includes your BIB number with colour code for your category, an official event jersey (based on your selected T-shirt size), and race-day instructions.',
    },
    {
        num: '03',
        title: 'Collection Location',
        body: 'Kits will be collected at the Ulinzi Sports Complex (USCL), Langata. Bring your registration confirmation and a valid ID for verification.',
    },
];

const Circuits = () => {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600;700&display=swap');

                :root, [data-theme="dark"] {
                    --color-primary: #2d6a2d;
                    --color-primary-dark: #1e4d1e;
                    --color-primary-light: #4caf50;
                    --ci-bg:        #0a0a0a;
                    --ci-card:      #141414;
                    --ci-raised:    #111111;
                    --ci-border:    rgba(255,255,255,0.07);
                    --ci-border-2:  rgba(255,255,255,0.13);
                    --ci-text-1:    #ffffff;
                    --ci-text-2:    rgba(255,255,255,0.58);
                    --ci-text-3:    rgba(255,255,255,0.32);
                    --ci-meta-bg:   rgba(255,255,255,0.04);
                    --ci-kit-bg:    #111111;
                    --ci-kit-cell:  #0e0e0e;
                    --ci-divider:   rgba(255,255,255,0.05);
                }
                [data-theme="light"] {
                    --color-primary: #245924;
                    --color-primary-dark: #1a421a;
                    --color-primary-light: #2d6a2d;
                    --ci-bg:        #f5f2eb;
                    --ci-card:      #ffffff;
                    --ci-raised:    #edeae2;
                    --ci-border:    rgba(0,0,0,0.09);
                    --ci-border-2:  rgba(0,0,0,0.15);
                    --ci-text-1:    #111111;
                    --ci-text-2:    rgba(20,20,20,0.60);
                    --ci-text-3:    rgba(20,20,20,0.38);
                    --ci-meta-bg:   rgba(0,0,0,0.03);
                    --ci-kit-bg:    #ffffff;
                    --ci-kit-cell:  #f9f7f3;
                    --ci-divider:   rgba(0,0,0,0.05);
                }

                .ci-page {
                    font-family: 'Barlow', sans-serif;
                    background: var(--ci-bg);
                    color: var(--ci-text-1);
                    min-height: 100vh;
                    padding: 96px 48px 80px;
                    transition: background 0.3s, color 0.3s;
                }
                @media (max-width: 640px) { .ci-page { padding: 80px 20px 60px; } }
                .ci-inner { max-width: 1400px; margin: 0 auto; }

                /* ── Header ── */
                .ci-header { margin-bottom: 64px; }
                .ci-label-row { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
                .ci-label-line { height: 1px; width: 44px; background: var(--color-primary); flex-shrink: 0; }
                .ci-eyebrow {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.68rem; font-weight: 700;
                    letter-spacing: 0.28em; text-transform: uppercase;
                    color: var(--color-primary-light);
                }
                .ci-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(3.5rem, 8vw, 7rem);
                    letter-spacing: 0.03em; line-height: 0.92;
                    color: var(--ci-text-1); margin-bottom: 16px;
                }
                .ci-title span { color: var(--color-primary-light); }
                .ci-subtitle {
                    font-size: 1rem; font-weight: 300; line-height: 1.75;
                    color: var(--ci-text-2); max-width: 500px;
                }

                /* ── Circuit cards ── */
                .ci-cards { display: flex; flex-direction: column; gap: 3px; margin-bottom: 4px; }

                .ci-card {
                    background: var(--ci-card);
                    border: 1px solid var(--ci-border);
                    display: grid; grid-template-columns: 1fr;
                    overflow: hidden; position: relative;
                    clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%);
                    transition: border-color 0.25s;
                }
                @media (min-width: 900px) {
                    .ci-card { grid-template-columns: 2fr 3fr; }
                    .ci-card:nth-child(even) { grid-template-columns: 3fr 2fr; }
                    .ci-card:nth-child(even) .ci-card-img { order: 2; }
                    .ci-card:nth-child(even) .ci-card-body { order: 1; }
                }
                .ci-card:hover { border-color: rgba(255,255,255,0.15); }

                /* Image pane */
                .ci-card-img {
                    position: relative;
                    height: 260px;
                    overflow: hidden;
                }
                @media (min-width: 900px) { .ci-card-img { height: auto; min-height: 320px; } }
                .ci-card-img img {
                    width: 100%; height: 100%; object-fit: cover; display: block;
                    transition: transform 0.6s ease;
                }
                .ci-card:hover .ci-card-img img { transform: scale(1.04); }
                .ci-card-img-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%);
                }
                .ci-card-img-badges {
                    position: absolute; bottom: 16px; left: 18px;
                    display: flex; flex-wrap: wrap; gap: 6px;
                }
                .ci-distance-badge {
                    display: inline-flex; align-items: center; gap: 5px;
                    padding: 5px 12px;
                    background: rgba(255,255,255,0.12);
                    border: 1px solid rgba(255,255,255,0.25);
                    backdrop-filter: blur(8px);
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.1rem; letter-spacing: 0.05em;
                    color: #fff;
                    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
                }
                .ci-competitive-badge {
                    display: inline-flex; align-items: center; gap: 5px;
                    padding: 4px 10px;
                    background: var(--color-primary);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.6rem; font-weight: 800;
                    letter-spacing: 0.2em; text-transform: uppercase;
                    color: #fff;
                    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
                }

                /* Left accent bar */
                .ci-card-accent {
                    position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
                }

                /* Body pane */
                .ci-card-body {
                    padding: 40px 44px;
                    display: flex; flex-direction: column; justify-content: space-between; gap: 28px;
                    border-left: 1px solid var(--ci-border);
                }
                @media (max-width: 899px) { .ci-card-body { padding: 28px 24px; border-left: none; border-top: 1px solid var(--ci-border); } }

                .ci-card-eyebrow {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.65rem; font-weight: 700;
                    letter-spacing: 0.26em; text-transform: uppercase;
                    color: var(--color-primary-light); margin-bottom: 8px;
                }
                .ci-card-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(2rem, 4vw, 2.8rem);
                    letter-spacing: 0.03em; line-height: 0.95;
                    color: var(--ci-text-1); margin-bottom: 14px;
                }
                .ci-card-desc {
                    font-size: 0.9rem; font-weight: 300; line-height: 1.75;
                    color: var(--ci-text-2);
                }

                /* Meta cells */
                .ci-meta-row {
                    display: grid; grid-template-columns: 1fr;
                    gap: 2px;
                }
                @media (min-width: 540px) { .ci-meta-row { grid-template-columns: repeat(3, 1fr); } }

                .ci-meta-cell {
                    background: var(--ci-meta-bg);
                    border: 1px solid var(--ci-border);
                    padding: 14px 16px;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
                }
                .ci-meta-label {
                    display: flex; align-items: center; gap: 6px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.6rem; font-weight: 700;
                    letter-spacing: 0.2em; text-transform: uppercase;
                    color: var(--ci-text-3); margin-bottom: 6px;
                }
                .ci-meta-label svg { font-size: 0.75rem; }
                .ci-meta-value {
                    font-size: 0.82rem; font-weight: 700;
                    color: var(--ci-text-1); line-height: 1.4;
                }

                /* CTA */
                .ci-register-btn {
                    position: relative; overflow: hidden;
                    display: inline-flex; align-items: center; gap: 10px;
                    padding: 14px 32px; align-self: flex-start;
                    background: var(--color-primary); color: #fff;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.84rem; font-weight: 800;
                    letter-spacing: 0.14em; text-transform: uppercase;
                    text-decoration: none;
                    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
                    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
                }
                .ci-register-btn::before {
                    content: ''; position: absolute; top: 0; left: -80%;
                    width: 60%; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.42) 50%, transparent 80%);
                    transform: skewX(-20deg); pointer-events: none;
                }
                .ci-register-btn:hover::before { left: 140%; transition: left 0.55s cubic-bezier(0.25,0.46,0.45,0.94); }
                .ci-register-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(45,106,45,0.38); background: var(--color-primary-dark); }
                .ci-register-btn svg { transition: transform 0.2s; }
                .ci-register-btn:hover svg { transform: translateX(3px); }

                /* ── Kit section ── */
                .ci-kit {
                    background: var(--ci-kit-bg);
                    border: 1px solid var(--ci-border);
                    padding: 52px 52px;
                    margin-top: 3px;
                    clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%);
                }
                @media (max-width: 640px) { .ci-kit { padding: 32px 24px; } }

                .ci-kit-header { margin-bottom: 44px; }
                .ci-kit-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(2rem, 4vw, 3rem);
                    letter-spacing: 0.03em; color: var(--ci-text-1);
                    margin-top: 8px;
                }

                .ci-kit-grid {
                    display: grid; grid-template-columns: 1fr;
                    gap: 2px;
                }
                @media (min-width: 768px) { .ci-kit-grid { grid-template-columns: repeat(3, 1fr); } }

                .ci-kit-cell {
                    background: var(--ci-kit-cell);
                    border: 1px solid var(--ci-border);
                    padding: 32px 28px;
                    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%);
                    transition: border-color 0.25s, transform 0.25s;
                }
                .ci-kit-cell:hover { border-color: var(--color-primary); transform: translateY(-3px); }

                .ci-kit-num {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 3rem; letter-spacing: 0.03em;
                    color: var(--color-primary-light);
                    line-height: 1; margin-bottom: 16px;
                }
                .ci-kit-step-title {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 1rem; font-weight: 800;
                    letter-spacing: 0.08em; text-transform: uppercase;
                    color: var(--ci-text-1); margin-bottom: 10px;
                }
                .ci-kit-step-body {
                    font-size: 0.88rem; font-weight: 300; line-height: 1.72;
                    color: var(--ci-text-2);
                }
                .ci-kit-step-body strong { color: var(--ci-text-1); font-weight: 700; }
            `}</style>

            <div className="ci-page">
                <div className="ci-inner">

                    {/* ── Header ── */}
                    <div className="ci-header">
                        <div className="ci-label-row">
                            <div className="ci-label-line" />
                            <span className="ci-eyebrow">Race Categories</span>
                        </div>
                        <h1 className="ci-title">
                            The <span>Circuits.</span>
                        </h1>
                        <p className="ci-subtitle">
                            Four circuits for every level of rider. Choose your challenge and register today.
                        </p>
                    </div>

                    {/* ── Circuit cards ── */}
                    <div className="ci-cards">
                        {categories.map((cat) => (
                            <div key={cat.id} className="ci-card">
                                {/* Left accent bar */}
                                <div className="ci-card-accent" style={{ background: cat.accentColor }} />

                                {/* Image */}
                                <div className="ci-card-img">
                                    <img src={cat.image} alt={cat.title} loading="lazy" />
                                    <div className="ci-card-img-overlay" />
                                    <div className="ci-card-img-badges">
                                        <span className="ci-distance-badge">
                                            {cat.distance}
                                        </span>
                                        {cat.isCompetitive && (
                                            <span className="ci-competitive-badge">
                                                <MdEmojiEvents />
                                                Competitive
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="ci-card-body">
                                    <div>
                                        <div className="ci-card-eyebrow">{cat.subtitle}</div>
                                        <div className="ci-card-title">{cat.title}</div>
                                        <p className="ci-card-desc">{cat.description}</p>
                                    </div>

                                    <div className="ci-meta-row">
                                        <div className="ci-meta-cell">
                                            <div className="ci-meta-label"><AiOutlineDollar />Fee</div>
                                            <div className="ci-meta-value">{cat.price}</div>
                                        </div>
                                        <div className="ci-meta-cell">
                                            <div className="ci-meta-label"><AiOutlineClockCircle />Start Time</div>
                                            <div className="ci-meta-value">{cat.time}</div>
                                        </div>
                                        <div className="ci-meta-cell">
                                            <div className="ci-meta-label"><AiOutlineEnvironment />Route</div>
                                            <div className="ci-meta-value">{cat.route}</div>
                                        </div>
                                    </div>

                                    <Link to="/register/step/1" className="ci-register-btn">
                                        Register for {cat.title}
                                        <AiOutlineArrowRight />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Kit section ── */}
                    <div className="ci-kit">
                        <div className="ci-kit-header">
                            <div className="ci-label-row">
                                <div className="ci-label-line" />
                                <span className="ci-eyebrow">Pre-Event Information</span>
                            </div>
                            <div className="ci-kit-title">Kit & Number Collection</div>
                        </div>
                        <div className="ci-kit-grid">
                            {kitSteps.map(step => (
                                <div key={step.num} className="ci-kit-cell">
                                    <div className="ci-kit-num">{step.num}</div>
                                    <div className="ci-kit-step-title">{step.title}</div>
                                    <p className="ci-kit-step-body" dangerouslySetInnerHTML={{ __html: step.body.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Circuits;