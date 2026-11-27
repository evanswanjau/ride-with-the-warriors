/** Shared chart settings for the Overview and Analytics pages. */
export type ChartRange = '7d' | '30d' | '6m';

/** Keeps the last 7 or 30 days of a daily series; 6m keeps all of it (the server sends six months). */
export function sliceRange<T>(rows: T[] | undefined, range: ChartRange): T[] {
    return (rows ?? []).slice(range === '7d' ? -7 : range === '30d' ? -30 : undefined);
}

/** X-axis props that keep date labels readable for each range. */
export function rangeAxis(range: ChartRange) {
    return {
        interval: range === '7d' ? 0 : range === '30d' ? 4 : 29,
        tickFormatter: range === '6m' ? (v: string) => v.split(' ')[0] : undefined,
    };
}

export const axisTick = { fontSize: 10, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fill: 'var(--ad-t3)' };

export const legendStyle = { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const };

/** Chart tooltip box; follows the admin theme. */
export function tooltipStyle(dark: boolean) {
    return { backgroundColor: dark ? '#0d1a0d' : '#ffffff', border: `1px solid ${dark ? '#2d6a2d' : '#d8d4cc'}`, borderRadius: 0, padding: '10px 14px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700 };
}
