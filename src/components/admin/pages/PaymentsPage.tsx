import { useState } from 'react';
import { AiOutlineTable } from 'react-icons/ai';
import type { AdminPayment } from '../../../adminTypes';
import { adminApi } from '../api/adminApi';
import { toCsv } from '../api/csv';
import { saveFile } from '../api/download';
import { errorMessage } from '../api/http';
import { useDebounced } from '../hooks/useDebounced';
import { useLoad } from '../hooks/useLoad';
import { ErrorBanner, LoadingOverlay, TableHead, TableMessage } from '../ui/Feedback';
import { FilterBar, FilterGroup, SearchFilter, SelectFilter } from '../ui/Filters';
import KpiGrid from '../ui/KpiGrid';
import PageHeader from '../ui/PageHeader';
import Pagination from '../ui/Pagination';
import { StatusPill } from '../ui/StatusPill';
import { ALL_YEARS_NOTE, formatDate, kes } from '../ui/format';

const LIMIT = 20;
const EXPORT_LIMIT = 10_000;
const COLUMNS = ['Transaction Code', 'Phone', 'Amount', 'Status', 'Timestamp', 'For'];

/** What a payment was for, e.g. "Cycling · Bib 1024". */
function paidFor(p: AdminPayment): string {
    if (p.bikeHireId) return `Bike hire${p.bibNumber ? ` · Bib ${p.bibNumber}` : ''}`;
    if (p.registrationId) return `Cycling · ${p.bibNumber ? `Bib ${p.bibNumber}` : 'no bib yet'}`;
    if (p.raffleTicketIds?.length) return `Raffle · ${p.ticketNumbers?.length ? p.ticketNumbers.join(', ') : `${p.raffleTicketIds.length} unnumbered`}`;
    return p.donationId ? 'Donation' : '—';
}

// The type filter works on the page already loaded: the server cannot filter by type.
function matchesType(p: AdminPayment, type: string): boolean {
    if (type === 'cycling') return !!p.registrationId;
    if (type === 'raffle') return (p.raffleTicketIds?.length ?? 0) > 0;
    if (type === 'donation') return !!p.donationId;
    return true;
}

export default function PaymentsPage() {
    const [filter, setFilter] = useState({ status: '', search: '', dateFrom: '', dateTo: '' });
    const [type, setType] = useState('');
    const [page, setPage] = useState(1);
    const [actionError, setActionError] = useState<string | null>(null);
    const search = useDebounced(filter.search);

    const query = { status: filter.status, search, dateFrom: filter.dateFrom, dateTo: filter.dateTo };
    const list = useLoad(() => adminApi.payments.list({ ...query, page, limit: LIMIT }), JSON.stringify({ ...query, page }), 'Failed to load payments');
    const stats = useLoad(() => adminApi.payments.stats(), 'stats', 'Failed to load payments');
    const payments = list.data?.payments ?? [];
    const shown = payments.filter(p => matchesType(p, type));
    const pagination = list.data?.pagination;
    const s = stats.data?.summary;

    const change = (patch: Partial<typeof filter>) => { setFilter(f => ({ ...f, ...patch })); setPage(1); };

    const handleExport = async () => {
        try {
            const { payments: all } = await adminApi.payments.list({ ...query, search: filter.search, limit: EXPORT_LIMIT });
            saveFile(toCsv(
                ['TransactionCode', 'Phone', 'Amount', 'Status', 'Timestamp', 'RegistrationId', 'CreatedAt'],
                all.map(p => [p.mpesaReceiptNumber, p.phone, p.amount, p.status, p.transactionDate || new Date(p.createdAt).toISOString(), p.registrationId, new Date(p.createdAt).toLocaleString()]),
            ), 'Payments.csv');
        } catch (e) {
            setActionError(errorMessage(e, 'Export failed'));
        }
    };

    const error = actionError ?? list.error ?? stats.error;

    return (
        <>
            {error && <ErrorBanner message={error} onAction={() => { setActionError(null); list.reload(); stats.reload(); }} />}
            <PageHeader
                eyebrow="Transactions"
                title="Payments"
                actions={<button className="ad-btn ad-btn-primary" onClick={handleExport}><AiOutlineTable /> Export CSV</button>}
            />
            {s && (
                <KpiGrid note={`${ALL_YEARS_NOTE}; so does this list`} items={[
                    { label: 'Total', val: s.total },
                    { label: 'Paid', val: s.paid, cls: 'green' },
                    { label: 'Failed', val: s.failed, cls: 'red' },
                    { label: 'Revenue', val: kes(Number(s.revenue || 0)), cls: 'green' },
                ]} />
            )}
            <div className="ad-panel">
                <FilterBar>
                    <SearchFilter value={filter.search} onChange={v => change({ search: v })} placeholder="Transaction code or phone…" />
                    <SelectFilter label="Status" value={filter.status} onChange={v => change({ status: v })}
                        options={[['', 'All'], ['PAID', 'Paid'], ['PENDING', 'Pending'], ['FAILED', 'Failed']]} />
                    <FilterGroup label="From">
                        <input className="ad-input" type="date" value={filter.dateFrom} onChange={e => change({ dateFrom: e.target.value })} style={{ minWidth: 130 }} />
                    </FilterGroup>
                    <FilterGroup label="To">
                        <input className="ad-input" type="date" value={filter.dateTo} onChange={e => change({ dateTo: e.target.value })} style={{ minWidth: 130 }} />
                    </FilterGroup>
                    <SelectFilter label="Type" value={type} onChange={setType}
                        options={[['', 'All Types'], ['cycling', 'Cycling'], ['raffle', 'Raffle'], ['donation', 'Donation']]} />
                </FilterBar>
                <div className="ad-panel-rel">
                    {list.loading && <LoadingOverlay />}
                    <div className="ad-table-wrap">
                        <table className="ad-table">
                            <TableHead columns={COLUMNS} />
                            <tbody>
                                {list.loading && payments.length === 0 ? <TableMessage colSpan={6}>Loading…</TableMessage>
                                    : shown.length === 0 ? <TableMessage colSpan={6}>No payments found.</TableMessage>
                                        : shown.map(p => (
                                            <tr key={p.id} className="ad-tr">
                                                <td className="ad-td ad-mono">{p.mpesaReceiptNumber || '—'}</td>
                                                <td className="ad-td">{p.phone || '—'}</td>
                                                <td className="ad-td" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: 'var(--ad-pl)' }}>{kes(p.amount)}</td>
                                                <td className="ad-td"><StatusPill status={p.status} /></td>
                                                <td className="ad-td ad-mono" style={{ fontSize: '0.72rem' }}>{p.transactionDate ? String(p.transactionDate).slice(0, 8) : formatDate(p.createdAt)}</td>
                                                <td className="ad-td ad-mono" style={{ fontSize: '0.65rem' }}>{paidFor(p)}</td>
                                            </tr>
                                        ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination page={page} pages={pagination?.pages ?? 1} total={pagination?.total ?? 0} limit={LIMIT} onPage={setPage} />
                </div>
            </div>
        </>
    );
}
