import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

type SearchType = 'id' | 'email' | 'phone';

interface ProfileLookupProps {
    onFound: (registration: any) => void;
}

const ProfileLookup = ({ onFound }: ProfileLookupProps) => {
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
                throw new Error(data.error?.message || 'Registration not found');
            }

            onFound(data.registration);
            navigate(`/profile/${data.registration.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getPlaceholder = () => {
        switch (searchType) {
            case 'id':
                return 'e.g., abc123-def456-ghi789';
            case 'email':
                return 'e.g., john@example.com';
            case 'phone':
                return 'e.g., 0712345678';
            default:
                return '';
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-3">
                        Check My Registration
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Enter your registration details to view your profile
                    </p>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl p-8">
                    {/* Search Type Tabs */}
                    <div className="flex gap-2 mb-6 bg-neutral-100 dark:bg-neutral-700 p-1 rounded-xl">
                        <button
                            onClick={() => setSearchType('id')}
                            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${searchType === 'id'
                                ? 'bg-white dark:bg-neutral-800 text-primary shadow-md'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                        >
                            Registration ID
                        </button>
                        <button
                            onClick={() => setSearchType('email')}
                            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${searchType === 'email'
                                ? 'bg-white dark:bg-neutral-800 text-primary shadow-md'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                        >
                            Email
                        </button>
                        <button
                            onClick={() => setSearchType('phone')}
                            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${searchType === 'phone'
                                ? 'bg-white dark:bg-neutral-800 text-primary shadow-md'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                        >
                            Phone Number
                        </button>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch}>
                        <div className="mb-6">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-neutral-400">
                                    search
                                </span>
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder={getPlaceholder()}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-primary focus:outline-none transition-colors text-lg"
                                />
                            </div>
                            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                                {searchType === 'id' && 'Enter your Registration ID (e.g. 5001) or ID/Passport Number'}
                                {searchType === 'email' && 'Enter the email used during registration'}
                                {searchType === 'phone' && 'Enter your phone number (e.g., 0712345678)'}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl">
                                    error
                                </span>
                                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 rounded-xl bg-primary text-white text-lg font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Searching...</span>
                                </>
                            ) : (
                                <>
                                    <span>Search Registration</span>
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-6">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Don't have a registration yet?{' '}
                        <a href="/" className="text-primary font-bold hover:underline">
                            Register Now
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfileLookup;
