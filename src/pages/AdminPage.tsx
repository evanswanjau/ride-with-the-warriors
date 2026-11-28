import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AcceptInvite from '../components/admin/AcceptInvite';
import AdminLogin from '../components/admin/AdminLogin';
import AdminRoutes from '../components/admin/AdminRoutes';
import { adminApi } from '../components/admin/api/adminApi';
import { SIGNED_OUT_EVENT, clearSession, readSession, saveSession, type AdminSession } from '../components/admin/api/session';
import type { AdminUser } from '../types';

const AdminPage = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const inviteToken = pathname.match(/^\/admin\/invite\/([^/]+)$/)?.[1];
    const [session, setSession] = useState<AdminSession | null>(() => readSession());

    const handleLogin = (token: string, admin: AdminUser) => {
        saveSession(token, admin);
        setSession(readSession());
    };

    const handleLogout = useCallback(() => {
        // Best effort: the session ends here even if the server cannot be reached.
        adminApi.auth.logout().catch(() => undefined).finally(clearSession);
        setSession(null);
    }, []);

    // Expired (checked every minute) or refused by the server: back to the login form.
    useEffect(() => {
        if (!session) return;
        const onSignedOut = () => setSession(null);
        const timer = setInterval(() => { if (!readSession()) setSession(null); }, 60_000);
        window.addEventListener(SIGNED_OUT_EVENT, onSignedOut);
        return () => {
            clearInterval(timer);
            window.removeEventListener(SIGNED_OUT_EVENT, onSignedOut);
        };
    }, [session]);

    // An emailed invite link: the new admin sets a password, then lands on the Overview signed in.
    if (inviteToken) {
        return <AcceptInvite token={inviteToken} onBack={() => navigate('/')} onAccepted={(token, admin) => { handleLogin(token, admin); navigate('/admin', { replace: true }); }} />;
    }

    if (!session) return <AdminLogin onLogin={handleLogin} onBack={() => navigate('/')} />;

    return <AdminRoutes admin={session.admin} onLogout={handleLogout} />;
};

export default AdminPage;
