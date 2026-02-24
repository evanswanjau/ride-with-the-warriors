import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineCalendar, AiOutlineEnvironment, AiOutlineTeam, AiOutlineTrophy } from 'react-icons/ai';
import heroImage from '../../assets/images/hero.jpeg';
import highlightImage1 from '../../assets/images/296A0069-28-min.jpeg';
import highlightImage2 from '../../assets/images/296A0184-33-min.jpeg';
import highlightImage3 from '../../assets/images/296A0219-40-min.jpeg';

const HomePage = () => {
    const heroRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        let ticking = false;

        const updateParallax = () => {
            if (heroRef.current) {
                const scrollY = window.scrollY;
                if (scrollY < 1200) { // Limit to hero section height + buffer
                    heroRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
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
        { icon: <AiOutlineTeam />, value: '500', label: 'Riders Expected' },
        { icon: <AiOutlineTrophy />, value: '4', label: 'Race Circuits' },
        { icon: <AiOutlineCalendar />, value: 'July 5', label: '2026' },
        { icon: <AiOutlineEnvironment />, value: '120 KM', label: 'Longest Route' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[85vh] min-h-[550px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        ref={heroRef}
                        src={heroImage}
                        alt="Ride With The Warriors"
                        className="w-full h-[120%] -top-[10%] absolute object-cover object-top will-change-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary-light text-xs font-black uppercase tracking-[0.2em] mb-8">
                        2nd Edition — 05 July 2026
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tight">
                        Ride With<br />The <span className="text-primary">Warriors</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light leading-relaxed drop-shadow-sm">
                        A premier multi-national cycling event hosted by the KDF Airborne Fraternity.
                        Ride with honour — supporting the widows.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register/step/1"
                            className="px-10 py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-primary-dark hover:scale-105 transition-all delay-150 duration-300 ease-in-out "
                        >
                            Register Now
                        </Link>
                        <Link
                            to="/about"
                            className="px-10 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-2xl hover:bg-white/20 transition-all border border-white/20"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
                        <div className="w-1.5 h-3 bg-white/60 rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Stats Strip */}
            <section className="bg-neutral-900 dark:bg-[#0a0a0a] py-8">
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="text-center">
                            <div className="text-primary text-2xl mb-2 flex justify-center">{stat.icon}</div>
                            <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-neutral-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* About Preview Section - Redesigned */}
            <section className="py-24 px-4 relative overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/50">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform origin-top-right z-0 pointer-events-none"></div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    {/* Left Column: Content (Swapped from Right) */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            Our Mission
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white mb-6 leading-[1.1]">
                            More Than Just <br />
                            <span className="text-primary">A Race.</span>
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                            Ride With The Warriors is a fusion of elite cycling challenge and military tradition.
                            The 2026 edition raises the bar with new circuits, aiming to unite civilians and soldiers
                            in a shared test of endurance.
                        </p>

                        <div className="space-y-6 mb-10">
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-primary text-2xl shrink-0 transition-colors duration-300">
                                    <AiOutlineTrophy />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-neutral-900 dark:text-white mb-1 transition-colors">World-Class Challenge</h4>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Four circuits designed to test every level of cyclist, from the elite 120KM to the family 5KM.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-primary text-2xl shrink-0 transition-colors duration-300">
                                    <AiOutlineTeam />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-neutral-900 dark:text-white mb-1 transition-colors">Honour The Fallen</h4>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Every pedal stroke supports the widows and families of our fallen heroes through the KDF Airborne Fraternity.</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/about"
                            className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all"
                        >
                            Read Our Full Story →
                        </Link>
                    </div>

                    {/* Right Column: Image Composition (Swapped from Left) - Images Only */}
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 pt-8">
                                <img
                                    src={highlightImage1}
                                    alt="RWTW Cyclist"
                                    className="rounded-3xl w-full h-80 object-cover hover:scale-[1.02] transition-transform duration-500"
                                />
                                <img
                                    src={highlightImage3}
                                    alt="RWTW Action"
                                    className="rounded-3xl w-full h-64 object-cover hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                            <div className="space-y-4">
                                <img
                                    src={highlightImage2}
                                    alt="RWTW Peloton"
                                    className="rounded-3xl w-full h-64 object-cover hover:scale-[1.02] transition-transform duration-500"
                                />
                                <img
                                    src={heroImage}
                                    alt="RWTW Landscape"
                                    className="rounded-3xl w-full h-80 object-cover hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Circuits Preview */}
            <section className="py-24 px-4 bg-neutral-50 dark:bg-[#0a0a0a]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">Race Categories</div>
                        <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white mb-4">Choose Your Challenge</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto font-medium">
                            Four circuits for every level — from elite 120KM racers to 5KM family fun rides.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                number: '120',
                                name: 'Blitz Circuit',
                                type: 'Competitive',
                                distance: '120 KM',
                                color: 'bg-primary/10 text-primary',
                                description: 'The ultimate endurance test for elite cyclists pushing their limits.'
                            },
                            {
                                number: '60',
                                name: 'Recon Circuit',
                                type: 'Competitive',
                                distance: '60 KM',
                                color: 'bg-primary/10 text-primary',
                                description: 'A perfect balance of speed and stamina for seasoned riders.'
                            },
                            {
                                number: '30',
                                name: 'Corporate',
                                type: 'Non-Competitive',
                                distance: '30 KM',
                                color: 'bg-primary/10 text-primary',
                                description: 'Build team spirit and network while enjoying a scenic ride.'
                            },
                            {
                                number: '5',
                                name: 'Family Fun',
                                type: 'Leisure',
                                distance: '5 KM',
                                color: 'bg-primary/10 text-primary',
                                description: 'A safe and enjoyable route for families and beginners of all ages.'
                            },
                        ].map((circuit, idx) => (
                            <Link key={idx} to="/participants" className="group bg-white dark:bg-[#232623] rounded-[2.5rem] p-8 hover:-translate-y-2 transition-all border border-neutral-100 dark:border-neutral-800 hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-none flex flex-col items-start text-left">
                                <div className={`w-24 h-24 rounded-full ${circuit.color} flex items-center justify-center text-4xl font-black mb-6 group-hover:scale-110 transition-transform`}>
                                    {circuit.number}
                                </div>
                                <h3 className="text-xl font-black text-neutral-900 dark:text-white mb-2">{circuit.name}</h3>
                                <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">{circuit.type} • {circuit.distance}</p>
                                <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed max-w-[200px]">
                                    {circuit.description}
                                </p>
                                <span className={`inline-flex items-center gap-2 font-bold ${circuit.color.split(' ')[1]} group-hover:gap-4 transition-all mt-auto`}>
                                    Learn more →
                                </span>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/participants" className="px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark hover:scale-105 transition-all inline-block">
                            View All Categories
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white mb-6">
                        Ready to <span className="text-primary">Ride</span>?
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-2xl mx-auto mb-10 font-medium">
                        Join hundreds of riders on July 5th, 2026 at the Ulinzi Sports Complex.
                        Whether you're a pro cyclist or bringing the family, there's a circuit for you.
                    </p>
                    <Link
                        to="/register/step/1"
                        className="px-12 py-5 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-primary-dark hover:scale-105 transition-all shadow-lg shadow-primary/30 inline-block"
                    >
                        Register for RWTW 2026
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
