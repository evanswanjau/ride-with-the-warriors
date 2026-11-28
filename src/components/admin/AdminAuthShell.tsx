import type { ReactNode } from 'react';
import { useState } from 'react';
import { AiOutlineArrowLeft, AiOutlineMoon, AiOutlineSun } from 'react-icons/ai';
import logo from '../../assets/logos/logo.png';
import './AdminLogin.css';

/** The admin sign-in frame: dark left panel, theme toggle, and a card on the right. */
export default function AdminAuthShell({ onBack, children }: { onBack: () => void; children: ReactNode }) {
    const [dm, setDm] = useState(() => localStorage.getItem('adminTheme') === 'dark');
    const toggleTheme = () => {
        localStorage.setItem('adminTheme', dm ? 'light' : 'dark');
        setDm(!dm);
    };

    return (
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

                {children}
            </div>
        </div>
    );
}
