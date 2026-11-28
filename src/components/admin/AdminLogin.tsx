import { useState } from 'react';
import { AiOutlineExclamationCircle, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { adminApi } from './api/adminApi';
import { errorMessage } from './api/http';
import type { AdminUser } from '../../types';
import AdminAuthShell from './AdminAuthShell';

interface AdminLoginProps {
    onLogin: (token: string, admin: AdminUser) => void;
    onBack: () => void;
}

const AdminLogin = ({ onLogin, onBack }: AdminLoginProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { setError('Please enter both email and password'); return; }
        setLoading(true);
        setError(null);
        try {
            const { token, admin } = await adminApi.auth.login(email, password);
            onLogin(token, admin);
        } catch (err) {
            setError(errorMessage(err, 'An error occurred during login'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminAuthShell onBack={onBack}>
        {/* Form card */}
        <div className="al-card">
            <div className="al-card-eyebrow">Secure Login</div>
            <div className="al-card-title">Authenticate</div>
            <p className="al-card-sub">Enter your credentials to access the event management workspace.</p>

            <div className="al-divider" />

            <form onSubmit={handleSubmit}>
                <div className="al-field">
                    <label className="al-label">Email Address</label>
                    <input
                        className="al-input"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        autoFocus
                        autoComplete="email"
                    />
                </div>

                <div className="al-field">
                    <label className="al-label">Password</label>
                    <div className="al-pass-wrap">
                        <input
                            className="al-input"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            style={{ paddingRight: 48 }}
                        />
                        <button
                            type="button"
                            className="al-pass-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            title={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="al-error">
                        <AiOutlineExclamationCircle className="al-error-icon" />
                        <span>{error}</span>
                    </div>
                )}

                <button type="submit" className="al-submit" disabled={loading}>
                    {loading ? (
                        <div className="al-spinner" />
                    ) : (
                        <>
                            <span>Access Workspace</span>
                            <span className="al-submit-arrow">&rarr;</span>
                        </>
                    )}
                </button>
            </form>

            <div className="al-footnote">
                Ride With The Warriors 2026 &mdash; KDF Airborne Fraternity<br />
                Unauthorised access attempts are monitored and logged
            </div>
        </div>
        </AdminAuthShell>
    );
};

export default AdminLogin;
