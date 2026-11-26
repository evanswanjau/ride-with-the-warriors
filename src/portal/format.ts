import type { Entry, Rider } from './types';

export const PAID = ['PAID', 'CONFIRMED', 'COMPLEMENTARY'];
export const isPaid = (status: string) => PAID.includes(status);

export const fmtKes = (n: number) => `KES ${n.toLocaleString('en-KE')}`;

export const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });

/** "1984-07-19" or an ISO timestamp → "19 Jul 1984", without timezone drift. */
export function fmtDob(s: string | null | undefined): string {
    if (!s) return 'Not set';
    const [y, m, d] = s.slice(0, 10).split('-').map(Number);
    if (!y || !m || !d) return 'Not set';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d} ${months[m - 1]} ${y}`;
}

export const dobInput = (s: string | null | undefined) => (s ? s.slice(0, 10) : '');

export const circuitName = (c: string) => c.charAt(0).toUpperCase() + c.slice(1);

export const fullName = (r: Pick<Rider, 'firstName' | 'lastName'>) => `${r.firstName} ${r.lastName}`.trim();

export const initials = (r: Pick<Rider, 'firstName' | 'lastName'>) =>
    `${r.firstName.charAt(0)}${r.lastName.charAt(0)}`.toUpperCase();

export function entryTitle(e: Entry): string {
    if (e.type === 'team') return e.teamName || 'Team entry';
    if (e.type === 'family') return e.circuitId === 'family' ? 'Family ride' : `${circuitName(e.circuitId)} · Family`;
    return `${circuitName(e.circuitId)} circuit`;
}

export function entrySubtitle(e: Entry): string {
    const n = e.riders.length;
    const parts = [
        e.type === 'team' ? `${circuitName(e.circuitId)} circuit · Team` : e.type === 'family' ? 'Family' : 'Individual',
        `${n} ${n === 1 ? 'rider' : 'riders'}`,
    ];
    if (e.role === 'participant') parts.push('registered by someone else');
    return parts.join(' · ');
}

export type StatusKind = 'paid' | 'unpaid' | 'other';

export function statusKind(status: string): StatusKind {
    if (isPaid(status)) return 'paid';
    if (status === 'UNPAID' || status === 'PENDING') return 'unpaid';
    return 'other';
}

export function statusLabel(status: string): string {
    switch (status) {
        case 'PAID':
        case 'CONFIRMED':
            return 'Paid';
        case 'COMPLEMENTARY':
            return 'Complimentary';
        case 'UNPAID':
            return 'Awaiting payment';
        case 'PENDING':
            return 'Pending';
        case 'CANCELLED':
            return 'Cancelled';
        default:
            return status.charAt(0) + status.slice(1).toLowerCase();
    }
}

/** What the check-in desk scans. Kept short so the QR stays easy to read on a cracked screen. */
export const checkInPayload = (year: number, rider: Rider) => `RWTW:${year}:${rider.bibNumber}:${rider.id}`;
export const rafflePayload = (ticketNumber: string) => `RWTW-RAFFLE:${ticketNumber}`;
