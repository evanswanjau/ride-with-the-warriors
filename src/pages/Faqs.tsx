import { useState } from 'react';
import '../styles/faqs.css';
import { Link } from 'react-router-dom';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

interface FAQItemProps { question: string; answer: string; isOpen: boolean; onToggle: () => void; }
const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => (
    <div className="faq-item">
        <button onClick={onToggle} className="faq-trigger">
            <span className={`faq-question ${isOpen ? 'faq-question--open' : ''}`}>{question}</span>
            <div className={`faq-icon-box ${isOpen ? 'faq-icon-box--open' : ''}`}>
                {isOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </div>
        </button>
        <div className={`faq-body ${isOpen ? 'faq-body--open' : ''}`}>
            <p className="faq-answer">{answer}</p>
        </div>
    </div>
);


/* ─── FAQs Page ──────────────────────────────────────────────────────────── */
const Faqs = () => {
    const [openKey, setOpenKey] = useState<string | null>(null);
    const handleToggle = (key: string) => setOpenKey(prev => prev === key ? null : key);

    const faqCategories = [
        {
            title: 'Event Overview',
            label: 'General',
            questions: [
                { question: 'What is Ride With The Warriors?', answer: 'Ride With The Warriors (RWTW) is a premier multi-national cycling event hosted by the Kenya Defence Forces (KDF) Airborne Fraternity. It combines competitive racing with inclusivity, bringing together professional soldiers, corporate teams, families, civilians, and international participants. The 2026 edition builds on the inaugural 2025 event, serving as a platform for military diplomacy, health and wellness, and community engagement.' },
                { question: 'What is the date and location of the 2026 event?', answer: 'The event takes place on 05 July 2026 at the Ulinzi Sports Complex (USCL) in Nairobi, Kenya. All routes start and finish at USCL, with scenic and challenging terrain across all circuits.' },
                { question: 'What is the theme of RWTW 2026?', answer: 'The theme is "Ride with Honour — Supporting the Widows." The event raises awareness and funds for military widows while promoting physical fitness, regional cooperation, and shared experiences between the military and civilian communities.' },
                { question: 'What are the core pillars of the event?', answer: 'The event is anchored on three pillars: Military Diplomacy (enhancing partnerships through healthy competition); Health and Wellness (advocating cycling as a sustainable lifestyle supporting combat readiness); and Community & Corporate Engagement (bridging the military and public through an inclusive national sporting event).' },
                { question: 'Who can participate?', answer: 'The event is open to KDF military personnel (free entry), civilians, corporate teams, families including children, elite cyclists, juniors, veterans, experienced riders, and international/EAC airborne delegations — promoting broad inclusivity across all ages, genders, and backgrounds.' },
            ],
        },
        {
            title: 'Race Categories & Routes',
            label: 'Circuits',
            questions: [
                { question: 'What are the four race categories?', answer: 'There are four main circuits: Blitz Circuit (competitive, 120 km), Recon Circuit (competitive, 60 km), Corporate Challenge Ride (non-competitive team/individual, 30 km), and Family Fun Ride (leisure, 5 km within the USCL stadium).' },
                { question: 'What is the Blitz Circuit (120 KM)?', answer: 'The Blitz Circuit is the main competitive long-distance category covering 120 km: USCL → Kibiko → Kimuka → Enkang Sidai Resort (Turning Point A) → back to USCL. Sub-categories include Teams, Vanguard/Junior (under 25), Airborne/Elite (25–39), Commanders (40–49), and Veterans (over 50).' },
                { question: 'What is the Recon Circuit (60 KM)?', answer: 'The Recon Circuit is the intermediate competitive category covering 60 km: USCL → Kibiko → Kimuka (Turning Point B) → back to USCL. It features Teams and Individual (male/female) sub-categories.' },
                { question: 'What are the Corporate Challenge and Family Fun Ride?', answer: 'The Corporate Challenge is a non-competitive 30 km ride: USCL → Galleria Mall → Langata Road → Ebul Bul Station (Turning Point C) → back to USCL. The Family Fun Ride is a safe 5 km leisure ride entirely within USCL, with sub-categories for Cubs (kids 4–8), Champs (kids 9–13), and Tigers (parents/guardians cycling alongside kids).' },
                { question: 'Are there hydration stations on the routes?', answer: 'Yes. Hydration and snack stations are positioned every 10 km along the longer routes, ensuring all competitive and non-competitive riders are well-supported throughout the event.' },
            ],
        },
        {
            title: 'Registration & Fees',
            label: 'Sign Up',
            questions: [
                { question: 'What are the registration fees?', answer: 'Military personnel cycle for free. Civilians pay KES 2,000 per individual. Team entries (Blitz, Recon, Corporate) are KES 9,000 per team and must include at least one female rider. Family Fun Ride: Cubs/Champs pay KES 1,000 each; Tigers (parents/guardians) pay KES 2,000.' },
                { question: 'What registration details are required?', answer: 'Participants provide their full name, contact details, country of origin, service/ID/passport number, shirt size, and emergency contact information. Registration is available online at airbornefraternity.org.' },
                { question: 'Do teams have any special requirements?', answer: 'Yes. Teams in the Blitz, Recon, and Corporate categories must include at least one female rider to qualify. This is a non-negotiable inclusivity requirement for all team entries.' },
                { question: 'When are event kits collected?', answer: 'Event kits — including bibs, jerseys, and other branded items — are issued 2–3 days before the event to allow adequate time for fitting and preparation.' },
                { question: 'Is there a colour-coding system for categories?', answer: 'Yes. Each category is assigned a unique colour and bib number range for easy identification. For example: Blitz Teams (Sky Blue, 7000–7999), Recon Teams (Grey, 0001–0999), Corporate Teams (Orange, 1000–1999), Family Cubs (Red, C300–C399), and so on.' },
            ],
        },
        {
            title: 'Raffle Tickets',
            label: 'Raffle',
            isRaffle: true,
            questions: [
                { question: 'What is the Grand Raffle and who can enter?', answer: 'The Grand Raffle is open to everyone — cyclists and non-cyclists alike. You do not need to participate in any cycling circuit to purchase a raffle ticket. It is a standalone way to support the widows and families of fallen heroes while standing a chance to win extraordinary prizes.' },
                { question: 'How much does a raffle ticket cost?', answer: 'Each raffle ticket is priced at KES 1,000. There is no limit on how many tickets a single person can purchase — the more tickets you buy, the better your chances of winning. All proceeds go directly to the KDF Airborne Fraternity\'s CSR projects supporting military widows.' },
                { question: 'What prizes can I win in the raffle?', answer: 'The Grand Raffle features multiple prize tiers with incredible rewards including a brand-new saloon car as the star prize, high-end bicycles, flat-screen TVs, refrigerators, and a wide range of other sponsored prizes. Full prize details will be announced closer to the event date.' },
                { question: 'How do I purchase raffle tickets?', answer: 'Raffle tickets can be purchased online through the official registration portal at airbornefraternity.org or in person at the event on the day. Online purchase is strongly recommended to secure your tickets in advance.' },
                { question: 'When is the raffle draw held?', answer: 'The raffle draw takes place on 05 July 2026 during the official awards and closing ceremony at the Ulinzi Sports Complex. The star prize — a brand-new saloon car — is drawn last by ballot in front of all attendees. Winners must be present or have a nominated representative.' },
                { question: 'Where do the raffle proceeds go?', answer: 'All raffle proceeds are managed transparently by the event sponsors and directed to pre-approved KDF Airborne Fraternity CSR projects. Funds go directly to welfare support for military widows and their families — making every ticket purchase an act of genuine impact.' },
            ],
        },
        {
            title: 'Prizes & Awards',
            label: 'Prizes',
            questions: [
                { question: 'Which categories have prize money?', answer: 'Prize money and trophies are awarded in the competitive circuits only — the Blitz Circuit (120 km) and the Recon Circuit (60 km). The Corporate Challenge and Family Fun Ride are non-competitive and recognition-based.' },
                { question: 'What prizes are available for competitive categories?', answer: 'The top three finishers in each sub-category receive cash prizes and trophies. Awards cover age-group, gender, team, and elite classifications. Detailed prize breakdowns will be published in the official race programme.' },
                { question: 'What is the Grand Raffle star prize?', answer: 'The star prize in the Grand Raffle is a brand-new saloon car. Additional raffle prizes include high-end bicycles, flat-screen TVs, refrigerators, and a variety of other sponsored items. Raffle tickets are KES 1,000 each and open to all.' },
                { question: 'How does the awards ceremony work?', answer: 'The closing ceremony includes speeches from the Riders Representative, Sponsors Representative, Fraternity Chairman, and Guest of Honour. Competitive category winners receive their awards first, followed by the Grand Raffle draw. The event concludes with the star prize vehicle ballot at approximately 17:00 hrs.' },
            ],
        },
    ];

    return (
        <>


            <div className="page" style={{ padding: '120px 0 80px' }}>
                <div className="page-inner--narrow">

                    {/* ── Header ─────────────────────────────────────────── */}
                    <div style={{ textAlign: 'center', marginBottom: 72 }}>
                        <div className="page-label-row--center" style={{ marginBottom: 20 }}>
                            <div className="page-label-line--short" />
                            <span className="page-eyebrow">Help Centre</span>
                            <div className="page-label-line--short" />
                        </div>
                        <h1 className="page-display page-title">
                            Frequently Asked<br />
                            <span style={{ color: 'var(--color-primary-light)' }}>Questions.</span>
                        </h1>
                        <p className="page-subtitle--center">
                            Everything you need to know about the 2026 Ride With The Warriors event.
                            Can't find what you're looking for? Reach out to our team.
                        </p>
                    </div>

                    {/* ── Categories ─────────────────────────────────────── */}
                    <div>
                        {faqCategories.map((category, idx) => (
                            <div key={idx} className="faq-category">

                                {/* Category header */}
                                <div className={`faq-category-header ${category.isRaffle ? 'faq-category-header--raffle' : ''}`}>
                                    <span className={`faq-cat-label ${category.isRaffle ? 'faq-cat-label--raffle' : ''}`}>{category.label}</span>
                                    <span className={`faq-cat-title ${category.isRaffle ? 'faq-cat-title--raffle' : ''}`}>{category.title}</span>
                                    <span className="faq-cat-count">{category.questions.length} questions</span>
                                </div>

                                {/* FAQ list */}
                                <div className={`faq-list ${category.isRaffle ? 'faq-list--raffle' : ''}`}>
                                    {category.questions.map((faq, fidx) => {
                                        const key = `${idx}-${fidx}`;
                                        return (
                                            <FAQItem
                                                key={fidx}
                                                question={faq.question}
                                                answer={faq.answer}
                                                isOpen={openKey === key}
                                                onToggle={() => handleToggle(key)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── CTA ────────────────────────────────────────────── */}
                    <div className="faqs-cta">
                        <div className="flex-1">
                            <h3 className="page-display faqs-cta-title">
                                Still have<br /><span style={{ color: 'var(--color-primary-light)' }}>questions?</span>
                            </h3>
                            <p className="faqs-cta-text">
                                Our team is here to help you prepare for the big day. No question is too small — reach out and we'll get back to you.
                            </p>
                        </div>
                        <Link to="/contact" className="shimmer-btn shimmer-btn--primary" style={{ flexShrink: 0 }}>
                            Contact Support →
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Faqs;