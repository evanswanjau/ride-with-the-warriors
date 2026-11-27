import type { AdminRaffleTicket, AdminRegistration } from '../../../adminTypes';
import { CIRCUITS } from '../../../constants';
import type { DrawerField } from '../ui/DetailDrawer';
import { cap, formatDate, kes } from '../ui/format';

/** What the registration detail drawer shows. */
export function registrationFields(r: AdminRegistration): DrawerField[] {
    return [
        { label: 'Bib', val: r.bibNumber || 'Assigned after payment', mono: true },
        { label: 'Reference', val: r.id, mono: true },
        { label: 'Name', val: `${cap(r.firstName)} ${cap(r.lastName)}` },
        { label: 'Military Status', val: r.isMilitary ? 'Yes' : 'No' },
        ...(r.isMilitary ? [
            { label: 'Service No.', val: r.serviceNumber || '—', mono: true },
            { label: 'Rank', val: r.rank || '—' },
            { label: 'Service', val: r.service || '—' },
            { label: 'Unit', val: r.unit || '—' },
        ] : []),
        { label: 'Team', val: r.teamName || '—' },
        { label: 'Circuit', val: CIRCUITS.find(c => c.id === r.circuitId)?.title || r.circuitId },
        { label: 'Category', val: r.category || '—' },
        { label: 'Type', val: r.type },
        { label: 'Kit Size', val: r.tshirtSize || '—' },
        { label: 'Email', val: r.email || '—' },
        { label: 'Phone', val: r.phoneNumber || '—' },
        { label: 'Emergency', val: `${r.emergencyContactName || '—'} · ${r.emergencyPhone || '—'}` },
        { label: 'Amount', val: kes(r.totalAmount) },
        { label: 'Status', val: r.status },
    ];
}

/** What the raffle ticket detail drawer shows. */
export function raffleTicketFields(t: AdminRaffleTicket): DrawerField[] {
    return [
        { label: 'Ticket No.', val: t.ticketNumber || 'Assigned after payment', mono: true },
        { label: 'Name', val: `${cap(t.firstName)} ${cap(t.lastName)}` },
        { label: 'Email', val: t.email || '—' },
        { label: 'Phone', val: t.phoneNumber || '—' },
        { label: 'ID Number', val: t.idNumber || '—' },
        { label: 'Gender', val: t.gender || '—' },
        { label: 'Status', val: t.status },
        { label: 'Created At', val: formatDate(t.createdAt) },
    ];
}
