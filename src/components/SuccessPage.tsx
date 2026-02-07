import { useState, useEffect } from 'react';
import {
    AiOutlineCheck,
    AiOutlineBarcode,
    AiOutlineUp,
    AiOutlineDown,
    AiOutlineIdcard
} from 'react-icons/ai';
import Confetti from 'react-confetti';
import { calculateAge } from '../utils';
import { API_BASE_URL } from '../config';

interface SuccessPageProps {
    registrationId: string;
    onViewProfile: () => void;
    onDone: () => void;
}

const SuccessPage = ({ registrationId, onViewProfile, onDone }: SuccessPageProps) => {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [registration, setRegistration] = useState<any>(null);
    const [showMembers, setShowMembers] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);

        // Fetch registration details to show member IDs
        fetch(`${API_BASE_URL}/profile/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchType: 'id', searchValue: registrationId })
        })
            .then(res => res.json())
            .then(data => {
                if (data.registration) {
                    setRegistration(data.registration);
                }
            })
            .catch(console.error);

        return () => window.removeEventListener('resize', handleResize);
    }, [registrationId]);

    const isTeam = registration?.type === 'team';
    const members = registration?.payload?.teamDetails?.members || [];

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4 font-sans overflow-x-hidden">
            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                recycle={false}
                numberOfPieces={200}
                colors={['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']}
            />

            <div className="max-w-2xl w-full text-center relative z-10 py-12">
                <div className="mb-10 animate-in zoom-in duration-700">
                    <div className="size-24 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-green-500/30 scale-110">
                        <AiOutlineCheck className="text-6xl" />
                    </div>
                </div>

                <h1 className="text-4xl font-black text-neutral-900 dark:text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    Payment Received!
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    Thank you for your payment. Your registration for <span className="font-bold text-neutral-900 dark:text-white whitespace-nowrap">Ride With The Warriors 2026</span> is confirmed.
                </p>

                <div className="max-w-md mx-auto">
                    <div className="bg-white dark:bg-neutral-800 p-8 rounded-[40px] shadow-2xl border border-neutral-100 dark:border-neutral-700 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-4">
                            {isTeam ? 'Team Registration ID' : 'Your Registration ID'}
                        </p>
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <AiOutlineBarcode className="text-primary text-3xl" />
                            <span className="text-4xl font-mono font-black text-primary select-all tracking-tighter">{registrationId}</span>
                        </div>

                        {isTeam && members.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-700">
                                <button
                                    onClick={() => setShowMembers(!showMembers)}
                                    className="flex items-center justify-center gap-2 w-full text-sm font-bold text-neutral-500 hover:text-primary transition-colors mb-4"
                                >
                                    {showMembers ? <AiOutlineUp /> : <AiOutlineDown />}
                                    {showMembers ? 'Hide Member Details' : `View All ${members.length} Member Details`}
                                </button>

                                {showMembers && (
                                    <div className="space-y-3 text-left">
                                        {members.map((m: any, idx: number) => (
                                            <div key={idx} className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-bold text-neutral-900 dark:text-white">
                                                        {m.firstName} {m.lastName}
                                                        {m.isCaptain && <span className="ml-2 text-[8px] bg-primary text-white px-1.5 py-0.5 rounded-full">CAPTAIN</span>}
                                                    </p>
                                                    <p className="text-[10px] text-neutral-500 font-mono tracking-tighter">REG ID: {m.regId || `${registrationId}-${idx + 1}`}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-neutral-400 font-bold uppercase">{m.gender}</p>
                                                    <p className="text-[10px] text-neutral-400 font-bold uppercase">{calculateAge(m.dob)} YRS</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
                        <button
                            onClick={onViewProfile}
                            className="w-full py-5 rounded-[24px] bg-neutral-900 dark:bg-primary text-white font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl"
                        >
                            <AiOutlineIdcard />
                            <span>View My Full Profile</span>
                        </button>

                        <button
                            onClick={onDone}
                            className="w-full py-4 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-bold transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>

                    <p className="mt-12 text-sm text-neutral-400 animate-in fade-in duration-1000 delay-1000">
                        A confirmation email has been sent to the captain's email address.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
