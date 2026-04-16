import { useState } from 'react';
import { AiOutlineSun, AiOutlineMoon, AiOutlineArrowLeft, AiOutlineExclamationCircle } from 'react-icons/ai';
import { API_BASE_URL } from '../../config';
import logo from '../../assets/logos/logo.png';

interface AdminLoginProps {
    onLogin: (token: string, admin: any) => void;
    onBack: () => void;
}

const AdminLogin = ({ onLogin, onBack }: AdminLoginProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || 'Login failed');
            onLogin(data.token, data.admin);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const dm = isDarkMode;

    return (
        <>
            <style>{`
                

                .al-root {
                    min-height: 100vh;
                    display: flex;
                    font-family: 'Barlow', sans-serif;
                    transition: background 0.25s;
                }
                .al-root.dark { background: #0a0a0a; color: #ffffff; }
                .al-root.light { background: #f5f2eb; color: #111111; }

                /* Left panel — dark always */
                .al-left {
                    width: 420px;
                    flex-shrink: 0;
                    background: #0d1a0d;
                    border-right: 2px solid #2d6a2d;
                    display: flex;
                    flex-direction: column;
                    padding: 48px 44px;
                    position: relative;
                    overflow: hidden;
                }
                .al-left::before {
                    content: '';
                    position: absolute;
                    right: -80px; bottom: -80px;
                    width: 320px; height: 320px;
                    border: 1px solid rgba(76,175,80,0.08);
                    transform: rotate(15deg);
                    pointer-events: none;
                }
                .al-left::after {
                    content: '';
                    position: absolute;
                    right: -40px; bottom: -40px;
                    width: 200px; height: 200px;
                    border: 1px solid rgba(76,175,80,0.05);
                    transform: rotate(15deg);
                    pointer-events: none;
                }
                .al-left-logo { height: 40px; width: auto; object-fit: contain; margin-bottom: 48px; }
                .al-left-eyebrow {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.6rem; font-weight: 700;
                    letter-spacing: 0.28em; text-transform: uppercase;
                    color: #4caf50; margin-bottom: 10px;
                    display: flex; align-items: center; gap: 8px;
                }
                .al-left-eyebrow::before { content: ''; display: block; width: 28px; height: 1px; background: #4caf50; }
                .al-left-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 3.2rem; letter-spacing: 0.04em; line-height: 1;
                    color: #ffffff; margin-bottom: 18px;
                }
                .al-left-subtitle {
                    font-size: 0.88rem; line-height: 1.65;
                    color: rgba(255,255,255,0.38); max-width: 280px;
                }
                .al-left-spacer { flex: 1; }
                .al-event-badge {
                    display: inline-flex; flex-direction: column; gap: 4px;
                    border: 1px solid rgba(76,175,80,0.2);
                    border-left: 3px solid #4caf50;
                    padding: 14px 18px;
                }
                .al-event-badge-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.58rem; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase;
                    color: rgba(255,255,255,0.3);
                }
                .al-event-badge-val {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.88rem; font-weight: 700;
                    color: rgba(255,255,255,0.75);
                }
                .al-event-badge-dot {
                    display: inline-block; width: 6px; height: 6px;
                    border-radius: 50%; background: #4caf50;
                    margin-right: 6px;
                    animation: al-pulse 2s infinite;
                }
                @keyframes al-pulse {
                    0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
                }
                .al-warning {
                    margin-top: 20px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.62rem; font-weight: 600;
                    letter-spacing: 0.12em; text-transform: uppercase;
                    color: rgba(255,255,255,0.2);
                    line-height: 1.6;
                }

                /* Right panel */
                .al-right {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 48px 32px;
                    position: relative;
                }

                /* Top bar */
                .al-topbar {
                    position: absolute;
                    top: 24px; left: 24px; right: 24px;
                    display: flex; align-items: center; justify-content: space-between;
                }
                .al-back-btn {
                    display: flex; align-items: center; gap: 8px;
                    background: none; border: none; cursor: pointer;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.72rem; font-weight: 700;
                    letter-spacing: 0.16em; text-transform: uppercase;
                    transition: color 0.2s;
                }
                .dark .al-back-btn { color: rgba(255,255,255,0.3); }
                .dark .al-back-btn:hover { color: rgba(255,255,255,0.7); }
                .light .al-back-btn { color: rgba(0,0,0,0.3); }
                .light .al-back-btn:hover { color: rgba(0,0,0,0.7); }

                .al-theme-btn {
                    width: 36px; height: 36px;
                    display: flex; align-items: center; justify-content: center;
                    border: 1px solid;
                    background: none; cursor: pointer; font-size: 1rem;
                    transition: border-color 0.2s, color 0.2s;
                }
                .dark .al-theme-btn { border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); }
                .dark .al-theme-btn:hover { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.8); }
                .light .al-theme-btn { border-color: rgba(0,0,0,0.12); color: rgba(0,0,0,0.4); }
                .light .al-theme-btn:hover { border-color: rgba(0,0,0,0.3); color: rgba(0,0,0,0.7); }

                /* Form card */
                .al-card {
                    width: 100%; max-width: 400px;
                }
                .al-card-eyebrow {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.6rem; font-weight: 700;
                    letter-spacing: 0.26em; text-transform: uppercase;
                    color: #4caf50; margin-bottom: 8px;
                    display: flex; align-items: center; gap: 8px;
                }
                .al-card-eyebrow::before { content: ''; display: block; width: 24px; height: 1px; background: #4caf50; }
                .al-card-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 2.6rem; letter-spacing: 0.04em; line-height: 1;
                    margin-bottom: 6px;
                }
                .dark .al-card-title { color: #ffffff; }
                .light .al-card-title { color: #111111; }
                .al-card-sub {
                    font-size: 0.85rem; line-height: 1.6;
                    margin-bottom: 36px;
                }
                .dark .al-card-sub { color: rgba(255,255,255,0.35); }
                .light .al-card-sub { color: rgba(0,0,0,0.38); }

                /* Divider */
                .al-divider {
                    height: 1px; margin-bottom: 32px;
                }
                .dark .al-divider { background: rgba(255,255,255,0.06); }
                .light .al-divider { background: rgba(0,0,0,0.08); }

                /* Field */
                .al-field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 18px; }
                .al-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.58rem; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase;
                }
                .dark .al-label { color: rgba(255,255,255,0.3); }
                .light .al-label { color: rgba(0,0,0,0.35); }

                .al-input {
                    width: 100%; padding: 13px 16px;
                    font-family: 'Barlow', sans-serif; font-size: 0.9rem;
                    border: 1px solid; outline: none;
                    transition: border-color 0.2s, background 0.2s;
                    box-sizing: border-box;
                    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
                }
                .dark .al-input { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); color: #ffffff; }
                .dark .al-input::placeholder { color: rgba(255,255,255,0.18); }
                .dark .al-input:focus { border-color: #4caf50; background: rgba(76,175,80,0.05); }
                .light .al-input { background: rgba(0,0,0,0.03); border-color: rgba(0,0,0,0.1); color: #111111; }
                .light .al-input::placeholder { color: rgba(0,0,0,0.2); }
                .light .al-input:focus { border-color: #2d6a2d; background: rgba(45,106,45,0.04); }

                /* Error */
                .al-error {
                    display: flex; align-items: flex-start; gap: 10px;
                    padding: 12px 16px; margin-bottom: 18px;
                    border-left: 3px solid #ef4444;
                    font-size: 0.82rem; line-height: 1.55;
                }
                .dark .al-error { background: rgba(239,68,68,0.07); border-color: #ef4444; color: #fca5a5; }
                .light .al-error { background: rgba(239,68,68,0.06); border-color: #dc2626; color: #b91c1c; }
                .al-error-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }

                /* Submit */
                .al-submit {
                    position: relative; overflow: hidden;
                    width: 100%; padding: 15px;
                    border: none; cursor: pointer;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.82rem; font-weight: 800;
                    letter-spacing: 0.2em; text-transform: uppercase;
                    color: #ffffff;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    transition: opacity 0.2s;
                    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
                    margin-top: 24px;
                }
                .al-submit:not(:disabled) { background: #2d6a2d; }
                .al-submit:not(:disabled):hover { background: #1e4d1e; }
                .al-submit:disabled { background: rgba(45,106,45,0.4); cursor: not-allowed; }
                .al-submit::before {
                    content: '';
                    position: absolute; top: 0; left: -80%;
                    width: 60%; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.22) 50%, transparent 80%);
                    transform: skewX(-20deg);
                }
                .al-submit:not(:disabled):hover::before {
                    left: 140%;
                    transition: left 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .al-spinner {
                    width: 16px; height: 16px;
                    border: 2px solid rgba(255,255,255,0.25);
                    border-top-color: #ffffff;
                    border-radius: 50%;
                    animation: al-spin 0.7s linear infinite;
                }
                @keyframes al-spin { to { transform: rotate(360deg); } }

                .al-submit-arrow {
                    transition: transform 0.2s;
                }
                .al-submit:not(:disabled):hover .al-submit-arrow {
                    transform: translateX(4px);
                }

                /* Footer note */
                .al-footnote {
                    margin-top: 28px;
                    padding-top: 22px;
                    border-top: 1px solid;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.62rem; font-weight: 600;
                    letter-spacing: 0.1em; text-transform: uppercase;
                    text-align: center; line-height: 1.7;
                }
                .dark .al-footnote { border-color: rgba(255,255,255,0.06); color: rgba(255,255,255,0.18); }
                .light .al-footnote { border-color: rgba(0,0,0,0.07); color: rgba(0,0,0,0.25); }

                /* Responsive — hide left panel on small screens */
                @media (max-width: 768px) {
                    .al-left { display: none; }
                    .al-right { padding: 80px 24px 40px; }
                }
            `}</style>

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
                                <input
                                    className="al-input"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
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