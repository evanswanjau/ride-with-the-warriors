import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import {
    AiOutlineSearch,
    AiOutlineExclamationCircle,
    AiOutlineArrowRight
} from 'react-icons/ai';

type SearchType = 'id' | 'email' | 'phone';

interface ProfileLookupProps {
    onFound: (registration: any) => void;
    onRaffleFound: (ticket: any) => void;
}

const ProfileLookup = ({ onFound, onRaffleFound }: ProfileLookupProps) => {
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState<SearchType>('id');
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchValue.trim()) {
            setError('Please enter a value to search');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/profile/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchType,
                    searchValue: searchValue.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'No registration or raffle ticket found');
            }

            const { registration, raffleTicket } = data;

            if (registration) {
                onFound(registration);
                navigate(`/profile/${registration.id}`);
            } else if (raffleTicket) {
                onRaffleFound(raffleTicket);
                navigate(`/raffle/profile/${raffleTicket.id}`);
            } else {
                setError('Nothing found matching your search. Please try again.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getPlaceholder = () => {
        switch (searchType) {
            case 'id':
                return 'Registration ID or Raffle Code (e.g. AA001)';
            case 'email':
                return 'e.g., john@example.com';
            case 'phone':
                return 'e.g., 0712345678';
            default:
                return '';
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[400px] py-12">
            <div className="w-full max-w-2xl px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-neutral-900 dark:text-white mb-3">
                        Track My Entry
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 font-medium">
                        Search for your event registration or raffle ticket
                    </p>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-[32px] shadow-2xl p-6 md:p-10 border border-neutral-100 dark:border-neutral-700/50">
                    {/* Search Type Tabs */}
                    <div className="flex gap-2 mb-8 bg-neutral-100 dark:bg-neutral-900/50 p-1.5 rounded-2xl">
                        {(['id', 'email', 'phone'] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setSearchType(type)}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${searchType === type
                                    ? 'bg-white dark:bg-neutral-800 text-primary shadow-lg shadow-primary/10'
                                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                    }`}
                            >
                                {type.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div>
                            <div className="relative group">
                                <AiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 text-2xl transition-colors group-focus-within:text-primary" />
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder={getPlaceholder()}
                                    className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-neutral-100 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-primary focus:bg-white dark:focus:bg-neutral-800 focus:outline-none transition-all text-lg font-medium"
                                />
                            </div>
                            <p className="mt-3 text-[11px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 text-center">
                                {searchType === 'id' && 'Registration ID (e.g. 1001), Passport, or Raffle Code (e.g. AA001)'}
                                {searchType === 'email' && 'Use the email you registered with'}
                                {searchType === 'phone' && 'Use your M-Pesa phone number'}
                            </p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                <AiOutlineExclamationCircle className="text-red-500 text-xl shrink-0 mt-0.5" />
                                <p className="text-red-600 dark:text-red-400 text-sm font-semibold">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 rounded-2xl bg-neutral-900 dark:bg-primary text-white text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    <span>Searching Ecosystem...</span>
                                </>
                            ) : (
                                <>
                                    <span>Search Everything</span>
                                    <AiOutlineArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-10">
                    <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">
                        Need help? <a href="/contact" className="text-primary hover:underline">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfileLookup;
