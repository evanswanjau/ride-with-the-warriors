import type { ReactNode } from 'react';

interface PageHeaderProps {
    eyebrow: string;
    title: string;
    actions?: ReactNode;
    /** Space below the header when it has actions. */
    spacing?: number;
}

export default function PageHeader({ eyebrow, title, actions, spacing }: PageHeaderProps) {
    const heading = (
        <div>
            <div className="ad-section-head"><div className="ad-section-line" /><span className="ad-section-eyebrow">{eyebrow}</span></div>
            <div className="ad-page-title" style={actions ? { marginBottom: 0 } : undefined}>{title}</div>
        </div>
    );
    if (!actions) return heading;
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: spacing }}>
            {heading}
            {actions}
        </div>
    );
}
