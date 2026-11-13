import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineTeam, AiOutlineTrophy } from 'react-icons/ai';
import Countdown from '../components/common/Countdown';
import RecapPhotos from '../components/common/RecapPhotos';
import { EDITION, PAST_EDITION, phaseAt } from '../config/edition';
import { primaryCta } from '../config/cta';
import { HERO_HIGHLIGHT, HOME_COLLAGE, highlightImgProps } from '../data/highlights';
import kdfLogo from '../assets/logos/web/kdf.webp';
import logo from '../assets/logos/web/logo.webp';
import equity from '../assets/logos/web/equity.webp';
import dedsilva from '../assets/logos/web/dedsilva.webp';
import isuzu from '../assets/logos/web/isuzu.webp';
import gigamsys from '../assets/logos/web/gigamsys.webp';
import stanfajoy from '../assets/logos/web/stanfajoy.webp';
import wld from '../assets/logos/web/wld.webp';
import fdsaLogo from '../assets/logos/fdsa-logo.png';

import '../styles/home.css';


/* ─── Testimonials Data ──────────────────────────────────────────────────── */
const testimonials = [
    { text: 'Crossing that finish line knowing every kilometre raised money for the widows — nothing else compares to that feeling.', name: 'James Mwangi', role: 'Veteran Cyclist', circuit: '120KM Blitz', initials: 'JM' },
    { text: 'The organisation was flawless. Seeing active-duty soldiers and civilians riding together was genuinely moving.', name: 'Sarah Kamau', role: 'Competitive Cyclist, Nairobi', circuit: '60KM Recon', initials: 'SK' },
    { text: 'We entered as a corporate team of eight and finished as brothers. Back with double the team for 2026.', name: 'David Ochieng', role: 'Team Lead, Safaricom', circuit: '30KM Corporate', initials: 'DO' },
    { text: 'My daughter kept saying it was the best day of her life. We have already registered for the next edition.', name: 'Amina Hassan', role: 'Parent & Recreational Rider', circuit: '5KM Family Fun', initials: 'AH' },
    { text: 'As a Paratrooper, this event sits close to the heart. The camaraderie on that course is something you only understand by being there.', name: 'Peter Njoroge', role: 'KDF Airborne Paratrooper', circuit: '120KM Blitz', initials: 'PN' },
    { text: 'Won a stunning mountain bike in the raffle. More importantly, I learned about the incredible work done for military families.', name: 'Grace Wambui', role: 'Raffle Winner, 2025', circuit: 'Grand Raffle', initials: 'GW' },
    { text: 'The 60KM route was punishing in the best way. Proper race-quality design — I have done many sportives and this held its own.', name: 'Brian Otieno', role: 'Amateur Racer', circuit: '60KM Recon', initials: 'BO' },
    { text: 'Never thought I would ride alongside soldiers. By kilometre 20 we were just riders, all chasing the same goal.', name: 'Linet Chebet', role: 'First-Time Participant', circuit: '30KM Corporate', initials: 'LC' },
];

/* ─── Testimonial Card ───────────────────────────────────────────────────── */
interface Testimonial {
    text: string;
    name: string;
    role: string;
    circuit: string;
    initials: string;
}

const TestimonialCard = ({ t }: { t: Testimonial }) => (
    <div className="t-card">
        <div className="t-stars">★★★★★</div>
        <p className="t-text">"{t.text}"</p>
        <div className="t-footer">
            <div className="t-avatar">{t.initials}</div>
            <div className="t-author">
                <div className="t-name">{t.name}</div>
                <div className="t-meta">{t.role}</div>
            </div>
            <div className="t-badge">{t.circuit}</div>
        </div>
    </div>
);

