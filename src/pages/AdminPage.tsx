import { useState, useEffect } from 'react';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';

const AdminPage = () => {
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    const getInitialToken = () => {
        const token = localStorage.getItem('adminToken');
        const expiry = localStorage.getItem('adminSessionExpiry');
        if (token && expiry && Date.now() < parseInt(expiry)) {
            return token;
        }
        // If expired or missing, clean up
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminSessionExpiry');
        return null;
    };

    const [adminToken, setAdminToken] = useState<string | null>(getInitialToken());
    const [adminUser, setAdminUser] = useState<any>(JSON.parse(localStorage.getItem('adminUser') || 'null'));

    const handleAdminLogin = (token: string, admin: any) => {
        const expiry = Date.now() + SEVEN_DAYS_MS;
        setAdminToken(token);
        setAdminUser(admin);
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(admin));
        localStorage.setItem('adminSessionExpiry', expiry.toString());
    };

    const handleAdminLogout = () => {
        setAdminToken(null);
        setAdminUser(null);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminSessionExpiry');
    };

    // Periodic session check
    useEffect(() => {
        if (!adminToken) return;

        const interval = setInterval(() => {
            const expiry = localStorage.getItem('adminSessionExpiry');
            if (expiry && Date.now() > parseInt(expiry)) {
                console.log('[Admin] Session expired, logging out...');
                handleAdminLogout();
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [adminToken]);

    if (!adminToken) {
        return <AdminLogin onLogin={handleAdminLogin} onBack={() => window.location.href = '/'} />;
    }

    return (
        <AdminDashboard
            admin={adminUser}
            token={adminToken}
            onLogout={handleAdminLogout}
        />
    );
};

export default AdminPage;
