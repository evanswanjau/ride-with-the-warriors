import { useState } from 'react';
import type { AdminRaffleTicket } from '../../../adminTypes';
import AdminRaffleTicketsPrint from '../AdminRaffleTicketsPrint';
import { adminApi } from '../api/adminApi';
import { errorMessage } from '../api/http';

const PRINT_LIMIT = 5000;
// The ticket pages need a moment to render (QR codes, logo) before they are captured.
const RENDER_WAIT_MS = 2000;

/**
 * "Generate Tickets": renders every paid ticket off screen, captures each A4
 * page as an image and saves one PDF. `printArea` must be rendered by the page.
 */
export function useRaffleTicketPdf() {
    const [tickets, setTickets] = useState<AdminRaffleTicket[]>([]);
    const [printing, setPrinting] = useState(false);

    const generate = async () => {
        setPrinting(true);
        try {
            const { tickets: paid } = await adminApi.raffle.list({ limit: PRINT_LIMIT, status: 'PAID' });
            if (!paid.length) {
                alert('No tickets found to print.');
                return;
            }
            setTickets(paid);
            const [{ jsPDF }, { toPng }] = await Promise.all([import('jspdf'), import('html-to-image'), new Promise(r => setTimeout(r, RENDER_WAIT_MS))]);

            const container = document.getElementById('raffle-print-container');
            if (!container) throw new Error('Ready container not found');
            const pages = container.querySelectorAll<HTMLElement>('.raffle-print-page');
            const pdf = new jsPDF('p', 'mm', 'a4');
            for (let i = 0; i < pages.length; i++) {
                if (i > 0) pdf.addPage();
                pdf.addImage(await toPng(pages[i], { pixelRatio: 1.5, backgroundColor: '#ffffff' }), 'PNG', 0, 0, 210, 297);
            }
            pdf.save(`RWTW_Raffle_Tickets_All_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (e) {
            alert(errorMessage(e, e instanceof Error ? e.message : 'Failed to generate PDF'));
        } finally {
            setPrinting(false);
            setTickets([]);
        }
    };

    const printArea = (
        <div style={{ position: 'fixed', left: '-10000mm', top: 0, pointerEvents: 'none', zIndex: -1000 }}>
            {printing && <AdminRaffleTicketsPrint tickets={tickets.filter(t => t.ticketNumber).map(t => ({ ...t, id: t.ticketNumber ?? '' }))} />}
        </div>
    );

    return { printing, generate, printArea };
}
