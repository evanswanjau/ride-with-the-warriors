import { Suspense, useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AiOutlineMoon, AiOutlineSun } from 'react-icons/ai';
import type { AdminUser } from '../../types';
import logo from '../../assets/logos/logo.png';
import { useAdminYear } from './hooks/useAdminYear';
import { NAV_ITEMS } from './nav';
import { hasRole } from './roles';
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

    const { year, years, ready, setYear } = useAdminYear();
    // Page links keep only the year; other query values belong to the page they were set on.
    const yearSearch = year ? `?year=${year}` : '';

    const shell: AdminShell = { admin, dark, year };

    return (
        <div className={`ad-root ${dark ? 'ad-dark' : 'ad-light'}`}>
            <header className="ad-header">
                <div className="ad-header-brand">
                    <img src={logo} alt="RWTW" />
                    <span className="ad-header-title">Admin Workspace &mdash; {admin?.name}</span>
                </div>
                <div className="ad-header-actions">
                    {years.length > 0 && (
                        <select className="ad-year-select" aria-label="Event year" value={year ?? ''} onChange={e => setYear(Number(e.target.value))}>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    )}
                    <button className="ad-hbtn ad-hbtn-icon" onClick={() => setDark(!dark)} title="Toggle theme">
                        {dark ? <AiOutlineSun /> : <AiOutlineMoon />}
                    </button>
                    <button className="ad-hbtn ad-hbtn-ghost" onClick={onLogout}>Sign Out</button>
                </div>
            </header>

            <div className="ad-body">
                <aside className="ad-sidebar">
                    {NAV_ITEMS.filter(item => !item.minRole || hasRole(admin, item.minRole)).map(({ path, label, icon: Icon }) => (
                        <NavLink
                            key={label}
                            to={`/admin${path ? `/${path}` : ''}${yearSearch}`}
                            end
                            className={({ isActive }) => `ad-nav-btn${isActive ? ' active' : ''}`}
                        >
                            <Icon className="ad-nav-icon" /> {label}
                        </NavLink>
                    ))}
                </aside>

                <main className="ad-main">
                    <Suspense fallback={<div className="ad-panel-rel" style={{ minHeight: 240 }}><LoadingOverlay /></div>}>
                        {ready ? <Outlet key={year} context={shell} /> : <div className="ad-panel-rel" style={{ minHeight: 240 }}><LoadingOverlay /></div>}
                    </Suspense>
                </main>
            </div>
        </div>
    );
}
