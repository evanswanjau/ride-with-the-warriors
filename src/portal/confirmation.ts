import type { Entry } from './types';
import { entrySubtitle, entryTitle, fmtDate, fmtKes, fullName, isPaid, statusLabel } from './format';

/**
 * Entry confirmation as a PDF, made on the device from the entry the account already
 * holds (the server has no confirmation download). Works for any paid entry, any year,
 * and for riders registered by someone else. Check-in QR codes are copied from the bib
 * cards on screen (`[data-rider-id] canvas`); a rider with no bib is listed without one.
 */
export async function downloadConfirmation(entry: Entry) {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const green: [number, number, number] = [45, 106, 45];
    doc.setFillColor(...green);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(`RIDE WITH THE WARRIORS ${entry.eventYear}`, 14, 17);
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(14);
    doc.text('Entry confirmation', 14, 42);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`${entryTitle(entry)} · ${entrySubtitle(entry)}`, 14, 50);
    const amount = entry.totalAmount != null ? ` · ${fmtKes(entry.totalAmount)}` : '';
    doc.text(`Status: ${isPaid(entry.status) ? 'Paid' : statusLabel(entry.status)}${amount} · Registered ${fmtDate(entry.createdAt)}`, 14, 57);

    let y = 70;
    for (const rider of entry.riders) {
        if (y > 250) { doc.addPage(); y = 20; }
        const canvas = document.querySelector<HTMLCanvasElement>(`[data-rider-id="${CSS.escape(rider.id)}"] canvas`);
        if (canvas) doc.addImage(canvas.toDataURL('image/png'), 'PNG', 14, y, 36, 36);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.text(rider.bibNumber ?? 'No bib', 56, y + 12);
        doc.setFontSize(12);
        doc.text(`${fullName(rider)}${rider.isCaptain ? ' (captain)' : ''}`, 56, y + 21);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text([rider.category, rider.bikeHire?.status === 'PAID' ? 'Bike hired' : null].filter(Boolean).join(' · '), 56, y + 28);
        y += 44;
    }
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text('Show the QR code at check-in with the ID or birth certificate the entry was made with.', 14, Math.min(y + 6, 285));
    doc.save(`rwtw-${entry.eventYear}-${entry.groupId.slice(0, 8)}.pdf`);
}
