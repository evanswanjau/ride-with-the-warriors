import { useState } from 'react';
import { AiOutlinePrinter } from 'react-icons/ai';
import type { AdminRegistration, BibJobProgress } from '../../../adminTypes';
import type { PricingCategory } from '../../../types';
import { CIRCUITS } from '../../../constants';
import AdminBibVisual from '../AdminBibVisual';
import { adminApi } from '../api/adminApi';
import { saveFile } from '../api/download';
import { errorMessage } from '../api/http';
import { useDebounced } from '../hooks/useDebounced';
import { useLoad } from '../hooks/useLoad';
import { usePricingCategories } from '../hooks/usePricingCategories';
import { EmptyState, ErrorBanner, LoadingOverlay } from '../ui/Feedback';
import { FilterBar, FilterGroup, SearchFilter, SelectFilter } from '../ui/Filters';
import PageHeader from '../ui/PageHeader';
import Pagination from '../ui/Pagination';
import { bibsFileName, generateBibsPdf } from './generateBibs';
import { useAdminShell } from '../useAdminShell';

const LIMIT = 10;
type SortBy = 'id' | 'name' | 'category';

/** Bib cards for the registrations that have a bib (paid or complementary), sorted on screen. */
function bibCards(regs: AdminRegistration[], categories: PricingCategory[], sortBy: SortBy) {
    return regs.filter(r => r.bibNumber).map(r => ({
        id: r.bibNumber as string,
        firstName: r.firstName,
        lastName: r.lastName,
        category: r.category,
        hexColor: categories.find(c => c.categoryName === r.category && c.circuitId === r.circuitId)?.hexColor || '#000000',
        circuitId: r.circuitId,
        teamName: r.teamName,
        type: r.type,
    })).sort((a, b) => {
        if (sortBy === 'category') return a.category.localeCompare(b.category);
        if (sortBy === 'name') return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        return a.id.localeCompare(b.id);
    });
}

export default function BibsPage() {
    const { year } = useAdminShell();
    const [filter, setFilter] = useState({ search: '', circuitId: '', category: '', status: '', dateFrom: '' });
    const [sortBy, setSortBy] = useState<SortBy>('id');
    const [page, setPage] = useState(1);
    const [progress, setProgress] = useState<BibJobProgress | null>(null);
    const [generating, setGenerating] = useState(false);
    const search = useDebounced(filter.search);
    const { categories } = usePricingCategories(year);

    const filters = { circuitId: filter.circuitId, category: filter.category, status: filter.status, dateFrom: filter.dateFrom };
    const query = { ...filters, year, search, page, limit: LIMIT };
    const list = useLoad(() => adminApi.registrations.list(query), JSON.stringify(query), 'Failed to load registrations');
    const regs = list.data?.registrations ?? [];

    const change = (patch: Partial<typeof filter>) => { setFilter(f => ({ ...f, ...patch })); setPage(1); };

    const handleGenerate = async () => {
        setGenerating(true);
        setProgress({ pct: 0, processed: 0, total: 0 });
        try {
            saveFile(await generateBibsPdf({ ...filters, search: filter.search }, setProgress), bibsFileName(filter.status, filter.category));
        } catch (e) {
            alert(errorMessage(e, e instanceof Error ? e.message : 'Failed to generate PDF from server'));
        } finally {
            setGenerating(false);
            setProgress(null);
        }
    };

    const categoryOptions = (filter.circuitId ? categories.filter(c => c.circuitId === filter.circuitId) : categories)
        .map(c => [c.categoryName, c.categoryName] as const);

    return (
        <>
            {list.error && <ErrorBanner message={list.error} onAction={list.reload} />}
            <PageHeader eyebrow="Participant IDs" title="Bibs" actions={
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 3 }}>
                    <button className="ad-btn ad-btn-primary" onClick={handleGenerate} disabled={generating} title="Generate PDF on server">
                        <AiOutlinePrinter />
                        {generating && progress?.total ? `${progress.pct}% (${progress.processed}/${progress.total})` : generating ? 'Starting…' : 'Generate Bibs'}
                    </button>
                    {generating && progress && (
                        <div style={{ height: 3, borderRadius: 2, background: 'var(--ad-border2)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${progress.pct}%`, background: 'var(--ad-pl)', borderRadius: 2, transition: 'width 0.3s ease' }} />
                        </div>
                    )}
                </div>
            } />

            <div className="ad-panel">
                <FilterBar flush>
                    <SearchFilter value={filter.search} onChange={v => change({ search: v })} placeholder="Name, team or ID…" style={{ flex: 1 }} />
                    <SelectFilter label="Circuit" value={filter.circuitId} onChange={v => change({ circuitId: v, category: '' })}
                        options={[['', 'All Circuits'], ...CIRCUITS.map(c => [c.id, c.title] as const)]} />
                    <SelectFilter label="Category" value={filter.category} onChange={v => change({ category: v })} options={[['', 'All Categories'], ...categoryOptions]} />
                    <SelectFilter label="Payment" value={filter.status} onChange={v => change({ status: v })} options={[['', 'All'], ['PAID', 'Paid'], ['UNPAID', 'Unpaid']]} />
                    <FilterGroup label="Registered From">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <input type="date" className="ad-input" style={{ minWidth: 0, width: 150 }} value={filter.dateFrom} onChange={e => change({ dateFrom: e.target.value })} />
                            {filter.dateFrom && (
                                <button onClick={() => change({ dateFrom: '' })} title="Clear date filter"
                                    style={{ background: 'none', border: '1px solid var(--ad-border)', color: 'var(--ad-t3)', padding: '10px 10px', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.7rem', fontWeight: 800, lineHeight: 1 }}>✕</button>
                            )}
                        </div>
                    </FilterGroup>
                    <SelectFilter label="Sort By" value={sortBy} onChange={v => setSortBy(v as SortBy)} options={[['id', 'Bib Number'], ['category', 'Category'], ['name', 'Name']]} />
                </FilterBar>

                <div className="ad-panel-rel">
                    {list.loading && <LoadingOverlay />}
                    {list.loading && regs.length === 0 ? <EmptyState>Loading bibs…</EmptyState>
                        : regs.length === 0 ? <EmptyState>No registrations found matching filters.</EmptyState>
                            : <AdminBibVisual registrations={bibCards(regs, categories, sortBy)} />}
                    <Pagination
                        spaced
                        page={page}
                        pages={list.data?.pagination?.pages ?? 1}
                        onPage={setPage}
                        info={<>
                            Showing {regs.length} bibs
                            {filter.status && <span style={{ marginLeft: 8, padding: '2px 8px', background: filter.status === 'PAID' ? 'rgba(76,175,80,0.12)' : 'rgba(245,158,11,0.12)', color: filter.status === 'PAID' ? 'var(--ad-pl)' : 'var(--ad-accent)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{filter.status}</span>}
                        </>}
                    />
                </div>
            </div>
        </>
    );
}
