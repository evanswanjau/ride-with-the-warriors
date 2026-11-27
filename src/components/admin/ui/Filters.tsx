import type { CSSProperties, ReactNode } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

export function FilterBar({ children, flush }: { children: ReactNode; flush?: boolean }) {
    return <div className="ad-filters" style={flush ? { borderBottom: 'none' } : undefined}>{children}</div>;
}

export function FilterGroup({ label, children, style }: { label: string; children: ReactNode; style?: CSSProperties }) {
    return (
        <div className="ad-filter-group" style={style}>
            <label className="ad-filter-label">{label}</label>
            {children}
        </div>
    );
}

interface SearchFilterProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    style?: CSSProperties;
}

export function SearchFilter({ label = 'Search', value, onChange, placeholder, style = { flex: 1, minWidth: 200 } }: SearchFilterProps) {
    return (
        <FilterGroup label={label} style={style}>
            <div className="ad-search-wrap">
                <AiOutlineSearch className="ad-search-icon" />
                <input className="ad-input" type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
            </div>
        </FilterGroup>
    );
}

/** [value, label] */
export type Option = readonly [string, string];

interface SelectFilterProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: readonly Option[];
    style?: CSSProperties;
}

export function SelectFilter({ label, value, onChange, options, style }: SelectFilterProps) {
    return (
        <FilterGroup label={label} style={style}>
            <select className="ad-select" value={value} onChange={e => onChange(e.target.value)}>
                {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
        </FilterGroup>
    );
}
