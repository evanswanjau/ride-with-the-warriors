import type { ReactNode } from 'react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';

const linkButton = {
    marginLeft: 'auto', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em',
    textTransform: 'uppercase', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline',
} as const;

/** Red error bar with one action (Retry or Close). */
export function ErrorBanner({ message, actionLabel = 'Retry', onAction }: { message: string; actionLabel?: string; onAction?: () => void }) {
    return (
        <div className="ad-error">
            <AiOutlineExclamationCircle />
            <span>{message}</span>
            {onAction && <button style={linkButton} onClick={onAction}>{actionLabel}</button>}
        </div>
    );
}

export function SuccessBanner({ message, onClose }: { message: string; onClose: () => void }) {
    return (
        <div style={{ padding: '14px 18px', background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.3)', borderLeft: '3px solid var(--ad-pl)', color: 'var(--ad-pl)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', marginBottom: '20px' }}>
            <span>{message}</span>
            <button style={linkButton} onClick={onClose}>Close</button>
        </div>
    );
}

export function LoadingOverlay() {
    return <div className="ad-loading-overlay"><div className="ad-spinner" /></div>;
}

/** Centred grey message in a panel: "Loading…", "Nothing found." */
export function EmptyState({ children }: { children: ReactNode }) {
    return <div style={{ padding: 60, textAlign: 'center', color: 'var(--ad-t3)' }}>{children}</div>;
}

/** Table header row from a list of column names. */
export function TableHead({ columns }: { columns: readonly string[] }) {
    return <thead><tr>{columns.map(h => <th key={h} className="ad-th">{h}</th>)}</tr></thead>;
}

/** One full-width cell for "Loading…" or "None found." */
export function TableMessage({ colSpan, children }: { colSpan: number; children: ReactNode }) {
    return <tr><td className="ad-td" colSpan={colSpan} style={{ textAlign: 'center', padding: 40 }}>{children}</td></tr>;
}
