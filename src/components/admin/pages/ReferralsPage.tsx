import { useState } from 'react';
import { AiOutlineDelete, AiOutlineLink } from 'react-icons/ai';
import { SITE_URL } from '../../../config';
import { adminApi } from '../api/adminApi';
import { saveFile } from '../api/download';
import { errorMessage } from '../api/http';
import { useDebounced } from '../hooks/useDebounced';
import { useLoad } from '../hooks/useLoad';
import { ErrorBanner, LoadingOverlay, TableHead } from '../ui/Feedback';
import { FilterBar, SearchFilter, SelectFilter } from '../ui/Filters';
import KpiGrid from '../ui/KpiGrid';
import PageHeader from '../ui/PageHeader';
import { rowNumber } from '../ui/format';
import ReferralModal from './ReferralModal';
import { useAdminShell } from '../useAdminShell';

const LIMIT = 20;
const COLUMNS = ['#', 'Code', 'Influencer', 'Email', 'Phone', 'Clicks', 'Direct', 'Paid', 'Status', 'Actions'];

export default function ReferralsPage() {
    const { year } = useAdminShell();
    const [filter, setFilter] = useState({ status: '', search: '' });
    const [creating, setCreating] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const search = useDebounced(filter.search);

    const query = { year, page: 1, limit: LIMIT, status: filter.status, search };
    const list = useLoad(() => adminApi.referrals.list(query), JSON.stringify(query), 'Failed to load referrals');
    const referrals = list.data?.referrals ?? [];
    const stats = list.data?.stats;

    const handleDeactivate = async (id: string) => {
        if (!window.confirm('Deactivate this referral code?')) return;
        try {
            await adminApi.referrals.deactivate(id);
            list.reload();
        } catch (e) {
            setActionError(errorMessage(e, 'Failed to deactivate referral'));
        }
    };

    const handleExport = async () => {
        try {
            saveFile(await adminApi.referrals.exportCsv(year), `referrals_${year ?? 'all'}_${new Date().toISOString().split('T')[0]}.csv`);
        } catch (e) {
            setActionError(errorMessage(e, 'Export failed'));
        }
    };

    const copyLink = (code: string) => {
        const url = `${SITE_URL}?ref=${code}`;
        navigator.clipboard.writeText(url);
        alert(`Link copied: ${url}`);
    };

    const error = actionError ?? list.error;

    return (
        <>
            {error && <ErrorBanner message={error} onAction={() => { setActionError(null); list.reload(); }} />}
            <PageHeader eyebrow="Marketing" title="Referral System" spacing={24} actions={
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="ad-btn ad-btn-primary" onClick={() => setCreating(true)}><AiOutlineLink /> Create Code</button>
                    <button className="ad-btn ad-btn-ghost" onClick={handleExport}>Export CSV</button>
                </div>
            } />

            <KpiGrid spacing={24} items={[
                { label: 'Total Codes', val: stats?.totalReferrals || 0 },
                { label: 'Active Codes', val: stats?.activeReferrals || 0, cls: 'blue' },
                { label: 'Total Clicks', val: stats?.totalClicks || 0, cls: 'amber' },
                { label: 'Conversions', val: stats?.totalPaidReferred || 0, cls: 'green' },
            ]} />

            <div className="ad-panel">
                <FilterBar>
                    <SearchFilter label="Search Influencer or Code" value={filter.search} onChange={v => setFilter(f => ({ ...f, search: v }))} placeholder="Name, code, email…" style={{ flex: 1 }} />
                    <SelectFilter label="Status" value={filter.status} onChange={v => setFilter(f => ({ ...f, status: v }))}
                        options={[['', 'All'], ['active', 'Active'], ['inactive', 'Inactive']]} />
                </FilterBar>

                <div className="ad-panel-rel">
                    {list.loading && <LoadingOverlay />}
                    <div className="ad-table-wrap">
                        <table className="ad-table">
                            <TableHead columns={COLUMNS} />
                            <tbody>
                                {referrals.length === 0
                                    ? <tr><td className="ad-td" colSpan={10} style={{ textAlign: 'center', padding: 60, color: 'var(--ad-t3)' }}>No referral codes found.</td></tr>
                                    : referrals.map((r, i) => (
                                        <tr key={r.id} className="ad-tr">
                                            <td className="ad-td ad-mono" style={{ opacity: 0.5 }}>{rowNumber(1, LIMIT, i)}</td>
                                            <td className="ad-td"><span className="ad-badge ad-badge-paid" style={{ fontSize: '0.85rem', padding: '4px 8px' }}>{r.code}</span></td>
                                            <td className="ad-td"><div style={{ fontWeight: 700, color: 'var(--ad-t1)' }}>{r.influencerName}</div></td>
                                            <td className="ad-td"><div style={{ fontSize: '0.78rem', color: 'var(--ad-t2)' }}>{r.influencerEmail || '—'}</div></td>
                                            <td className="ad-td"><div className="ad-mono" style={{ fontSize: '0.75rem', color: 'var(--ad-t3)' }}>{r.influencerPhone || '—'}</div></td>
                                            <td className="ad-td ad-mono">{r.clicks}</td>
                                            <td className="ad-td ad-mono">{r.totalTickets}</td>
                                            <td className="ad-td ad-mono" style={{ color: 'var(--ad-pl)', fontWeight: 700 }}>{r.paidTickets}</td>
                                            <td className="ad-td"><span className={`ad-badge ad-badge-${r.isActive ? 'paid' : 'failed'}`}>{r.isActive ? 'ACTIVE' : 'INACTIVE'}</span></td>
                                            <td className="ad-td">
                                                <div className="ad-row-actions">
                                                    <button className="ad-row-btn blue" title="Copy Referral Link" onClick={() => copyLink(r.code)}><AiOutlineLink /></button>
                                                    {r.isActive && <button className="ad-row-btn red" title="Deactivate" onClick={() => handleDeactivate(r.id)}><AiOutlineDelete /></button>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {creating && (
                <ReferralModal
                    onClose={() => setCreating(false)}
                    onCreated={() => { setCreating(false); list.reload(); }}
                    onError={setActionError}
                />
            )}
        </>
    );
}
