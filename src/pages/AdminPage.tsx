import { useState } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';

const AdminPage = () => {
    const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));
    const [adminUser, setAdminUser] = useState<any>(JSON.parse(localStorage.getItem('adminUser') || 'null'));

    const handleAdminLogin = (token: string, admin: any) => {
        setAdminToken(token);
        setAdminUser(admin);
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(admin));
    };

    const handleAdminLogout = () => {
        setAdminToken(null);
        setAdminUser(null);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
    };

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
