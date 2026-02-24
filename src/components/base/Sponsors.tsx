const Sponsors = () => {
    // Placeholder sponsor data — replace with actual logos and names
    const sponsorTiers = [
        {
            tier: 'Gold Partners',
            sponsors: [
                { name: 'KDF Airborne Fraternity', initials: 'KDF' },
                { name: 'Main Sponsor', initials: 'MS' },
            ]
        },
        {
            tier: 'Silver Partners',
            sponsors: [
                { name: 'Silver Sponsor 1', initials: 'S1' },
                { name: 'Silver Sponsor 2', initials: 'S2' },
                { name: 'Silver Sponsor 3', initials: 'S3' },
            ]
        },
        {
            tier: 'Bronze Partners',
            sponsors: [
                { name: 'Bronze Sponsor 1', initials: 'B1' },
                { name: 'Bronze Sponsor 2', initials: 'B2' },
                { name: 'Bronze Sponsor 3', initials: 'B3' },
                { name: 'Bronze Sponsor 4', initials: 'B4' },
            ]
        },
        {
            tier: 'Supporting Partners',
            sponsors: [
                { name: 'Support Partner 1', initials: 'P1' },
                { name: 'Support Partner 2', initials: 'P2' },
                { name: 'Support Partner 3', initials: 'P3' },
                { name: 'Support Partner 4', initials: 'P4' },
                { name: 'Support Partner 5', initials: 'P5' },
                { name: 'Support Partner 6', initials: 'P6' },
            ]
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-5xl font-black text-neutral-900 dark:text-white mb-4">Our Sponsors</h1>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto font-medium">
                    RWTW 2026 is made possible by the generous support of our partners. Thank you for riding with us.
                </p>
            </div>

            {/* Sponsor Tiers */}
            <div className="space-y-16">
                {sponsorTiers.map((tier, tidx) => (
                    <div key={tidx}>
                        <div className="flex items-center gap-4 mb-8">
                            <span className="size-2 rounded-full bg-primary"></span>
                            <h2 className="text-2xl font-black text-neutral-900 dark:text-white">{tier.tier}</h2>
                        </div>
                        <div className={`grid gap-6 ${tidx === 0 ? 'grid-cols-1 sm:grid-cols-2' :
                            tidx === 1 ? 'grid-cols-2 sm:grid-cols-3' :
                                'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                            }`}>
                            {tier.sponsors.map((sponsor, sidx) => (
                                <div
                                    key={sidx}
                                    className="bg-white dark:bg-[#232623] rounded-3xl p-8 flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-all"
                                >
                                    {/* Placeholder logo — replace div with <img> when logos are available */}
                                    <div className={`rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 ${tidx === 0 ? 'w-28 h-28 text-3xl' : tidx === 1 ? 'w-20 h-20 text-2xl' : 'w-16 h-16 text-xl'
                                        } font-black text-neutral-400 dark:text-neutral-500`}>
                                        {sponsor.initials}
                                    </div>
                                    <p className={`font-bold text-neutral-900 dark:text-white ${tidx === 0 ? 'text-lg' : 'text-sm'}`}>
                                        {sponsor.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Become a Sponsor CTA */}
            <div className="mt-24 bg-neutral-900 dark:bg-primary rounded-3xl p-12 text-center relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-4">Become a Sponsor</h3>
                    <p className="text-neutral-400 dark:text-white/80 mb-8 max-w-lg mx-auto">
                        Partner with RWTW 2026 and connect your brand with a unique audience of military personnel, corporate teams, families, and cycling enthusiasts.
                    </p>
                    <a
                        href="mailto:rwtw@airbornefraternity.org"
                        className="px-8 py-4 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-2xl hover:scale-105 transition-transform inline-block"
                    >
                        Get In Touch
                    </a>
                </div>
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-64 bg-primary/20 dark:bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 size-64 bg-primary/20 dark:bg-white/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default Sponsors;
