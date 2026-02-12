import { Link } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { MdMap, MdEmojiEvents } from 'react-icons/md';
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
}

const Participants = () => {
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
            route: 'USCL → Kibiko → Kimuka → Enkang Sidai Resort → USCL'
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
            route: 'USCL → Kibiko → Kimuka → USCL'
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
            route: 'USCL → Galleria Mall → Langata Rd → Ebul Bul Station → USCL'
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
            route: 'Within USCL Stadium'
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-5xl font-black text-neutral-900 dark:text-white mb-4">Participants</h1>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto font-medium">
                    Four circuits for every level of rider. Choose your challenge and register today.
                </p>
            </div>

            {/* Category Cards */}
            <div className="space-y-8 mb-24">
                {categories.map((cat, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#232623] rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-5 gap-0">
                        {/* Image */}
                        <div className="lg:col-span-2 relative h-64 lg:h-auto">
                            <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                            <div className="absolute bottom-4 left-4 flex gap-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-white/90 dark:bg-black/80 text-gray-900 dark:text-gray-100 backdrop-blur-sm">
                                    <MdMap size={18} className="mr-1" />
                                    {cat.distance}
                                </span>
                                {cat.isCompetitive && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary text-white uppercase tracking-wider">
                                        <MdEmojiEvents size={16} className="mr-1" />
                                        Competitive
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* Details */}
                        <div className="lg:col-span-3 p-8 flex flex-col justify-between">
                            <div>
                                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{cat.subtitle}</p>
                                <h3 className="text-2xl font-black text-neutral-900 dark:text-white mb-4">{cat.title}</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">{cat.description}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl px-4 py-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Fee</p>
                                        <p className="text-sm font-bold text-neutral-900 dark:text-white">{cat.price}</p>
                                    </div>
                                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl px-4 py-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Start Time</p>
                                        <p className="text-sm font-bold text-neutral-900 dark:text-white">{cat.time}</p>
                                    </div>
                                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl px-4 py-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Route</p>
                                        <p className="text-sm font-bold text-neutral-900 dark:text-white">{cat.route}</p>
                                    </div>
                                </div>
                            </div>
                            <Link
                                to={`/register/step/1`}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-green-600 hover:scale-105 transition-all w-fit"
                            >
                                Register for {cat.title} <AiOutlineArrowRight />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Kit & Number Collection */}
            <div className="bg-white dark:bg-[#232623] rounded-3xl p-8 md:p-12 mb-12">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">Pre-Event Information</div>
                <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-8">Kit & Number Collection</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6">
                        <div className="text-3xl font-black text-primary mb-3">01</div>
                        <h4 className="font-bold text-neutral-900 dark:text-white mb-2">Collection Dates</h4>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                            Event kits (bibs, jerseys, and race materials) will be available for collection <strong>2–3 days before the event</strong> at the designated venue.
                        </p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6">
                        <div className="text-3xl font-black text-primary mb-3">02</div>
                        <h4 className="font-bold text-neutral-900 dark:text-white mb-2">What You Receive</h4>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                            Your kit includes your BIB number with colour code for your category, an official event jersey (based on your selected T-shirt size), and race-day instructions.
                        </p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6">
                        <div className="text-3xl font-black text-primary mb-3">03</div>
                        <h4 className="font-bold text-neutral-900 dark:text-white mb-2">Collection Location</h4>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                            Kits will be collected at the <strong>Ulinzi Sports Complex (USCL)</strong>, Langata. Bring your registration confirmation and a valid ID for verification.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Participants;
