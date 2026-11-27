import { useState } from 'react';
import { AiOutlineSun, AiOutlineMoon, AiOutlineArrowLeft, AiOutlineExclamationCircle, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { adminApi } from './api/adminApi';
import { errorMessage } from './api/http';
import type { AdminUser } from '../../types';
import logo from '../../assets/logos/logo.png';
import './AdminLogin.css';

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
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('adminTheme') === 'dark');

    const toggleTheme = () => {
        const next = !isDarkMode;
        setIsDarkMode(next);
        localStorage.setItem('adminTheme', next ? 'dark' : 'light');
    };

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

    const dm = isDarkMode;

    return (
        <>

            <div className={`al-root ${dm ? 'dark' : 'light'}`}>

                {/* ── Left panel ── */}
                <div className="al-left">
                    <img src={logo} alt="Ride With The Warriors" className="al-left-logo" />

                    <div className="al-left-eyebrow">Admin Access</div>
                    <div className="al-left-title">Command<br />Portal</div>
                    <p className="al-left-subtitle">
                        Restricted access. Only authorised event personnel may proceed beyond this point.
                    </p>

                    <div className="al-left-spacer" />

                    <div className="al-event-badge">
                        <span className="al-event-badge-label">Current Event</span>
                        <span className="al-event-badge-val">
                            <span className="al-event-badge-dot" />
                            Ride With The Warriors 2026
                        </span>
                        <span className="al-event-badge-val" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem' }}>
                            05 July 2026 &mdash; Ulinzi Sports Complex
                        </span>
                    </div>

                    <p className="al-warning">
                        All access attempts are logged.<br />
                        Unauthorised access is prohibited.
                    </p>
                </div>

                {/* ── Right panel ── */}
                <div className="al-right">

                    {/* Top bar */}
                    <div className="al-topbar">
                        <button className="al-back-btn" onClick={onBack}>
                            <AiOutlineArrowLeft style={{ fontSize: '0.9rem' }} />
                            Back to Home
                        </button>
                        <button className="al-theme-btn" onClick={toggleTheme} title="Toggle theme">
                            {dm ? <AiOutlineSun /> : <AiOutlineMoon />}
                        </button>
                    </div>

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

                </div>
            </div>
        </>
    );
};

export default AdminLogin;