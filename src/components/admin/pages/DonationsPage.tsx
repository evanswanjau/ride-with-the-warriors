import { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { adminApi } from '../api/adminApi';
import { errorMessage } from '../api/http';
import { useDebounced } from '../hooks/useDebounced';
import { useLoad } from '../hooks/useLoad';
import { EmptyState, ErrorBanner, LoadingOverlay, TableHead } from '../ui/Feedback';
import { FilterBar, SearchFilter, SelectFilter } from '../ui/Filters';
import KpiGrid from '../ui/KpiGrid';
import PageHeader from '../ui/PageHeader';
import Pagination from '../ui/Pagination';
import { StatusPill } from '../ui/StatusPill';
import { formatDate, kes, rowNumber } from '../ui/format';

const LIMIT = 20;
const COLUMNS = ['#', 'Donor', 'Contact Info', 'Amount', 'Status', 'M-Pesa Code', 'Date', 'Actions'];

export default function DonationsPage() {
    const [filter, setFilter] = useState({ status: '', search: '' });
    const [page, setPage] = useState(1);
    const [actionError, setActionError] = useState<string | null>(null);
    const search = useDebounced(filter.search);

    const query = { page, limit: LIMIT, status: filter.status, search };
    const list = useLoad(() => adminApi.donations.list(query), JSON.stringify(query), 'Failed to load donations');
    const stats = useLoad(() => adminApi.donations.stats(), 'stats', 'Failed to load donations');
    const donations = list.data?.donations ?? [];
    const pagination = list.data?.pagination;
    const s = stats.data?.summary;

    const change = (patch: Partial<typeof filter>) => { setFilter(f => ({ ...f, ...patch })); setPage(1); };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this donation?')) return;
        try {
            await adminApi.donations.remove(id);
            list.reload();
            stats.reload();
        } catch (e) {
            setActionError(errorMessage(e, 'Failed to delete donation'));
        }
    };

    const error = actionError ?? list.error ?? stats.error;

    return (
        <>
            {error && <ErrorBanner message={error} onAction={() => { setActionError(null); list.reload(); stats.reload(); }} />}
            <PageHeader eyebrow="Contributions" title="Donations" />

            {s && (
                <KpiGrid items={[
                    { label: 'Total Count', val: s.totalCount },
                    { label: 'Paid Count', val: s.paidCount, cls: 'green' },
                    { label: 'Unpaid Count', val: s.unpaidCount ?? 0, cls: 'amber' },
                    { label: 'Total Revenue', val: kes(s.totalAmount), cls: 'green' },
                ]} />
            )}

            <div className="ad-panel">
                <FilterBar>
                    <SearchFilter value={filter.search} onChange={v => change({ search: v })} placeholder="Name, email, phone or code…" style={{ flex: 1 }} />
                    <SelectFilter label="Status" value={filter.status} onChange={v => change({ status: v })} style={{ marginLeft: 'auto' }}
                        options={[['', 'All'], ['PAID', 'Paid'], ['PENDING', 'Pending'], ['FAILED', 'Failed']]} />
                </FilterBar>

                <div className="ad-panel-rel">
                    {list.loading && <LoadingOverlay />}
                    {list.loading && donations.length === 0 ? <EmptyState>Loading donations…</EmptyState>
                        : donations.length === 0 ? <EmptyState>No donations found matching filters.</EmptyState>
                            : (
                                <div className="ad-table-wrap">
                                    <table className="ad-table">
                                        <TableHead columns={COLUMNS} />
                                        <tbody>
                                            {donations.map((d, i) => (
                                                <tr key={d.id} className="ad-tr">
                                                    <td className="ad-td ad-mono" style={{ opacity: 0.5 }}>{rowNumber(page, LIMIT, i)}</td>
                                                    <td className="ad-td"><div style={{ fontWeight: 700, color: 'var(--ad-t1)' }}>{d.name || 'Anonymous'}</div></td>
                                                    <td className="ad-td">
                                                        <div style={{ fontSize: '0.78rem', color: 'var(--ad-t2)' }}>{d.email}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--ad-t3)' }}>{d.phone}</div>
                                                    </td>
                                                    <td className="ad-td" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: 'var(--ad-pl)' }}>{kes(d.amount)}</td>
                                                    <td className="ad-td"><StatusPill status={d.status} /></td>
                                                    <td className="ad-td ad-mono" style={{ fontSize: '0.78rem' }}>{d.mpesaCode || '—'}</td>
                                                    <td className="ad-td ad-mono" style={{ fontSize: '0.72rem' }}>{formatDate(d.createdAt)}</td>
                                                    <td className="ad-td" style={{ textAlign: 'right' }}>
                                                        <button className="ad-row-btn red" style={{ marginLeft: 'auto' }} title="Delete" onClick={() => handleDelete(d.id)}><AiOutlineDelete /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                    <Pagination spaced page={page} pages={pagination?.pages ?? 1} total={pagination?.total ?? 0} limit={LIMIT} onPage={setPage} />
                </div>
            </div>
        </>
    );
}
