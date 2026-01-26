import { useState } from 'react';
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
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md">
                <button
                    onClick={onBack}
                    className="mb-8 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span>Back to Home</span>
                </button>

                <div className="bg-neutral-800 rounded-3xl shadow-2xl p-8 border border-neutral-700">
                    <div className="text-center mb-10">
                        <div className="inline-flex size-16 rounded-2xl bg-primary/10 items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
                        <p className="text-neutral-400 text-sm">Secure access for event organizers</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                                className="w-full px-5 py-4 rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 ml-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-xl flex items-start gap-3">
                                <span className="material-symbols-outlined text-red-500 text-xl">error</span>
                                <p className="text-red-400 text-sm">{error}</p>
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
                                    <span className="material-symbols-outlined text-[18px]">key</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-neutral-700 text-center">
                        <p className="text-xs text-neutral-500">
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