/* ─── Testimonials Section ───────────────────────────────────────────────── */
const TestimonialsSection = () => {
    const row1 = testimonials;
    const row2 = [...testimonials].reverse();
    return (
        <section className="t-section">
            <div className="t-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ height: 1, width: 48, background: 'var(--color-primary)', flexShrink: 0 }} />
                    <span className="section-label">Voices From Past Editions</span>
                </div>
                <h2 className="display-heading t-heading">
                    Riders Don't <span style={{ color: 'var(--color-primary-light)' }}>Forget.</span>
                </h2>
            </div>
            {/* Row 1 — scroll left */}
            <div className="t-mask">
                <div className="t-track t-track-left">
                    {[...row1, ...row1].map((t, i) => <TestimonialCard key={`a${i}`} t={t} />)}
                </div>
            </div>
            {/* Row 2 — scroll right */}
            <div className="t-mask" style={{ marginTop: 14 }}>
                <div className="t-track t-track-right">
                    {[...row2, ...row2].map((t, i) => <TestimonialCard key={`b${i}`} t={t} />)}
                </div>
            </div>
        </section>
    );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const HomePage = () => {
    const heroRef = useRef<HTMLImageElement>(null);
    const cta = primaryCta();
    const phase = phaseAt();

    useEffect(() => {
        let ticking = false;
        const updateParallax = () => {
            if (heroRef.current) {
                const scrollY = window.scrollY;
                if (scrollY < 1200) {
                    heroRef.current.style.transform = `translateY(${scrollY * 0.35}px)`;
                }
            }
            ticking = false;
        };
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const keyDates = [
        { title: 'Pre-register now', detail: 'Be first to know' },
        { title: `Registration opens ${EDITION.registrationOpensLabel}`, detail: '00:00 EAT' },
        { title: `Closes ${EDITION.registrationClosesLabel} or at ${EDITION.riderCap.toLocaleString('en-US')} riders`, detail: 'Whichever comes first' },
        { title: `Race day ${EDITION.raceDayLabel.replace('Sunday ', '')}`, detail: EDITION.venue },
    ];
    const activeStep = { 'pre-registration': 0, 'registration-open': 2, 'registration-closed': 3, 'post-race': 3 }[phase];

    const circuits = [
        { number: '120', name: 'Blitz Circuit', type: 'Competitive', distance: '120 KM', description: 'The ultimate endurance test for elite cyclists pushing their absolute limits.' },
        { number: '60', name: 'Recon Circuit', type: 'Competitive', distance: '60 KM', description: 'A perfect balance of speed and stamina for seasoned riders.' },
        { number: '30', name: 'Corporate', type: 'Non-Competitive', distance: '30 KM', description: 'Build team spirit and network while enjoying a scenic ride.' },
        { number: '5', name: 'Family Fun', type: 'Leisure', distance: '5 KM', description: 'A safe and enjoyable route for families and beginners of all ages.' },
    ];

    return (
        <>
            <div className="rwtw-page min-h-screen">

                {/* ── Hero ─────────────────────────────────────────────── */}
                <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            ref={heroRef}
                            {...highlightImgProps(HERO_HIGHLIGHT, '100vw')}
                            fetchPriority="high"
                            data-testid="home-hero-img"
                            className="w-full h-[130%] -top-[15%] absolute object-cover object-top will-change-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-black/30" />
                        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/60 via-transparent to-transparent" />
                    </div>
                    <div className="grid-line absolute top-0 left-[33%] w-px h-full" />
                    <div className="grid-line absolute top-0 left-[66%] w-px h-full" />

                    <div className="relative z-10 w-full pb-20 pt-32">
                        <div className="max-w-7xl mx-auto px-6 lg:px-12">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-px w-12 bg-[var(--color-primary)]" />
                                <span className="section-label" style={{ color: '#4caf50' }}>{`${EDITION.ordinal} Edition — KDF Airborne Fraternity`}</span>
                            </div>
                            <h1 className="display-heading text-[clamp(3.2rem,10vw,8rem)] text-white mb-2">
                                Ride for the<br />
                                <span style={{ color: 'var(--color-primary-light)' }}>Warrior Within.</span>
                            </h1>
                            <div className="flex flex-col md:flex-row md:items-end gap-10 mt-8">
                                <div className="flex flex-col gap-8">
                                    <p className="text-white/60 text-lg max-w-xl leading-relaxed font-light">
                                        {EDITION.theme}
                                    </p>
                                    <Countdown className="text-white" />
                                </div>
                                <div className="flex flex-wrap gap-4 md:ml-auto md:pb-1">
                                    <Link to={cta.to} className="shimmer-btn shimmer-btn--primary">{cta.label}</Link>
                                    <Link to="/2026" className="shimmer-btn shimmer-btn--ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}>See 2026 highlights</Link>
                                </div>
                            </div>
                            <div className="mt-12 flex items-center gap-4">
                                <div className="flex items-center gap-2 text-white/40 text-sm font-semibold tracking-widest uppercase">
                                    <span className="inline-block w-2 h-2 bg-[var(--color-primary-light)]" />
                                    {EDITION.raceDayLabel}
                                </div>
                                <div className="h-px flex-1 max-w-[200px] bg-white/10" />
                                <div className="text-white/40 text-sm font-semibold tracking-widest uppercase">{EDITION.venue}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Ticker ───────────────────────────────────────────── */}
                <div className="ticker-wrap py-3">
                    <div className="ticker-track">
                        {Array(2).fill([
                            'RIDE WITH THE WARRIORS', EDITION.raceDayLabel.toUpperCase(), 'KDF AIRBORNE FRATERNITY',
                            `REGISTRATION OPENS ${EDITION.registrationOpensLabel.toUpperCase()}`, 'HONOUR THE FALLEN', EDITION.venue.toUpperCase(),
                            'SUPPORTING THE WIDOWS', EDITION.shortName, '4 CIRCUITS',
                        ]).flat().map((item, i) => (
                            <span key={i} className="px-8 text-xs font-bold tracking-[0.25em] text-white/80 whitespace-nowrap">
                                {item} <span className="text-white/30 mx-2">◆</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── Key dates ────────────────────────────────────────── */}
                <section style={{ background: 'var(--stat-bg)', borderTop: '1px solid var(--border-1)', borderBottom: '1px solid var(--border-1)', transition: 'background 0.3s' }}>
                    <ol className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 list-none m-0" data-testid="key-dates">
                        {keyDates.map((step, idx) => {
                            const active = idx === activeStep;
                            return (
                                <li
                                    key={step.title}
                                    aria-current={active ? 'step' : undefined}
                                    className="py-8 md:px-6 first:md:pl-0 flex flex-col gap-2"
                                    style={{
                                        borderRight: idx < 3 ? '1px solid var(--border-1)' : 'none',
                                        borderBottom: idx < 3 ? '1px solid var(--border-1)' : 'none',
                                        borderTop: active ? '3px solid var(--color-primary-light)' : '3px solid transparent',
                                    }}
                                >
                                    <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: active ? 'var(--color-primary-light)' : 'var(--text-3)' }}>
                                        Step {idx + 1}{active ? ' · Now' : ''}
                                    </div>
                                    <div className="display-heading text-3xl" style={{ color: 'var(--text-1)' }}>{step.title}</div>
                                    <div className="text-sm" style={{ color: 'var(--text-3)' }}>{step.detail}</div>
                                </li>
                            );
                        })}
                    </ol>
                </section>

                {/* ── About / Mission ──────────────────────────────────── */}
                <section className="py-28 px-6 lg:px-12 relative overflow-hidden" style={{ background: 'var(--page-bg)', transition: 'background 0.3s' }}>
                    <div className="absolute inset-y-0 right-0 w-1/2 pointer-events-none"
                        style={{ background: 'var(--about-accent-bg)', clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)' }} />

                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-3 pt-10">
                                <div className="img-hover-frame h-[350px] w-full overflow-hidden" style={{ clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)' }}><img {...highlightImgProps(HOME_COLLAGE[0], '(min-width: 1024px) 25vw, 50vw')} loading="lazy" data-testid="home-collage-img" className="w-full h-full object-cover" /></div>
                                <div className="img-hover-frame h-[350px] w-full overflow-hidden" style={{ clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)' }}><img {...highlightImgProps(HOME_COLLAGE[1], '(min-width: 1024px) 25vw, 50vw')} loading="lazy" data-testid="home-collage-img" className="w-full h-full object-cover" /></div>
                            </div>
                            <div className="space-y-3">
                                <div className="img-hover-frame h-[350px] w-full overflow-hidden" style={{ clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)' }}><img {...highlightImgProps(HOME_COLLAGE[2], '(min-width: 1024px) 25vw, 50vw')} loading="lazy" data-testid="home-collage-img" className="w-full h-full object-cover" /></div>
                                <div className="img-hover-frame h-[350px] w-full overflow-hidden" style={{ clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)' }}><img {...highlightImgProps(HOME_COLLAGE[3], '(min-width: 1024px) 25vw, 50vw')} loading="lazy" data-testid="home-collage-img" className="w-full h-full object-cover" /></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px w-12 bg-[var(--color-primary)]" />
                                <span className="section-label">Our Mission</span>
                            </div>
                            <h2 className="display-heading text-[clamp(3rem,6vw,5.5rem)] mb-8" style={{ color: 'var(--text-1)' }}>
                                More Than<br />Just A <span style={{ color: 'var(--color-primary-light)' }}>Race.</span>
                            </h2>
                            <p className="text-lg leading-relaxed mb-10" style={{ color: 'var(--text-2)' }}>
                                Ride With The Warriors is a fusion of elite cycling challenge and military tradition.
                                The {EDITION.year} edition rides for the Warrior Within, raising awareness of soldiers' mental health
                                while uniting civilians and soldiers in a shared test of endurance — and making
                                a real difference for the families left behind.
                            </p>
                            <div className="space-y-0 mb-12" style={{ borderTop: '1px solid var(--border-1)' }}>
                                {[
                                    { icon: <AiOutlineTrophy />, title: 'World-Class Challenge', text: 'Four circuits designed to test every level of cyclist, from the elite 120KM to the family 5KM.' },
                                    { icon: <AiOutlineTeam />, title: 'Honour The Fallen', text: 'Every pedal stroke supports the widows and families of our fallen heroes through the KDF Airborne Fraternity.' },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-5 py-6 group cursor-default" style={{ borderBottom: '1px solid var(--border-1)' }}>
                                        <div className="w-10 h-10 flex items-center justify-center text-lg shrink-0 transition-all"
                                            style={{ border: '1px solid var(--border-2)', color: 'var(--color-primary-light)' }}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1 tracking-wide" style={{ color: 'var(--text-1)' }}>{item.title}</h4>
                                            <p className="text-sm" style={{ color: 'var(--text-3)' }}>{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link to="/about" className="shimmer-btn shimmer-btn--primary">Read Our Full Story →</Link>
                        </div>
                    </div>
                </section>

                {/* ── Circuits ─────────────────────────────────────────── */}
                <section className="py-28 px-6 lg:px-12" style={{ background: 'var(--raised-bg)', transition: 'background 0.3s' }}>
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-16">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-px w-12 bg-[var(--color-primary)]" />
                                    <span className="section-label">Race Categories</span>
                                </div>
                                <h2 className="display-heading text-[clamp(3rem,6vw,5rem)]" style={{ color: 'var(--text-1)' }}>
                                    Choose Your<br />Challenge.
                                </h2>
                            </div>
                            <p className="max-w-xs leading-relaxed md:ml-auto md:text-right text-sm" style={{ color: 'var(--text-3)' }}>
                                Four circuits for every level — from elite 120KM racers to 5KM family fun rides.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {circuits.map((circuit, idx) => (
                                <Link key={idx} to="/circuits" className="circuit-card block p-8 border">
                                    <div className="circuit-shimmer" />
                                    <div className="circuit-number">{circuit.number}</div>
                                    <div className="relative z-10">
                                        <div className="inline-block px-3 py-1 mb-8 text-xs font-bold uppercase tracking-wider"
                                            style={{ background: 'rgba(45,106,45,0.1)', border: '1px solid rgba(45,106,45,0.3)', color: 'var(--color-primary-light)' }}>
                                            {circuit.distance}
                                        </div>
                                        <h3 className="display-heading text-3xl mb-1" style={{ color: 'var(--text-1)' }}>{circuit.name}</h3>
                                        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-3)' }}>{circuit.type}</p>
                                        <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-2)' }}>{circuit.description}</p>
                                        <span className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-primary-light)' }}>Learn more →</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-10 flex justify-end">
                            <Link to="/circuits" className="shimmer-btn shimmer-btn--primary">View All Categories</Link>
                        </div>
                    </div>
                </section>





                {/* ── 2026 Recap ───────────────────────────────────────── */}
                <section className="py-24 px-6 lg:px-12" style={{ background: 'var(--page-bg)', transition: 'background 0.3s' }} data-testid="home-recap">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-px w-12 bg-[var(--color-primary)]" />
                            <span className="section-label">{PAST_EDITION.year} Recap</span>
                        </div>
                        <h2 className="display-heading text-[clamp(3rem,6vw,5rem)] mb-12" style={{ color: 'var(--text-1)' }}>
                            See What You <span style={{ color: 'var(--color-primary-light)' }}>Missed.</span>
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
                            <div className="lg:col-span-3 grid grid-cols-3 gap-4">
                                {[
                                    { value: PAST_EDITION.riders, label: 'riders' },
                                    { value: PAST_EDITION.participants, label: 'participants' },
                                    { value: PAST_EDITION.ordinal, label: 'edition' },
                                ].map((t) => (
                                    <div key={t.label} className="border p-6 flex flex-col gap-2 justify-center" style={{ borderColor: 'var(--border-1)', background: 'var(--raised-bg)' }}>
                                        <div className="display-heading text-4xl md:text-5xl" style={{ color: 'var(--text-1)' }}>{t.value}</div>
                                        <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-3)' }}>{t.label}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="lg:col-span-2 border p-6 flex flex-col gap-2" style={{ borderColor: 'var(--border-1)', background: 'var(--raised-bg)' }}>
                                <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">The ticket that won the car</div>
                                <div className="display-heading text-6xl text-amber-500" data-testid="car-ticket">{PAST_EDITION.carTicket}</div>
                                <Link to="/raffle-winners" className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-primary-light)' }}>
                                    All raffle winners →
                                </Link>
                            </div>
                        </div>

                        <RecapPhotos count={4} />

                        <div className="mt-10 flex flex-wrap gap-4">
                            <Link to="/2026" className="shimmer-btn shimmer-btn--primary">Highlights</Link>
                            <Link to="/gallery?year=2026" className="shimmer-btn shimmer-btn--ghost">Photos</Link>
                            <Link to="/results" className="shimmer-btn shimmer-btn--ghost">Results</Link>
                        </div>
                    </div>
                </section>

                {/* ── Testimonials ─────────────────────────────────────── */}
                <TestimonialsSection />

                {/* ── CTA Band ─────────────────────────────────────────── */}
                <section className="py-28 px-6 lg:px-12 cta-band relative overflow-hidden" style={{ background: 'var(--page-bg)', transition: 'background 0.3s' }}>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                        <span className="display-heading text-[20vw] whitespace-nowrap select-none" style={{ color: 'var(--text-1)', opacity: 0.02 }}>
                            RIDE {EDITION.year}
                        </span>
                    </div>
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-12">
                            <div className="flex-none max-w-md">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-px w-12 bg-[var(--color-accent)]" />
                                    <span className="section-label" style={{ color: 'var(--color-accent)' }}>Join The Movement</span>
                                </div>
                                <h2 className="display-heading text-[clamp(3.5rem,7vw,7rem)]" style={{ color: 'var(--text-1)' }}>
                                    Ready To<br /><span style={{ color: 'var(--color-primary-light)' }}>Ride?</span>
                                </h2>
                                <p className="mt-6 text-lg max-w-md leading-relaxed" style={{ color: 'var(--text-3)' }}>
                                    Registration opens {EDITION.registrationOpensLabel}. Pre-register and
                                    we'll tell you first.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                <Link to={cta.to} className="shimmer-btn shimmer-btn--primary text-center">{cta.label}</Link>
                                <Link to="/feedback" className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-primary-light)' }}>
                                    Give feedback on {PAST_EDITION.year}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Flying Doctors Safety Partner ── */}
                <section className="py-14 px-6 lg:px-12 border-t" style={{ borderColor: 'var(--border-1)', background: 'var(--page-bg)', transition: 'background 0.3s' }}>
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
                        <div className="flex-none flex items-center justify-center w-32 h-32 border" style={{ borderColor: 'var(--border-2)', background: 'rgba(255,255,255,0.04)', clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
                            <img src={fdsaLogo} alt="Flying Doctors Society of Africa" width={80} height={77} loading="lazy" decoding="async" className="h-20 w-auto object-contain" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                                <div className="h-px w-8 bg-red-500 flex-shrink-0" />
                                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#ef4444' }}>Official Safety Partner</span>
                            </div>
                            <h3 className="display-heading text-3xl mb-3" style={{ color: 'var(--text-1)' }}>Flying Doctors Society of Africa</h3>
                            <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'var(--text-2)' }}>
                                As an {EDITION.shortName} participant, we strongly recommend enrolling in Flying Doctors' Emergency Medical Evacuation membership — ensuring access to air rescue and emergency medical services throughout the event and beyond.
                            </p>
                        </div>
                        <div className="flex-none">
                            <a
                                href="https://forms.office.com/r/HUT4VV2juN"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shimmer-btn shimmer-btn--primary whitespace-nowrap"
                            >
                                Enroll Now →
                            </a>
                        </div>
                    </div>
                </section>

                {/* ── Sponsors Carousel ── */}
                <section className="py-12 px-6 overflow-hidden border-t border-b" style={{ borderColor: 'var(--border-1)', background: 'var(--raised-bg)', transition: 'background 0.3s' }}>
                    <div className="max-w-7xl mx-auto mb-8 text-center flex flex-col items-center">
                        <div className="h-px w-12 bg-[var(--color-primary)] mb-4" />
                        <span className="section-label">Our Proud Sponsors &amp; Partners</span>
                    </div>
                    <div className="sp-mask">
                        <div className="sp-track">
                            {[...Array(2)].flatMap((_, pass) =>
                                [
                                    { src: kdfLogo, alt: 'KDF', h: 'h-24' },
                                    { src: isuzu, alt: 'Isuzu', h: 'h-28' },
                                    { src: logo, alt: 'Airborne Fraternity', h: 'h-28' },
                                    { src: equity, alt: 'Equity Bank', h: 'h-28' },
                                    { src: dedsilva, alt: 'Dedsilva', h: 'h-24' },
                                    { src: gigamsys, alt: 'GigamSys', h: 'h-20' },
                                    { src: stanfajoy, alt: 'Stanfa Joy', h: 'h-24' },
                                    { src: wld, alt: 'WLD', h: 'h-24' },
                                    { src: fdsaLogo, alt: 'Flying Doctors Society of Africa', h: 'h-24', cls: 'sp-logo-fdsa' },
                                ].map((s, i) => (
                                    <div key={`${pass}-${i}`} className={`sp-logo-wrap flex-shrink-0 flex items-center justify-center ${'cls' in s ? s.cls : ''}`} aria-hidden={pass === 1}>
                                        <img src={s.src} alt={s.alt} loading="lazy" decoding="async" className={`${s.h} w-auto object-contain`} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

            </div>

        </>
    );
};

export default HomePage;