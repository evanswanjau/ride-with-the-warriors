import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import {
    AiOutlineSearch,
    AiOutlineReload,
    AiOutlineLeft,
    AiOutlineRight,
    AiOutlineEye,
    AiOutlineClose,
    AiFillStar,
} from 'react-icons/ai';

interface FeedbackEntry {
    id: string;
    role: string;
    rating: number;
    firstName: string | null;
    lastName: string | null;
    highlights: string | null;
    improvements: string | null;
    createdAt: string;
}

const ROLE_LABELS: Record<string, string> = {
    CYCLIST: 'Cyclist',
    ATTENDEE: 'Attendee',
    SPONSOR: 'Sponsor',
    ORGANISER: 'Organiser',
};

const PAGE_SIZE = 12;

const formatDate = (d: string) => {
    try { return new Date(d).toLocaleString(); } catch { return 'N/A'; }
};

const displayName = (entry: FeedbackEntry) => {
    const name = [entry.firstName, entry.lastName].filter(Boolean).join(' ').trim();
    return name || 'Anonymous';
};

const AdminFeedback = () => {
    const [entries, setEntries] = useState<FeedbackEntry[]>([]);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<FeedbackEntry | null>(null);

    const fetchFeedback = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE_URL}/admin/feedback`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Failed to load feedback');
            setEntries(data.entries || []);
            setAverageRating(data.averageRating ?? 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load feedback');
            setEntries([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFeedback(); }, []);

    const filtered = entries.filter(e => {
        const q = searchTerm.toLowerCase();
        const matchesSearch = !q || [
            displayName(e),
            e.role,
            e.highlights,
            e.improvements,
        ].some(v => (v || '').toLowerCase().includes(q));
        const matchesRole = !roleFilter || e.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    useEffect(() => { setPage(1); }, [searchTerm, roleFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageEntries = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const roleCounts = entries.reduce<Record<string, number>>((acc, e) => {
        acc[e.role] = (acc[e.role] || 0) + 1;
        return acc;
    }, {});

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <div className="ad-section-head"><div className="ad-section-line" /><span className="ad-section-eyebrow">Post-Event</span></div>
                    <div className="ad-page-title" style={{ marginBottom: 0 }}>Event Feedback</div>
                </div>
                <button className="ad-btn ad-btn-primary" onClick={fetchFeedback} disabled={loading}>
                    <AiOutlineReload style={loading ? { animation: 'spin 1s linear infinite' } : {}} /> Refresh
                </button>
            </div>

            {error && (
                <div className="ad-error" style={{ marginBottom: 20 }}>
                    <span>{error}</span>
                </div>
            )}

            <div className="ad-kpi-grid" style={{ marginBottom: 24 }}>
                {[
                    { label: 'Total Responses', val: entries.length, cls: '' },
                    { label: 'Average Rating', val: entries.length ? `${averageRating} / 5` : '—', cls: 'amber' },
                    { label: 'Cyclists', val: roleCounts.CYCLIST || 0, cls: 'green' },
                    { label: 'Attendees', val: roleCounts.ATTENDEE || 0, cls: '' },
                    { label: 'Sponsors', val: roleCounts.SPONSOR || 0, cls: '' },
                    { label: 'Organisers', val: roleCounts.ORGANISER || 0, cls: '' },
                ].map(stat => (
                    <div key={stat.label} className="ad-kpi">
                        <div className="ad-kpi-label">{stat.label}</div>
                        <div className={`ad-kpi-value ${stat.cls}`}>{stat.val}</div>
                    </div>
                ))}
            </div>

            <div className="ad-panel">
                <div className="ad-filters">
                    <div className="ad-filter-group" style={{ flex: 1 }}>
                        <label className="ad-filter-label">Search</label>
                        <div className="ad-search-wrap">
                            <AiOutlineSearch className="ad-search-icon" />
                            <input
                                className="ad-input"
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Name, role, highlights or improvements…"
                            />
                        </div>
                    </div>
                    <div className="ad-filter-group" style={{ marginLeft: 'auto' }}>
                        <label className="ad-filter-label">Role</label>
                        <select className="ad-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                            <option value="">All roles</option>
                            {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="ad-panel-rel">
                    {loading && entries.length === 0 ? (
                        <div style={{ padding: 60, textAlign: 'center', color: 'var(--ad-t3)' }}>Loading feedback…</div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: 60, textAlign: 'center', color: 'var(--ad-t3)' }}>
                            {entries.length === 0 ? 'No feedback submitted yet.' : 'No responses match your filters.'}
                        </div>
                    ) : (
                        <div className="ad-table-wrap">
                            <table className="ad-table">
                                <thead>
                                    <tr>
                                        {['#', 'Respondent', 'Role', 'Rating', 'Highlights', 'Improvements', 'Submitted', ''].map(h => (
                                            <th key={h || 'actions'} className="ad-th">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageEntries.map((entry, index) => (
                                        <tr key={entry.id} className="ad-tr">
                                            <td className="ad-td ad-mono" style={{ opacity: 0.5 }}>
                                                {(page - 1) * PAGE_SIZE + index + 1}
                                            </td>
                                            <td className="ad-td">
                                                <div style={{ fontWeight: 700, color: 'var(--ad-t1)' }}>{displayName(entry)}</div>
                                            </td>
                                            <td className="ad-td">
                                                <span className="ad-badge ad-badge-paid">{ROLE_LABELS[entry.role] || entry.role}</span>
                                            </td>
                                            <td className="ad-td">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 2, color: 'var(--ad-accent)' }}>
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <AiFillStar key={i} size={14} style={{ opacity: i < entry.rating ? 1 : 0.2 }} />
                                                    ))}
                                                    <span style={{ marginLeft: 6, fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: 'var(--ad-t1)' }}>
                                                        {entry.rating}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="ad-td" style={{ maxWidth: 220 }}>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--ad-t2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {entry.highlights || '—'}
                                                </div>
                                            </td>
                                            <td className="ad-td" style={{ maxWidth: 220 }}>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--ad-t2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {entry.improvements || '—'}
                                                </div>
                                            </td>
                                            <td className="ad-td ad-mono" style={{ fontSize: '0.72rem' }}>{formatDate(entry.createdAt)}</td>
                                            <td className="ad-td" style={{ textAlign: 'right' }}>
                                                <button
                                                    onClick={() => setSelected(entry)}
                                                    style={{ background: 'none', border: '1px solid var(--ad-border)', color: 'var(--ad-t3)', padding: '5px 8px', cursor: 'pointer', fontSize: '0.95rem' }}
                                                    title="View full response"
                                                >
                                                    <AiOutlineEye />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {filtered.length > 0 && (
                        <div className="ad-pagination" style={{ marginTop: 20 }}>
                            <span className="ad-page-info">
                                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                            </span>
                            <div className="ad-page-btns">
                                <button className="ad-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                                    <AiOutlineLeft /> Prev
                                </button>
                                <span className="ad-page-cur">Page {page} / {totalPages}</span>
                                <button className="ad-page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                                    Next <AiOutlineRight />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {selected && (
                <div className="ad-modal-overlay" onClick={() => setSelected(null)}>
                    <div className="ad-modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
                        <div className="ad-modal-header">
                            <h3 className="ad-modal-title">Feedback Response</h3>
                            <button className="ad-modal-close" onClick={() => setSelected(null)}><AiOutlineClose /></button>
                        </div>
                        <div className="ad-modal-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                                <div>
                                    <div className="ad-filter-label">Respondent</div>
                                    <div style={{ fontWeight: 700, color: 'var(--ad-t1)' }}>{displayName(selected)}</div>
                                </div>
                                <div>
                                    <div className="ad-filter-label">Role</div>
                                    <div style={{ color: 'var(--ad-t2)' }}>{ROLE_LABELS[selected.role] || selected.role}</div>
                                </div>
                                <div>
                                    <div className="ad-filter-label">Rating</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, color: 'var(--ad-accent)' }}>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <AiFillStar key={i} size={16} style={{ opacity: i < selected.rating ? 1 : 0.2 }} />
                                        ))}
                                        <span style={{ marginLeft: 8, color: 'var(--ad-t1)', fontWeight: 700 }}>{selected.rating} / 5</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="ad-filter-label">Submitted</div>
                                    <div style={{ color: 'var(--ad-t2)', fontSize: '0.85rem' }}>{formatDate(selected.createdAt)}</div>
                                </div>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <div className="ad-filter-label">What did we get right?</div>
                                <p style={{ margin: '6px 0 0', color: 'var(--ad-t2)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                    {selected.highlights || '—'}
                                </p>
                            </div>
                            <div>
                                <div className="ad-filter-label">What should we improve for 2027?</div>
                                <p style={{ margin: '6px 0 0', color: 'var(--ad-t2)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                    {selected.improvements || '—'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminFeedback;
