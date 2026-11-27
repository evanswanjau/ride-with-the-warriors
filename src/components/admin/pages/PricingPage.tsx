import type { PricingCategory } from '../../../types';
import { CIRCUITS } from '../../../constants';
import { usePricingCategories } from '../hooks/usePricingCategories';
import { ErrorBanner, TableHead } from '../ui/Feedback';
import PageHeader from '../ui/PageHeader';
import { useAdminShell } from '../useAdminShell';

const COLUMNS = ['Category', 'Type', 'Age Range', 'Colour', 'BIB Range', 'Remarks'];
const smallCaps = { fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ad-t3)' } as const;
const message = { padding: 40, textAlign: 'center', color: 'var(--ad-t3)' } as const;

export default function PricingPage() {
    const { year } = useAdminShell();
    const { categories, loading, error, reload } = usePricingCategories(year);
    const byCircuit = categories.reduce<Record<string, PricingCategory[]>>((acc, cat) => {
        (acc[cat.circuitId] ??= []).push(cat);
        return acc;
    }, {});

    return (
        <>
            {error && <ErrorBanner message={error} onAction={reload} />}
            <PageHeader eyebrow="Configuration" title="Pricing Categories" />
            {loading ? <div style={message}>Loading…</div>
                : Object.keys(byCircuit).length === 0 ? <div style={message}>No categories found.</div>
                    : Object.entries(byCircuit).map(([circuitId, cats]) => (
                        <div key={circuitId} className="ad-panel">
                            <div className="ad-panel-head">
                                <div className="ad-panel-title">{CIRCUITS.find(c => c.id === circuitId)?.title || circuitId.toUpperCase()}</div>
                                <span style={smallCaps}>{cats.length} categories</span>
                            </div>
                            <div className="ad-table-wrap">
                                <table className="ad-table" style={{ minWidth: 700 }}>
                                    <TableHead columns={COLUMNS} />
                                    <tbody>
                                        {cats.map(cat => (
                                            <tr key={cat.id} className="ad-tr">
                                                <td className="ad-td" style={{ fontWeight: 700, color: 'var(--ad-t1)' }}>{cat.categoryName}</td>
                                                <td className="ad-td" style={{ ...smallCaps, fontSize: '0.65rem', letterSpacing: '0.14em' }}>{cat.type}</td>
                                                <td className="ad-td">{cat.minAge != null && cat.maxAge != null ? `${cat.minAge}–${cat.maxAge}` : cat.familyCategory || 'All'}</td>
                                                <td className="ad-td"><div style={{ width: 32, height: 16, background: cat.hexColor, border: '1px solid var(--ad-border)' }} /></td>
                                                <td className="ad-td ad-mono" style={{ fontSize: '0.75rem', color: 'var(--ad-t3)' }}>{cat.regRange}</td>
                                                <td className="ad-td" style={{ fontSize: '0.78rem', color: 'var(--ad-t3)' }}>{cat.remarks || '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
        </>
    );
}
