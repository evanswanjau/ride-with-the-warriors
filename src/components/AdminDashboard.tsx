import { useState, useEffect } from 'react';
import { CIRCUITS } from '../constants';
import { API_BASE_URL } from '../config';

interface AdminDashboardProps {
    token: string;
    admin: any;
    onLogout: () => void;
}

const AdminDashboard = ({ token, admin, onLogout }: AdminDashboardProps) => {
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState({
        circuitId: '',
        type: '',
        status: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        total: 0,
        pages: 1
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('adminTheme');
        return saved ? saved === 'dark' : true;
    });

    useEffect(() => {
        localStorage.setItem('adminTheme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    useEffect(() => {
        fetchData();
    }, [filter, pagination.page]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: String(pagination.page),
                ...filter
            });

            const [regRes, statsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/registrations?${queryParams}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_BASE_URL}/admin/registrations/stats/summary`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (!regRes.ok || !statsRes.ok) throw new Error('Failed to fetch data');

            const regData = await regRes.json();
            const statsData = await statsRes.json();

            setRegistrations(regData.registrations);
            setPagination(regData.pagination);
            setStats(statsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/registrations/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) fetchData();
        } catch (err) {
            console.error('Update error:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this registration?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/admin/registrations/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) fetchData();
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const formatDate = (date: string) => {
        try {
            return new Date(date).toLocaleString();
        } catch (e) {
            return 'N/A';
        }
    };

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
            {/* Header */}
            <header className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} border-b py-4 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm`}>
                <div className="flex items-center gap-4">
                    <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">shield_person</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Admin Workspace</h1>
                        <p className={`text-xs ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Welcome back, {admin.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`size-10 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-neutral-700 hover:bg-neutral-600 text-yellow-400' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'}`}
                        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                    <button
                        onClick={onLogout}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isDarkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'}`}
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="p-8 max-w-7xl mx-auto space-y-8">
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-2xl flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p className="font-bold">{error}</p>
                        <button onClick={fetchData} className="ml-auto underline">Retry</button>
                    </div>
                )}

                {/* Stats Section */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <StatCard label="Total" value={stats.summary.total} icon="groups" color="primary" isDarkMode={isDarkMode} />
                        <StatCard label="Paid" value={stats.summary.paid} icon="check_circle" color="green-500" isDarkMode={isDarkMode} />
                        <StatCard label="Unpaid" value={stats.summary.unpaid} icon="error" color="yellow-500" isDarkMode={isDarkMode} />
                        <StatCard label="Cancelled" value={stats.summary.cancelled} icon="cancel" color="red-500" isDarkMode={isDarkMode} />
                        <StatCard label="Revenue" value={`KES ${stats.summary.revenue?.toLocaleString() || 0}`} icon="payments" color="emerald-500" isDarkMode={isDarkMode} />
                    </div>
                )}

                {/* Filters */}
                <div className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} p-6 rounded-3xl border flex flex-wrap gap-4 items-end shadow-sm`}>
                    <div className="flex-1 min-w-[300px]">
                        <label className={`block text-[10px] font-bold ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-widest mb-2 ml-1`}>Search</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-neutral-500 text-xl">search</span>
                            <input
                                type="text"
                                value={filter.search}
                                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                                placeholder="Name, Team or ID..."
                                className={`w-full border rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all ${isDarkMode ? 'bg-neutral-900 border-neutral-700 text-white focus:border-primary' : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-primary focus:bg-white'}`}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={`block text-[10px] font-bold ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-widest mb-2 ml-1`}>Circuit</label>
                        <select
                            value={filter.circuitId}
                            onChange={(e) => setFilter({ ...filter, circuitId: e.target.value })}
                            className={`border rounded-xl py-2.5 px-4 text-sm outline-none transition-all ${isDarkMode ? 'bg-neutral-900 border-neutral-700 text-white focus:border-primary' : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-primary focus:bg-white'}`}
                        >
                            <option value="">All Circuits</option>
                            {CIRCUITS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={`block text-[10px] font-bold ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-widest mb-2 ml-1`}>Status</label>
                        <select
                            value={filter.status}
                            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                            className={`border rounded-xl py-2.5 px-4 text-sm outline-none transition-all ${isDarkMode ? 'bg-neutral-900 border-neutral-700 text-white focus:border-primary' : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-primary focus:bg-white'}`}
                        >
                            <option value="">All Status</option>
                            <option value="UNPAID">Unpaid</option>
                            <option value="PAID">Paid</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Table Section */}
                <div className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} rounded-3xl border overflow-hidden shadow-xl`}>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className={`${isDarkMode ? 'bg-neutral-700/50 text-neutral-400' : 'bg-neutral-50 text-neutral-500'} text-[10px] font-bold uppercase tracking-widest border-b ${isDarkMode ? 'border-neutral-700' : 'border-neutral-100'}`}>
                                <th className="px-6 py-5">Participant</th>
                                <th className="px-6 py-5">Category / Circuit</th>
                                <th className="px-6 py-5">Contact Info</th>
                                <th className="px-6 py-5 text-center">Amount</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Date</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-neutral-700' : 'divide-neutral-100'}`}>
                            {loading && registrations.length === 0 ? (
                                <tr><td colSpan={7} className="py-20 text-center text-neutral-500">Loading registrations...</td></tr>
                            ) : registrations.length === 0 ? (
                                <tr><td colSpan={7} className="py-20 text-center text-neutral-500">No registrations found matching your criteria.</td></tr>
                            ) : registrations.map(reg => (
                                <tr key={reg.id} className={`transition-colors group ${isDarkMode ? 'hover:bg-neutral-700/30' : 'hover:bg-neutral-50'}`}>
                                    <td className="px-6 py-5">
                                        <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{reg.firstName || 'Unknown'} {reg.lastName || ''}</div>
                                        <div className="text-[10px] text-neutral-500 font-mono tracking-tighter uppercase">{reg.id}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-neutral-800'}`}>{reg.category || 'Rider'}</div>
                                        <div className="text-[10px] text-neutral-500 uppercase tracking-widest leading-none mt-1">
                                            {reg.teamName ? `TEAM: ${reg.teamName}` : (reg.type || 'individual')} • {CIRCUITS.find(c => c.id === reg.circuitId)?.id.toUpperCase() || reg.circuitId}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`text-xs ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>{reg.email || 'No Email'}</div>
                                        <div className="text-[10px] text-neutral-500 mt-1">{reg.phoneNumber || 'No Phone'}</div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="font-mono font-black text-primary text-sm">{(reg.totalAmount || 0).toLocaleString()}/=</div>
                                        {reg.totalAmount === 0 && <div className="text-[8px] text-neutral-600 uppercase font-bold">Group Paid</div>}
                                    </td>
                                    <td className="px-6 py-5">
                                        <select
                                            value={reg.status}
                                            onChange={(e) => handleStatusUpdate(reg.id, e.target.value)}
                                            className={`text-[10px] font-bold px-3 py-1.5 rounded-full border-none outline-none cursor-pointer shadow-sm ${getStatusColor(reg.status)}`}
                                        >
                                            <option value="UNPAID">UNPAID</option>
                                            <option value="PAID">PAID</option>
                                            <option value="CONFIRMED">CONFIRMED</option>
                                            <option value="CANCELLED">CANCELLED</option>
                                        </select>
                                    </td>
                                    <td className={`px-6 py-5 text-[11px] tabular-nums font-medium ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                        {formatDate(reg.createdAt)}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <a
                                                href={`/profile/${reg.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`size-9 rounded-lg flex items-center justify-center transition-all ${isDarkMode ? 'hover:bg-neutral-700 text-neutral-400 hover:text-white' : 'hover:bg-neutral-100 text-neutral-500 hover:text-primary'}`}
                                                title="View Full Profile"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                                            </a>
                                            <button
                                                onClick={() => handleDelete(reg.id)}
                                                className={`size-9 rounded-lg flex items-center justify-center transition-all ${isDarkMode ? 'hover:bg-red-500/10 text-neutral-400 hover:text-red-500' : 'hover:bg-red-50 text-neutral-500 hover:text-red-500'}`}
                                                title="Delete Registration"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className={`p-6 border-t flex justify-center gap-2 ${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-50 border-neutral-100'}`}>
                            {[...Array(pagination.pages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPagination({ ...pagination, page: i + 1 })}
                                    className={`size-8 rounded-lg text-xs font-bold transition-all ${pagination.page === i + 1
                                        ? 'bg-primary text-white'
                                        : isDarkMode ? 'bg-neutral-900 text-neutral-400 hover:text-white' : 'bg-white text-neutral-600 hover:text-primary border'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const StatCard = ({ label, value, icon, color, isDarkMode }: any) => (
    <div className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} p-6 rounded-3xl border shadow-sm`}>
        <div className="flex justify-between items-start mb-4">
            <div className={`size-10 rounded-xl bg-${color}/10 flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-${color}`}>{icon}</span>
            </div>
            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-[0.2em]`}>{label}</span>
        </div>
        <div className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{value.toLocaleString()}</div>
    </div>
);

const getStatusColor = (status: string) => {
    switch (status) {
        case 'PAID': return 'bg-green-500/10 text-green-500';
        case 'CONFIRMED': return 'bg-primary/10 text-primary';
        case 'CANCELLED': return 'bg-red-500/10 text-red-500';
        default: return 'bg-yellow-500/10 text-yellow-500';
    }
};


export default AdminDashboard;
