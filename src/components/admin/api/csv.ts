/**
 * CSV text for the Payments export only. The server has CSV exports for
 * registrations, raffle and donations (/admin/exports) but not for payments yet;
 * remove this once it does.
 */
type Cell = string | number | null | undefined;

const escape = (v: Cell): string => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(header: string[], rows: Cell[][]): Blob {
    const text = [header, ...rows].map(r => r.map(escape).join(',')).join('\r\n');
    // BOM so Excel reads UTF-8, as the server exports do.
    return new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' });
}
