import { useState } from 'react';
import {
    AiOutlineSun,
    AiOutlineMoon,
    AiOutlineArrowLeft,
    AiOutlineSafety,
    AiOutlineExclamationCircle,
    AiOutlineKey
} from 'react-icons/ai';
import { API_BASE_URL } from '../config';

interface AdminLoginProps {
    onLogin: (token: string, admin: any) => void;
    onBack: () => void;
}

const AdminLogin = ({ onLogin, onBack }: AdminLoginProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('adminTheme');
        return saved ? saved === 'dark' : false;
    });

    const toggleTheme = () => {
        const nextMode = !isDarkMode;
        setIsDarkMode(nextMode);
        localStorage.setItem('adminTheme', nextMode ? 'dark' : 'light');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Login failed');
            }

            onLogin(data.token, data.admin);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 font-sans transition-colors duration-300 ${isDarkMode ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
            <div className="fixed top-6 right-6">
                <button
                    onClick={toggleTheme}
                    className={`size-10 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-neutral-800 hover:bg-neutral-700 text-yellow-400' : 'bg-white hover:bg-neutral-100 text-neutral-600 shadow-sm border'}`}
                >
                    <div className="text-xl">
                        {isDarkMode ? <AiOutlineSun /> : <AiOutlineMoon />}
                    </div>
                </button>
            </div>

            <div className="w-full max-w-md">
                <button
                    onClick={onBack}
                    className={`mb-8 flex items-center gap-2 transition-colors ${isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}`}
                >
                    <AiOutlineArrowLeft className="text-xl" />
                    <span>Back to Home</span>
                </button>

                <div className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200 shadow-xl'} rounded-3xl p-8 border`}>
                    <div className="text-center mb-10">
                        <div className="inline-flex size-16 rounded-2xl bg-primary/10 items-center justify-center mb-4">
                            <AiOutlineSafety className="text-primary text-3xl" />
                        </div>
                        <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Admin Portal</h1>
                        <p className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'} text-sm`}>Secure access for event organizers</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ml-1 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                                className={`w-full px-5 py-4 rounded-xl outline-none transition-all ${isDarkMode
                                    ? 'bg-neutral-900 border-neutral-700 text-white focus:border-primary'
                                    : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-primary'
                                    } border focus:ring-2 focus:ring-primary/20`}
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ml-1 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-5 py-4 rounded-xl outline-none transition-all ${isDarkMode
                                    ? 'bg-neutral-900 border-neutral-700 text-white focus:border-primary'
                                    : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-primary'
                                    } border focus:ring-2 focus:ring-primary/20`}
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className={`p-4 rounded-xl flex items-start gap-3 border ${isDarkMode ? 'bg-red-900/20 border-red-900/50' : 'bg-red-50 border-red-200'}`}>
                                <AiOutlineExclamationCircle className="text-red-500 text-xl" />
                                <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="size-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                            ) : (
                                <>
                                    <span>Authenticate</span>
                                    <AiOutlineKey className="text-[18px]" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className={`mt-8 pt-6 border-t text-center ${isDarkMode ? 'border-neutral-700' : 'border-neutral-100'}`}>
                        <p className={`text-xs ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            Only authorized personnel should attempt to log in. <br />
                            All access attempts are logged.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
