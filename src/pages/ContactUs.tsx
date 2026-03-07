import { useState } from 'react';
import '../styles/contact-us.css';
import {
    AiOutlineMail,
    AiOutlinePhone,
    AiOutlineEnvironment,
    AiOutlineSend,
    AiOutlineCheckCircle,
    AiOutlineClockCircle
} from 'react-icons/ai';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', subject: '', message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        }, 1500);
    };

    const contactCards = [
        { icon: <AiOutlineMail />, title: 'Email Us', detail: 'ridesupport@airbornefraternity.org', link: 'mailto:ridesupport@airbornefraternity.org', accentColor: 'rgba(59,130,246,0.7)' },
        { icon: <AiOutlinePhone />, title: 'Call Us', detail: '0703 752 118', link: 'tel:0703752118', accentColor: 'var(--color-primary-light)' },
        { icon: <AiOutlineEnvironment />, title: 'Event Venue', detail: 'Ulinzi Sports Complex, Nairobi', link: 'https://maps.google.com', accentColor: 'rgba(249,115,22,0.8)' },
    ];

    return (
        <>


            <div className="page">
                <div className="page-inner">

                    {/* ── Header ── */}
                    <div className="ct-header">
                        <div className="page-label-row">
                            <div className="page-label-line" />
                            <span className="page-eyebrow">Contact Us</span>
                        </div>
                        <h1 className="page-display page-title">Get in <span className="page-accent">Touch.</span></h1>
                        <p className="page-subtitle">
                            Questions about RWTW 2026? Whether it's registration, logistics, or
                            sponsorship — we're ready to help.
                        </p>
                    </div>

                    {/* ── Emergency banner ── */}
                    <div className="ct-emergency">
                        <div className="ct-emergency-icon"><AiOutlinePhone /></div>
                        <div className="ct-emergency-text">
                            <div className="ct-emergency-title">Medical & Emergency</div>
                            <div className="ct-emergency-sub">Immediate assistance for event-day incidents.</div>
                        </div>
                        <a href="tel:0703752118" className="ct-emergency-btn">
                            <AiOutlinePhone />
                            Call Emergency Line
                        </a>
                    </div>

                    {/* ── Main grid ── */}
                    <div className="ct-grid">

                        {/* Sidebar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {contactCards.map((card, idx) => (
                                <a key={idx} href={card.link} target="_blank" rel="noopener noreferrer"
                                    className="ct-contact-card"
                                    style={{ '--hover-border': card.accentColor } as any}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = card.accentColor; (e.currentTarget.querySelector('.ct-contact-icon') as HTMLElement).style.borderColor = card.accentColor; (e.currentTarget.querySelector('.ct-contact-icon') as HTMLElement).style.color = card.accentColor; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--ct-border)'; (e.currentTarget.querySelector('.ct-contact-icon') as HTMLElement).style.borderColor = 'var(--ct-border-2)'; (e.currentTarget.querySelector('.ct-contact-icon') as HTMLElement).style.color = card.accentColor; }}
                                >
                                    <div className="ct-contact-icon" style={{ color: card.accentColor }}>
                                        {card.icon}
                                    </div>
                                    <div>
                                        <div className="ct-contact-label">{card.title}</div>
                                        <div className="ct-contact-detail">{card.detail}</div>
                                    </div>
                                </a>
                            ))}

                            {/* Office Hours */}
                            <div className="ct-hours">
                                <div className="ct-hours-bg-icon"><AiOutlineClockCircle /></div>
                                <div className="ct-hours-title">Office Hours</div>
                                <div className="ct-hours-row"><div className="ct-hours-dot" />Mon – Fri: 8:00 AM – 5:00 PM</div>
                                <div className="ct-hours-row"><div className="ct-hours-dot" />Sat: 9:00 AM – 1:00 PM</div>
                            </div>
                        </div>

                        {/* Main column */}
                        <div>
                            {/* Form */}
                            <div className="ct-form-panel">
                                <div className="ct-form-title">Send Us<br />A Message.</div>
                                <div className="ct-form-sub">We'll get back to you as soon as possible.</div>

                                <form onSubmit={handleSubmit} className="ct-form-fields">
                                    <div className="ct-field">
                                        <label className="ct-field-label">Full Name</label>
                                        <input type="text" required placeholder="Enter your full name" value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="ct-input" />
                                    </div>

                                    <div className="ct-grid-2">
                                        <div className="ct-field">
                                            <label className="ct-field-label">Email Address</label>
                                            <input type="email" required placeholder="email@example.com" value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="ct-input" />
                                        </div>
                                        <div className="ct-field">
                                            <label className="ct-field-label">Phone Number</label>
                                            <input type="tel" required placeholder="07XX XXX XXX" value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="ct-input" />
                                        </div>
                                    </div>

                                    <div className="ct-field">
                                        <label className="ct-field-label">Subject</label>
                                        <input type="text" required placeholder="How can we help?" value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                            className="ct-input" />
                                    </div>

                                    <div className="ct-field">
                                        <label className="ct-field-label">Message</label>
                                        <textarea required rows={5} placeholder="Write your message here..." value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            className="ct-textarea ct-input" />
                                    </div>

                                    <div>
                                        <button type="submit" disabled={status !== 'idle'}
                                            className={`shimmer-btn shimmer-btn--primary w-full ${status}`}>
                                            {status === 'idle' && <><span>Send Message</span><AiOutlineSend /></>}
                                            {status === 'submitting' && <><div className="ct-spinner" /><span>Sending…</span></>}
                                            {status === 'success' && <><AiOutlineCheckCircle style={{ fontSize: '1.1rem' }} /><span>Sent Successfully!</span></>}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Map */}
                            <div className="ct-map-panel">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7438949984935!2d36.787552375827794!3d-1.329716135676906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f117e8b602a2d%3A0xcbadd496b3d4d07d!2sUlinzi%20Sports%20Complex%20-%20Langata!5e0!3m2!1sen!2ske!4v1770886515720!5m2!1sen!2ske"
                                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                                />
                                <div className="ct-map-footer">
                                    <div className="ct-map-label">
                                        <div className="ct-map-label-dot" />
                                        Ulinzi Sports Complex, Langata, Nairobi
                                    </div>
                                    <a href="https://maps.app.goo.gl/FqXgWrtojwBmY5GJA" target="_blank" rel="noopener noreferrer" className="ct-directions-link">
                                        <AiOutlineEnvironment />
                                        Get Directions
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUs;