import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineCalendar, AiOutlineEnvironment, AiOutlineTeam, AiOutlineTrophy } from 'react-icons/ai';
import heroImage from '../assets/images/hero.jpeg';
import highlightImage1 from '../assets/images/296A0069-28-min.jpeg';
import highlightImage2 from '../assets/images/296A0184-33-min.jpeg';
import highlightImage3 from '../assets/images/296A0219-40-min.jpeg';

import RaffleHomeSection from '../components/base/RaffleHomeSection';
import '../styles/home.css';


/* ─── Testimonials Data ──────────────────────────────────────────────────── */
const testimonials = [
    { text: 'Crossing that finish line knowing every kilometre raised money for the widows — nothing else compares to that feeling.', name: 'Col. James Mwangi (Ret.)', role: 'Veteran Cyclist', circuit: '120KM Blitz', initials: 'JM' },
    { text: 'The organisation was flawless. Seeing active-duty soldiers and civilians riding together was genuinely moving.', name: 'Sarah Kamau', role: 'Competitive Cyclist, Nairobi', circuit: '60KM Recon', initials: 'SK' },
    { text: 'We entered as a corporate team of eight and finished as brothers. Back with double the team for 2026.', name: 'David Ochieng', role: 'Team Lead, Safaricom', circuit: '30KM Corporate', initials: 'DO' },
    { text: 'My daughter kept saying it was the best day of her life. We have already registered for the next edition.', name: 'Amina Hassan', role: 'Parent & Recreational Rider', circuit: '5KM Family Fun', initials: 'AH' },
    { text: 'As a Paratrooper, this event sits close to the heart. The camaraderie on that course is something you only understand by being there.', name: 'Capt. Peter Njoroge', role: 'KDF Airborne Paratrooper', circuit: '120KM Blitz', initials: 'PN' },
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
                    <span className="section-label">Voices From The 2025 Edition</span>
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

    const stats = [
        { icon: <AiOutlineTeam />, value: '500+', label: 'Riders Expected' },
        { icon: <AiOutlineTrophy />, value: '4', label: 'Race Circuits' },
        { icon: <AiOutlineCalendar />, value: 'July 5', label: '2026 Edition' },
        { icon: <AiOutlineEnvironment />, value: '120 KM', label: 'Longest Route' },
    ];

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
                            src={heroImage}
                            alt="Ride With The Warriors"
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
                                <span className="section-label" style={{ color: '#4caf50' }}>2nd Edition — KDF Airborne Fraternity</span>
                            </div>
                            <h1 className="display-heading text-[clamp(4rem,12vw,9rem)] text-white mb-2">
                                Ride With<br />
                                The <span style={{ color: 'var(--color-primary-light)' }}>Warriors</span>
                            </h1>
                            <div className="flex flex-col md:flex-row md:items-end gap-10 mt-8">
                                <p className="text-white/60 text-lg max-w-md leading-relaxed font-light">
                                    A premier multi-national cycling event. Ride with honour —
                                    <span className="text-white/90 font-semibold"> supporting the widows</span> of our fallen heroes.
                                </p>
                                <div className="flex flex-wrap gap-4 md:ml-auto md:pb-1">
                                    <Link to="/register/step/1" className="shimmer-btn shimmer-btn--primary">Register to Cycle</Link>
                                    <Link to="/raffle/step/1" className="shimmer-btn shimmer-btn--amber">Buy Raffle Tickets</Link>
                                    <Link to="/about" className="shimmer-btn shimmer-btn--ghost">Learn More</Link>
                                </div>
                            </div>
                            <div className="mt-12 flex items-center gap-4">
                                <div className="flex items-center gap-2 text-white/40 text-sm font-semibold tracking-widest uppercase">
                                    <span className="inline-block w-2 h-2 bg-[var(--color-primary-light)]" />
                                    05 July 2026
                                </div>
                                <div className="h-px flex-1 max-w-[200px] bg-white/10" />
                                <div className="text-white/40 text-sm font-semibold tracking-widest uppercase">Ulinzi Sports Complex</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Ticker ───────────────────────────────────────────── */}
                <div className="ticker-wrap py-3">
                    <div className="ticker-track">
                        {Array(2).fill([
                            'RIDE WITH THE WARRIORS', '05 JULY 2026', 'KDF AIRBORNE FRATERNITY',
                            '120KM BLITZ CIRCUIT', 'HONOUR THE FALLEN', 'ULINZI SPORTS COMPLEX',
                            'SUPPORTING THE WIDOWS', '500+ RIDERS', '4 CIRCUITS',
                        ]).flat().map((item, i) => (
                            <span key={i} className="px-8 text-xs font-bold tracking-[0.25em] text-white/80 whitespace-nowrap">
                                {item} <span className="text-white/30 mx-2">◆</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── Stats Strip ──────────────────────────────────────── */}
                <section style={{ background: 'var(--stat-bg)', borderTop: '1px solid var(--border-1)', borderBottom: '1px solid var(--border-1)', transition: 'background 0.3s' }}>
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4" style={{ borderRight: 'none' }}>
                        {stats.map((stat, idx) => (
                            <div key={idx} className="stat-card py-10 flex flex-col gap-2" style={{ borderRight: idx < 3 ? '1px solid var(--border-1)' : 'none' }}>
                                <div style={{ color: 'var(--color-primary-light)', fontSize: '1.25rem' }}>{stat.icon}</div>
                                <div className="display-heading text-5xl" style={{ color: 'var(--text-1)' }}>{stat.value}</div>
                                <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-3)' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── About / Mission ──────────────────────────────────── */}
                <section className="py-28 px-6 lg:px-12 relative overflow-hidden" style={{ background: 'var(--page-bg)', transition: 'background 0.3s' }}>
                    <div className="absolute inset-y-0 right-0 w-1/2 pointer-events-none"
                        style={{ background: 'var(--about-accent-bg)', clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)' }} />

                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-3 pt-10">
                                <div className="img-hover-frame h-72 overflow-hidden"><img src={highlightImage1} alt="RWTW Cyclist" className="w-full h-full object-cover" /></div>
                                <div className="img-hover-frame h-52 overflow-hidden"><img src={highlightImage3} alt="RWTW Action" className="w-full h-full object-cover" /></div>
                            </div>
                            <div className="space-y-3">
                                <div className="img-hover-frame h-52 overflow-hidden"><img src={highlightImage2} alt="RWTW Peloton" className="w-full h-full object-cover" /></div>
                                <div className="img-hover-frame h-72 overflow-hidden"><img src={heroImage} alt="RWTW Landscape" className="w-full h-full object-cover" /></div>
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
                                The 2026 edition raises the bar with new circuits, uniting civilians and soldiers
                                in a shared test of endurance — while making a real difference for the families left behind.
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
                                <Link key={idx} to="/participants" className="circuit-card block p-8 border">
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
                            <Link to="/participants" className="shimmer-btn shimmer-btn--primary">View All Categories</Link>
                        </div>
                    </div>
                </section>

                {/* ── Raffle Section ───────────────────────────────────── */}
                <RaffleHomeSection />

                {/* ── Testimonials ─────────────────────────────────────── */}
                <TestimonialsSection />

                {/* ── CTA Band ─────────────────────────────────────────── */}
                <section className="py-28 px-6 lg:px-12 cta-band relative overflow-hidden" style={{ background: 'var(--page-bg)', transition: 'background 0.3s' }}>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                        <span className="display-heading text-[20vw] whitespace-nowrap select-none" style={{ color: 'var(--text-1)', opacity: 0.02 }}>
                            RIDE 2026
                        </span>
                    </div>
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-12">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-px w-12 bg-[var(--color-accent)]" />
                                    <span className="section-label" style={{ color: 'var(--color-accent)' }}>Join The Movement</span>
                                </div>
                                <h2 className="display-heading text-[clamp(3.5rem,7vw,7rem)]" style={{ color: 'var(--text-1)' }}>
                                    Ready To<br /><span style={{ color: 'var(--color-primary-light)' }}>Ride?</span>
                                </h2>
                                <p className="mt-6 text-lg max-w-md leading-relaxed" style={{ color: 'var(--text-3)' }}>
                                    Join hundreds of riders on July 5th, 2026. Whether you're a pro cyclist
                                    or bringing the family — there's a circuit for you.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 lg:flex-col xl:flex-row">
                                <div className="border p-8 flex-1" style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)', borderColor: 'var(--border-1)', background: 'var(--cta-card-bg)', transition: 'background 0.3s' }}>
                                    <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-3)' }}>For Cyclists</div>
                                    <div className="display-heading text-3xl mb-4" style={{ color: 'var(--text-1)' }}>Enter The Race</div>
                                    <p className="text-sm mb-8" style={{ color: 'var(--text-3)' }}>Four circuits. One mission. Choose your challenge.</p>
                                    <Link to="/register/step/1" className="shimmer-btn shimmer-btn--primary w-full text-center">Register to Cycle</Link>
                                </div>
                                <div className="border p-8 flex-1" style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)', borderColor: 'var(--border-1)', background: 'var(--cta-card-bg)', transition: 'background 0.3s' }}>
                                    <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-3)' }}>For Supporters</div>
                                    <div className="display-heading text-3xl mb-4" style={{ color: 'var(--text-1)' }}>Win Big, Give Back</div>
                                    <p className="text-sm mb-8" style={{ color: 'var(--text-3)' }}>Buy a raffle ticket and support the warriors' families.</p>
                                    <Link to="/raffle/step/1" className="shimmer-btn shimmer-btn--amber w-full text-center">Buy Raffle Tickets</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </>
    );
};

export default HomePage;