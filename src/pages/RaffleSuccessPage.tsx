import { useState, useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { AiOutlineCheck, AiOutlineIdcard } from 'react-icons/ai';
import Confetti from 'react-confetti';

const RaffleSuccessPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () =>
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!id) return <Navigate to="/" replace />;

    const handleViewTicket = async () => {
        navigate(`/raffle/profile/${id}`);
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4 font-sans overflow-x-hidden">
            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                recycle={false}
                numberOfPieces={220}
                colors={['#f59e0b', '#22c55e', '#3b82f6', '#ec4899', '#a78bfa']}
            />

            <div className="max-w-md w-full text-center relative z-10 py-12">
                {/* Check icon */}
                <div className="mb-10 animate-in zoom-in duration-700">
                    <div className="size-24 rounded-full bg-amber-400 text-white flex items-center justify-center mx-auto shadow-2xl shadow-amber-400/40 scale-110">
                        <AiOutlineCheck className="text-6xl" />
                    </div>
                </div>

                <h1 className="text-4xl font-black text-neutral-900 dark:text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    You're In! 🎉
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    Your raffle ticket for{' '}
                    <span className="font-bold text-neutral-900 dark:text-white whitespace-nowrap">
                        Ride With The Warriors 2026
                    </span>{' '}
                    has been confirmed.
                </p>

                {/* Code card */}
                <div className="bg-white dark:bg-neutral-800 p-8 rounded-[40px] shadow-2xl border border-neutral-100 dark:border-neutral-700 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-4">
                        Your Raffle Code
                    </p>
                    <div className="inline-flex items-center justify-center px-8 py-4 bg-neutral-900 dark:bg-neutral-950 rounded-2xl shadow-lg mb-3">
                        <span className="text-5xl font-mono font-black text-amber-400 tracking-widest select-all">
                            {id}
                        </span>
                    </div>
                    <p className="text-sm text-neutral-400 mt-2">
                        Screenshot or note this — it's your entry number!
                    </p>
                </div>

                {/* Buttons */}
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
                    <button
                        onClick={handleViewTicket}
                        className="w-full py-5 rounded-[24px] bg-neutral-900 dark:bg-amber-400 text-white dark:text-neutral-900 font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl"
                    >
                        <AiOutlineIdcard />
                        <span>View My Ticket</span>
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-4 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-bold transition-colors"
                    >
                        Back to Home
                    </button>
                </div>

                <p className="mt-12 text-sm text-neutral-400 animate-in fade-in duration-1000 delay-1000">
                    You can look up your ticket anytime using your email at{' '}
                    <button onClick={() => navigate('/search')} className="text-primary underline-offset-2 hover:underline">
                        the search page
                    </button>.
                </p>
            </div>
        </div>
    );
};

export default RaffleSuccessPage;
