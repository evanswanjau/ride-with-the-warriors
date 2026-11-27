import type { ChartRange } from './chartRange';

const LABEL: Record<ChartRange, string> = { '7d': '7D', '30d': '30D', '6m': '6M' };

export default function RangeToggle({ value, onChange }: { value: ChartRange; onChange: (r: ChartRange) => void }) {
    return (
        <div style={{ display: 'flex', gap: 8 }}>
            {(['7d', '30d', '6m'] as const).map(r => {
                const active = value === r;
                return (
                    <button key={r} onClick={() => onChange(r)} style={{ padding: '5px 10px', border: '1px solid', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s', background: active ? 'var(--ad-pl)' : 'transparent', color: active ? '#fff' : 'var(--ad-t3)', borderColor: active ? 'var(--ad-pl)' : 'var(--ad-border)', clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' }}>
                        {LABEL[r]}
                    </button>
                );
            })}
        </div>
    );
}
