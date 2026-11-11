import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/** Sends logged-out visitors to /login, then back here once they've signed in. */
const RequireAuth = ({ children }: { children: ReactNode }) => {
    const { account, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="acct-page"><p className="acct-muted" style={{ textAlign: 'center' }}>Loading…</p></div>;
    }
    if (!account) {
        const next = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?next=${next}`} replace />;
    }
    return <>{children}</>;
};

export default RequireAuth;
