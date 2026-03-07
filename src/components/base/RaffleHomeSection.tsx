import { Link } from 'react-router-dom';
import { AiOutlineTags, AiOutlineTrophy, AiOutlineArrowRight } from 'react-icons/ai';

const RaffleHomeSection = () => {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap');

                .raffle-section {
                    font-family: 'Barlow', sans-serif;
                }

                /* ── Ticket shimmer button ── */
                .raffle-cta-btn {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 40px;
                    background: #f59e0b;
                    color: #111;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 1.05rem;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    text-decoration: none;
                    overflow: hidden;
                    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
                    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
                }
                .raffle-cta-btn::before {
                    content: '';
                    position: absolute;
                    top: 0; left: -80%;
                    width: 60%; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.5) 50%, transparent 80%);
                    transform: skewX(-20deg);
                    pointer-events: none;
                }
                .raffle-cta-btn:hover::before {
                    left: 140%;
                    transition: left 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .raffle-cta-btn:hover {
                    background: #fbbf24;
                    transform: translateY(-2px);
                    box-shadow: 0 16px 40px rgba(245, 158, 11, 0.35);
                }

                /* ── Ticket visual ── */
                .raffle-ticket-visual {
                    position: relative;
                    background: linear-gradient(135deg, #1a1a0e 0%, #1c1a08 50%, #0f1a0f 100%);
                    border: 1px solid rgba(245, 158, 11, 0.2);
                    overflow: hidden;
                    clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px));
                }
                .raffle-ticket-visual::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: repeating-linear-gradient(
                        -45deg,
                        transparent,
                        transparent 18px,
                        rgba(245,158,11,0.03) 18px,
                        rgba(245,158,11,0.03) 36px
                    );
                    pointer-events: none;
                }
                /* Notch cutouts on sides (ticket effect) */
                .raffle-ticket-visual::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 0; right: 0;
                    border-top: 1px dashed rgba(245, 158, 11, 0.15);
                    transform: translateY(-50%);
                    pointer-events: none;
                }

                /* ── Prize stat ── */
                .prize-stat {
                    border-left: 2px solid rgba(245, 158, 11, 0.3);
                    padding: 14px 20px;
                    transition: border-color 0.2s;
                }
                .prize-stat:hover {
                    border-color: #f59e0b;
                }

                /* ── Section label ── */
                .raffle-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 0.25em;
                    text-transform: uppercase;
                }

                /* ── Display heading ── */
                .raffle-heading {
                    font-family: 'Bebas Neue', sans-serif;
                    letter-spacing: 0.03em;
                    line-height: 0.95;
                }

                /* ── Feature row ── */
                .raffle-feature {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    padding: 18px 0;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    transition: background 0.2s;
                }
                .raffle-feature:first-child {
                    border-top: 1px solid rgba(255,255,255,0.06);
                }
                .raffle-feature-icon {
                    width: 40px; height: 40px;
                    border: 1px solid rgba(245, 158, 11, 0.25);
                    display: flex; align-items: center; justify-content: center;
                    color: #f59e0b;
                    font-size: 1.1rem;
                    flex-shrink: 0;
                    transition: background 0.2s, border-color 0.2s;
                }
                .raffle-feature:hover .raffle-feature-icon {
                    background: rgba(245, 158, 11, 0.1);
                    border-color: #f59e0b;
                }

                /* Pulse glow on ticket number */
                @keyframes glowPulse {
                    0%, 100% { text-shadow: 0 0 20px rgba(245,158,11,0.3); }
                    50%       { text-shadow: 0 0 50px rgba(245,158,11,0.7), 0 0 80px rgba(245,158,11,0.3); }
                }
                .ticket-price-glow {
                    animation: glowPulse 3s ease-in-out infinite;
                }
            `}</style>

            <section className="raffle-section py-24 px-6 lg:px-12 bg-neutral-900">
                <div className="max-w-7xl mx-auto">

                    {/* Header row */}
                    <div className="flex flex-col md:flex-row md:items-end gap-6 mb-14">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-px w-12" style={{ background: '#f59e0b' }} />
                                <span className="raffle-label" style={{ color: '#f59e0b' }}>The Grand Raffle 2026</span>
                            </div>
                            <h2 className="raffle-heading text-[clamp(3rem,6vw,5rem)] text-white">
                                Win Big.<br />
                                <span style={{ color: '#f59e0b' }}>Give Back.</span>
                            </h2>
                        </div>
                        <p className="text-neutral-500 max-w-xs leading-relaxed md:ml-auto md:text-right text-sm">
                            Every ticket supports the widows and families of fallen heroes — while putting you in the draw for incredible prizes.
                        </p>
                    </div>

                    {/* Main panel */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border border-neutral-800"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))' }}>

                        {/* ── Left: Content (3 cols) ── */}
                        <div className="lg:col-span-3 bg-neutral-950 p-10 md:p-14 flex flex-col justify-between">
                            <div>
                                <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg">
                                    Support the widows and families of our fallen heroes. Every ticket purchased
                                    directly contributes to their welfare while giving you a chance to
                                    <span className="text-white font-semibold"> win incredible prizes</span>.
                                </p>

                                {/* Feature rows */}
                                <div className="mb-12">
                                    {[
                                        {
                                            icon: <AiOutlineTrophy />,
                                            title: 'Elite Prizes',
                                            text: 'High-end mountain bikes, exclusive military experiences, and more.'
                                        },
                                        {
                                            icon: <AiOutlineTags />,
                                            title: 'KSH 1,000 / Ticket',
                                            text: 'Buy as many as you want — more tickets means better odds.'
                                        },
                                    ].map((item, i) => (
                                        <div key={i} className="raffle-feature">
                                            <div className="raffle-feature-icon">{item.icon}</div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm tracking-wide mb-1">{item.title}</h4>
                                                <p className="text-sm text-neutral-500">{item.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Link to="/raffle/step/1" className="raffle-cta-btn">
                                    Get Your Tickets Now
                                    <AiOutlineArrowRight className="text-lg" />
                                </Link>
                            </div>
                        </div>

                        {/* ── Right: Visual (2 cols) ── */}
                        <div className="lg:col-span-2 raffle-ticket-visual min-h-[360px] flex flex-col items-center justify-center gap-8 p-12">

                            {/* Top label */}
                            <div className="raffle-label text-amber-400/60 tracking-[0.3em]">Grand Raffle 2026</div>

                            {/* Big ticket price */}
                            <div className="text-center">
                                <div className="raffle-heading text-[5.5rem] text-amber-400 ticket-price-glow leading-none">
                                    1,000
                                </div>
                                <div className="raffle-label text-amber-400/50 tracking-[0.2em] mt-1">KSH per ticket</div>
                            </div>

                            {/* Divider */}
                            <div className="w-full border-t border-dashed border-amber-400/20" />

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-0 w-full">
                                {[
                                    { value: 'Multiple', label: 'Prize Tiers' },
                                    { value: '∞', label: 'Tickets / Person' },
                                ].map((s, i) => (
                                    <div key={i} className="prize-stat text-center">
                                        <div className="raffle-heading text-3xl text-white">{s.value}</div>
                                        <div className="text-xs font-bold uppercase tracking-widest text-neutral-600 mt-1">{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Bottom draw date */}
                            <div className="raffle-label text-neutral-600 tracking-[0.2em]">Draw: 05 July 2026</div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default RaffleHomeSection;