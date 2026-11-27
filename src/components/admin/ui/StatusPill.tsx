/** Status badge (read only) and status picker (changes the row). */
export function StatusPill({ status }: { status: string }) {
    return <span className={`ad-badge ad-badge-${status.toLowerCase()}`}>{status}</span>;
}

interface StatusSelectProps {
    value: string;
    options: readonly string[];
    onChange: (value: string) => void;
    color: string;
}

export function StatusSelect({ value, options, onChange, color }: StatusSelectProps) {
    return (
        <select className="ad-status-select" value={value} onChange={e => onChange(e.target.value)} style={{ color }}>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    );
}
