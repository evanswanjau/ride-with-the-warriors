import { AiOutlineSafety } from 'react-icons/ai';

const Rules = () => {
    const categories = [
        {
            title: 'Competitive (120KM/60KM)',
            rules: [
                'Teams must consist of at least 5 members.',
                'Each team must have at least ONE female rider.',
                'Drafting is allowed only within your category.',
                'Mechanical support is provided at designated water points.',
                'Helmets are mandatory throughout the event.'
            ]
        },
        {
            title: 'Family & Junior Events',
            rules: [
                'Guardian must be present during registration and cleanup.',
                'Participants must follow the designated family route (Cubs, Champs, Tigers).',
                'No motor-assisted bicycles allowed for participants.',
                'Positive attitude and sportsmanship are non-negotiable.'
            ]
        },
        {
            title: 'Corporate Class',
            rules: [
                'Maximum of 5 members per team.',
                'Must represent a registered company/organization.',
                'Uniforms with corporate branding are highly encouraged.',
                'Awards are based on team unity and finishing consistency.'
            ]
        }
    ];

    return (
        <div className="min-h-screen py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-neutral-900 dark:text-white mb-6">Regimental Rules</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 text-lg">
                        The Ride With The Warriors event is built on discipline, safety, and mutual respect. Familiarize yourself with our operational guidelines.
                    </p>
                </div>

                <div className="space-y-12">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="bg-white dark:bg-neutral-800 rounded-3xl p-8 shadow-xl border border-neutral-100 dark:border-neutral-700 hover:border-primary/30 transition-all group">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <AiOutlineSafety className="font-black" />
                                </div>
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{cat.title}</h2>
                            </div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {cat.rules.map((rule, ridx) => (
                                    <li key={ridx} className="flex gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 text-neutral-600 dark:text-neutral-300 border border-transparent hover:border-primary/20 transition-all">
                                        <span className="text-primary font-black">0{ridx + 1}</span>
                                        <span className="text-sm font-medium leading-relaxed">{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );
};

export default Rules;
