import type { ReactNode } from 'react';

export interface Kpi {
    label: string;
    val: ReactNode;
    /** green | amber | red | blue | gray */
    cls?: string;
}

/** `note`: small line under the cards, e.g. when the totals do not follow the chosen year. */
export default function KpiGrid({ items, spacing, note }: { items: Kpi[]; spacing?: number; note?: string }) {
    const grid = (
        <div className="ad-kpi-grid" style={spacing && !note ? { marginBottom: spacing } : undefined}>
            {items.map(k => (
                <div key={k.label} className="ad-kpi">
                    <div className="ad-kpi-label">{k.label}</div>
                    <div className={`ad-kpi-value ${k.cls ?? ''}`}>{k.val}</div>
                </div>
            ))}
        </div>
    );
    if (!note) return grid;
    return (
        <div style={spacing ? { marginBottom: spacing } : undefined}>
            {grid}
            <div className="ad-kpi-note">{note}</div>
        </div>
    );
}
