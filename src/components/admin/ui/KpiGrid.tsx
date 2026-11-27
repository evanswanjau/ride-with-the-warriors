import type { ReactNode } from 'react';

export interface Kpi {
    label: string;
    val: ReactNode;
    /** green | amber | red | blue | gray */
    cls?: string;
}

export default function KpiGrid({ items, spacing }: { items: Kpi[]; spacing?: number }) {
    return (
        <div className="ad-kpi-grid" style={spacing ? { marginBottom: spacing } : undefined}>
            {items.map(k => (
                <div key={k.label} className="ad-kpi">
                    <div className="ad-kpi-label">{k.label}</div>
                    <div className={`ad-kpi-value ${k.cls ?? ''}`}>{k.val}</div>
                </div>
            ))}
        </div>
    );
}
