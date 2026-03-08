import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
    AiOutlineTable, AiOutlineSun, AiOutlineMoon, AiOutlineTeam,
    AiOutlineDollar, AiOutlineExclamationCircle, AiOutlineSearch, AiOutlineEye, AiOutlineDelete,
    AiOutlineLeft, AiOutlineRight, AiOutlineStar, AiOutlineClose,
    AiOutlineDownload, AiOutlinePrinter, AiOutlineDashboard, AiOutlineHistory,
    AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineBarChart
} from 'react-icons/ai';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie, Line, Legend, ComposedChart
} from 'recharts';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import AdminRaffleTicketsPrint from './AdminRaffleTicketsPrint';
import AdminBibNumbersPrint from './AdminBibNumbersPrint';
import AdminBibVisual from './AdminBibVisual';
import logo from '../../assets/logos/logo.png';
import { CIRCUITS } from '../../constants';
import { API_BASE_URL } from '../../config';

interface AdminDashboardProps {
    token: string;
    admin: any;
    onLogout: () => void;
}



const AdminDashboard = ({ token, admin, onLogout }: AdminDashboardProps) => {
    type ViewType = 'overview' | 'analytics' | 'registrations' | 'pricing' | 'payments' | 'raffle' | 'bibs';
    const [activeView, setActiveView] = useState<ViewType>('overview');
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [pricingCategories, setPricingCategories] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState({ circuitId: '', type: '', status: '', category: '', search: '' });
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('adminTheme') === 'dark');
    const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [payments, setPayments] = useState<any[]>([]);
    const [paymentsStats, setPaymentsStats] = useState<any>(null);
    const [paymentsFilter, setPaymentsFilter] = useState({ status: '', search: '', dateFrom: '', dateTo: '' });
    const [paymentsPagination, setPaymentsPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
    const [raffleTickets, setRaffleTickets] = useState<any[]>([]);
    const [raffleFilter, setRaffleFilter] = useState({ status: '', search: '' });
    const [rafflePagination, setRafflePagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
    const [isPrintingRaffle, setIsPrintingRaffle] = useState(false);
    const [allRaffleTicketsForPrint, setAllRaffleTicketsForPrint] = useState<any[]>([]);
    const [isPrintingBibs, setIsPrintingBibs] = useState(false);
    const [allRegsForPrint, setAllRegsForPrint] = useState<any[]>([]);
    const [printProgress, setPrintProgress] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>('id'); // 'id', 'name', 'category'

    const dm = isDarkMode;

    useEffect(() => { localStorage.setItem('adminTheme', dm ? 'dark' : 'light'); }, [dm]);
    useEffect(() => { fetchPricingCategories(); }, []);
    useEffect(() => {
        if (activeView === 'overview' || activeView === 'analytics') fetchDashboardStats();
        else if (activeView === 'registrations' || activeView === 'bibs') fetchData();
        else if (activeView === 'pricing') fetchPricingCategories();
        else if (activeView === 'payments') fetchPayments();
        else if (activeView === 'raffle') fetchRaffleTickets();
    }, [filter, pagination.page, activeView, paymentsFilter, paymentsPagination.page, raffleFilter, rafflePagination.page]);

    const fetchDashboardStats = async () => {
        try { setLoading(true); const r = await fetch(`${API_BASE_URL}/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` } }); if (!r.ok) throw new Error(); setDashboardData(await r.json()); } catch { setError('Failed to load dashboard'); } finally { setLoading(false); }
    };
    const fetchData = async () => {
        try {
            setLoading(true);
            const q = new URLSearchParams({ page: String(pagination.page), limit: String(pagination.limit), ...filter });
            const [rr, sr] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/registrations?${q}`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API_BASE_URL}/admin/registrations/stats/summary`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            if (!rr.ok || !sr.ok) throw new Error();
            const rd = await rr.json(); const sd = await sr.json();
            setRegistrations(rd.registrations); setPagination(rd.pagination); setStats(sd);
        } catch { setError('Failed to load registrations'); } finally { setLoading(false); }
    };
    const fetchPricingCategories = async () => {
        try { setLoading(true); const r = await fetch(`${API_BASE_URL}/registrations/config/categories`); if (!r.ok) throw new Error(); const d = await r.json(); setPricingCategories(d.categories || []); } catch { setError('Failed to load pricing'); } finally { setLoading(false); }
    };
    const fetchPayments = async () => {
        try {
            setLoading(true); setError(null);
            const p = new URLSearchParams({ page: String(paymentsPagination.page), limit: String(paymentsPagination.limit), ...(paymentsFilter.status && { status: paymentsFilter.status }), ...(paymentsFilter.search && { search: paymentsFilter.search }), ...(paymentsFilter.dateFrom && { dateFrom: paymentsFilter.dateFrom }), ...(paymentsFilter.dateTo && { dateTo: paymentsFilter.dateTo }) });
            const [lr, sr] = await Promise.all([fetch(`${API_BASE_URL}/admin/payments?${p}`, { headers: { Authorization: `Bearer ${token}` } }), fetch(`${API_BASE_URL}/admin/payments/stats/summary`, { headers: { Authorization: `Bearer ${token}` } })]);
            if (!lr.ok || !sr.ok) throw new Error();
            const ld = await lr.json(); const sd = await sr.json();
            setPayments(ld.payments || []); setPaymentsPagination(prev => ({ ...prev, ...(ld.pagination || {}) })); setPaymentsStats(sd);
        } catch { setError('Failed to load payments'); } finally { setLoading(false); }
    };
    const fetchRaffleTickets = async () => {
        try {
            setLoading(true); setError(null);
            const p = new URLSearchParams({ page: String(rafflePagination.page), limit: String(rafflePagination.limit), ...(raffleFilter.status && { status: raffleFilter.status }), ...(raffleFilter.search && { search: raffleFilter.search }) });
            const r = await fetch(`${API_BASE_URL}/admin/raffle?${p}`, { headers: { Authorization: `Bearer ${token}` } });
            if (!r.ok) throw new Error(); const d = await r.json();
            setRaffleTickets(d.tickets || []); setRafflePagination(prev => ({ ...prev, ...(d.pagination || {}) }));
        } catch { setError('Failed to load raffle'); } finally { setLoading(false); }
    };

    const handleStatusUpdate = async (id: string, s: string) => {
        try { const r = await fetch(`${API_BASE_URL}/admin/registrations/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status: s }) }); if (r.ok) fetchData(); } catch (e) { console.error(e); }
    };
    const handleDelete = async (id: string) => {
        if (!confirm('Delete this registration?')) return;
        try { const r = await fetch(`${API_BASE_URL}/admin/registrations/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); if (r.ok) fetchData(); } catch (e) { console.error(e); }
    };
    const formatDate = (d: string) => { try { return new Date(d).toLocaleString(); } catch { return 'N/A'; } };
    const cap = (s: string) => s ? s.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';

    const handleExport = async () => {
        try {
            const q = new URLSearchParams({ limit: '10000', ...filter });
            const r = await fetch(`${API_BASE_URL}/admin/registrations?${q}`, { headers: { Authorization: `Bearer ${token}` } });
            const d = await r.json(); if (!d.registrations) return;
            const ws = XLSX.utils.json_to_sheet(d.registrations.map((r: any) => ({ ID: r.id, Name: `${r.firstName} ${r.lastName}`, Email: r.email, Phone: r.phoneNumber, Team: r.teamName || '', TshirtSize: r.tshirtSize || '', EmergencyContact: r.emergencyContactName || '', EmergencyPhone: r.emergencyPhone || '', Type: r.type, Circuit: r.circuitId, Category: r.category, Amount: r.totalAmount, MpesaCode: r.mpesaCode || '', Status: r.status, Date: new Date(r.createdAt).toLocaleString() })));
            const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Registrations'); XLSX.writeFile(wb, 'Registrations.xlsx');
        } catch { alert('Export failed'); }
    };
    const handleExportPayments = async (fmt: 'csv' | 'excel') => {
        try {
            const p = new URLSearchParams({ limit: '10000', ...(paymentsFilter.status && { status: paymentsFilter.status }), ...(paymentsFilter.search && { search: paymentsFilter.search }), ...(paymentsFilter.dateFrom && { dateFrom: paymentsFilter.dateFrom }), ...(paymentsFilter.dateTo && { dateTo: paymentsFilter.dateTo }) });
            const r = await fetch(`${API_BASE_URL}/admin/payments?${p}`, { headers: { Authorization: `Bearer ${token}` } }); const d = await r.json(); const list = d.payments || [];
            const rows = list.map((p: any) => ({ TransactionCode: p.mpesaReceiptNumber || '', Phone: p.phone || '', Amount: p.amount, Status: p.status, Timestamp: p.transactionDate || new Date(p.createdAt).toISOString(), RegistrationId: p.registrationId, CreatedAt: new Date(p.createdAt).toLocaleString() }));
            const ws = XLSX.utils.json_to_sheet(rows);
            if (fmt === 'csv') { const csv = XLSX.utils.sheet_to_csv(ws); const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'Payments.csv'; a.click(); URL.revokeObjectURL(url); } else { const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Payments'); XLSX.writeFile(wb, 'Payments.xlsx'); }
        } catch { alert('Export failed'); }
    };

    const handleDownloadRaffleTickets = async () => {
        try {
            setError(null);
            setIsPrintingRaffle(true);
            setPrintProgress(0);

            // Fetch all raffle tickets matching filter (ignoring pagination)
            const q = new URLSearchParams({ limit: '5000', ...raffleFilter });
            const r = await fetch(`${API_BASE_URL}/admin/raffle?${q}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!r.ok) throw new Error('Failed to fetch raffle tickets for printing');
            const d = await r.json();
            const list = d.tickets || [];
            if (!list.length) {
                alert('No tickets found to print.');
                setIsPrintingRaffle(false);
                return;
            }

            setAllRaffleTicketsForPrint(list);

            // Wait for render
            await new Promise(r => setTimeout(r, 2000));

            const container = document.getElementById('raffle-print-container');
            if (!container) throw new Error('Ready container not found');

            const pages = container.querySelectorAll('.raffle-print-page');
            const pdf = new jsPDF('p', 'mm', 'a4');

            for (let i = 0; i < pages.length; i++) {
                if (i > 0) pdf.addPage();
                const url = await toPng(pages[i] as HTMLElement, {
                    pixelRatio: 1.5,
                    backgroundColor: '#ffffff'
                });
                pdf.addImage(url, 'PNG', 0, 0, 210, 297);
                setPrintProgress(Math.round(((i + 1) / pages.length) * 100));
            }

            pdf.save(`RWTW_Raffle_Tickets_All_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (e: any) {
            console.error(e);
            alert(e.message || 'Failed to generate PDF');
        } finally {
            setIsPrintingRaffle(false);
            setPrintProgress(0);
            setAllRaffleTicketsForPrint([]);
        }
    };
    const handleDownloadBibNumbers = async () => {
        try {
            setError(null);
            setIsPrintingBibs(true);

            // Fetch all registrations matching current filter (ignoring pagination)
            const q = new URLSearchParams({ limit: '5000', ...filter }); // Limit to 5000 to be safe
            const r = await fetch(`${API_BASE_URL}/admin/registrations?${q}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!r.ok) throw new Error('Failed to fetch registrations for printing');
            const d = await r.json();
            const list = d.registrations || [];
            if (!list.length) {
                alert('No registrations found to print.');
                setIsPrintingBibs(false);
                return;
            }

            setAllRegsForPrint(list);
            setPrintProgress(0);

            // Wait for render
            await new Promise(r => setTimeout(r, 2500));

            const container = document.getElementById('bib-print-container');
            if (!container) throw new Error('Ready container not found');

            const pages = container.querySelectorAll('.bib-a4-page');
            const pdf = new jsPDF('p', 'mm', 'a4');

            for (let i = 0; i < pages.length; i++) {
                if (i > 0) pdf.addPage();
                const url = await toPng(pages[i] as HTMLElement, {
                    pixelRatio: 1.5, // Slightly lower for bulk to avoid OOM
                    backgroundColor: '#ffffff'
                });
                pdf.addImage(url, 'PNG', 0, 0, 210, 297);
                setPrintProgress(Math.round(((i + 1) / pages.length) * 100));
            }

            pdf.save(`RWTW_Bib_Numbers_All_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (e: any) {
            console.error(e);
            alert(e.message || 'Failed to generate PDF');
        } finally {
            setIsPrintingBibs(false);
            setPrintProgress(0);
            setAllRegsForPrint([]);
        }
    };
    const getBibRegistrationData = (regsToUse: any[] = registrations) => {
        const data = regsToUse.map(reg => ({
            id: reg.id,
            firstName: reg.firstName,
            lastName: reg.lastName,
            category: reg.category,
            hexColor: pricingCategories.find(c => c.categoryName === reg.category && c.circuitId === reg.circuitId)?.hexColor || '#000000',
            circuitId: reg.circuitId
        }));

        // Client-side sorting
        return [...data].sort((a, b) => {
            if (sortBy === 'category') return a.category.localeCompare(b.category);
            if (sortBy === 'name') return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
            return a.id.localeCompare(b.id);
        });
    };
    const groupedCategories = pricingCategories.reduce((acc, cat) => { if (!acc[cat.circuitId]) acc[cat.circuitId] = []; acc[cat.circuitId].push(cat); return acc; }, {} as Record<string, any[]>);

    // ─── Derived stats from API ───────────────────────────────────────────────
    const d = dashboardData;
    const totalRevenue = d?.summary?.revenue ?? 0;
    const totalPaid = d?.summary?.registrations?.paid ?? 0;
    const totalRegs = d?.summary?.registrations?.total ?? 1;
    const convRate = totalRegs > 0 ? Math.round((totalPaid / totalRegs) * 100) : 0;
    const rafflePaid = d?.summary?.raffle?.paid ?? 0;
    const raffleRevenue = d?.summary?.raffle?.revenue ?? 0;
    const staleUnpaid = d?.summary?.pulse?.staleUnpaid ?? 0;
    const avgPerDay = d?.summary?.pulse?.avgPerDay ?? 0;

    // ─── Tooltip style ────────────────────────────────────────────────────────
    const ttStyle = { backgroundColor: dm ? '#0d1a0d' : '#ffffff', border: `1px solid ${dm ? '#2d6a2d' : '#d8d4cc'}`, borderRadius: 0, padding: '10px 14px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700 };

    const navItems: { id: ViewType; label: string; icon: any }[] = [
        { id: 'overview', label: 'Overview', icon: AiOutlineDashboard },
        { id: 'analytics', label: 'Analytics', icon: AiOutlineBarChart },
        { id: 'registrations', label: 'Registrations', icon: AiOutlineTeam },
        { id: 'payments', label: 'Payments', icon: AiOutlineDollar },
        { id: 'raffle', label: 'Raffle', icon: AiOutlineStar },
        { id: 'bibs', label: 'Bibs', icon: AiOutlinePrinter },
        { id: 'pricing', label: 'Pricing', icon: AiOutlineTable },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

                :root, .ad-dark {
                    --ad-bg:      #0a0a0a;
                    --ad-surface: #111111;
                    --ad-raised:  #161616;
                    --ad-border:  rgba(255,255,255,0.07);
                    --ad-border2: rgba(255,255,255,0.13);
                    --ad-t1:      #ffffff;
                    --ad-t2:      rgba(255,255,255,0.55);
                    --ad-t3:      rgba(255,255,255,0.28);
                    --ad-primary: #2d6a2d;
                    --ad-pl:      #4caf50;
                    --ad-accent:  #f59e0b;
                    --ad-red:     #ef4444;
                    --ad-sidebar: #0d1a0d;
                }
                .ad-light {
                    --ad-bg:      #f5f2eb;
                    --ad-surface: #ffffff;
                    --ad-raised:  #edeae2;
                    --ad-border:  rgba(0,0,0,0.09);
                    --ad-border2: rgba(0,0,0,0.15);
                    --ad-t1:      #111111;
                    --ad-t2:      rgba(20,20,20,0.58);
                    --ad-t3:      rgba(20,20,20,0.34);
                    --ad-primary: #2d6a2d;
                    --ad-pl:      #2d6a2d;
                    --ad-accent:  #b45309;
                    --ad-red:     #dc2626;
                    --ad-sidebar: #0d1a0d;
                }

                .ad-root { font-family: 'Barlow', sans-serif; background: var(--ad-bg); color: var(--ad-t1); min-height: 100vh; display: flex; flex-direction: column; transition: background 0.25s, color 0.25s; }

                /* Header */
                .ad-header { background: var(--ad-sidebar); border-bottom: 2px solid var(--ad-primary); padding: 0 32px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; flex-shrink: 0; }
                .ad-header-brand { display: flex; align-items: center; gap: 14px; }
                .ad-header-brand img { height: 32px; width: auto; object-fit: contain; }
                .ad-header-title { font-family: 'Barlow Condensed', sans-serif; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
                .ad-header-actions { display: flex; align-items: center; gap: 8px; }

                .ad-hbtn {
                    position: relative; overflow: hidden;
                    display: inline-flex; align-items: center; gap: 7px;
                    padding: 8px 18px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.72rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
                    border: none; cursor: pointer; transition: opacity 0.2s;
                    clip-path: polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px));
                }
                .ad-hbtn::before { content: ''; position: absolute; top: 0; left: -80%; width: 60%; height: 100%; background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.35) 50%, transparent 80%); transform: skewX(-20deg); }
                .ad-hbtn:hover::before { left: 140%; transition: left 0.5s cubic-bezier(0.25,0.46,0.45,0.94); }
                .ad-hbtn-primary { background: var(--ad-primary); color: #fff; }
                .ad-hbtn-ghost { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); }
                .ad-hbtn-icon { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.6); padding: 8px 10px; }

                /* Layout */
                .ad-body { display: flex; flex: 1; overflow: hidden; }

                /* Sidebar */
                .ad-sidebar { width: 220px; flex-shrink: 0; background: var(--ad-sidebar); border-right: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; padding: 20px 12px; gap: 2px; }
                .ad-nav-btn { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: none; background: transparent; cursor: pointer; width: 100%; text-align: left; font-family: 'Barlow Condensed', sans-serif; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.38); transition: color 0.2s, background 0.2s; position: relative; }
                .ad-nav-btn:hover { color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.04); }
                .ad-nav-btn.active { color: #ffffff; background: rgba(76,175,80,0.12); }
                .ad-nav-btn.active::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--ad-pl); }
                .ad-nav-icon { font-size: 1rem; opacity: 0.7; flex-shrink: 0; }
                .ad-nav-btn.active .ad-nav-icon { opacity: 1; }

                /* Main */
                .ad-main { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 32px; display: flex; flex-direction: column; gap: 24px; }

                /* Section header */
                .ad-section-head { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
                .ad-section-line { height: 1px; width: 36px; background: var(--ad-primary); flex-shrink: 0; }
                .ad-section-eyebrow { font-family: 'Barlow Condensed', sans-serif; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.26em; text-transform: uppercase; color: var(--ad-pl); }
                .ad-page-title { font-family: 'Bebas Neue', sans-serif; font-size: 2.4rem; letter-spacing: 0.04em; color: var(--ad-t1); line-height: 1; margin-bottom: 24px; }

                /* KPI cards */
                .ad-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; }
                @media (max-width: 1200px) { .ad-kpi-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 640px) { .ad-kpi-grid { grid-template-columns: 1fr; } }

                .ad-kpi {
                    background: var(--ad-surface);
                    border: 1px solid var(--ad-border);
                    padding: 24px 26px;
                    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%);
                    transition: border-color 0.2s;
                }
                .ad-kpi:hover { border-color: var(--ad-border2); }
                .ad-kpi-label { font-family: 'Barlow Condensed', sans-serif; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ad-t3); margin-bottom: 10px; }
                .ad-kpi-value { font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem; letter-spacing: 0.03em; color: var(--ad-t1); line-height: 1; margin-bottom: 6px; }
                .ad-kpi-value.green { color: var(--ad-pl); }
                .ad-kpi-value.amber { color: var(--ad-accent); }
                .ad-kpi-value.red { color: var(--ad-red); }
                .ad-kpi-trend { font-size: 0.72rem; color: var(--ad-t3); font-weight: 600; display: flex; align-items: center; gap: 4px; }
                .ad-kpi-trend.up { color: var(--ad-pl); }
                .ad-kpi-trend.down { color: var(--ad-red); }

                /* Panels */
                .ad-panel {
                    background: var(--ad-surface);
                    border: 1px solid var(--ad-border);
                    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);
                    overflow: hidden;
                }
                .ad-panel-head { padding: 20px 24px 16px; border-bottom: 1px solid var(--ad-border); display: flex; align-items: flex-end; justify-content: space-between; }
                .ad-panel-title { font-family: 'Barlow Condensed', sans-serif; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ad-t3); }
                .ad-panel-val { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; letter-spacing: 0.03em; color: var(--ad-t1); }
                .ad-panel-body { padding: 20px 24px; }

                /* Chart grid */
                .ad-chart-2 { display: grid; grid-template-columns: 2fr 1fr; gap: 2px; }
                .ad-chart-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
                .ad-chart-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; }
                @media (max-width: 1100px) { .ad-chart-2 { grid-template-columns: 1fr; } .ad-chart-3 { grid-template-columns: 1fr 1fr; } }
                @media (max-width: 640px) { .ad-chart-2, .ad-chart-3, .ad-chart-4 { grid-template-columns: 1fr; } }

                /* Conversion funnel */
                .ad-funnel-row { display: flex; align-items: center; gap: 14px; padding: 10px 0; border-bottom: 1px solid var(--ad-border); }
                .ad-funnel-row:last-child { border-bottom: none; }
                .ad-funnel-label { font-family: 'Barlow Condensed', sans-serif; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ad-t3); width: 80px; flex-shrink: 0; }
                .ad-funnel-bar-wrap { flex: 1; height: 6px; background: var(--ad-raised); overflow: hidden; }
                .ad-funnel-bar { height: 100%; background: var(--ad-pl); transition: width 1s ease; }
                .ad-funnel-count { font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; color: var(--ad-t1); width: 44px; text-align: right; flex-shrink: 0; }

                /* Table */
                .ad-table-wrap { overflow-x: auto; }
                .ad-table { width: 100%; border-collapse: collapse; min-width: 900px; }
                .ad-th { padding: 12px 18px; font-family: 'Barlow Condensed', sans-serif; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ad-t3); border-bottom: 1px solid var(--ad-border); text-align: left; white-space: nowrap; }
                .ad-td { padding: 13px 18px; font-size: 0.83rem; color: var(--ad-t2); border-bottom: 1px solid var(--ad-border); vertical-align: middle; }
                .ad-td:first-child { color: var(--ad-t1); font-weight: 600; }
                .ad-tr:hover .ad-td { background: rgba(255,255,255,0.02); }
                .ad-mono { font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; }

                /* Status badges */
                .ad-badge { display: inline-block; padding: 3px 10px; font-family: 'Barlow Condensed', sans-serif; font-size: 0.6rem; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; }
                .ad-badge-paid { background: rgba(76,175,80,0.12); color: var(--ad-pl); }
                .ad-badge-unpaid { background: rgba(245,158,11,0.12); color: var(--ad-accent); }
                .ad-badge-cancelled { background: rgba(239,68,68,0.1); color: var(--ad-red); }
                .ad-badge-pending { background: rgba(245,158,11,0.12); color: var(--ad-accent); }
                .ad-badge-confirmed { background: rgba(76,175,80,0.2); color: var(--ad-pl); }
                .ad-badge-failed { background: rgba(239,68,68,0.1); color: var(--ad-red); }

                /* Status select */
                .ad-status-select { font-family: 'Barlow Condensed', sans-serif; font-size: 0.6rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; padding: 3px 8px; border: 1px solid var(--ad-border); background: transparent; color: var(--ad-pl); cursor: pointer; outline: none; }

                /* Filters bar */
                .ad-filters { display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end; padding: 16px 20px; background: var(--ad-raised); border-bottom: 1px solid var(--ad-border); }
                .ad-filter-group { display: flex; flex-direction: column; gap: 5px; }
                .ad-filter-label { font-family: 'Barlow Condensed', sans-serif; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ad-t3); }
                .ad-input { background: var(--ad-surface); border: 1px solid var(--ad-border); color: var(--ad-t1); padding: 8px 12px; font-family: 'Barlow', sans-serif; font-size: 0.82rem; outline: none; transition: border-color 0.2s; min-width: 180px; }
                .ad-input:focus { border-color: var(--ad-pl); }
                .ad-select { background: var(--ad-surface); border: 1px solid var(--ad-border); color: var(--ad-t1); padding: 8px 12px; font-family: 'Barlow Condensed', sans-serif; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; outline: none; cursor: pointer; }
                .ad-search-wrap { position: relative; }
                .ad-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--ad-t3); font-size: 1rem; }
                .ad-search-wrap .ad-input { padding-left: 32px; }

                /* Pagination */
                .ad-pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid var(--ad-border); background: var(--ad-raised); }
                .ad-page-info { font-size: 0.75rem; color: var(--ad-t3); font-family: 'Barlow Condensed', sans-serif; font-weight: 600; letter-spacing: 0.08em; }
                .ad-page-btns { display: flex; align-items: center; gap: 6px; }
                .ad-page-btn { padding: 6px 14px; font-family: 'Barlow Condensed', sans-serif; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; border: 1px solid var(--ad-border); background: transparent; color: var(--ad-t2); cursor: pointer; transition: border-color 0.2s, color 0.2s; display: flex; align-items: center; gap: 5px; }
                .ad-page-btn:hover:not(:disabled) { border-color: var(--ad-pl); color: var(--ad-pl); }
                .ad-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
                .ad-page-cur { padding: 6px 14px; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--ad-t3); background: var(--ad-raised); border: 1px solid var(--ad-border); }

                /* Activity feed */
                .ad-feed { display: flex; flex-direction: column; gap: 0; max-height: 340px; overflow-y: auto; }
                .ad-feed-item { display: flex; align-items: flex-start; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--ad-border); }
                .ad-feed-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
                .ad-feed-title { font-size: 0.83rem; font-weight: 600; color: var(--ad-t1); margin-bottom: 2px; }
                .ad-feed-sub { font-family: 'Barlow Condensed', sans-serif; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ad-t3); }

                /* Error */
                .ad-error { padding: 14px 18px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.3); border-left: 3px solid var(--ad-red); display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--ad-red); }

                /* Side panel */
                .ad-drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 200; }
                .ad-drawer { position: fixed; top: 0; right: 0; width: 380px; height: 100%; background: var(--ad-surface); border-left: 1px solid var(--ad-border2); z-index: 201; overflow-y: auto; display: flex; flex-direction: column; }
                .ad-drawer-head { padding: 22px 24px; border-bottom: 2px solid var(--ad-primary); background: var(--ad-sidebar); display: flex; align-items: center; justify-content: space-between; }
                .ad-drawer-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; letter-spacing: 0.06em; color: #fff; }
                .ad-drawer-close { background: rgba(255,255,255,0.07); border: none; color: rgba(255,255,255,0.5); width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: background 0.2s; }
                .ad-drawer-close:hover { background: rgba(255,255,255,0.14); }
                .ad-drawer-body { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 18px; }
                .ad-drawer-field-label { font-family: 'Barlow Condensed', sans-serif; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ad-t3); margin-bottom: 4px; }
                .ad-drawer-field-val { font-size: 0.88rem; color: var(--ad-t1); font-weight: 600; }
                .ad-drawer-actions { padding: 20px 24px; border-top: 1px solid var(--ad-border); display: flex; flex-direction: column; gap: 8px; }
                .ad-drawer-link-primary { display: block; text-align: center; padding: 13px; background: var(--ad-primary); color: #fff; font-family: 'Barlow Condensed', sans-serif; font-size: 0.82rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; transition: background 0.2s; }
                .ad-drawer-link-primary:hover { background: #1e4d1e; }
                .ad-drawer-link-ghost { display: block; text-align: center; padding: 12px; border: 1px solid var(--ad-border2); color: var(--ad-t2); font-family: 'Barlow Condensed', sans-serif; font-size: 0.82rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; transition: border-color 0.2s; }
                .ad-drawer-link-ghost:hover { border-color: var(--ad-pl); }

                /* Gender bars */
                .ad-gender-bar-wrap { height: 4px; background: var(--ad-raised); overflow: hidden; margin-top: 4px; }
                .ad-gender-bar { height: 100%; transition: width 1s ease; }

                /* Pie legend */
                .ad-pie-legend { display: flex; flex-direction: column; gap: 8px; }
                .ad-pie-legend-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
                .ad-pie-legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
                .ad-pie-legend-label { font-family: 'Barlow Condensed', sans-serif; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ad-t2); flex: 1; }
                .ad-pie-legend-val { font-family: 'Bebas Neue', sans-serif; font-size: 1rem; color: var(--ad-t1); }

                /* Insight card */
                .ad-insight { background: rgba(76,175,80,0.06); border: 1px solid rgba(76,175,80,0.15); border-left: 3px solid var(--ad-pl); padding: 14px 16px; font-size: 0.8rem; color: var(--ad-t2); line-height: 1.55; }
                .ad-insight strong { color: var(--ad-pl); }

                /* Stale alert */
                .ad-stale { background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.2); border-left: 3px solid var(--ad-red); padding: 18px 20px; }
                .ad-stale-num { font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; color: var(--ad-red); line-height: 1; }
                .ad-stale-desc { font-size: 0.78rem; color: var(--ad-t3); margin-top: 4px; line-height: 1.5; }
                .ad-stale-btn { margin-top: 14px; width: 100%; padding: 10px; background: var(--ad-red); border: none; color: #fff; font-family: 'Barlow Condensed', sans-serif; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; }
                .ad-stale-btn:hover { opacity: 0.85; }

                /* Scrollbar */
                .ad-main::-webkit-scrollbar { width: 4px; } .ad-main::-webkit-scrollbar-track { background: transparent; } .ad-main::-webkit-scrollbar-thumb { background: var(--ad-border2); }
                .ad-feed::-webkit-scrollbar { width: 3px; } .ad-feed::-webkit-scrollbar-thumb { background: var(--ad-border2); }
                .ad-drawer::-webkit-scrollbar { width: 3px; } .ad-drawer::-webkit-scrollbar-thumb { background: var(--ad-border2); }
            `}</style>

            <div className={`ad-root ${dm ? 'ad-dark' : 'ad-light'}`}>

                {/* ── Header ── */}
                <header className="ad-header">
                    <div className="ad-header-brand">
                        <img src={logo} alt="RWTW" />
                        <span className="ad-header-title">Admin Workspace &mdash; {admin?.name}</span>
                    </div>
                    <div className="ad-header-actions">
                        {activeView === 'registrations' && (
                            <>
                                <button className="ad-hbtn ad-hbtn-ghost" onClick={handleDownloadBibNumbers} disabled={isPrintingBibs}>
                                    <AiOutlinePrinter /> {isPrintingBibs ? 'Generating…' : 'Bibs PDF'}
                                </button>
                                <button className="ad-hbtn ad-hbtn-primary" onClick={handleExport}>
                                    <AiOutlineTable /> Export Excel
                                </button>
                            </>
                        )}
                        {activeView === 'payments' && (
                            <>
                                <button className="ad-hbtn ad-hbtn-ghost" onClick={() => handleExportPayments('csv')}>Export CSV</button>
                                <button className="ad-hbtn ad-hbtn-primary" onClick={() => handleExportPayments('excel')}><AiOutlineTable /> Export Excel</button>
                            </>
                        )}
                        <button className="ad-hbtn ad-hbtn-icon" onClick={() => setIsDarkMode(!dm)} title="Toggle theme">
                            {dm ? <AiOutlineSun /> : <AiOutlineMoon />}
                        </button>
                        <button className="ad-hbtn ad-hbtn-ghost" onClick={onLogout}>Sign Out</button>
                    </div>
                </header>

                <div className="ad-body">
                    {/* ── Sidebar ── */}
                    <aside className="ad-sidebar">
                        {navItems.map(({ id, label, icon: Icon }) => (
                            <button key={id} className={`ad-nav-btn${activeView === id ? ' active' : ''}`} onClick={() => setActiveView(id)}>
                                <Icon className="ad-nav-icon" /> {label}
                            </button>
                        ))}
                    </aside>

                    {/* ── Main ── */}
                    <main className="ad-main">

                        {error && (
                            <div className="ad-error">
                                <AiOutlineExclamationCircle />
                                <span>{error}</span>
                                <button style={{ marginLeft: 'auto', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setError(null); if (activeView === 'overview') fetchDashboardStats(); else if (activeView === 'registrations') fetchData(); }}>Retry</button>
                            </div>
                        )}

                        {/* ═══════════════════════════════════════════ OVERVIEW ══ */}
                        {activeView === 'overview' && (
                            <>
                                <div>
                                    <div className="ad-section-head"><div className="ad-section-line" /><span className="ad-section-eyebrow">Command View</span></div>
                                    <div className="ad-page-title">Mission Overview</div>
                                </div>

                                {/* KPIs */}
                                <div className="ad-kpi-grid">
                                    <div className="ad-kpi">
                                        <div className="ad-kpi-label">Gross Revenue</div>
                                        <div className="ad-kpi-value green">KES {totalRevenue.toLocaleString()}</div>
                                        <div className="ad-kpi-trend up"><AiOutlineArrowUp /> Includes Raffle</div>
                                    </div>
                                    <div className="ad-kpi">
                                        <div className="ad-kpi-label">Confirmed Entries</div>
                                        <div className="ad-kpi-value">{totalPaid}</div>
                                        <div className="ad-kpi-trend up"><AiOutlineArrowUp /> {totalRegs} total attempts</div>
                                    </div>
                                    <div className="ad-kpi">
                                        <div className="ad-kpi-label">Raffle Tickets Sold</div>
                                        <div className="ad-kpi-value amber">{rafflePaid}</div>
                                        <div className="ad-kpi-trend">KES {raffleRevenue.toLocaleString()} revenue</div>
                                    </div>
                                    <div className="ad-kpi">
                                        <div className="ad-kpi-label">Needs Attention</div>
                                        <div className="ad-kpi-value red">{staleUnpaid}</div>
                                        <div className="ad-kpi-trend down"><AiOutlineArrowDown /> Unpaid &gt; 48 hours</div>
                                    </div>
                                </div>

                                {/* Revenue chart + funnel */}
                                <div className="ad-chart-2">
                                    <div className="ad-panel">
                                        <div className="ad-panel-head">
                                            <div>
                                                <div className="ad-panel-title">Daily Revenue</div>
                                                <div className="ad-panel-val">KES {totalRevenue.toLocaleString()}</div>
                                            </div>
                                            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ad-pl)' }}>30-day window</span>
                                        </div>
                                        <div className="ad-panel-body">
                                            <ResponsiveContainer width="100%" height={240}>
                                                <AreaChart data={d?.dailyStats || []}>
                                                    <defs>
                                                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#4caf50" stopOpacity={0.22} />
                                                            <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="var(--ad-border)" />
                                                    <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fill: 'var(--ad-t3)' }} axisLine={false} tickLine={false} interval={4} />
                                                    <YAxis tick={{ fontSize: 10, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fill: 'var(--ad-t3)' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
                                                    <Tooltip contentStyle={ttStyle} />
                                                    <Area type="monotone" dataKey="revenue" stroke="#4caf50" strokeWidth={2} fill="url(#revGrad)" dot={false} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="ad-panel">
                                        <div className="ad-panel-head">
                                            <div>
                                                <div className="ad-panel-title">Conversion Funnel</div>
                                                <div className="ad-panel-val">{convRate}%</div>
                                            </div>
                                        </div>
                                        <div className="ad-panel-body">
                                            {(d?.financials?.conversionFunnel || []).map((row: any, i: number) => (
                                                <div key={row.label} className="ad-funnel-row">
                                                    <span className="ad-funnel-label">{row.label}</span>
                                                    <div className="ad-funnel-bar-wrap">
                                                        <div className="ad-funnel-bar" style={{ width: `${i === 0 ? 100 : Math.round((row.count / (d?.financials?.conversionFunnel[0].count || 1)) * 100)}%` }} />
                                                    </div>
                                                    <span className="ad-funnel-count">{row.count}</span>
                                                </div>
                                            ))}
                                            <div className="ad-insight" style={{ marginTop: 16 }}>
                                                <strong>{convRate}%</strong> of registrations convert to confirmed paid entries. The biggest drop is at payment.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Circuit + T-shirt + Gender */}
                                <div className="ad-chart-3">
                                    <div className="ad-panel">
                                        <div className="ad-panel-head"><div className="ad-panel-title">Circuit Distribution</div></div>
                                        <div className="ad-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                            <div style={{ marginBottom: 16 }}>
                                                <ResponsiveContainer width="100%" height={160}>
                                                    <PieChart>
                                                        <Pie data={d?.byCircuit || []} dataKey="value" cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={4} startAngle={90} endAngle={-270}>
                                                            {(d?.byCircuit || []).map((c: any, i: number) => <Cell key={i} fill={c.color} stroke="none" />)}
                                                        </Pie>
                                                        <Tooltip contentStyle={ttStyle} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="ad-pie-legend">
                                                {(d?.byCircuit || []).map((c: any) => (
                                                    <div key={c.name} className="ad-pie-legend-row">
                                                        <div className="ad-pie-legend-dot" style={{ background: c.color }} />
                                                        <span className="ad-pie-legend-label">{c.name}</span>
                                                        <span className="ad-pie-legend-val">{c.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ad-panel">
                                        <div className="ad-panel-head"><div className="ad-panel-title">T-Shirt Sizes</div></div>
                                        <div className="ad-panel-body">
                                            <ResponsiveContainer width="100%" height={210}>
                                                <BarChart data={d?.demographics?.tshirtBreakdown || []} layout="vertical" margin={{ left: 0, right: 10 }}>
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="size" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fill: 'var(--ad-t3)', letterSpacing: '0.1em' }} />
                                                    <Tooltip contentStyle={ttStyle} />
                                                    <Bar dataKey="count" fill="var(--ad-pl)" barSize={8} radius={0} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="ad-panel">
                                        <div className="ad-panel-head"><div className="ad-panel-title">Gender Split</div></div>
                                        <div className="ad-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                            {(d?.demographics?.genderBreakdown || []).map((g: any) => (
                                                <div key={g.label}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ad-t3)' }}>{g.label}</span>
                                                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: 'var(--ad-t1)' }}>{g.count}</span>
                                                    </div>
                                                    <div className="ad-gender-bar-wrap">
                                                        <div className="ad-gender-bar" style={{ width: `${g.pct}%`, background: g.color }} />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="ad-insight" style={{ marginTop: 8 }}>
                                                Minimum lady-per-team rules are on track. <strong>Female participation at {d?.demographics?.genderBreakdown?.find((g: any) => g.label === 'Female')?.pct || 0}%</strong>.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Activity + Stale alert */}
                                <div className="ad-chart-2">
                                    <div className="ad-panel">
                                        <div className="ad-panel-head">
                                            <div className="ad-panel-title">Recent Activity Stream</div>
                                            <AiOutlineHistory style={{ color: 'var(--ad-t3)', fontSize: '1.1rem' }} />
                                        </div>
                                        <div className="ad-panel-body">
                                            <div className="ad-feed">
                                                {(d?.activityFeed || []).map((item: any, i: number) => (
                                                    <div key={i} className="ad-feed-item">
                                                        <div className="ad-feed-dot" style={{ background: item.type === 'PAYMENT' ? 'var(--ad-pl)' : item.type === 'REGISTRATION' ? 'var(--ad-accent)' : '#38bdf8' }} />
                                                        <div style={{ flex: 1 }}>
                                                            <div className="ad-feed-title">{item.title}</div>
                                                            <div className="ad-feed-sub">{item.subtitle} · {formatDate(item.date)}</div>
                                                        </div>
                                                        <span className={`ad-badge ${item.status === 'PAID' || item.status === 'CONFIRMED' ? 'ad-badge-paid' : 'ad-badge-unpaid'}`}>{item.status}</span>
                                                    </div>
                                                ))}
                                                {(!d?.activityFeed || d.activityFeed.length === 0) && (
                                                    <div className="ad-feed-sub" style={{ padding: '20px 0', textAlign: 'center' }}>No recent activity</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ad-panel">
                                        <div className="ad-panel-head"><div className="ad-panel-title">Action Required</div></div>
                                        <div className="ad-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                            <div className="ad-stale">
                                                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ad-red)', marginBottom: 4 }}>Stale Unpaid</div>
                                                <div className="ad-stale-num">{staleUnpaid}</div>
                                                <div className="ad-stale-desc">Entries stuck in UNPAID for over 48 hours. Consider automated follow-up email.</div>
                                                <button className="ad-stale-btn" onClick={() => { setFilter({ ...filter, status: 'UNPAID' }); setActiveView('registrations'); }}>Review Now &rarr;</button>
                                            </div>
                                            <div className="ad-insight">
                                                <strong>Raffle draw</strong> is scheduled for 05 Jul 2026. <strong>{rafflePaid} tickets sold</strong> — target is 300.
                                            </div>
                                            <div className="ad-insight">
                                                <strong>Registration Pace</strong> is at <strong>{avgPerDay} per day</strong> average over the last 30 days.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ════════════════════════════════════════════ ANALYTICS ══ */}
                        {activeView === 'analytics' && (
                            <>
                                <div>
                                    <div className="ad-section-head"><div className="ad-section-line" /><span className="ad-section-eyebrow">Deep Dive</span></div>
                                    <div className="ad-page-title">Granular Analytics</div>
                                </div>

                                {/* Registrations + Payments dual line */}
                                <div className="ad-panel">
                                    <div className="ad-panel-head">
                                        <div>
                                            <div className="ad-panel-title">Registrations vs Paid — 30 Day</div>
                                            <div className="ad-panel-val">Daily volume comparison</div>
                                        </div>
                                    </div>
                                    <div className="ad-panel-body">
                                        <ResponsiveContainer width="100%" height={280}>
                                            <ComposedChart data={d?.dailyStats || []}>
                                                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="var(--ad-border)" />
                                                <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fill: 'var(--ad-t3)' }} axisLine={false} tickLine={false} interval={4} />
                                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fill: 'var(--ad-t3)' }} />
                                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fill: 'var(--ad-t3)' }} tickFormatter={v => `${v / 1000}k`} />
                                                <Tooltip contentStyle={ttStyle} />
                                                <Legend wrapperStyle={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }} />
                                                <Bar yAxisId="left" dataKey="registrations" fill="rgba(76,175,80,0.25)" barSize={12} radius={0} name="Registrations" />
                                                <Line yAxisId="left" type="monotone" dataKey="paid" stroke="#4caf50" strokeWidth={2} dot={false} name="Paid" />
                                                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} dot={false} name="Revenue (KES)" strokeDasharray="4 2" />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Status trend + Hourly heatmap */}
                                <div className="ad-chart-2">
                                    <div className="ad-panel">
                                        <div className="ad-panel-head"><div className="ad-panel-title">Status Breakdown — 14 Day</div></div>
                                        <div className="ad-panel-body">
                                            <ResponsiveContainer width="100%" height={220}>
                                                <AreaChart data={d?.statusTrend || []}>
                                                    <defs>
                                                        <linearGradient id="gPaid" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4caf50" stopOpacity={0.2} /><stop offset="95%" stopColor="#4caf50" stopOpacity={0} /></linearGradient>
                                                        <linearGradient id="gUnpaid" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="var(--ad-border)" />
                                                    <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fill: 'var(--ad-t3)' }} axisLine={false} tickLine={false} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fill: 'var(--ad-t3)' }} />
                                                    <Tooltip contentStyle={ttStyle} />
                                                    <Legend wrapperStyle={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }} />
                                                    <Area type="monotone" dataKey="paid" stroke="#4caf50" strokeWidth={2} fill="url(#gPaid)" dot={false} name="Paid" />
                                                    <Area type="monotone" dataKey="unpaid" stroke="#f59e0b" strokeWidth={2} fill="url(#gUnpaid)" dot={false} name="Unpaid" />
                                                    <Area type="monotone" dataKey="cancelled" stroke="#ef4444" strokeWidth={1.5} fill="none" dot={false} name="Cancelled" strokeDasharray="3 3" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="ad-panel">
                                        <div className="ad-panel-head"><div className="ad-panel-title">Hourly Registration Intensity</div></div>
                                        <div className="ad-panel-body">
                                            <ResponsiveContainer width="100%" height={220}>
                                                <BarChart data={d?.hourlyIntensity || []}>
                                                    <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="var(--ad-border)" />
                                                    <XAxis dataKey="hour" tick={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fill: 'var(--ad-t3)' }} axisLine={false} tickLine={false} interval={3} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fill: 'var(--ad-t3)' }} />
                                                    <Tooltip contentStyle={ttStyle} />
                                                    <Bar dataKey="registrations" radius={0} barSize={8}>
                                                        {(d?.hourlyIntensity || []).map((entry: any, i: number) => (
                                                            <Cell key={i} fill={entry.registrations > 12 ? '#4caf50' : entry.registrations > 6 ? 'rgba(76,175,80,0.5)' : 'rgba(76,175,80,0.18)'} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                            <div className="ad-insight" style={{ marginTop: 12 }}>Distribution of registrations by hour of day (all-time history).</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Age + Circuit per-day + Raffle pace */}
                                <div className="ad-chart-3">
                                    <div className="ad-panel">
                                        <div className="ad-panel-head"><div className="ad-panel-title">Age Distribution</div></div>
                                        <div className="ad-panel-body">
                                            <ResponsiveContainer width="100%" height={200}>
                                                <BarChart data={d?.ageDistribution || []}>
                                                    <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="var(--ad-border)" />
                                                    <XAxis dataKey="band" tick={{ fontSize: 10, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fill: 'var(--ad-t3)' }} axisLine={false} tickLine={false} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fill: 'var(--ad-t3)' }} />
                                                    <Tooltip contentStyle={ttStyle} />
                                                    <Bar dataKey="count" fill="var(--ad-pl)" barSize={20} radius={0} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                            <div className="ad-insight" style={{ marginTop: 12 }}>Age demographic based on provided Date of Birth records.</div>
                                        </div>
                                    </div>

                                    <div className="ad-panel">
                                        <div className="ad-panel-head"><div className="ad-panel-title">Revenue by Circuit</div></div>
                                        <div className="ad-panel-body">
                                            <ResponsiveContainer width="100%" height={200}>
                                                <BarChart data={d?.revenueByCircuit || []} layout="vertical">
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fill: 'var(--ad-t3)' }} width={90} />
                                                    <Tooltip contentStyle={ttStyle} formatter={(v: any) => `KES ${Number(v).toLocaleString()}`} />
                                                    <Bar dataKey="value" barSize={10} radius={0}>
                                                        {(d?.revenueByCircuit || []).map((c: any, i: number) => <Cell key={i} fill={c.color} />)}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="ad-panel">
                                        <div className="ad-panel-head">
                                            <div>
                                                <div className="ad-panel-title">Raffle Ticket Pace</div>
                                                <div className="ad-panel-val">{rafflePaid} / 300</div>
                                            </div>
                                        </div>
                                        <div className="ad-panel-body">
                                            <div style={{ marginBottom: 16 }}>
                                                <div style={{ height: 8, background: 'var(--ad-raised)', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${Math.min(100, (rafflePaid / 300) * 100)}%`, background: 'var(--ad-accent)', transition: 'width 1s' }} />
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ad-t3)' }}>
                                                    <span>0</span><span style={{ color: 'var(--ad-accent)' }}>{Math.round((rafflePaid / 300) * 100)}%</span><span>300</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                {[
                                                    { l: 'Paid Tickets', v: rafflePaid },
                                                    { l: 'Unpaid Tickets', v: (d?.summary?.raffle?.total || 0) - rafflePaid },
                                                    { l: 'Target', v: 300 },
                                                    { l: 'Total Revenue', v: `KES ${raffleRevenue.toLocaleString()}` }
                                                ].map(r => (
                                                    <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--ad-border)', paddingBottom: 8 }}>
                                                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ad-t3)' }}>{r.l}</span>
                                                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: 'var(--ad-t1)' }}>{r.v}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ════════════════════════════════════════ REGISTRATIONS ══ */}
                        {activeView === 'registrations' && (
                            <>
                                <div>
                                    <div className="ad-section-head"><div className="ad-section-line" /><span className="ad-section-eyebrow">Participants</span></div>
                                    <div className="ad-page-title">Registrations</div>
                                </div>

                                {/* Mini KPIs */}
                                {stats && (
                                    <div className="ad-kpi-grid">
                                        {[
                                            { label: 'Total', val: stats.summary.total, cls: '' },
                                            { label: 'Paid', val: stats.summary.paid, cls: 'green' },
                                            { label: 'Unpaid', val: stats.summary.unpaid, cls: 'amber' },
                                            { label: 'Revenue', val: `KES ${Number(stats.summary.revenue || 0).toLocaleString()}`, cls: 'green' },
                                        ].map(k => (
                                            <div key={k.label} className="ad-kpi">
                                                <div className="ad-kpi-label">{k.label}</div>
                                                <div className={`ad-kpi-value ${k.cls}`}>{k.val}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Table panel */}
                                <div className="ad-panel">
                                    {/* Filters */}
                                    <div className="ad-filters">
                                        <div className="ad-filter-group" style={{ flex: 1, minWidth: 200 }}>
                                            <label className="ad-filter-label">Search</label>
                                            <div className="ad-search-wrap">
                                                <AiOutlineSearch className="ad-search-icon" />
                                                <input className="ad-input" type="text" value={filter.search} onChange={e => setFilter({ ...filter, search: e.target.value })} placeholder="Name, team or ID…" />
                                            </div>
                                        </div>
                                        <div className="ad-filter-group">
                                            <label className="ad-filter-label">Circuit</label>
                                            <select className="ad-select" value={filter.circuitId} onChange={e => setFilter({ ...filter, circuitId: e.target.value })}>
                                                <option value="">All Circuits</option>
                                                {CIRCUITS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                            </select>
                                        </div>
                                        <div className="ad-filter-group">
                                            <label className="ad-filter-label">Status</label>
                                            <select className="ad-select" value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
                                                <option value="">All</option>
                                                <option value="UNPAID">Unpaid</option>
                                                <option value="PAID">Paid</option>
                                                <option value="CONFIRMED">Confirmed</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <div className="ad-table-wrap">
                                        <table className="ad-table">
                                            <thead>
                                                <tr>
                                                    {['Pass ID', 'Participant', 'Circuit / Category', 'Amount', 'Status', 'Registered', 'Actions'].map(h => (
                                                        <th key={h} className="ad-th">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loading && registrations.length === 0 ? (
                                                    <tr><td className="ad-td" colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>Loading…</td></tr>
                                                ) : registrations.length === 0 ? (
                                                    <tr><td className="ad-td" colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>No registrations found.</td></tr>
                                                ) : registrations.map(reg => (
                                                    <tr key={reg.id} className="ad-tr">
                                                        <td className="ad-td ad-mono">{reg.id}</td>
                                                        <td className="ad-td">
                                                            <div style={{ fontWeight: 700, color: 'var(--ad-t1)' }}>{cap(reg.firstName)} {cap(reg.lastName)}</div>
                                                            {reg.teamName && <div style={{ fontSize: '0.72rem', color: 'var(--ad-t3)', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>Team: {reg.teamName}</div>}
                                                        </td>
                                                        <td className="ad-td">
                                                            <div style={{ fontWeight: 700, color: 'var(--ad-t1)', fontSize: '0.8rem' }}>{reg.category || 'Rider'}</div>
                                                            <div style={{ fontSize: '0.65rem', color: 'var(--ad-t3)', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}>{reg.circuitId?.toUpperCase()}</div>
                                                        </td>
                                                        <td className="ad-td" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: 'var(--ad-pl)' }}>KES {(reg.totalAmount ?? 0).toLocaleString()}</td>
                                                        <td className="ad-td">
                                                            <select className="ad-status-select" value={reg.status} onChange={e => handleStatusUpdate(reg.id, e.target.value)}
                                                                style={{ color: reg.status === 'PAID' || reg.status === 'CONFIRMED' ? 'var(--ad-pl)' : reg.status === 'CANCELLED' ? 'var(--ad-red)' : 'var(--ad-accent)' }}>
                                                                <option value="UNPAID">UNPAID</option>
                                                                <option value="PAID">PAID</option>
                                                                <option value="CONFIRMED">CONFIRMED</option>
                                                                <option value="CANCELLED">CANCELLED</option>
                                                            </select>
                                                        </td>
                                                        <td className="ad-td ad-mono" style={{ fontSize: '0.72rem' }}>{formatDate(reg.createdAt)}</td>
                                                        <td className="ad-td" style={{ textAlign: 'right' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                                                                <button onClick={() => { setSelectedRegistration(reg); setIsDetailsOpen(true); }} style={{ background: 'none', border: '1px solid var(--ad-border)', color: 'var(--ad-t3)', padding: '5px 8px', cursor: 'pointer', fontSize: '0.95rem', transition: 'border-color 0.2s, color 0.2s' }} title="View" onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--ad-pl)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ad-pl)'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--ad-border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ad-t3)'; }}>
                                                                    <AiOutlineEye />
                                                                </button>
                                                                <button onClick={() => handleDelete(reg.id)} style={{ background: 'none', border: '1px solid var(--ad-border)', color: 'var(--ad-t3)', padding: '5px 8px', cursor: 'pointer', fontSize: '0.95rem', transition: 'border-color 0.2s, color 0.2s' }} title="Delete" onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--ad-red)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ad-red)'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--ad-border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ad-t3)'; }}>
                                                                    <AiOutlineDelete />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="ad-pagination">
                                        <span className="ad-page-info">Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</span>
                                        <div className="ad-page-btns">
                                            <button className="ad-page-btn" onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))} disabled={pagination.page === 1}><AiOutlineLeft /> Prev</button>
                                            <span className="ad-page-cur">Page {pagination.page} / {pagination.pages}</span>
                                            <button className="ad-page-btn" onClick={() => setPagination(p => ({ ...p, page: Math.min(p.pages, p.page + 1) }))} disabled={pagination.page === pagination.pages}>Next <AiOutlineRight /></button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ═══════════════════════════════════════════ PAYMENTS ══ */}
                        {activeView === 'payments' && (
                            <>
                                <div>
                                    <div className="ad-section-head"><div className="ad-section-line" /><span className="ad-section-eyebrow">Transactions</span></div>
                                    <div className="ad-page-title">Payments</div>
                                </div>
                                {paymentsStats?.summary && (
                                    <div className="ad-kpi-grid">
                                        {[
                                            { label: 'Total', val: paymentsStats.summary.total, cls: '' },
                                            { label: 'Paid', val: paymentsStats.summary.paid, cls: 'green' },
                                            { label: 'Failed', val: paymentsStats.summary.failed, cls: 'red' },
                                            { label: 'Revenue', val: `KES ${Number(paymentsStats.summary.revenue || 0).toLocaleString()}`, cls: 'green' },
                                        ].map(k => (
                                            <div key={k.label} className="ad-kpi"><div className="ad-kpi-label">{k.label}</div><div className={`ad-kpi-value ${k.cls}`}>{k.val}</div></div>
                                        ))}
                                    </div>
                                )}
                                <div className="ad-panel">
                                    <div className="ad-filters">
                                        <div className="ad-filter-group" style={{ flex: 1, minWidth: 200 }}>
                                            <label className="ad-filter-label">Search</label>
                                            <div className="ad-search-wrap">
                                                <AiOutlineSearch className="ad-search-icon" />
                                                <input className="ad-input" type="text" value={paymentsFilter.search} onChange={e => setPaymentsFilter({ ...paymentsFilter, search: e.target.value })} placeholder="Transaction code or phone…" />
                                            </div>
                                        </div>
                                        <div className="ad-filter-group">
                                            <label className="ad-filter-label">Status</label>
                                            <select className="ad-select" value={paymentsFilter.status} onChange={e => setPaymentsFilter({ ...paymentsFilter, status: e.target.value })}>
                                                <option value="">All</option><option value="PAID">Paid</option><option value="PENDING">Pending</option><option value="FAILED">Failed</option>
                                            </select>
                                        </div>
                                        <div className="ad-filter-group">
                                            <label className="ad-filter-label">From</label>
                                            <input className="ad-input" type="date" value={paymentsFilter.dateFrom} onChange={e => setPaymentsFilter({ ...paymentsFilter, dateFrom: e.target.value })} style={{ minWidth: 130 }} />
                                        </div>
                                        <div className="ad-filter-group">
                                            <label className="ad-filter-label">To</label>
                                            <input className="ad-input" type="date" value={paymentsFilter.dateTo} onChange={e => setPaymentsFilter({ ...paymentsFilter, dateTo: e.target.value })} style={{ minWidth: 130 }} />
                                        </div>
                                    </div>
                                    <div className="ad-table-wrap">
                                        <table className="ad-table">
                                            <thead><tr>{['Transaction Code', 'Phone', 'Amount', 'Status', 'Timestamp', 'Registration ID', 'Link'].map(h => <th key={h} className="ad-th">{h}</th>)}</tr></thead>
                                            <tbody>
                                                {loading && payments.length === 0 ? <tr><td className="ad-td" colSpan={7} style={{ textAlign: 'center', padding: 40 }}>Loading…</td></tr>
                                                    : payments.length === 0 ? <tr><td className="ad-td" colSpan={7} style={{ textAlign: 'center', padding: 40 }}>No payments found.</td></tr>
                                                        : payments.map((p: any) => (
                                                            <tr key={p.id} className="ad-tr">
                                                                <td className="ad-td ad-mono">{p.mpesaReceiptNumber || '—'}</td>
                                                                <td className="ad-td">{p.phone || '—'}</td>
                                                                <td className="ad-td" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: 'var(--ad-pl)' }}>KES {(p.amount || 0).toLocaleString()}</td>
                                                                <td className="ad-td"><span className={`ad-badge ad-badge-${p.status.toLowerCase()}`}>{p.status}</span></td>
                                                                <td className="ad-td ad-mono" style={{ fontSize: '0.72rem' }}>{p.transactionDate ? String(p.transactionDate).slice(0, 8) : formatDate(p.createdAt)}</td>
                                                                <td className="ad-td ad-mono">{p.registrationId}</td>
                                                                <td className="ad-td"><a href={`/profile/${p.registrationId}`} target="_blank" rel="noreferrer" style={{ color: 'var(--ad-pl)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>View &rarr;</a></td>
                                                            </tr>
                                                        ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="ad-pagination">
                                        <span className="ad-page-info">Showing {(paymentsPagination.page - 1) * paymentsPagination.limit + 1}–{Math.min(paymentsPagination.page * paymentsPagination.limit, paymentsPagination.total)} of {paymentsPagination.total}</span>
                                        <div className="ad-page-btns">
                                            <button className="ad-page-btn" onClick={() => setPaymentsPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))} disabled={paymentsPagination.page === 1}><AiOutlineLeft /> Prev</button>
                                            <span className="ad-page-cur">Page {paymentsPagination.page} / {paymentsPagination.pages}</span>
                                            <button className="ad-page-btn" onClick={() => setPaymentsPagination(p => ({ ...p, page: Math.min(p.pages, p.page + 1) }))} disabled={paymentsPagination.page === paymentsPagination.pages}>Next <AiOutlineRight /></button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ══════════════════════════════════════════════ RAFFLE ══ */}
                        {activeView === 'raffle' && (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
                                    <div>
                                        <div className="ad-section-head"><div className="ad-section-line" /><span className="ad-section-eyebrow">Raffle System</span></div>
                                        <div className="ad-page-title">Digital Tickets (3 per row)</div>
                                    </div>
                                    <div style={{ marginBottom: 24 }}>
                                        <button className="ad-hbtn ad-hbtn-primary" onClick={handleDownloadRaffleTickets} disabled={isPrintingRaffle}>
                                            <AiOutlineDownload /> {isPrintingRaffle ? `Generating... ${printProgress}%` : 'Generate Tickets (A4 PDF)'}
                                        </button>
                                    </div>
                                </div>

                                <div className="ad-panel" style={{ padding: '0 24px' }}>
                                    <div className="ad-filters" style={{ borderBottom: 'none' }}>
                                        <div className="ad-filter-group" style={{ flex: 1 }}>
                                            <label className="ad-filter-label">Search</label>
                                            <div className="ad-search-wrap">
                                                <AiOutlineSearch className="ad-search-icon" />
                                                <input className="ad-input" type="text" value={raffleFilter.search} onChange={e => setRaffleFilter({ ...raffleFilter, search: e.target.value })} placeholder="Ticket code or name…" />
                                            </div>
                                        </div>
                                        <div className="ad-filter-group">
                                            <label className="ad-filter-label">Status</label>
                                            <select className="ad-select" value={raffleFilter.status} onChange={e => setRaffleFilter({ ...raffleFilter, status: e.target.value })}>
                                                <option value="">All</option><option value="PAID">Paid</option><option value="UNPAID">Unpaid</option>
                                            </select>
                                        </div>
                                    </div>

                                    {loading && raffleTickets.length === 0 ? (
                                        <div style={{ padding: 60, textAlign: 'center', color: 'var(--ad-t3)' }}>Loading tickets…</div>
                                    ) : raffleTickets.length === 0 ? (
                                        <div style={{ padding: 60, textAlign: 'center', color: 'var(--ad-t3)' }}>No raffle tickets found matching filters.</div>
                                    ) : (
                                        <div className="ad-table-wrap">
                                            <table className="ad-table">
                                                <thead><tr>{['Ticket ID', 'Name', 'Email', 'Phone', 'Status', 'Created', 'Link'].map(h => <th key={h} className="ad-th">{h}</th>)}</tr></thead>
                                                <tbody>
                                                    {raffleTickets.map((t: any) => (
                                                        <tr key={t.id} className="ad-tr">
                                                            <td className="ad-td ad-mono">{t.id}</td>
                                                            <td className="ad-td">{cap(t.firstName)} {cap(t.lastName)}</td>
                                                            <td className="ad-td" style={{ fontSize: '0.78rem' }}>{t.email || '—'}</td>
                                                            <td className="ad-td" style={{ fontSize: '0.78rem' }}>{t.phoneNumber || '—'}</td>
                                                            <td className="ad-td"><span className={`ad-badge ${t.status === 'PAID' ? 'ad-badge-paid' : 'ad-badge-unpaid'}`}>{t.status}</span></td>
                                                            <td className="ad-td ad-mono" style={{ fontSize: '0.72rem' }}>{formatDate(t.createdAt)}</td>
                                                            <td className="ad-td"><a href={`/raffle/profile/${t.id}`} target="_blank" rel="noreferrer" style={{ color: 'var(--ad-pl)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>View &rarr;</a></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    <div className="ad-pagination" style={{ marginTop: 20 }}>
                                        <span className="ad-page-info">Showing {(rafflePagination.page - 1) * rafflePagination.limit + 1}–{Math.min(rafflePagination.page * rafflePagination.limit, rafflePagination.total)} of {rafflePagination.total}</span>
                                        <div className="ad-page-btns">
                                            <button className="ad-page-btn" onClick={() => setRafflePagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))} disabled={rafflePagination.page === 1}><AiOutlineLeft /> Prev</button>
                                            <span className="ad-page-cur">Page {rafflePagination.page} / {rafflePagination.pages}</span>
                                            <button className="ad-page-btn" onClick={() => setRafflePagination(p => ({ ...p, page: Math.min(rafflePagination.pages, p.page + 1) }))} disabled={rafflePagination.page === rafflePagination.pages}>Next <AiOutlineRight /></button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {/* ══════════════════════════════════════════════════ BIBS ══ */}
                        {activeView === 'bibs' && (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
                                    <div>
                                        <div className="ad-section-head"><div className="ad-section-line" /><span className="ad-section-eyebrow">Participant IDs</span></div>
                                        <div className="ad-page-title">Visual Bibs (A4 Pairs)</div>
                                    </div>
                                    <div style={{ marginBottom: 24 }}>
                                        <button className="ad-hbtn ad-hbtn-primary" onClick={handleDownloadBibNumbers} disabled={isPrintingBibs}>
                                            <AiOutlineDownload /> {isPrintingBibs ? `Generating... ${printProgress}%` : 'Generate Bibs (A4 PDF)'}
                                        </button>
                                    </div>
                                </div>

                                <div className="ad-panel" style={{ padding: '0 24px' }}>
                                    <div className="ad-filters" style={{ borderBottom: 'none' }}>
                                        <div className="ad-filter-group" style={{ flex: 1 }}>
                                            <label className="ad-filter-label">Search</label>
                                            <div className="ad-search-wrap">
                                                <AiOutlineSearch className="ad-search-icon" />
                                                <input className="ad-input" type="text" value={filter.search} onChange={e => setFilter({ ...filter, search: e.target.value })} placeholder="Name, team or ID…" />
                                            </div>
                                        </div>
                                        <div className="ad-filter-group">
                                            <label className="ad-filter-label">Circuit</label>
                                            <select className="ad-select" value={filter.circuitId} onChange={e => setFilter({ ...filter, circuitId: e.target.value, category: '' })}>
                                                <option value="">All Circuits</option>
                                                {CIRCUITS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                            </select>
                                        </div>
                                        <div className="ad-filter-group">
                                            <label className="ad-filter-label">Category</label>
                                            <select className="ad-select" value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })}>
                                                <option value="">All Categories</option>
                                                {(filter.circuitId ? pricingCategories.filter(c => c.circuitId === filter.circuitId) : pricingCategories)
                                                    .map(c => <option key={c.id} value={c.categoryName}>{c.categoryName}</option>)}
                                            </select>
                                        </div>
                                        <div className="ad-filter-group">
                                            <label className="ad-filter-label">Sort By</label>
                                            <select className="ad-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                                <option value="id">Bib Number</option>
                                                <option value="category">Category</option>
                                                <option value="name">Name</option>
                                            </select>
                                        </div>
                                    </div>

                                    {loading && registrations.length === 0 ? (
                                        <div style={{ padding: 60, textAlign: 'center', color: 'var(--ad-t3)' }}>Loading bibs…</div>
                                    ) : registrations.length === 0 ? (
                                        <div style={{ padding: 60, textAlign: 'center', color: 'var(--ad-t3)' }}>No registrations found matching filters.</div>
                                    ) : (
                                        <AdminBibVisual registrations={getBibRegistrationData()} />
                                    )}

                                    <div className="ad-pagination" style={{ marginTop: 20 }}>
                                        <span className="ad-page-info">Showing {registrations.length} visual bibs</span>
                                        <div className="ad-page-btns">
                                            <button className="ad-page-btn" onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))} disabled={pagination.page === 1}><AiOutlineLeft /> Prev</button>
                                            <span className="ad-page-cur">Page {pagination.page} / {pagination.pages}</span>
                                            <button className="ad-page-btn" onClick={() => setPagination(p => ({ ...p, page: Math.min(pagination.pages, p.page + 1) }))} disabled={pagination.page === pagination.pages}>Next <AiOutlineRight /></button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ══════════════════════════════════════════════ PRICING ══ */}
                        {activeView === 'pricing' && (
                            <>
                                <div>
                                    <div className="ad-section-head"><div className="ad-section-line" /><span className="ad-section-eyebrow">Configuration</span></div>
                                    <div className="ad-page-title">Pricing Categories</div>
                                </div>
                                {loading ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--ad-t3)' }}>Loading…</div>
                                    : Object.keys(groupedCategories).length === 0 ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--ad-t3)' }}>No categories found.</div>
                                        : Object.entries(groupedCategories).map(([circuitId, cats]: [string, any]) => (
                                            <div key={circuitId} className="ad-panel">
                                                <div className="ad-panel-head">
                                                    <div className="ad-panel-title">{CIRCUITS.find(c => c.id === circuitId)?.title || circuitId.toUpperCase()}</div>
                                                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ad-t3)' }}>{cats.length} categories</span>
                                                </div>
                                                <div className="ad-table-wrap">
                                                    <table className="ad-table" style={{ minWidth: 700 }}>
                                                        <thead><tr>{['Category', 'Type', 'Age Range', 'Colour', 'BIB Range', 'Remarks'].map(h => <th key={h} className="ad-th">{h}</th>)}</tr></thead>
                                                        <tbody>
                                                            {cats.map((cat: any) => (
                                                                <tr key={cat.id} className="ad-tr">
                                                                    <td className="ad-td" style={{ fontWeight: 700, color: 'var(--ad-t1)' }}>{cat.categoryName}</td>
                                                                    <td className="ad-td" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ad-t3)' }}>{cat.type}</td>
                                                                    <td className="ad-td">{cat.minAge != null && cat.maxAge != null ? `${cat.minAge}–${cat.maxAge}` : cat.familyCategory || 'All'}</td>
                                                                    <td className="ad-td"><div style={{ width: 32, height: 16, background: cat.hexColor, border: '1px solid var(--ad-border)' }} /></td>
                                                                    <td className="ad-td ad-mono" style={{ fontSize: '0.75rem', color: 'var(--ad-t3)' }}>{cat.regRange}</td>
                                                                    <td className="ad-td" style={{ fontSize: '0.78rem', color: 'var(--ad-t3)' }}>{cat.remarks || '—'}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))}
                            </>
                        )}

                    </main>
                </div>

                {/* ── Registration detail drawer ── */}
                {isDetailsOpen && selectedRegistration && (
                    <>
                        <div className="ad-drawer-overlay" onClick={() => { setIsDetailsOpen(false); setSelectedRegistration(null); }} />
                        <aside className="ad-drawer">
                            <div className="ad-drawer-head">
                                <span className="ad-drawer-title">Registration Detail</span>
                                <button className="ad-drawer-close" onClick={() => { setIsDetailsOpen(false); setSelectedRegistration(null); }}><AiOutlineClose /></button>
                            </div>
                            <div className="ad-drawer-body">
                                {[
                                    { label: 'Pass ID', val: selectedRegistration.id, mono: true },
                                    { label: 'Name', val: `${cap(selectedRegistration.firstName)} ${cap(selectedRegistration.lastName)}` },
                                    { label: 'Team', val: selectedRegistration.teamName || '—' },
                                    { label: 'Circuit', val: CIRCUITS.find(c => c.id === selectedRegistration.circuitId)?.title || selectedRegistration.circuitId },
                                    { label: 'Category', val: selectedRegistration.category || '—' },
                                    { label: 'Type', val: selectedRegistration.type },
                                    { label: 'T-Shirt', val: selectedRegistration.tshirtSize || '—' },
                                    { label: 'Email', val: selectedRegistration.email || '—' },
                                    { label: 'Phone', val: selectedRegistration.phoneNumber || '—' },
                                    { label: 'Emergency', val: `${selectedRegistration.emergencyContactName || '—'} · ${selectedRegistration.emergencyPhone || '—'}` },
                                    { label: 'Amount', val: `KES ${(selectedRegistration.totalAmount ?? 0).toLocaleString()}` },
                                    { label: 'Status', val: selectedRegistration.status },
                                ].map(f => (
                                    <div key={f.label}>
                                        <div className="ad-drawer-field-label">{f.label}</div>
                                        <div className={`ad-drawer-field-val${f.mono ? ' ad-mono' : ''}`}>{f.val}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="ad-drawer-actions">
                                <a href={`/profile/${selectedRegistration.id}`} target="_blank" rel="noreferrer" className="ad-drawer-link-primary">Open Full Profile &rarr;</a>
                                <a href={`/payment/${selectedRegistration.id}`} className="ad-drawer-link-ghost">Go to Payment</a>
                            </div>
                        </aside>
                    </>
                )}

                {/* Hidden print containers - kept off-screen for PDF capture */}
                <div style={{ position: 'fixed', left: '-10000mm', top: 0, pointerEvents: 'none', zIndex: -1000 }}>
                    {isPrintingRaffle && <AdminRaffleTicketsPrint tickets={allRaffleTicketsForPrint.length > 0 ? allRaffleTicketsForPrint : raffleTickets} />}
                    {isPrintingBibs && <AdminBibNumbersPrint registrations={getBibRegistrationData(allRegsForPrint.length > 0 ? allRegsForPrint : registrations)} />}
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;