import { useState } from 'react';
import { AiOutlineDelete, AiOutlineEye, AiOutlinePrinter, AiOutlineTable } from 'react-icons/ai';
import type { AdminRaffleTicket } from '../../../adminTypes';
import { adminApi } from '../api/adminApi';
import { saveFile } from '../api/download';
import { errorMessage } from '../api/http';
import { useDashboard } from '../hooks/useDashboard';
import { useDebounced } from '../hooks/useDebounced';
import { useLoad } from '../hooks/useLoad';
import DetailDrawer from '../ui/DetailDrawer';
import { EmptyState, ErrorBanner, LoadingOverlay, TableHead } from '../ui/Feedback';
import { FilterBar, FilterGroup, SearchFilter, SelectFilter } from '../ui/Filters';
import KpiGrid from '../ui/KpiGrid';
import PageHeader from '../ui/PageHeader';
import Pagination from '../ui/Pagination';
import { StatusSelect } from '../ui/StatusPill';
import { ALL_YEARS_NOTE, cap, formatDate, kes, rowNumber } from '../ui/format';
import { useAdminShell } from '../useAdminShell';
import { raffleTicketFields } from './registrationFields';
import { useRaffleTicketPdf } from './useRaffleTicketPdf';

const LIMIT = 12;
const COLUMNS = ['#', 'Ticket No.', 'Name', 'Email', 'Phone', 'Referral', 'Status', 'Created', 'Actions'];

export default function RafflePage() {
    const { year } = useAdminShell();
    const [filter, setFilter] = useState({ status: '', search: '', referralCode: '' });
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<AdminRaffleTicket | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const search = useDebounced(filter.search);
    const dashboard = useDashboard();
    const pdf = useRaffleTicketPdf(year);

    const query = { year, page, limit: LIMIT, status: filter.status, search, referralCode: filter.referralCode };
    const list = useLoad(() => adminApi.raffle.list(query), JSON.stringify(query), 'Failed to load raffle');
    const tickets = list.data?.tickets ?? [];
    const pagination = list.data?.pagination;
    const t = dashboard.totals;

    const change = (patch: Partial<typeof filter>) => { setFilter(f => ({ ...f, ...patch })); setPage(1); };

    const act = async (action: () => Promise<unknown>, failure: string) => {
        try {
            await action();
            list.reload();
            dashboard.reload();
        } catch (e) {
            setActionError(errorMessage(e, failure));
        }
    };

    const handleExport = async () => {
        try {
            saveFile(await adminApi.exports.raffle(year), `raffle-${year ?? 'all'}.csv`);
        } catch (e) {
            setActionError(errorMessage(e, 'Export failed'));
        }
    };

    const error = actionError ?? list.error ?? dashboard.error;

    return (
        <>
            {error && <ErrorBanner message={error} onAction={() => { setActionError(null); list.reload(); dashboard.reload(); }} />}
            <PageHeader
                eyebrow="Engagement"
                title="Raffle Tickets"
                actions={
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="ad-btn ad-btn-ghost" onClick={handleExport}><AiOutlineTable /> Export CSV</button>
                        <button className="ad-btn ad-btn-primary" onClick={pdf.generate} disabled={pdf.printing}>
                            <AiOutlinePrinter /> {pdf.printing ? 'Generating…' : 'Generate Tickets'}
                        </button>
                    </div>
                }
            />

            <KpiGrid spacing={24} note={ALL_YEARS_NOTE} items={[
                { label: 'Total Tickets', val: t.raffleTotal },
                { label: 'Paid Tickets', val: t.rafflePaid, cls: 'green' },
                { label: 'Unpaid Tickets', val: t.raffleUnpaid, cls: 'amber' },
                { label: 'Raffle Revenue', val: kes(t.raffleRevenue), cls: 'green' },
            ]} />

            <div className="ad-panel">
                <FilterBar flush>
                    <SearchFilter value={filter.search} onChange={v => change({ search: v })} placeholder="Ticket code or name…" style={{ flex: 1 }} />
                    <SelectFilter label="Status" value={filter.status} onChange={v => change({ status: v })} options={[['', 'All'], ['PAID', 'Paid'], ['UNPAID', 'Unpaid']]} />
                    <FilterGroup label="Referral Code">
                        <input className="ad-input" type="text" value={filter.referralCode} onChange={e => change({ referralCode: e.target.value.toUpperCase() })} placeholder="e.g. JAMES2026" />
                    </FilterGroup>
                </FilterBar>

                <div className="ad-panel-rel">
                    {list.loading && <LoadingOverlay />}
                    {list.loading && tickets.length === 0 ? <EmptyState>Loading tickets…</EmptyState>
                        : tickets.length === 0 ? <EmptyState>No raffle tickets found matching filters.</EmptyState>
                            : (
                                <div className="ad-table-wrap">
                                    <table className="ad-table">
                                        <TableHead columns={COLUMNS} />
                                        <tbody>
                                            {tickets.map((tk, i) => (
                                                <tr key={tk.id} className="ad-tr">
                                                    <td className="ad-td ad-mono" style={{ fontSize: '0.65rem', color: 'var(--ad-t3)' }}>{rowNumber(page, LIMIT, i)}</td>
                                                    <td className="ad-td ad-mono" style={{ fontWeight: 700, color: 'var(--ad-accent)' }}>{tk.ticketNumber || <span style={{ color: 'var(--ad-t3)', fontWeight: 400 }}>Unpaid</span>}</td>
                                                    <td className="ad-td" style={{ fontWeight: 600 }}>{cap(tk.firstName)} {cap(tk.lastName)}</td>
                                                    <td className="ad-td" style={{ fontSize: '0.75rem' }}>{tk.email || '—'}</td>
                                                    <td className="ad-td ad-mono" style={{ fontSize: '0.75rem' }}>{tk.phoneNumber || '—'}</td>
                                                    <td className="ad-td"><span className="ad-badge ad-badge-blue" style={{ fontSize: '0.65rem' }}>{tk.referralCode || 'Direct'}</span></td>
                                                    <td className="ad-td">
                                                        <StatusSelect value={tk.status} options={['UNPAID', 'PAID']} color={tk.status === 'PAID' ? 'var(--ad-pl)' : 'var(--ad-accent)'}
                                                            onChange={s => act(() => adminApi.raffle.setStatus(tk.id, s), 'Failed to update ticket')} />
                                                    </td>
                                                    <td className="ad-td ad-mono" style={{ fontSize: '0.72rem' }}>{formatDate(tk.createdAt)}</td>
                                                    <td className="ad-td" style={{ textAlign: 'right' }}>
                                                        <div className="ad-row-actions">
                                                            <button className="ad-row-btn" title="View" onClick={() => setSelected(tk)}><AiOutlineEye /></button>
                                                            <button className="ad-row-btn red" title="Delete" onClick={() => { if (confirm('Delete this raffle ticket?')) act(() => adminApi.raffle.remove(tk.id), 'Failed to delete ticket'); }}><AiOutlineDelete /></button>
                                                        </div>
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

            {selected && <DetailDrawer title="Raffle Ticket Detail" fields={raffleTicketFields(selected)} onClose={() => setSelected(null)} />}
            {pdf.printArea}
        </>
    );
}
