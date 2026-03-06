import { Link } from 'react-router-dom';
import { AiOutlineTags, AiOutlineTrophy, AiOutlineArrowRight } from 'react-icons/ai';

const RaffleHomeSection = () => {
    return (
        <section className="py-24 px-4 bg-white dark:bg-[#0a0a0a] overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="bg-neutral-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden group shadow-2xl">
                    {/* Decorative background Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-amber-400/20 transition-colors duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="space-y-8">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/20 text-amber-400 text-xs font-black uppercase tracking-[0.2em] mb-6">
                                    <AiOutlineTags className="text-lg" />
                                    The Grand Raffle 2026
                                </div>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                                    Win Big for <br />
                                    <span className="text-amber-400">A Great Cause</span>
                                </h2>
                                <p className="text-lg text-neutral-400 max-w-lg leading-relaxed">
                                    Support the widows and families of our fallen heroes. Every ticket purchased directly contributes to their welfare while giving you a chance to win incredible prizes.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-amber-400 text-2xl shrink-0 group-hover:scale-110 transition-transform">
                                        <AiOutlineTrophy />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Elite Prizes</h4>
                                        <p className="text-sm text-neutral-500">From high-end mountain bikes to exclusive military experiences.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-amber-400 text-2xl shrink-0 group-hover:scale-110 transition-transform">
                                        <AiOutlineTags />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">KSH 1,000 / Ticket</h4>
                                        <p className="text-sm text-neutral-500">Buy as many as you want to increase your winning odds!</p>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/raffle/step/1"
                                className="inline-flex items-center gap-3 px-10 py-5 bg-amber-400 text-neutral-900 font-black text-lg rounded-2xl hover:bg-amber-500 hover:scale-105 transition-all shadow-xl shadow-amber-400/20"
                            >
                                Get Your Tickets Now
                                <AiOutlineArrowRight className="text-xl" />
                            </Link>
                        </div>

                        <div className="relative lg:h-[500px] flex items-center justify-center">
                            {/* Visual representation of a ticket or a mock-up image */}
                            <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[400px] bg-gradient-to-br from-amber-400/20 to-primary/20 rounded-[2.5rem] border border-white/10 flex items-center justify-center animate-pulse group-hover:animate-none group-hover:scale-[1.02] transition-all duration-700">
                                <span className="text-[120px] filter drop-shadow-2xl">🎟️</span>
                                {/* Floating elements */}
                                <div className="absolute top-10 right-10 size-16 bg-amber-400 rounded-2xl flex items-center justify-center text-3xl animate-bounce" style={{ animationDuration: '3s' }}>✨</div>
                                <div className="absolute bottom-10 left-10 size-12 bg-primary rounded-xl flex items-center justify-center text-2xl animate-bounce" style={{ animationDuration: '4s' }}>🏆</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RaffleHomeSection;
