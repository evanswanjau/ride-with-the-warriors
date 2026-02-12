import { Link } from 'react-router-dom';
import { AiOutlineAim, AiOutlineHeart, AiOutlineGlobal, AiOutlineStar } from 'react-icons/ai';
import storyImage from '../assets/images/296A0186-34-min.jpeg';
import teamImage from '../assets/images/296A0075-30-min.jpeg';
import collageImage1 from '../assets/images/296A0118-32-min.jpeg';
import collageImage2 from '../assets/images/296A0192-36-min.jpeg';
import collageImage3 from '../assets/images/296A0205-38-min.jpeg';

const AboutUs = () => {
    const pillars = [
        {
            icon: <AiOutlineGlobal className="text-3xl" />,
            title: 'Military Diplomacy',
            description: "Enhancing 'Esprit de Corps' and partnerships between the military and civilian world through healthy competition.",
            number: '01'
        },
        {
            icon: <AiOutlineHeart className="text-3xl" />,
            title: 'Health & Wellness',
            description: 'Advocating for cycling as a sustainable lifestyle choice for military personnel and their families, aligning with the military\u2019s focus on combat readiness and physical health.',
            number: '02'
        },
        {
            icon: <AiOutlineAim className="text-3xl" />,
            title: 'Community & Corporate Engagement',
            description: 'Bridging the gap between the military and the public by inviting sponsors, families, and civilians to participate in a shared national event.',
            number: '03'
        },
        {
            icon: <AiOutlineStar className="text-3xl" />,
            title: 'Integrity & Discipline',
            description: 'Adherence to international cycling standards and fair play, reflecting the core values of the Kenya Defence Forces in every aspect of the event\u2019s execution.',
            number: '04'
        }
    ];

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">            {/* ── Header (Contact Us style) ────────────────────────────── */}
                <div className="flex flex-col items-center text-center mb-16">
                    <span className="px-4 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-4 uppercase tracking-widest">
                        Our Story
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white mb-6 tracking-tight">
                        About <span className="text-emerald-500">Us.</span>
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 max-w-xl text-lg leading-relaxed">
                        A premier multi-national cycling movement rooted in service, unity, fitness, and honour.
                    </p>
                </div>

                {/* ── Mission Quote ─────────────────────────────────────────── */}
                <div className="relative bg-white dark:bg-[#161816] rounded-[2.5rem] p-10 md:p-16 mb-20 border border-neutral-100 dark:border-neutral-800/50 text-center overflow-hidden">
                    <div className="absolute -top-10 right-4 text-[18rem] md:text-[24rem] font-black text-primary/5 select-none leading-none">
                        &ldquo;
                    </div>
                    <blockquote className="relative z-10 text-2xl md:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-white leading-snug">
                        Ride with Honour —{' '}
                        <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                            Supporting the Widows
                        </span>
                    </blockquote>
                    <p className="relative z-10 mt-6 text-neutral-500 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
                        The powerful theme for RWTW 2026 — raising awareness and support for military widows, ensuring the families of fallen warriors are never forgotten.
                    </p>
                </div>

                {/* ── Our Story ──────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
                    {/* Text Column — 5 cols */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32">
                        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-6">
                            Our Story
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white leading-[1.05] mb-8">
                            From the Barracks<br />to the{' '}
                            <span className="text-primary">Open Road</span>
                        </h2>
                        <div className="space-y-5 text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            <p>
                                Ride With The Warriors (RWTW) is a premier multi-national cycling event hosted by the Kenya Defence Forces (KDF) Airborne Fraternity.
                                Designed to be more than just a race, it serves as a strategic platform to strengthen regional military cooperation and promote physical fitness.
                            </p>
                            <p>
                                It fosters a spirit of inclusivity through the participation of military families, civilians, and corporate partners, creating a unique bond through sport.
                            </p>
                        </div>
                    </div>

                    {/* Image Mosaic — 7 cols */}
                    <div className="lg:col-span-7">
                        <div className="grid grid-cols-12 gap-3 md:gap-4">
                            <div className="col-span-12 overflow-hidden rounded-[2rem]">
                                <img src={storyImage} alt="RWTW riders in action" className="w-full h-[350px] md:h-[420px] object-cover hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="col-span-4 overflow-hidden rounded-[1.5rem]">
                                <img src={collageImage1} alt="RWTW ceremony" className="w-full h-36 md:h-48 object-cover hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="col-span-4 overflow-hidden rounded-[1.5rem]">
                                <img src={collageImage2} alt="RWTW peloton" className="w-full h-36 md:h-48 object-cover hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="col-span-4 overflow-hidden rounded-[1.5rem]">
                                <img src={collageImage3} alt="RWTW finish line" className="w-full h-36 md:h-48 object-cover hover:scale-105 transition-transform duration-700" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── History ─────────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
                    {/* Image — Left */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-transparent to-emerald-500/10 rounded-[3rem] blur-2xl opacity-50" />
                        <div className="relative overflow-hidden rounded-[2.5rem]">
                            <img src={collageImage1} alt="RWTW history" className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>

                    {/* Text — Right */}
                    <div>
                        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-6">
                            History
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white leading-[1.05] mb-8">
                            Building a{' '}
                            <span className="text-primary">Legacy</span>
                        </h2>
                        <div className="space-y-5 text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            <p>
                                The first edition took place in July 2025 in preparation for the Airborne at 60 years celebration.
                                It was a resounding success, uniting soldiers and civilians on the roads.
                            </p>
                            <p>
                                The 2026 edition is scheduled for{' '}
                                <strong className="text-neutral-900 dark:text-white">05 July 2026</strong>{' '}
                                at the Ulinzi Sports Complex (USCL) in Nairobi, set against Kenya's scenic terrain.
                            </p>
                        </div>

                        {/* Event Meta */}
                        <div className="mt-10 flex gap-8">
                            <div>
                                <div className="text-3xl font-black text-primary">05</div>
                                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mt-1">July 2026</div>
                            </div>
                            <div className="w-px bg-neutral-200 dark:bg-neutral-700" />
                            <div>
                                <div className="text-3xl font-black text-primary">USCL</div>
                                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mt-1">Nairobi, Kenya</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Stats Strip ──────────────────────────────────────────── */}
                <div className="bg-neutral-900 dark:bg-[#161816] rounded-[2.5rem] p-10 md:p-14 grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 relative overflow-hidden">
                    {/* Decorative gradient orbs */}
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/20 rounded-full blur-[100px]" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-[100px]" />

                    {[
                        { value: '500', label: 'Riders Expected', suffix: '+' },
                        { value: '4', label: 'Race Circuits', suffix: '' },
                        { value: 'July 5', label: '2026', suffix: '' },
                        { value: '120 KM', label: 'Longest Route', suffix: '' },
                    ].map((stat, idx) => (
                        <div key={idx} className="text-center relative z-10 group">
                            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white group-hover:text-primary transition-colors duration-500 whitespace-nowrap">
                                {stat.value}
                                {stat.suffix && <span className="text-primary">{stat.suffix}</span>}
                            </div>
                            <div className="mt-2 text-xs font-bold text-neutral-400 uppercase tracking-[0.2em]">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── Core Pillars ──────────────────────────────────────────── */}
                <div className="mb-20">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
                        <div>
                            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-4">
                                Our Pillars
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white leading-tight">
                                What We<br />Stand For
                            </h2>
                        </div>
                        <p className="text-neutral-500 dark:text-neutral-400 max-w-sm font-medium leading-relaxed">
                            Four foundational values that drive every aspect of the Ride With The Warriors experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        {pillars.map((pillar, idx) => (
                            <div
                                key={idx}
                                className="group relative bg-white dark:bg-[#161816] rounded-[2rem] p-8 md:p-10 border border-neutral-100 dark:border-neutral-800/50 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-500 overflow-hidden"
                            >
                                {/* Background number */}
                                <div className="absolute top-4 right-6 text-[7rem] font-black text-neutral-50 dark:text-neutral-800/50 leading-none select-none group-hover:text-primary/5 transition-colors duration-500">
                                    {pillar.number}
                                </div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                        {pillar.icon}
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white mb-3 group-hover:text-primary transition-colors duration-500">{pillar.title}</h3>
                                    <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">{pillar.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Impact & Legacy ───────────────────────────────────────── */}
                <div className="mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Image with decorative frame */}
                        <div className="relative order-2 lg:order-1">
                            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-transparent to-emerald-500/10 rounded-[3rem] blur-2xl opacity-50" />
                            <div className="relative overflow-hidden rounded-[2.5rem]">
                                <img src={teamImage} alt="KDF Airborne Fraternity riders" className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700" />
                            </div>
                        </div>

                        {/* Text */}
                        <div className="order-1 lg:order-2">
                            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-6">
                                Impact & Legacy
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white leading-[1.05] mb-8">
                                Setting a New{' '}
                                <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                                    Benchmark
                                </span>
                            </h2>
                            <div className="space-y-5 text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                <p>
                                    RWTW 2026 aims to set a new benchmark for military-organized sporting events in East Africa.
                                    By combining high-stakes professional racing with family-oriented activities, the event provides sponsors with a unique audience while reinforcing Kenya's position as a regional hub for sports diplomacy and excellence.
                                </p>
                                <p>
                                    The event features four main circuits — Blitz (120 km competitive), Recon (60 km competitive), Corporate Challenge (30 km non-competitive), and Family Fun Ride (5 km leisure) — with a total of 12 races/sub-categories across ages, genders, teams, and classifications.
                                </p>
                                <p>
                                    Beyond competition, RWTW serves as a powerful platform to honour and support military widows, ensuring the families of fallen warriors are never forgotten.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CTA ──────────────────────────────────────────────────── */}
                <div className="relative rounded-[2.5rem] p-12 md:p-20 overflow-hidden text-center">
                    {/* Dark gradient bg */}
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-[#0a1a0f] to-neutral-900 rounded-[2.5rem]" />
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px]" />

                    <div className="relative z-10">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-emerald-400 text-xs font-black uppercase tracking-[0.3em] mb-8">
                            Join the Movement
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.95] mb-6">
                            Ready to{' '}
                            <span className="bg-gradient-to-r from-emerald-400 via-primary to-emerald-300 bg-clip-text text-transparent">
                                Ride
                            </span>
                            ?
                        </h2>
                        <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                            Join hundreds of riders on July 5th, 2026 at the Ulinzi Sports Complex.
                            Whether you're a pro cyclist or bringing the family, there's a circuit for you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register/step/1"
                                className="group px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all inline-flex items-center justify-center gap-3"
                            >
                                Register for RWTW 2026
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                            <Link
                                to="/participants"
                                className="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all inline-block"
                            >
                                Explore Circuits
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;