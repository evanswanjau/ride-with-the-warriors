/** The riders' quotes on the home page. */

/* ─── Testimonials Data ──────────────────────────────────────────────────── */
const testimonials = [
    { text: 'Crossing that finish line knowing every kilometre raised money for the widows — nothing else compares to that feeling.', name: 'James Mwangi', role: 'Veteran Cyclist', circuit: '120KM Blitz', initials: 'JM' },
    { text: 'The organisation was flawless. Seeing active-duty soldiers and civilians riding together was genuinely moving.', name: 'Sarah Kamau', role: 'Competitive Cyclist, Nairobi', circuit: '60KM Recon', initials: 'SK' },
    { text: 'We entered as a corporate team of eight and finished as brothers. Back with double the team next year.', name: 'David Ochieng', role: 'Team Lead, Safaricom', circuit: '30KM Corporate', initials: 'DO' },
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

export default TestimonialsSection;
