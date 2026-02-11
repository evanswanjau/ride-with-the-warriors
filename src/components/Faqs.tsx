import { useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

const FAQItem = ({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) => {
    return (
        <div className="border-b border-neutral-100 dark:border-neutral-800 last:border-0">
            <button
                onClick={onToggle}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-primary' : 'text-neutral-900 dark:text-white group-hover:text-primary'}`}>
                    {question}
                </span>
                <div className={`size-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-primary text-white scale-110' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                    {isOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
                </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed tabular-nums">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const Faqs = () => {
    const [openKey, setOpenKey] = useState<string | null>(null);

    const handleToggle = (key: string) => {
        setOpenKey(prev => prev === key ? null : key);
    };

    const faqCategories = [
        {
            "title": "Event Overview and Theme",
            "questions": [
                {
                    "question": "What is Ride With The Warriors?",
                    "answer": "Ride With The Warriors (RWTW) is a premier multi-national cycling event hosted by the Kenya Defence Forces (KDF) Airborne Fraternity. It combines competitive racing with inclusivity, bringing together professional soldiers, corporate teams, families, civilians, and international participants. The 2026 edition builds on the first event in 2025, serving as a platform for military diplomacy, health and wellness through cycling, and community engagement."
                },
                {
                    "question": "What is the date and location of the 2026 event?",
                    "answer": "The event takes place on 05 July 2026 at the Ulinzi Sports Complex (USCL) in Nairobi, Kenya. All routes start and finish at USCL, with scenic and challenging terrain across the circuits."
                },
                {
                    "question": "What is the theme of RWTW 2026?",
                    "answer": "The theme is 'Ride with Honour - Supporting the Widows.' The event aims to raise awareness and support for military widows while promoting physical fitness, regional cooperation, and shared experiences between the military and civilian communities."
                },
                {
                    "question": "What are the core pillars of the event?",
                    "answer": "The event is anchored on three pillars: Military Diplomacy to enhance 'Esprit de Corps' and partnerships through healthy competition; Health and Wellness to advocate cycling as a sustainable lifestyle for military personnel and families, supporting combat readiness; and Community and Corporate Engagement to bridge the military and public by inviting sponsors, families, and civilians to participate in a shared national event."
                },
                {
                    "question": "What makes RWTW 2026 special?",
                    "answer": "It sets a new benchmark for military-organized sporting events in East Africa by combining high-stakes professional racing with family-oriented activities. It features elite teams from the KDF, official sponsors, corporate partners, and the public, all sharing the same courses in an inclusive environment."
                }
            ]
        },
        {
            "title": "Race Categories and Routes",
            "questions": [
                {
                    "question": "What are the main race categories?",
                    "answer": "There are four main categories: Blitz Circuit (competitive, long-distance 120 km), Recon Circuit (competitive, mid-distance 60 km), Corporate Challenge Ride (non-competitive team/individual ride, 30 km), and Family Fun Ride (leisure, safe for all ages, 5 km within the USCL stadium)."
                },
                {
                    "question": "What is the Blitz Circuit?",
                    "answer": "The Blitz Circuit is the main competitive long-distance category covering 120 km, from USCL - Kibiko - Kimuka - Enkang Sidai resort (Turning Point A) - back to USCL. It includes sub-categories like Teams (must include a lady, open classification), Vanguard/Junior (under 25), Airborne/Elite (25-39), Commanders (40-49), and Veterans (over 50), with specific age/gender classes."
                },
                {
                    "question": "What is the Recon Circuit?",
                    "answer": "The Recon Circuit is the intermediate competitive mid-distance category covering 60 km, from USCL - Kibiko - Kimuka (Turning Point B) - back to USCL. It features Teams (must include a lady, open classification) and Individuals (male/female experienced classification)."
                },
                {
                    "question": "What are the Corporate Challenge and Family Fun Ride?",
                    "answer": "The Corporate Challenge is a non-competitive 30 km ride from USCL - Galleria mall - Langata Road - Ebul bul Station (Turning Point C) - back to USCL, open to teams (must include a lady) and individuals (male/female). The Family Fun Ride is a safe 5 km leisure race entirely within the USCL stadium, with sub-categories: Cubs (kids 4-8), Champs (kids 9-13), and Tigers (parents/guardians cycling with kids)."
                },
                {
                    "question": "How many races and participants are there in total?",
                    "answer": "The event features 4 main circuits with a total of 12 races/sub-categories across age groups, genders, and team/individual formats. It welcomes elite cyclists, juniors, veterans, corporate teams, families, and international participants for a diverse and inclusive experience."
                }
            ]
        },
        {
            "title": "Registration and Fees",
            "questions": [
                {
                    "question": "What are the registration fees?",
                    "answer": "Registration is free for military personnel participating in the cycling event. Civilians pay KES 2,000 per participant. Team entries (across Blitz, Recon, and Corporate) are KES 9,000 (must include at least one lady). Individual entries for most categories are KES 2,000. Family Fun Ride: Cubs/Champs KES 1,000 each, Tigers (parents/guardians) KES 2,000."
                },
                {
                    "question": "What registration details are required?",
                    "answer": "Participants provide name, contact details, country, service/ID/passport number, shirt size, and emergency contact. Registration is available online via https://airbornefraternity.org/event/ride-with-the-warriors-2/ and includes elite, intermediate, corporate teams, family riders, and EAC airborne delegations."
                },
                {
                    "question": "When and how are event kits issued?",
                    "answer": "Event kits for riders (including bibs, jerseys, and other items) are issued/collected 2-3 days before the event to ensure proper preparation and branding."
                },
                {
                    "question": "Are there any special requirements for teams?",
                    "answer": "Teams in Blitz, Recon, and Corporate categories must include at least one lady for inclusivity. Teams compete in open classification, with results based on participation in their respective circuits."
                },
                {
                    "question": "Is there a raffle or additional participation option?",
                    "answer": "Non-cyclists can join the event by purchasing a raffle ticket at KES 1,000 per individual, allowing entry without cycling. The raffle is managed by sponsors and supports pre-approved Airborne Fraternity CSR projects for widows."
                }
            ]
        },
        {
            "title": "Prizes, Awards, and Participant Experience",
            "questions": [
                {
                    "question": "What prizes are available?",
                    "answer": "Prize money and trophies are restricted to the competitive circuits (Blitz and Recon only). Awards go to the top three in each category/sub-category, with detailed prize structures including cash and trophies across age, gender, team, and elite classifications."
                },
                {
                    "question": "What happens during the awards and closing ceremony?",
                    "answer": "The ceremony includes speeches from a Riders Representative, Sponsors Representative, Chairman, and Guest of Honour, followed by a vote of thanks. It concludes at 1700hrs after the giveaway vehicle winner is selected through ballot."
                },
                {
                    "question": "What is the overall participant experience?",
                    "answer": "Participants enjoy scenic and challenging Kenyan terrain, shared courses for inclusivity (professionals, corporates, families, and children), hydration/snack stations every 10 km on longer routes, and a vibrant atmosphere at USCL with start/finish gantry, tents, and family-friendly elements."
                },
                {
                    "question": "Are there colour codes or bib numbers for categories?",
                    "answer": "Yes, each category has a unique colour code and registration number range for easy identification: e.g., Blitz Teams (Sky Blue, 7000-7999), Recon Teams (Grey, 0001-0999), Corporate Teams (Orange, 1000-1999), Family Cubs (Red, C300-C399), and more."
                },
                {
                    "question": "Who can participate in the event?",
                    "answer": "The event is open to KDF military personnel (free entry), civilians, corporate teams, families (including kids), elite cyclists, juniors, veterans, experienced riders, and international/EAC airborne delegations—promoting broad inclusivity across ages, genders, and backgrounds."
                }
            ]
        }
    ]

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-neutral-900 dark:text-white mb-4">Frequently Asked Questions</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto font-medium">
                        Everything you need to know about the Regimental Ride. Can't find what you're looking for? Reach out to our support team.
                    </p>
                </div>

                <div className="space-y-16">
                    {faqCategories.map((category, idx) => (
                        <div key={idx} className="bg-white dark:bg-[#232623] rounded-3xl p-8 md:p-12 shadow-none">
                            <h2 className="text-2xl font-black text-neutral-900 dark:text-white mb-8 flex items-center gap-4">
                                <span className="size-2 rounded-full bg-primary"></span>
                                {category.title}
                            </h2>
                            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {category.questions.map((faq, fidx) => {
                                    const key = `${idx}-${fidx}`;
                                    return (
                                        <FAQItem key={fidx} question={faq.question} answer={faq.answer} isOpen={openKey === key} onToggle={() => handleToggle(key)} />
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 p-12 rounded-[2.5rem] bg-neutral-900 dark:bg-primary text-center relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-4">Still have questions?</h3>
                        <p className="text-neutral-400 dark:text-white/80 mb-8 max-w-md mx-auto">
                            Our team is here to help you get ready for the big day. No question is too small.
                        </p>
                        <button className="px-8 py-4 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-2xl hover:scale-105 transition-transform">
                            Contact Support
                        </button>
                    </div>
                    {/* Background decorative elements */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-64 bg-primary/20 dark:bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 size-64 bg-primary/20 dark:bg-white/10 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
};

export default Faqs;
