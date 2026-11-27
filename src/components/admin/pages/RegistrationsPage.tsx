import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AiOutlineDelete, AiOutlineEye, AiOutlineTable } from 'react-icons/ai';
import type { AdminRegistration } from '../../../adminTypes';
import { CIRCUITS } from '../../../constants';
import { adminApi } from '../api/adminApi';
import { errorMessage } from '../api/http';
import { saveFile } from '../api/download';
import { useDebounced } from '../hooks/useDebounced';
import { useLoad } from '../hooks/useLoad';
import DetailDrawer from '../ui/DetailDrawer';
import { ErrorBanner, LoadingOverlay, TableHead, TableMessage } from '../ui/Feedback';
import { FilterBar, SearchFilter, SelectFilter } from '../ui/Filters';
import KpiGrid from '../ui/KpiGrid';
import PageHeader from '../ui/PageHeader';
import Pagination from '../ui/Pagination';
import { StatusSelect } from '../ui/StatusPill';
import { cap, formatDate, kes, statusColor } from '../ui/format';
import { registrationFields } from './registrationFields';

const LIMIT = 10;
const STATUSES = ['UNPAID', 'PAID', 'CONFIRMED', 'COMPLEMENTARY', 'CANCELLED'] as const;
const COLUMNS = ['Bib', 'Participant', 'Circuit / Category', 'Amount', 'Status', 'Registered', 'Actions'];
const subLine = { fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 } as const;

export default function RegistrationsPage() {
    const [params] = useSearchParams();
    // The Overview's "Review now" opens this page with ?status=UNPAID.
    const [filter, setFilter] = useState({ search: '', circuitId: '', status: params.get('status') ?? '', isMilitary: '' });
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<AdminRegistration | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const search = useDebounced(filter.search);

    const query = { page, limit: LIMIT, circuitId: filter.circuitId, status: filter.status, isMilitary: filter.isMilitary, search };
    const list = useLoad(() => adminApi.registrations.list(query), JSON.stringify(query), 'Failed to load registrations');
    const stats = useLoad(() => adminApi.registrations.stats(), 'stats', 'Failed to load registrations');
    const rows = list.data?.registrations ?? [];
    const pagination = list.data?.pagination;

    const change = (patch: Partial<typeof filter>) => { setFilter(f => ({ ...f, ...patch })); setPage(1); };

    const act = async (action: () => Promise<unknown>, failure: string) => {
        try {
            await action();
            list.reload();
            stats.reload();
        } catch (e) {
            setActionError(errorMessage(e, failure));
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Delete this registration?')) act(() => adminApi.registrations.remove(id), 'Failed to delete registration');
    };

    const handleExport = async () => {
        try {
            saveFile(await adminApi.exports.registrations(undefined), 'registrations-all.csv');
        } catch (e) {
            setActionError(errorMessage(e, 'Export failed'));
        }
    };

    const error = actionError ?? list.error ?? stats.error;
    const s = stats.data?.summary;

    return (
        <>
            {error && <ErrorBanner message={error} onAction={() => { setActionError(null); list.reload(); stats.reload(); }} />}
            <PageHeader
                eyebrow="Participants"
                title="Registrations"
                actions={<button className="ad-btn ad-btn-primary" onClick={handleExport}><AiOutlineTable /> Export CSV</button>}
            />

            {s && (
                <KpiGrid items={[
                    { label: 'Total', val: s.total },
                    { label: 'Paid', val: s.paid, cls: 'green' },
                    { label: 'Unpaid', val: s.unpaid, cls: 'amber' },
                    { label: 'Revenue', val: kes(Number(s.revenue || 0)), cls: 'green' },
                ]} />
            )}

            <div className="ad-panel">
                <FilterBar>
                    <SearchFilter value={filter.search} onChange={v => change({ search: v })} placeholder="Name, team or ID…" />
                    <SelectFilter label="Circuit" value={filter.circuitId} onChange={v => change({ circuitId: v })}
                        options={[['', 'All Circuits'], ...CIRCUITS.map(c => [c.id, c.title] as const)]} />
                    <SelectFilter label="Status" value={filter.status} onChange={v => change({ status: v })}
                        options={[['', 'All'], ['UNPAID', 'Unpaid'], ['PAID', 'Paid'], ['CONFIRMED', 'Confirmed'], ['COMPLEMENTARY', 'Complementary'], ['CANCELLED', 'Cancelled']]} />
                    <SelectFilter label="Military Status" value={filter.isMilitary} onChange={v => change({ isMilitary: v })}
                        options={[['', 'All'], ['true', 'Military Only'], ['false', 'Civilian Only']]} />
                </FilterBar>
                <div className="ad-panel-rel">
                    {list.loading && <LoadingOverlay />}
                    <div className="ad-table-wrap">
                        <table className="ad-table">
                            <TableHead columns={COLUMNS} />
                            <tbody>
                                {list.loading && rows.length === 0 ? <TableMessage colSpan={7}>Loading…</TableMessage>
                                    : rows.length === 0 ? <TableMessage colSpan={7}>No registrations found.</TableMessage>
                                        : rows.map(reg => (
                                            <tr key={reg.id} className="ad-tr">
                                                <td className="ad-td ad-mono">{reg.bibNumber || <span style={{ color: 'var(--ad-t3)' }}>Unpaid</span>}</td>
                                                <td className="ad-td">
                                                    <div style={{ fontWeight: 700, color: 'var(--ad-t1)' }}>{cap(reg.firstName)} {cap(reg.lastName)}</div>
                                                    {reg.teamName && <div style={{ ...subLine, fontSize: '0.72rem', color: 'var(--ad-t3)' }}>Team: {reg.teamName}</div>}
                                                    {reg.isMilitary && <div style={{ ...subLine, fontSize: '0.65rem', color: 'var(--ad-pl)' }}>[Military]</div>}
                                                </td>
                                                <td className="ad-td">
                                                    <div style={{ fontWeight: 700, color: 'var(--ad-t1)', fontSize: '0.8rem' }}>{reg.category || 'Rider'}</div>
                                                    <div style={{ ...subLine, fontSize: '0.65rem', color: 'var(--ad-t3)', letterSpacing: '0.14em' }}>{reg.circuitId?.toUpperCase()}</div>
                                                </td>
                                                <td className="ad-td" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: 'var(--ad-pl)' }}>{kes(reg.totalAmount)}</td>
                                                <td className="ad-td">
                                                    <StatusSelect value={reg.status} options={STATUSES} color={statusColor(reg.status)}
                                                        onChange={s => act(() => adminApi.registrations.setStatus(reg.id, s), 'Failed to update registration')} />
                                                </td>
                                                <td className="ad-td ad-mono" style={{ fontSize: '0.72rem' }}>{formatDate(reg.createdAt)}</td>
                                                <td className="ad-td" style={{ textAlign: 'right' }}>
                                                    <div className="ad-row-actions">
                                                        <button className="ad-row-btn" title="View" onClick={() => setSelected(reg)}><AiOutlineEye /></button>
                                                        <button className="ad-row-btn red" title="Delete" onClick={() => handleDelete(reg.id)}><AiOutlineDelete /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination page={page} pages={pagination?.pages ?? 1} total={pagination?.total ?? 0} limit={LIMIT} onPage={setPage} />
                </div>
            </div>

            {selected && <DetailDrawer title="Registration Detail" fields={registrationFields(selected)} onClose={() => setSelected(null)} />}
        </>
    );
}
