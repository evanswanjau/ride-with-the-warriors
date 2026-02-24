import { useState } from 'react';
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
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate API Call
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        }, 1500);
    };

    const contactCards = [
        {
            icon: <AiOutlineMail />,
            title: 'Email Us',
            detail: 'ridesupport@airbornefraternity.org',
            link: 'mailto:ridesupport@airbornefraternity.org',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            icon: <AiOutlinePhone />,
            title: 'Call Us',
            detail: '0703 752 118',
            link: 'tel:0703752118',
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        {
            icon: <AiOutlineEnvironment />,
            title: 'Event Venue',
            detail: 'Ulinzi Sports Complex, Nairobi',
            link: 'https://maps.google.com',
            color: 'text-orange-500',
            bg: 'bg-orange-500/10'
        }
    ];

    return (
        <div className="min-h-screen">
            {/* --- Header Section --- */}
            <div className="flex flex-col items-center text-center mb-16">
                <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 uppercase tracking-widest">
                    Contact
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white mb-6 tracking-tight">
                    Get in <span className="text-primary">Touch.</span>
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-xl text-lg leading-relaxed">
                    Have questions about RWTW 2026? Whether it's registration, logistics, or
                    sponsorship, we're ready to help.
                </p>
            </div>

            {/* --- Emergency Banner --- */}
            <div className="relative overflow-hidden bg-white dark:bg-[#232623] rounded-[2rem] p-1 mb-16">
                <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
                    <div className="flex -space-x-2">
                        <div className="w-14 h-14 rounded-2xl bg-red-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-red-500/40 animate-pulse">
                            <AiOutlinePhone />
                        </div>
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h3 className="font-bold text-neutral-900 dark:text-white text-xl">Medical & Emergency</h3>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Immediate assistance for event-day incidents.</p>
                    </div>
                    <a href="tel:0703752118" className="w-full md:w-auto px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all active:scale-95 text-center">
                        Call Emergency Line
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Sidebar: Contact Cards --- */}
                <div className="space-y-4">
                    {contactCards.map((card, idx) => (
                        <a key={idx} href={card.link} target="_blank" rel="noopener noreferrer"
                            className="block p-6 bg-white dark:bg-[#232623] rounded-[1.5rem] border border-neutral-100 dark:border-neutral-800 transition-all hover:border-primary/50 group">
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                                    {card.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest">{card.title}</p>
                                    <p className="text-neutral-900 dark:text-white font-medium break-all">{card.detail}</p>
                                </div>
                            </div>
                        </a>
                    ))}

                    <div className="p-8 bg-primary rounded-[2rem] text-white relative overflow-hidden group">
                        <AiOutlineClockCircle className="absolute -right-4 -bottom-4 text-9xl opacity-10 group-hover:rotate-12 transition-transform" />
                        <h4 className="font-bold text-xl mb-2">Office Hours</h4>
                        <p className="text-white/80 text-sm">Mon - Fri: 8:00 AM - 5:00 PM</p>
                        <p className="text-white/80 text-sm">Sat: 9:00 AM - 1:00 PM</p>
                    </div>
                </div>

                {/* --- Main: Content Area --- */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Contact Form */}
                    <div className="bg-white dark:bg-[#232623] rounded-[2.5rem] p-8 md:p-12">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Send us a Message</h2>
                            <p className="text-neutral-500 dark:text-neutral-400">
                                Fill out the form below and we'll get back to you as soon as possible.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-5 py-3 outline-none focus:border-primary transition-all dark:text-white duration-300 delay-100 ease-in-out"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-5 py-3 outline-none focus:border-primary transition-all dark:text-white duration-300 delay-100 ease-in-out"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-5 py-3 outline-none focus:border-primary transition-all dark:text-white duration-300 delay-100 ease-in-out"
                                        placeholder="07XX XXX XXX"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-5 py-3 outline-none focus:border-primary transition-all dark:text-white duration-300 delay-100 ease-in-out"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-5 py-4 outline-none focus:border-primary transition-all dark:text-white resize-none duration-300 delay-100 ease-in-out"
                                    placeholder="Write your message here..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status !== 'idle'}
                                className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 ${status === 'success'
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-primary text-white hover:bg-primary-dark'
                                    }`}
                            >
                                {status === 'idle' && (
                                    <>
                                        <span>Send Message</span>
                                        <AiOutlineSend />
                                    </>
                                )}
                                {status === 'submitting' && (
                                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                )}
                                {status === 'success' && (
                                    <>
                                        <AiOutlineCheckCircle className="text-xl" />
                                        <span>Sent Successfully!</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Map Section */}
                    <div className="bg-white dark:bg-[#232623] rounded-[2.5rem] p-4 overflow-hidden">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7438949984935!2d36.787552375827794!3d-1.329716135676906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f117e8b602a2d%3A0xcbadd496b3d4d07d!2sUlinzi%20Sports%20Complex%20-%20Langata!5e0!3m2!1sen!2ske!4v1770886515720!5m2!1sen!2ske"
                            width="100%"
                            height="300"
                            style={{ border: 0, borderRadius: '2rem' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                        <div className="mt-4 text-center">
                            <a
                                href="https://maps.app.goo.gl/FqXgWrtojwBmY5GJA"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                            >
                                <AiOutlineEnvironment />
                                Get Directions to Ulinzi Sports Complex
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;