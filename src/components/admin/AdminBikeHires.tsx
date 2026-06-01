import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { 
    AiOutlineCheckCircle, 
    AiOutlineHourglass, 
    AiOutlineHistory,
    AiOutlineSearch,
    AiOutlineReload,
    AiOutlineSelect
} from 'react-icons/ai';

interface BikeHire {
    id: string;
    registrationId: string;
    bikeType: string;
    status: 'PENDING' | 'PAID' | 'COLLECTED' | 'RETURNED';
    amount: number;
    createdAt: string;
    registration: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        type: string;
    };
}

const AdminBikeHires = () => {
    const [hires, setHires] = useState<BikeHire[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchHires = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE_URL}/admin/bike-hires`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setHires(data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHires();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE_URL}/admin/bike-hires/${id}/status`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setHires(hires.map(h => h.id === id ? { ...h, status: status as any } : h));
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    const filteredHires = hires.filter(h => {
        const matchesSearch = 
            h.registration.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.registration.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.registrationId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || h.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PAID': return { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.2)' };
            case 'COLLECTED': return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.2)' };
            case 'RETURNED': return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', border: 'rgba(107, 114, 128, 0.2)' };
            default: return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.2)' };
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Bike Hire Management</h1>
                    <p className="text-zinc-400 text-sm">Track and manage bike rental requests for the event</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchHires} className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors">
                        <AiOutlineReload className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Requests', value: hires.length, icon: <AiOutlineHistory />, color: 'blue' },
                    { label: 'Pending Payment', value: hires.filter(h => h.status === 'PENDING').length, icon: <AiOutlineHourglass />, color: 'orange' },
                    { label: 'Paid & Ready', value: hires.filter(h => h.status === 'PAID').length, icon: <AiOutlineCheckCircle />, color: 'green' },
                    { label: 'Out for Use', value: hires.filter(h => h.status === 'COLLECTED').length, icon: <AiOutlineSelect />, color: 'purple' },
                ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-500`}>{stat.icon}</div>
                            <span className="text-2xl font-bold text-white">{stat.value}</span>
                        </div>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-zinc-800 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input 
                            type="text" 
                            placeholder="Search by name or registration ID..." 
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="COLLECTED">Collected</option>
                        <option value="RETURNED">Returned</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-950/50 text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
                                <th className="px-6 py-4">Participant</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Reg ID</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {filteredHires.map((hire) => {
                                const style = getStatusStyle(hire.status);
                                return (
                                    <tr key={hire.id} className="hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white text-sm">{hire.registration.firstName} {hire.registration.lastName}</div>
                                            <div className="text-zinc-500 text-xs">{hire.registration.type}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-zinc-300 text-sm">{hire.registration.phoneNumber}</div>
                                            <div className="text-zinc-500 text-xs">{hire.registration.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-green-500 text-xs">{hire.registrationId}</code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase" style={{ backgroundColor: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
                                                {hire.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select 
                                                className="bg-zinc-800 border border-zinc-700 rounded-lg py-1 px-2 text-xs text-white focus:outline-none focus:border-green-500"
                                                value={hire.status}
                                                onChange={(e) => updateStatus(hire.id, e.target.value)}
                                            >
                                                <option value="PENDING">Set Pending</option>
                                                <option value="PAID">Set Paid</option>
                                                <option value="COLLECTED">Set Collected</option>
                                                <option value="RETURNED">Set Returned</option>
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredHires.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                        No bike hire requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminBikeHires;
