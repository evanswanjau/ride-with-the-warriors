import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { 
    AiOutlineSearch,
    AiOutlineReload,
    AiOutlineExclamationCircle,
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
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchHires = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE_URL}/admin/bike-hires`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (res.ok && Array.isArray(data)) {
                setHires(data);
            } else {
                const errMsg = data.error?.message || 'Failed to fetch bike hires';
                console.error('Fetch error:', errMsg);
                setError(errMsg);
                setHires([]);
            }
        } catch (error: any) {
            console.error('Fetch error:', error);
            setError(error.message || 'An unexpected error occurred');
            setHires([]);
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

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <div className="ad-section-head"><div className="ad-section-line" /><span className="ad-section-eyebrow">Equipment</span></div>
                    <div className="ad-page-title" style={{ marginBottom: 0 }}>Bike Hires</div>
                </div>
                <button className="ad-btn ad-btn-primary" onClick={fetchHires} disabled={loading}>
                    <AiOutlineReload className={loading ? 'fa-spin' : ''} style={loading ? { animation: 'spin 1s linear infinite' } : {}} /> Refresh
                </button>
            </div>

            <div className="ad-kpi-grid" style={{ marginBottom: 24 }}>
                {[
                    { label: 'Total Requests', val: hires.length, cls: '' },
                    { label: 'Pending Payment', val: hires.filter(h => h.status === 'PENDING').length, cls: 'amber' },
                    { label: 'Paid & Ready', val: hires.filter(h => h.status === 'PAID').length, cls: 'green' },
                    { label: 'Out for Use', val: hires.filter(h => h.status === 'COLLECTED').length, cls: 'blue' },
                    { label: 'Returned', val: hires.filter(h => h.status === 'RETURNED').length, cls: 'gray' },
                ].map((stat, i) => (
                    <div key={i} className="ad-kpi">
                        <div className="ad-kpi-label">{stat.label}</div>
                        <div className={`ad-kpi-value ${stat.cls}`}>{stat.val}</div>
                    </div>
                ))}
            </div>

            <div className="ad-panel">
                <div className="ad-filters">
                    <div className="ad-filter-group" style={{ flex: 1, minWidth: 200 }}>
                        <label className="ad-filter-label">Search</label>
                        <div className="ad-search-wrap">
                            <AiOutlineSearch className="ad-search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search by name or registration ID..." 
                                className="ad-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="ad-filter-group">
                        <label className="ad-filter-label">Status Filter</label>
                        <select 
                            className="ad-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="PENDING">PENDING</option>
                            <option value="PAID">PAID</option>
                            <option value="COLLECTED">COLLECTED</option>
                            <option value="RETURNED">RETURNED</option>
                        </select>
                    </div>
                </div>

                <div className="ad-panel-rel">
                    {loading && hires.length === 0 ? (
                        <div className="ad-loading-overlay">
                            <div className="ad-spinner" />
                        </div>
                    ) : error ? (
                        <div style={{ padding: 60, textAlign: 'center' }}>
                            <div className="ad-error" style={{ display: 'inline-flex', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}>
                                <AiOutlineExclamationCircle /> {error}
                            </div>
                            <div style={{ marginTop: 16 }}>
                                <button className="ad-btn ad-btn-ghost" onClick={fetchHires}>Try Again</button>
                            </div>
                        </div>
                    ) : filteredHires.length === 0 ? (
                        <div style={{ padding: 60, textAlign: 'center', color: 'var(--ad-t3)' }}>
                            No bike hire requests found.
                        </div>
                    ) : (
                        <div className="ad-table-wrap">
                            <table className="ad-table">
                                <thead>
                                    <tr>
                                        {['Participant', 'Contact', 'Reg ID', 'Status', 'Actions'].map(h => (
                                            <th key={h} className="ad-th">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredHires.map((hire) => (
                                        <tr key={hire.id} className="ad-tr">
                                            <td className="ad-td">
                                                <div style={{ fontWeight: 700, color: 'var(--ad-t1)' }}>{hire.registration.firstName} {hire.registration.lastName}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--ad-t3)', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}>{hire.registration.type}</div>
                                            </td>
                                            <td className="ad-td">
                                                <div style={{ fontSize: '0.78rem', color: 'var(--ad-t2)' }}>{hire.registration.phoneNumber}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--ad-t3)' }}>{hire.registration.email}</div>
                                            </td>
                                            <td className="ad-td ad-mono">
                                                {hire.registrationId}
                                            </td>
                                            <td className="ad-td">
                                                <select className="ad-status-select" value={hire.status} onChange={(e) => updateStatus(hire.id, e.target.value)} style={{ color: hire.status === 'PAID' ? 'var(--ad-pl)' : hire.status === 'COLLECTED' ? 'var(--ad-accent)' : hire.status === 'RETURNED' ? 'var(--ad-t3)' : 'var(--ad-t2)' }}>
                                                    <option value="PENDING">PENDING</option>
                                                    <option value="PAID">PAID</option>
                                                    <option value="COLLECTED">COLLECTED</option>
                                                    <option value="RETURNED">RETURNED</option>
                                                </select>
                                            </td>
                                            <td className="ad-td" style={{ textAlign: 'right' }}>
                                                <a href={`/profile/${hire.registrationId}`} target="_blank" rel="noreferrer" style={{ color: 'var(--ad-pl)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>View &rarr;</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminBikeHires;
