import { Link } from 'react-router-dom';
import Countdown from '../components/common/Countdown';
import RecapPhotos from '../components/common/RecapPhotos';
import { EDITION, PAST_EDITION } from '../config/edition';
import { primaryCta } from '../config/cta';
import '../styles/home.css';

const CIRCUITS = [
    { name: 'Blitz', distance: '120 KM', type: 'Competitive' },
    { name: 'Recon', distance: '60 KM', type: 'Competitive' },
    { name: 'Corporate', distance: '30 KM', type: 'Non-Competitive' },
    { name: 'Family Fun', distance: '5 KM', type: 'Leisure' },
];

const Label = ({ children }: { children: string }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="h-px w-12 bg-[var(--color-primary)]" />
        <span className="section-label">{children}</span>
    </div>
);

const Recap2026Page = () => {
    const cta = primaryCta();
    const stats = [
        { value: PAST_EDITION.riders, label: 'Riders' },
        { value: PAST_EDITION.participants, label: 'Participants' },
        { value: '4', label: 'Circuits' },
        { value: PAST_EDITION.ordinal, label: 'Edition' },
    ];

    return (
        <div className="rwtw-page min-h-screen" style={{ background: 'var(--page-bg)', color: 'var(--text-1)' }}>
            {/* 1. Header */}
            <section className="pt-36 pb-16 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <Label>{`${PAST_EDITION.ordinal} Edition — ${PAST_EDITION.dateLabel}`}</Label>
                    <h1 className="display-heading text-[clamp(3.5rem,9vw,7rem)]" style={{ color: 'var(--text-1)' }}>
                        {PAST_EDITION.year} Highlights<span style={{ color: 'var(--color-primary-light)' }}>.</span>
                    </h1>
                    <p className="mt-6 text-lg max-w-2xl leading-relaxed" style={{ color: 'var(--text-2)' }}>
                        Hundreds of riders, soldiers and families took to the road at Ulinzi Sports Complex for a day of
                        honour, endurance and community, riding for the widows of our fallen heroes.
                    </p>
                </div>
            </section>

            {/* 2. Stats */}
            <section className="px-6 lg:px-12 pb-16">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((t) => (
                        <div key={t.label} className="border p-6 flex flex-col gap-2" style={{ borderColor: 'var(--border-1)', background: 'var(--raised-bg)' }}>
                            <div className="display-heading text-5xl" style={{ color: 'var(--text-1)' }}>{t.value}</div>
                            <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-3)' }}>{t.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Car winner */}
            <section className="px-6 lg:px-12 pb-16">
                <div className="max-w-7xl mx-auto border p-8 md:p-12 flex flex-col gap-3" style={{ borderColor: 'var(--border-1)', background: 'var(--raised-bg)' }}>
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">The ticket that won the {PAST_EDITION.carPrize}</div>
                    <div className="display-heading text-[clamp(4rem,10vw,7rem)] text-amber-500" data-testid="car-ticket">{PAST_EDITION.carTicket}</div>
                    <div className="text-xl font-semibold" data-testid="car-winner">{PAST_EDITION.carWinner}</div>
                    <p className="max-w-xl" style={{ color: 'var(--text-2)' }}>
                        Your ticket could be next: the {EDITION.year} raffle opens with registration.
                    </p>
                    <Link to="/raffle-winners" className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-primary-light)' }}>
                        All raffle winners →
                    </Link>
                </div>
            </section>

            {/* 4. Photos */}
            <section className="px-6 lg:px-12 pb-16">
                <div className="max-w-7xl mx-auto">
                    <Label>Photos</Label>
                    <RecapPhotos count={8} />
                    <div className="mt-8">
                        <Link to="/gallery?year=2026" className="shimmer-btn shimmer-btn--primary">See all {PAST_EDITION.year} photos</Link>
                    </div>
                </div>
            </section>

            {/* 5. Results */}
            <section className="px-6 lg:px-12 pb-16">
                <div className="max-w-7xl mx-auto">
                    <Label>Race Results</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {CIRCUITS.map((c) => (
                            <Link key={c.name} to="/results" className="circuit-card block p-8 border">
                                <div className="relative z-10">
                                    <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--color-primary-light)' }}>{c.distance}</div>
                                    <h3 className="display-heading text-3xl mb-1" style={{ color: 'var(--text-1)' }}>{c.name}</h3>
                                    <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--text-3)' }}>{c.type}</p>
                                    <span className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-primary-light)' }}>See results →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Coming back in 2027 */}
            <section className="py-20 px-6 lg:px-12" style={{ background: 'var(--raised-bg)' }}>
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center gap-10">
                    <div className="flex-1">
                        <Label>{`Coming back in ${EDITION.year}?`}</Label>
                        <h2 className="display-heading text-[clamp(2.5rem,6vw,4.5rem)]" style={{ color: 'var(--text-1)' }}>
                            {EDITION.raceDayLabel}
                        </h2>
                        <p className="mt-3 text-lg" style={{ color: 'var(--text-2)' }}>{EDITION.venue}</p>
                        <div className="mt-8 flex flex-wrap items-center gap-6">
                            <Link to={cta.to} className="shimmer-btn shimmer-btn--primary">{cta.label}</Link>
                            <Link to="/feedback" className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-primary-light)' }}>
                                Give feedback
                            </Link>
                        </div>
                    </div>
                    <Countdown className="text-[var(--text-1)]" />
                </div>
            </section>
        </div>
    );
};

export default Recap2026Page;
