import { Suspense, useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AiOutlineMoon, AiOutlineSun } from 'react-icons/ai';
import type { AdminUser } from '../../types';
import logo from '../../assets/logos/logo.png';
import { NAV_ITEMS } from './nav';
import { LoadingOverlay } from './ui/Feedback';
import type { AdminShell } from './useAdminShell';
import './admin.css';

interface AdminLayoutProps {
    admin: AdminUser | null;
    onLogout: () => void;
}

/** Header, sidebar and the current page. */
export default function AdminLayout({ admin, onLogout }: AdminLayoutProps) {
    const [dark, setDark] = useState(() => localStorage.getItem('adminTheme') === 'dark');

    useEffect(() => { localStorage.setItem('adminTheme', dark ? 'dark' : 'light'); }, [dark]);

    const shell: AdminShell = { admin, dark };

    return (
        <div className={`ad-root ${dark ? 'ad-dark' : 'ad-light'}`}>
            <header className="ad-header">
                <div className="ad-header-brand">
                    <img src={logo} alt="RWTW" />
                    <span className="ad-header-title">Admin Workspace &mdash; {admin?.name}</span>
                </div>
                <div className="ad-header-actions">
                    <button className="ad-hbtn ad-hbtn-icon" onClick={() => setDark(!dark)} title="Toggle theme">
                        {dark ? <AiOutlineSun /> : <AiOutlineMoon />}
                    </button>
                    <button className="ad-hbtn ad-hbtn-ghost" onClick={onLogout}>Sign Out</button>
                </div>
            </header>

            <div className="ad-body">
                <aside className="ad-sidebar">
                    {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
                        <NavLink
                            key={label}
                            to={`/admin/${path}`}
                            end
                            className={({ isActive }) => `ad-nav-btn${isActive ? ' active' : ''}`}
                        >
                            <Icon className="ad-nav-icon" /> {label}
                        </NavLink>
                    ))}
                </aside>

                <main className="ad-main">
                    <Suspense fallback={<div className="ad-panel-rel" style={{ minHeight: 240 }}><LoadingOverlay /></div>}>
                        <Outlet context={shell} />
                    </Suspense>
                </main>
            </div>
        </div>
    );
}
