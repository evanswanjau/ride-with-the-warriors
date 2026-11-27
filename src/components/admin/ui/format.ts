/** Display helpers shared by the admin pages. */
export const formatDate = (d: string | null | undefined): string => {
    if (!d) return 'N/A';
    const date = new Date(d);
    return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleString();
};

/** "JANE doe" -> "Jane Doe" */
export const cap = (s: string | null | undefined): string =>
    s ? s.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';

export const kes = (n: number | null | undefined): string => `KES ${(n ?? 0).toLocaleString()}`;

/** Row number on a paged list, counting from 1. */
export const rowNumber = (page: number, limit: number, index: number): number => (page - 1) * limit + index + 1;

/** Colour for registration and raffle statuses. */
export function statusColor(status: string): string {
    if (status === 'PAID' || status === 'CONFIRMED') return 'var(--ad-pl)';
    if (status === 'COMPLEMENTARY') return '#a78bfa';
    if (status === 'CANCELLED') return 'var(--ad-red)';
    return 'var(--ad-accent)';
}
