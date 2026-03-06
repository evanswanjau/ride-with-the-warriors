import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
    AiOutlineTable,
    AiOutlineSun,
    AiOutlineMoon,
    AiOutlineTeam,
    AiOutlineDollar,
    AiOutlineExclamationCircle,
    AiOutlineCheckCircle,
    AiOutlineCloseCircle,
    AiOutlineSearch,
    AiOutlineEye,
    AiOutlineDelete,
    AiOutlineLeft,
    AiOutlineRight,
    AiOutlineStar,
    AiOutlineClose,
    AiOutlineDownload,
    AiOutlinePrinter,
    AiOutlineDashboard,
    AiOutlineCalendar,
    AiOutlineInfoCircle,
    AiOutlineArrowUp,
    AiOutlineHistory
} from 'react-icons/ai';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie,
    Legend
} from 'recharts';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import AdminRaffleTicketsPrint from './AdminRaffleTicketsPrint';
import AdminBibNumbersPrint from './AdminBibNumbersPrint';
import logo from '../../assets/images/logo.png';
import { CIRCUITS } from '../../constants';
import { API_BASE_URL } from '../../config';

interface AdminDashboardProps {
    token: string;
    admin: any;
    onLogout: () => void;
}

const AdminDashboard = ({ token, admin, onLogout }: AdminDashboardProps) => {
    const [activeView, setActiveView] = useState<'overview' | 'registrations' | 'pricing' | 'payments' | 'raffle'>('overview');
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [pricingCategories, setPricingCategories] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState({
        circuitId: '',
        type: '',
        status: '',
        category: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('adminTheme');
        return saved ? saved === 'dark' : false;
    });
    const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const [payments, setPayments] = useState<any[]>([]);
    const [paymentsStats, setPaymentsStats] = useState<any>(null);
    const [paymentsFilter, setPaymentsFilter] = useState({
        status: '',
        search: '',
        dateFrom: '',
        dateTo: ''
    });
    const [paymentsPagination, setPaymentsPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 1
    });

    const [raffleTickets, setRaffleTickets] = useState<any[]>([]);
    const [raffleFilter, setRaffleFilter] = useState({ status: '', search: '' });
    const [rafflePagination, setRafflePagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 1
    });

    const [isPrintingRaffle, setIsPrintingRaffle] = useState(false);
    const [isPrintingBibs, setIsPrintingBibs] = useState(false);

    useEffect(() => {
        localStorage.setItem('adminTheme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    useEffect(() => {
        fetchPricingCategories(); // Fetch once on mount to have color metadata
    }, []);

    useEffect(() => {
        if (activeView === 'overview') {
            fetchDashboardStats();
        } else if (activeView === 'registrations') {
            fetchData();
        } else if (activeView === 'pricing') {
            fetchPricingCategories();
        } else if (activeView === 'payments') {
            fetchPayments();
        } else if (activeView === 'raffle') {
            fetchRaffleTickets();
        }
    }, [filter, pagination.page, activeView, paymentsFilter, paymentsPagination.page, raffleFilter, rafflePagination.page]);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch dashboard stats');
            const data = await res.json();
            setDashboardData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: String(pagination.page),
                limit: String(pagination.limit),
                ...filter
            });

            const [regRes, statsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/registrations?${queryParams}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_BASE_URL}/admin/registrations/stats/summary`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (!regRes.ok || !statsRes.ok) throw new Error('Failed to fetch data');

            const regData = await regRes.json();
            const statsData = await statsRes.json();

            setRegistrations(regData.registrations);
            setPagination(regData.pagination);
            setStats(statsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchPricingCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/registrations/config/categories`);
            if (!response.ok) throw new Error('Failed to fetch pricing categories');
            const data = await response.json();
            setPricingCategories(data.categories || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams({
                page: String(paymentsPagination.page),
                limit: String(paymentsPagination.limit),
                ...(paymentsFilter.status && { status: paymentsFilter.status }),
                ...(paymentsFilter.search && { search: paymentsFilter.search }),
                ...(paymentsFilter.dateFrom && { dateFrom: paymentsFilter.dateFrom }),
                ...(paymentsFilter.dateTo && { dateTo: paymentsFilter.dateTo }),
            });
            const [listRes, statsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/payments?${params}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${API_BASE_URL}/admin/payments/stats/summary`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);
            if (!listRes.ok || !statsRes.ok) throw new Error('Failed to fetch payments');
            const listData = await listRes.json();
            const statsData = await statsRes.json();
            setPayments(listData.payments || []);
            setPaymentsPagination(prev => ({ ...prev, ...(listData.pagination || {}) }));
            setPaymentsStats(statsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchRaffleTickets = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams({
                page: String(rafflePagination.page),
                limit: String(rafflePagination.limit),
                ...(raffleFilter.status && { status: raffleFilter.status }),
                ...(raffleFilter.search && { search: raffleFilter.search }),
            });
            const response = await fetch(`${API_BASE_URL}/admin/raffle?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch raffle tickets');
            const data = await response.json();
            setRaffleTickets(data.tickets || []);
            setRafflePagination(prev => ({ ...prev, ...(data.pagination || {}) }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/registrations/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) fetchData();
        } catch (err) {
            console.error('Update error:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this registration?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/admin/registrations/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) fetchData();
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const formatDate = (date: string) => {
        try {
            return new Date(date).toLocaleString();
        } catch {
            return 'N/A';
        }
    };

    const capitalizeWords = (str: string) => {
        if (!str) return '';
        return str.toLowerCase().split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const handleExport = async () => {
        try {
            const queryParams = new URLSearchParams({
                limit: '10000',
                ...filter
            });
            const response = await fetch(`${API_BASE_URL}/admin/registrations?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (!data.registrations) return;

            const ws = XLSX.utils.json_to_sheet(data.registrations.map((r: any) => ({
                ID: r.id,
                Name: `${r.firstName} ${r.lastName}`,
                Email: r.email,
                Phone: r.phoneNumber,
                Team: r.teamName || '',
                TshirtSize: r.tshirtSize || '',
                EmergencyContact: r.emergencyContactName || '',
                EmergencyPhone: r.emergencyPhone || '',
                Type: r.type,
                Circuit: r.circuitId,
                Category: r.category,
                Amount: r.totalAmount,
                MpesaCode: r.mpesaCode || '',
                Status: r.status,
                Date: new Date(r.createdAt).toLocaleString()
            })));

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Registrations");
            XLSX.writeFile(wb, "Registrations.xlsx");
        } catch (err) {
            console.error('Export failed:', err);
            alert('Export failed');
        }
    };

    const handleExportPayments = async (format: 'csv' | 'excel') => {
        try {
            const params = new URLSearchParams({
                limit: '10000',
                ...(paymentsFilter.status && { status: paymentsFilter.status }),
                ...(paymentsFilter.search && { search: paymentsFilter.search }),
                ...(paymentsFilter.dateFrom && { dateFrom: paymentsFilter.dateFrom }),
                ...(paymentsFilter.dateTo && { dateTo: paymentsFilter.dateTo }),
            });
            const response = await fetch(`${API_BASE_URL}/admin/payments?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            const list = data.payments || [];
            const rows = list.map((p: any) => ({
                TransactionCode: p.mpesaReceiptNumber || '',
                Phone: p.phone || '',
                Amount: p.amount,
                Status: p.status,
                Timestamp: p.transactionDate || new Date(p.createdAt).toISOString(),
                RegistrationId: p.registrationId,
                CreatedAt: new Date(p.createdAt).toLocaleString(),
            }));
            const ws = XLSX.utils.json_to_sheet(rows);
            if (format === 'csv') {
                const csv = XLSX.utils.sheet_to_csv(ws);
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Payments.csv';
                a.click();
                URL.revokeObjectURL(url);
            } else {
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Payments');
                XLSX.writeFile(wb, 'Payments.xlsx');
            }
        } catch (err) {
            console.error('Export payments failed:', err);
            alert('Export failed');
        }
    };

    const openRegistrationDetails = (reg: any) => {
        setSelectedRegistration(reg);
        setIsDetailsOpen(true);
    };

    const groupedCategories = pricingCategories.reduce((acc, cat) => {
        if (!acc[cat.circuitId]) acc[cat.circuitId] = [];
        acc[cat.circuitId].push(cat);
        return acc;
    }, {} as Record<string, any[]>);

    const handleDownloadRaffleTickets = async () => {
        if (raffleTickets.length === 0) return;
        try {
            setIsPrintingRaffle(true);
            // Give time for the hidden component to mount/render
            await new Promise(r => setTimeout(r, 1000));

            const container = document.getElementById('raffle-print-container');
            if (!container) return;

            const pages = container.querySelectorAll('.raffle-print-page');
            const pdf = new jsPDF('p', 'mm', 'a4');

            for (let i = 0; i < pages.length; i++) {
                if (i > 0) pdf.addPage();
                const dataUrl = await toPng(pages[i] as HTMLElement, {
                    pixelRatio: 2,
                    backgroundColor: '#ffffff',
                });
                pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 297);
            }

            pdf.save(`RWTW_Raffle_Tickets_Batch_${rafflePagination.page}.pdf`);
        } catch (err) {
            console.error('Raffle print error:', err);
            alert('Failed to generate PDF');
        } finally {
            setIsPrintingRaffle(false);
        }
    };

    const handleDownloadBibNumbers = async () => {
        if (registrations.length === 0) return;
        try {
            setIsPrintingBibs(true);
            await new Promise(r => setTimeout(r, 1000));

            const container = document.getElementById('bib-print-container');
            if (!container) return;

            const pages = container.querySelectorAll('.bib-page');
            const pdf = new jsPDF('l', 'mm', 'a5'); // Landscape A5

            for (let i = 0; i < pages.length; i++) {
                if (i > 0) pdf.addPage();
                const dataUrl = await toPng(pages[i] as HTMLElement, {
                    pixelRatio: 2,
                    backgroundColor: '#ffffff',
                });
                pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 148.5);
            }

            pdf.save(`RWTW_Bib_Numbers_Batch_${pagination.page}.pdf`);
        } catch (err) {
            console.error('Bib print error:', err);
            alert('Failed to generate PDF');
        } finally {
            setIsPrintingBibs(false);
        }
    };

    const getBibRegistrationData = () => {
        return registrations.map(reg => ({
            id: reg.id,
            firstName: reg.firstName,
            lastName: reg.lastName,
            category: reg.category,
            hexColor: pricingCategories.find(c => c.categoryName === reg.category && c.circuitId === reg.circuitId)?.hexColor || '#000000',
            circuitId: reg.circuitId
        }));
    };

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
            {/* Header */}
            <header className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} border-b py-4 px-8 flex items-center justify-between sticky top-0 z-50`}>
                <div className="flex items-center gap-4">
                    <img src={logo} alt="Ride With The Warriors" className="h-10 w-auto object-contain" />
                    <div>
                        <h1 className="text-xl font-bold">Admin Workspace</h1>
                        <p className={`text-xs ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Welcome back, {admin.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {activeView === 'registrations' && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleDownloadBibNumbers}
                                disabled={isPrintingBibs}
                                className={`px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-bold transition-all hover:bg-black flex items-center gap-2 ${isPrintingBibs ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <AiOutlinePrinter className="text-lg" />
                                {isPrintingBibs ? 'Generating...' : 'Download Bibs (A5)'}
                            </button>
                            <button
                                onClick={handleExport}
                                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold transition-all hover:bg-primary-dark flex items-center gap-2"
                            >
                                <AiOutlineTable className="text-lg" />
                                Export Excel
                            </button>
                        </div>
                    )}
                    {activeView === 'payments' && (
                        <>
                            <button
                                onClick={() => handleExportPayments('csv')}
                                className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-bold transition-all hover:bg-neutral-50 flex items-center gap-2"
                            >
                                Export CSV
                            </button>
                            <button
                                onClick={() => handleExportPayments('excel')}
                                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold transition-all hover:bg-primary-dark flex items-center gap-2"
                            >
                                <AiOutlineTable className="text-lg" />
                                Export Excel
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`size-10 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-neutral-700 hover:bg-neutral-600 text-yellow-400' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'}`}
                        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDarkMode ? <AiOutlineSun className="text-xl" /> : <AiOutlineMoon className="text-xl" />}
                    </button>
                    <button
                        onClick={onLogout}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isDarkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'}`}
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row">
                {/* Side Menu - Collapsible on mobile */}
                <aside className={`lg:w-64 w-full lg:min-h-[calc(100vh-73px)] ${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} border-r border-b lg:border-b-0`}>
                    <nav className="p-4 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible items-center lg:items-stretch">
                        <button
                            onClick={() => setActiveView('overview')}
                            className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeView === 'overview'
                                ? 'bg-primary text-white'
                                : isDarkMode
                                    ? 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
                                    : 'text-neutral-600 hover:bg-neutral-100'
                                }`}
                        >
                            <AiOutlineDashboard className="text-xl shrink-0" />
                            <span className="font-bold">Overview</span>
                        </button>
                        <button
                            onClick={() => setActiveView('registrations')}
                            className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeView === 'registrations'
                                ? 'bg-primary text-white'
                                : isDarkMode
                                    ? 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
                                    : 'text-neutral-600 hover:bg-neutral-100'
                                }`}
                        >
                            <AiOutlineTeam className="text-xl shrink-0" />
                            <span className="font-bold">Registrations</span>
                        </button>
                        <button
                            onClick={() => setActiveView('payments')}
                            className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeView === 'payments'
                                ? 'bg-primary text-white'
                                : isDarkMode
                                    ? 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
                                    : 'text-neutral-600 hover:bg-neutral-100'
                                }`}
                        >
                            <AiOutlineDollar className="text-xl shrink-0" />
                            <span className="font-bold">Payments</span>
                        </button>
                        <button
                            onClick={() => setActiveView('raffle')}
                            className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeView === 'raffle'
                                ? 'bg-primary text-white'
                                : isDarkMode
                                    ? 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
                                    : 'text-neutral-600 hover:bg-neutral-100'
                                }`}
                        >
                            <AiOutlineStar className="text-xl shrink-0" />
                            <span className="font-bold">Raffle</span>
                        </button>
                        <button
                            onClick={() => setActiveView('pricing')}
                            className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeView === 'pricing'
                                ? 'bg-primary text-white'
                                : isDarkMode
                                    ? 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
                                    : 'text-neutral-600 hover:bg-neutral-100'
                                }`}
                        >
                            <AiOutlineDollar className="text-xl shrink-0" />
                            <span className="font-bold">Pricing</span>
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 w-full max-w-[1600px] mx-auto space-y-8 overflow-x-hidden">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-2xl flex items-center gap-3">
                            <AiOutlineExclamationCircle className="text-xl" />
                            <p className="font-bold">{error}</p>
                            <button
                                onClick={() => {
                                    if (activeView === 'overview') fetchDashboardStats();
                                    else if (activeView === 'registrations') fetchData();
                                    else if (activeView === 'pricing') fetchPricingCategories();
                                    else if (activeView === 'payments') fetchPayments();
                                    else if (activeView === 'raffle') fetchRaffleTickets();
                                }}
                                className="ml-auto underline"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {activeView === 'overview' && dashboardData && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Header: Vital Signs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCardFlat
                                    label="Gross Revenue"
                                    value={`KES ${dashboardData.summary.revenue.toLocaleString()}`}
                                    icon={<AiOutlineDollar />}
                                    trend={`${dashboardData.summary.pulse.avgPerDay} registrations/day`}
                                    color="primary"
                                    isDarkMode={isDarkMode}
                                />
                                <StatCardFlat
                                    label="Confirmed entries"
                                    value={dashboardData.summary.registrations.paid}
                                    icon={<AiOutlineCheckCircle />}
                                    trend={`${dashboardData.summary.registrations.total} total attempts`}
                                    color="green"
                                    isDarkMode={isDarkMode}
                                />
                                <StatCardFlat
                                    label="Raffle Volume"
                                    value={dashboardData.summary.raffle.paid}
                                    icon={<AiOutlineStar />}
                                    trend={`KES ${(dashboardData.summary.raffle.paid * 500).toLocaleString()} revenue`}
                                    color="amber"
                                    isDarkMode={isDarkMode}
                                />
                                <StatCardFlat
                                    label="Needs attention"
                                    value={dashboardData.summary.pulse.staleUnpaid}
                                    icon={<AiOutlineExclamationCircle />}
                                    trend="Unpaid > 48 hours"
                                    color="red"
                                    isDarkMode={isDarkMode}
                                />
                            </div>

                            {/* Main Intelligence Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Cumulative Revenue Area Chart (Tall) */}
                                <div className={`lg:col-span-2 ${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} p-8 rounded-[32px] border`}>
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-xl font-black tracking-tight uppercase">Revenue Momentum</h3>
                                            <p className={`text-xs ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'} font-bold`}>Day-over-day growth rate</p>
                                        </div>
                                        <div className={`px-4 py-2 rounded-2xl ${isDarkMode ? 'bg-neutral-900' : 'bg-neutral-50'} border ${isDarkMode ? 'border-neutral-700' : 'border-neutral-100'}`}>
                                            <span className="text-primary font-black text-sm">Real-time</span>
                                        </div>
                                    </div>
                                    <div className="h-[350px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={dashboardData.financials.dailyRevenue}>
                                                <defs>
                                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#333' : '#f0f0f0'} />
                                                <XAxis
                                                    dataKey="createdAt"
                                                    hide
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 10, fontWeight: 700, fill: isDarkMode ? '#555' : '#999' }}
                                                    tickFormatter={(v) => `K${v / 1000}k`}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: isDarkMode ? '#171717' : '#fff',
                                                        borderRadius: '16px',
                                                        border: 'none',
                                                        boxShadow: 'none',
                                                        padding: '12px'
                                                    }}
                                                    itemStyle={{ color: '#3B82F6', fontWeight: 900 }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="amount"
                                                    stroke="#3B82F6"
                                                    strokeWidth={4}
                                                    fillOpacity={1}
                                                    fill="url(#colorRevenue)"
                                                    animationDuration={2000}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Conversion Funnel (Actionable) */}
                                <div className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} p-8 rounded-[32px] border flex flex-col`}>
                                    <div className="mb-8">
                                        <h3 className="text-xl font-black tracking-tight uppercase text-primary">Funnel conversion</h3>
                                        <p className={`text-xs ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'} font-bold`}>Entry to Confirmation velocity</p>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center space-y-6">
                                        {dashboardData.financials.conversionFunnel.map((step: any, i: number) => (
                                            <div key={i} className="relative">
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className={`text-xs font-black uppercase ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>{step.stage}</span>
                                                    <span className="font-black text-lg">{step.count}</span>
                                                </div>
                                                <div className={`h-3 rounded-full ${isDarkMode ? 'bg-neutral-900' : 'bg-neutral-100'} overflow-hidden`}>
                                                    <div
                                                        className="h-full bg-primary transition-all duration-1000"
                                                        style={{ width: `${(step.count / dashboardData.financials.conversionFunnel[0].count) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={`mt-8 p-4 rounded-2xl ${isDarkMode ? 'bg-primary/10' : 'bg-primary/5'} border border-primary/20`}>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-normal">
                                            Insight: {Math.round((dashboardData.summary.registrations.paid / dashboardData.summary.registrations.total) * 100)}% Conversion rate from registration to payment.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Demographics & Logistics Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* T-Shirt Inventory */}
                                <div className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} p-6 rounded-[32px] border`}>
                                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-60">Logistics: T-Shirt Inventory</h3>
                                    <div className="h-[200px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={dashboardData.demographics.tshirtBreakdown} layout="vertical">
                                                <XAxis type="number" hide />
                                                <YAxis
                                                    dataKey="tshirtSize"
                                                    type="category"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 10, fontWeight: 900, fill: isDarkMode ? '#888' : '#444' }}
                                                />
                                                <Tooltip cursor={{ fill: 'transparent' }} />
                                                <Bar dataKey="_count" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={12} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Circuit Popularity */}
                                <div className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} p-6 rounded-[32px] border`}>
                                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-60">Circuit preference</h3>
                                    <div className="h-[200px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={dashboardData.byCircuit}
                                                    dataKey="_count"
                                                    nameKey="circuitId"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={41}
                                                    outerRadius={65}
                                                    paddingAngle={8}
                                                >
                                                    {dashboardData.byCircuit.map((_entry: any, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]} stroke="none" />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: isDarkMode ? '#171717' : '#fff', borderRadius: '12px', border: 'none' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Gender Split */}
                                <div className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} p-6 rounded-[32px] border`}>
                                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-60">Gender Distribution</h3>
                                    <div className="space-y-6 py-4">
                                        {dashboardData.demographics.genderBreakdown.map((g: any, i: number) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <div className={`size-3 rounded-full ${g.gender === 'MALE' ? 'bg-blue-500' : g.gender === 'FEMALE' ? 'bg-pink-500' : 'bg-neutral-400'}`} />
                                                <div className="flex-1">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-xs font-black uppercase tracking-tighter">{g.gender}</span>
                                                        <span className="text-xs font-black">{Math.round((g._count / dashboardData.summary.registrations.paid) * 100)}%</span>
                                                    </div>
                                                    <div className={`h-1.5 rounded-full ${isDarkMode ? 'bg-neutral-900' : 'bg-neutral-100'} overflow-hidden`}>
                                                        <div className={`h-full ${g.gender === 'MALE' ? 'bg-blue-500' : g.gender === 'FEMALE' ? 'bg-pink-500' : 'bg-neutral-400'}`} style={{ width: `${(g._count / dashboardData.summary.registrations.paid) * 100}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Activity & Alerts Hub */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className={`lg:col-span-2 ${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} p-8 rounded-[32px] border`}>
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-lg font-black uppercase tracking-tight">Recent activity stream</h3>
                                        <AiOutlineHistory className="text-2xl opacity-40" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {dashboardData.activityFeed.map((item: any, idx: number) => (
                                            <div key={idx} className={`flex items-center gap-4 p-4 rounded-3xl border ${isDarkMode ? 'bg-neutral-900/40 border-neutral-700/50 hover:bg-neutral-900' : 'bg-neutral-50 border-neutral-100 hover:bg-white'} transition-all group`}>
                                                <div className={`size-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${item.type === 'REGISTRATION' ? 'bg-primary/10 text-primary' :
                                                    item.type === 'PAYMENT' ? 'bg-green-500/10 text-green-500' :
                                                        'bg-amber-500/10 text-amber-500'
                                                    }`}>
                                                    {item.type === 'REGISTRATION' ? <AiOutlineTeam /> :
                                                        item.type === 'PAYMENT' ? <AiOutlineDollar /> : <AiOutlineStar />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{item.title}</p>
                                                    <p className={`text-[10px] uppercase font-black tracking-widest ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                                        {item.subtitle} • {formatDate(item.date)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-[11px] font-black ${item.status === 'PAID' ? 'text-green-500' : 'text-neutral-400'}`}>
                                                        {item.status}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={`${isDarkMode ? 'bg-neutral-900 border-red-500/30' : 'bg-red-50/30 border-red-200'} p-8 rounded-[32px] border`}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="size-10 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/40">
                                            <AiOutlineExclamationCircle className="text-2xl" />
                                        </div>
                                        <h3 className="text-lg font-black uppercase tracking-tight text-red-500">Action Required</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className={`p-5 rounded-3xl border ${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-100'}`}>
                                            <p className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-1">Stale Unpaid</p>
                                            <p className="text-3xl font-black">{dashboardData.summary.pulse.staleUnpaid}</p>
                                            <p className="text-xs mt-2 text-neutral-400 font-bold leading-relaxed">Entries stuck in UNPAID status for over 48 hours. Consider automated followup.</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setFilter({ ...filter, status: 'UNPAID' });
                                                setActiveView('registrations');
                                            }}
                                            className="w-full py-4 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95"
                                        >
                                            Review Staleness
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeView === 'registrations' ? (
                        <>
                            {/* Stats Section */}
                            {stats && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                                        <StatCard label="Total" value={stats.summary.total} icon={<AiOutlineTeam />} color="primary" isDarkMode={isDarkMode} />
                                        <StatCard label="Paid" value={stats.summary.paid} icon={<AiOutlineCheckCircle />} color="primary" isDarkMode={isDarkMode} />
                                        <StatCard label="Unpaid" value={stats.summary.unpaid} icon={<AiOutlineExclamationCircle />} color="amber" isDarkMode={isDarkMode} />
                                        <StatCard label="Cancelled" value={stats.summary.cancelled} icon={<AiOutlineCloseCircle />} color="red" isDarkMode={isDarkMode} />
                                        <StatCard label="Revenue" value={`KES ${stats.summary.revenue != null ? Number(stats.summary.revenue).toLocaleString() : '0'}`} icon={<AiOutlineDollar />} color="primary" isDarkMode={isDarkMode} isString />
                                    </div>
                                    {(stats.byCircuit?.length > 0 || stats.byType?.length > 0) && (
                                        <div className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} rounded-2xl border p-4`}>
                                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Breakdown</p>
                                            <div className="flex flex-wrap gap-6">
                                                {stats.byCircuit?.length > 0 && (
                                                    <div>
                                                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>By circuit</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {stats.byCircuit.map((c: any) => (
                                                                <span key={c.circuitId} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${isDarkMode ? 'bg-neutral-700 text-neutral-200' : 'bg-neutral-100 text-neutral-700'}`}>
                                                                    {CIRCUITS.find(x => x.id === c.circuitId)?.title || c.circuitId}: {c._count}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {stats.byType?.length > 0 && (
                                                    <div>
                                                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>By type</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {stats.byType.map((t: any) => (
                                                                <span key={t.type} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${isDarkMode ? 'bg-neutral-700 text-neutral-200' : 'bg-neutral-100 text-neutral-700'}`}>
                                                                    {t.type}: {t._count}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Filters */}
                            <div className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} p-4 md:p-6 rounded-2xl border flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-end`}>
                                <div className="flex-1 min-w-[200px]">
                                    <label className={`block text-[10px] font-bold ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-widest mb-2 ml-1`}>Search</label>
                                    <div className="relative">
                                        <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xl" />
                                        <input
                                            type="text"
                                            value={filter.search}
                                            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                                            placeholder="Name, Team or ID..."
                                            className={`w-full border rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all ${isDarkMode ? 'bg-neutral-900 border-neutral-700 text-white focus:border-primary' : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-primary focus:bg-white'}`}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className={`block text-[10px] font-bold ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-widest mb-2 ml-1`}>Circuit</label>
                                        <select
                                            value={filter.circuitId}
                                            onChange={(e) => setFilter({ ...filter, circuitId: e.target.value })}
                                            className={`w-full border rounded-xl py-2.5 px-4 text-sm outline-none transition-all ${isDarkMode ? 'bg-neutral-900 border-neutral-700 text-white focus:border-primary' : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-primary focus:bg-white'}`}
                                        >
                                            <option value="">All Circuits</option>
                                            {CIRCUITS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className={`block text-[10px] font-bold ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-widest mb-2 ml-1`}>Status</label>
                                        <select
                                            value={filter.status}
                                            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                            className={`w-full border rounded-xl py-2.5 px-4 text-sm outline-none transition-all ${isDarkMode ? 'bg-neutral-900 border-neutral-700 text-white focus:border-primary' : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-primary focus:bg-white'}`}
                                        >
                                            <option value="">All Status</option>
                                            <option value="UNPAID">Unpaid</option>
                                            <option value="PAID">Paid</option>
                                            <option value="CONFIRMED">Confirmed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Table Section */}
                            <div className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} rounded-2xl border overflow-hidden`}>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm min-w-[1200px]">
                                        <thead>
                                            <tr className={`${isDarkMode ? 'bg-neutral-700/50 text-neutral-400' : 'bg-neutral-50 text-neutral-500'} text-[10px] font-bold uppercase tracking-widest border-b ${isDarkMode ? 'border-neutral-700' : 'border-neutral-100'}`}>
                                                <th className="px-6 py-5">Pass ID</th>
                                                <th className="px-6 py-5">Participant</th>
                                                <th className="px-6 py-5">Category / Circuit</th>
                                                <th className="px-6 py-5">Amount</th>
                                                <th className="px-6 py-5">Status</th>
                                                <th className="px-6 py-5">Date</th>
                                                <th className="px-6 py-5 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDarkMode ? 'divide-neutral-700' : 'divide-neutral-100'}`}>
                                            {loading && registrations.length === 0 ? (
                                                <tr><td colSpan={7} className="py-20 text-center text-neutral-500">Loading registrations...</td></tr>
                                            ) : registrations.length === 0 ? (
                                                <tr><td colSpan={7} className="py-20 text-center text-neutral-500">No registrations found matching your criteria.</td></tr>
                                            ) : (
                                                registrations.map((reg) => (
                                                    <tr key={reg.id} className={`transition-colors ${isDarkMode ? 'hover:bg-neutral-700/30' : 'hover:bg-neutral-50'}`}>
                                                        <td className="px-6 py-5">
                                                            <span className={`font-mono text-xs font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{reg.id}</span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                                                {capitalizeWords(reg.firstName || 'Unknown')} {capitalizeWords(reg.lastName || '')}
                                                            </div>
                                                            {reg.teamName && (
                                                                <div className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">
                                                                    Team: {reg.teamName}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-neutral-800'}`}>{reg.category || 'Rider'}</div>
                                                            <div className="text-[10px] text-neutral-500 uppercase tracking-widest leading-none mt-1">
                                                                {CIRCUITS.find(c => c.id === reg.circuitId)?.id.toUpperCase() || reg.circuitId}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-primary'}`}>
                                                                KES {(reg.totalAmount ?? 0).toLocaleString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <select
                                                                value={reg.status}
                                                                onChange={(e) => handleStatusUpdate(reg.id, e.target.value)}
                                                                className={`text-[10px] font-bold px-3 py-1.5 rounded-full border-none outline-none cursor-pointer ${getStatusColor(reg.status)}`}
                                                            >
                                                                <option value="UNPAID">UNPAID</option>
                                                                <option value="PAID">PAID</option>
                                                                <option value="CONFIRMED">CONFIRMED</option>
                                                                <option value="CANCELLED">CANCELLED</option>
                                                            </select>
                                                        </td>
                                                        <td className={`px-6 py-5 text-[11px] tabular-nums font-medium ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                                            {formatDate(reg.createdAt)}
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <button
                                                                    onClick={() => openRegistrationDetails(reg)}
                                                                    className={`size-9 rounded-lg flex items-center justify-center transition-all ${isDarkMode ? 'hover:bg-neutral-700 text-neutral-400 hover:text-white' : 'hover:bg-neutral-100 text-neutral-500 hover:text-primary'}`}
                                                                    title="View details"
                                                                >
                                                                    <AiOutlineEye className="text-[20px]" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(reg.id)}
                                                                    className={`size-9 rounded-lg flex items-center justify-center transition-all ${isDarkMode ? 'hover:bg-red-500/10 text-neutral-400 hover:text-red-500' : 'hover:bg-red-50 text-neutral-500 hover:text-red-500'}`}
                                                                    title="Delete Registration"
                                                                >
                                                                    <AiOutlineDelete className="text-[20px]" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className={`p-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-50 border-neutral-100'}`}>
                                    <div className={`text-xs font-medium ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                        Showing <span className={isDarkMode ? 'text-white' : 'text-neutral-900'}>{(pagination.page - 1) * pagination.limit + 1}</span> to <span className={isDarkMode ? 'text-white' : 'text-neutral-900'}>{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className={isDarkMode ? 'text-white' : 'text-neutral-900'}>{pagination.total}</span> results
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                                            disabled={pagination.page === 1}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${pagination.page === 1
                                                ? 'opacity-50 cursor-not-allowed ' + (isDarkMode ? 'bg-neutral-900 text-neutral-600' : 'bg-neutral-100 text-neutral-400')
                                                : isDarkMode ? 'bg-neutral-700 hover:bg-neutral-600 text-white' : 'bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-200'
                                                }`}
                                        >
                                            <AiOutlineLeft className="text-[16px]" />
                                            Previous
                                        </button>
                                        <div className={`px-4 py-2 rounded-lg text-xs font-bold ${isDarkMode ? 'bg-neutral-900 text-neutral-400' : 'bg-neutral-100 text-neutral-600'}`}>
                                            Page {pagination.page} of {pagination.pages}
                                        </div>
                                        <button
                                            onClick={() => setPagination({ ...pagination, page: Math.min(pagination.pages, pagination.page + 1) })}
                                            disabled={pagination.page === pagination.pages}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${pagination.page === pagination.pages
                                                ? 'opacity-50 cursor-not-allowed ' + (isDarkMode ? 'bg-neutral-900 text-neutral-600' : 'bg-neutral-100 text-neutral-400')
                                                : isDarkMode ? 'bg-neutral-700 hover:bg-neutral-600 text-white' : 'bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-200'
                                                }`}
                                        >
                                            Next
                                            <AiOutlineRight className="text-[16px]" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : null}
                    {activeView === 'payments' && (
                        <>
                            {paymentsStats?.summary && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                                    <StatCard label="Total" value={paymentsStats.summary.total} icon={<AiOutlineDollar />} color="primary" isDarkMode={isDarkMode} />
                                    <StatCard label="Paid" value={paymentsStats.summary.paid} icon={<AiOutlineCheckCircle />} color="primary" isDarkMode={isDarkMode} />
                                    <StatCard label="Failed" value={paymentsStats.summary.failed} icon={<AiOutlineCloseCircle />} color="red" isDarkMode={isDarkMode} />
                                    <StatCard label="Pending" value={paymentsStats.summary.pending} icon={<AiOutlineExclamationCircle />} color="amber" isDarkMode={isDarkMode} />
                                    <StatCard label="Revenue" value={`KES ${paymentsStats.summary.revenue != null ? Number(paymentsStats.summary.revenue).toLocaleString() : '0'}`} icon={<AiOutlineDollar />} color="primary" isDarkMode={isDarkMode} isString />
                                </div>
                            )}
                            <div className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} p-4 md:p-6 rounded-2xl border flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-end`}>
                                <div className="flex-1 min-w-[180px]">
                                    <label className={`block text-[10px] font-bold ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-widest mb-2 ml-1`}>Search</label>
                                    <div className="relative">
                                        <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xl" />
                                        <input
                                            type="text"
                                            value={paymentsFilter.search}
                                            onChange={(e) => setPaymentsFilter({ ...paymentsFilter, search: e.target.value })}
                                            placeholder="Transaction code or phone..."
                                            className={`w-full border rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all ${isDarkMode ? 'bg-neutral-900 border-neutral-700 text-white focus:border-primary' : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-primary focus:bg-white'}`}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <div>
                                        <label className={`block text-[10px] font-bold ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-widest mb-2 ml-1`}>Status</label>
                                        <select
                                            value={paymentsFilter.status}
                                            onChange={(e) => setPaymentsFilter({ ...paymentsFilter, status: e.target.value })}
                                            className={`border rounded-xl py-2.5 px-4 text-sm outline-none transition-all ${isDarkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'}`}
                                        >
                                            <option value="">All</option>
                                            <option value="PAID">Paid</option>
                                            <option value="PENDING">Pending</option>
                                            <option value="FAILED">Failed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={`block text-[10px] font-bold ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-widest mb-2 ml-1`}>From</label>
                                        <input
                                            type="date"
                                            value={paymentsFilter.dateFrom}
                                            onChange={(e) => setPaymentsFilter({ ...paymentsFilter, dateFrom: e.target.value })}
                                            className={`border rounded-xl py-2.5 px-4 text-sm outline-none ${isDarkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-[10px] font-bold ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-widest mb-2 ml-1`}>To</label>
                                        <input
                                            type="date"
                                            value={paymentsFilter.dateTo}
                                            onChange={(e) => setPaymentsFilter({ ...paymentsFilter, dateTo: e.target.value })}
                                            className={`border rounded-xl py-2.5 px-4 text-sm outline-none ${isDarkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} rounded-2xl border overflow-hidden`}>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm min-w-[1000px]">
                                        <thead>
                                            <tr className={`${isDarkMode ? 'bg-neutral-700/50 text-neutral-400' : 'bg-neutral-50 text-neutral-500'} text-[10px] font-bold uppercase tracking-widest border-b ${isDarkMode ? 'border-neutral-700' : 'border-neutral-100'}`}>
                                                <th className="px-6 py-5">Transaction code</th>
                                                <th className="px-6 py-5">Phone</th>
                                                <th className="px-6 py-5">Amount</th>
                                                <th className="px-6 py-5">Status</th>
                                                <th className="px-6 py-5">Timestamp</th>
                                                <th className="px-6 py-5">Registration ID</th>
                                                <th className="px-6 py-5 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDarkMode ? 'divide-neutral-700' : 'divide-neutral-100'}`}>
                                            {loading && payments.length === 0 ? (
                                                <tr><td colSpan={7} className="py-20 text-center text-neutral-500">Loading payments...</td></tr>
                                            ) : payments.length === 0 ? (
                                                <tr><td colSpan={7} className="py-20 text-center text-neutral-500">No payments found.</td></tr>
                                            ) : (
                                                payments.map((p: any) => (
                                                    <tr key={p.id} className={`transition-colors ${isDarkMode ? 'hover:bg-neutral-700/30' : 'hover:bg-neutral-50'}`}>
                                                        <td className="px-6 py-5 font-mono text-xs">{p.mpesaReceiptNumber || '—'}</td>
                                                        <td className="px-6 py-5">{p.phone || '—'}</td>
                                                        <td className="px-6 py-5 font-bold">KES {(p.amount || 0).toLocaleString()}</td>
                                                        <td className="px-6 py-5">
                                                            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${p.status === 'PAID' ? 'bg-primary/20 text-primary-dark' : p.status === 'FAILED' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-600'}`}>
                                                                {p.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 text-xs tabular-nums">{p.transactionDate ? String(p.transactionDate).slice(0, 8) : formatDate(p.createdAt)}</td>
                                                        <td className="px-6 py-5">
                                                            <a href={`/profile/${p.registrationId}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-primary hover:underline">
                                                                {p.registrationId}
                                                            </a>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <a href={`/profile/${p.registrationId}`} target="_blank" rel="noopener noreferrer" className={`text-sm font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary'}`}>View profile</a>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className={`p-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-50 border-neutral-100'}`}>
                                    <div className={`text-xs font-medium ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                        Showing {(paymentsPagination.page - 1) * paymentsPagination.limit + 1} to {Math.min(paymentsPagination.page * paymentsPagination.limit, paymentsPagination.total)} of {paymentsPagination.total}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setPaymentsPagination({ ...paymentsPagination, page: Math.max(1, paymentsPagination.page - 1) })}
                                            disabled={paymentsPagination.page === 1}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold ${paymentsPagination.page === 1 ? 'opacity-50 cursor-not-allowed ' + (isDarkMode ? 'bg-neutral-900 text-neutral-600' : 'bg-neutral-100 text-neutral-400') : isDarkMode ? 'bg-neutral-700 hover:bg-neutral-600 text-white' : 'bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600'}`}
                                        >
                                            <AiOutlineLeft className="text-[16px]" /> Previous
                                        </button>
                                        <span className={`px-4 py-2 rounded-lg text-xs font-bold ${isDarkMode ? 'bg-neutral-900 text-neutral-400' : 'bg-neutral-100 text-neutral-600'}`}>
                                            Page {paymentsPagination.page} of {paymentsPagination.pages}
                                        </span>
                                        <button
                                            onClick={() => setPaymentsPagination({ ...paymentsPagination, page: Math.min(paymentsPagination.pages, paymentsPagination.page + 1) })}
                                            disabled={paymentsPagination.page === paymentsPagination.pages}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold ${paymentsPagination.page === paymentsPagination.pages ? 'opacity-50 cursor-not-allowed ' + (isDarkMode ? 'bg-neutral-900 text-neutral-600' : 'bg-neutral-100 text-neutral-400') : isDarkMode ? 'bg-neutral-700 hover:bg-neutral-600 text-white' : 'bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600'}`}
                                        >
                                            Next <AiOutlineRight className="text-[16px]" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {activeView === 'raffle' && (
                        <>
                            <div className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} p-4 md:p-6 rounded-2xl border flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-end`}>
                                <div className="flex-1 min-w-[180px]">
                                    <label className={`block text-[10px] font-bold ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-widest mb-2 ml-1`}>Search</label>
                                    <div className="relative">
                                        <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xl" />
                                        <input
                                            type="text"
                                            value={raffleFilter.search}
                                            onChange={(e) => setRaffleFilter({ ...raffleFilter, search: e.target.value })}
                                            placeholder="Ticket ID, email, phone, name..."
                                            className={`w-full border rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all ${isDarkMode ? 'bg-neutral-900 border-neutral-700 text-white focus:border-primary' : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-primary focus:bg-white'}`}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-end gap-2">
                                    <div>
                                        <label className={`block text-[10px] font-bold ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-widest mb-2 ml-1`}>Status</label>
                                        <select
                                            value={raffleFilter.status}
                                            onChange={(e) => setRaffleFilter({ ...raffleFilter, status: e.target.value })}
                                            className={`border rounded-xl py-2.5 px-4 text-sm outline-none ${isDarkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'}`}
                                        >
                                            <option value="">All</option>
                                            <option value="UNPAID">Unpaid</option>
                                            <option value="PAID">Paid</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleDownloadRaffleTickets}
                                        disabled={isPrintingRaffle}
                                        className={`px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold transition-all hover:bg-primary-dark flex items-center gap-2 ${isPrintingRaffle ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <AiOutlineDownload className="text-lg" />
                                        {isPrintingRaffle ? 'Generating...' : 'Download PDF (A4)'}
                                    </button>
                                </div>
                            </div>
                            <div className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} rounded-2xl border overflow-hidden`}>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm min-w-[900px]">
                                        <thead>
                                            <tr className={`${isDarkMode ? 'bg-neutral-700/50 text-neutral-400' : 'bg-neutral-50 text-neutral-500'} text-[10px] font-bold uppercase tracking-widest border-b ${isDarkMode ? 'border-neutral-700' : 'border-neutral-100'}`}>
                                                <th className="px-6 py-5">Ticket ID</th>
                                                <th className="px-6 py-5">Name</th>
                                                <th className="px-6 py-5">Email</th>
                                                <th className="px-6 py-5">Phone</th>
                                                <th className="px-6 py-5">Status</th>
                                                <th className="px-6 py-5">Created</th>
                                                <th className="px-6 py-5 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDarkMode ? 'divide-neutral-700' : 'divide-neutral-100'}`}>
                                            {loading && raffleTickets.length === 0 ? (
                                                <tr><td colSpan={7} className="py-20 text-center text-neutral-500">Loading raffle tickets...</td></tr>
                                            ) : raffleTickets.length === 0 ? (
                                                <tr><td colSpan={7} className="py-20 text-center text-neutral-500">No raffle tickets found.</td></tr>
                                            ) : (
                                                raffleTickets.map((t: any) => (
                                                    <tr key={t.id} className={`transition-colors ${isDarkMode ? 'hover:bg-neutral-700/30' : 'hover:bg-neutral-50'}`}>
                                                        <td className="px-6 py-5 font-mono font-bold">{t.id}</td>
                                                        <td className="px-6 py-5">{capitalizeWords(t.firstName || '')} {capitalizeWords(t.lastName || '')}</td>
                                                        <td className="px-6 py-5 text-xs">{t.email || '—'}</td>
                                                        <td className="px-6 py-5 text-xs">{t.phoneNumber || '—'}</td>
                                                        <td className="px-6 py-5">
                                                            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${t.status === 'PAID' ? 'bg-primary/20 text-primary-dark' : 'bg-amber-500/10 text-amber-600'}`}>
                                                                {t.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 text-xs tabular-nums">{formatDate(t.createdAt)}</td>
                                                        <td className="px-6 py-5 text-right">
                                                            <a href={`/raffle/profile/${t.id}`} target="_blank" rel="noopener noreferrer" className={`text-sm font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary'}`}>View ticket</a>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className={`p-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-50 border-neutral-100'}`}>
                                    <div className={`text-xs font-medium ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                        Showing {(rafflePagination.page - 1) * rafflePagination.limit + 1} to {Math.min(rafflePagination.page * rafflePagination.limit, rafflePagination.total)} of {rafflePagination.total}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setRafflePagination({ ...rafflePagination, page: Math.max(1, rafflePagination.page - 1) })}
                                            disabled={rafflePagination.page === 1}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold ${rafflePagination.page === 1 ? 'opacity-50 cursor-not-allowed ' + (isDarkMode ? 'bg-neutral-900 text-neutral-600' : 'bg-neutral-100 text-neutral-400') : isDarkMode ? 'bg-neutral-700 hover:bg-neutral-600 text-white' : 'bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600'}`}
                                        >
                                            <AiOutlineLeft className="text-[16px]" /> Previous
                                        </button>
                                        <span className={`px-4 py-2 rounded-lg text-xs font-bold ${isDarkMode ? 'bg-neutral-900 text-neutral-400' : 'bg-neutral-100 text-neutral-600'}`}>
                                            Page {rafflePagination.page} of {rafflePagination.pages}
                                        </span>
                                        <button
                                            onClick={() => setRafflePagination({ ...rafflePagination, page: Math.min(rafflePagination.pages, rafflePagination.page + 1) })}
                                            disabled={rafflePagination.page === rafflePagination.pages}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold ${rafflePagination.page === rafflePagination.pages ? 'opacity-50 cursor-not-allowed ' + (isDarkMode ? 'bg-neutral-900 text-neutral-600' : 'bg-neutral-100 text-neutral-400') : isDarkMode ? 'bg-neutral-700 hover:bg-neutral-600 text-white' : 'bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600'}`}
                                        >
                                            Next <AiOutlineRight className="text-[16px]" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {activeView === 'pricing' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Pricing Categories</h2>
                                    <p className={`text-sm ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Manage pricing rules for all circuits and categories</p>
                                </div>
                                <div className={`px-4 py-2 rounded-xl ${isDarkMode ? 'bg-neutral-800' : 'bg-white'} border ${isDarkMode ? 'border-neutral-700' : 'border-neutral-200'}`}>
                                    <span className={`text-xs font-bold ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Total Categories: </span>
                                    <span className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{pricingCategories.length}</span>
                                </div>
                            </div>

                            {loading ? (
                                <div className="py-20 text-center text-neutral-500">Loading pricing categories...</div>
                            ) : Object.keys(groupedCategories).length === 0 ? (
                                <div className="py-20 text-center text-neutral-500">No pricing categories found.</div>
                            ) : (
                                Object.entries(groupedCategories).map(([circuitId, categories]: [string, any]) => (
                                    <div key={circuitId} className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} rounded-2xl border overflow-hidden`}>
                                        <div className={`px-6 py-4 border-b ${isDarkMode ? 'bg-neutral-700/50 border-neutral-700' : 'bg-neutral-50 border-neutral-100'}`}>
                                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                                {CIRCUITS.find(c => c.id === circuitId)?.title || circuitId.toUpperCase()}
                                            </h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm min-w-[800px]">
                                                <thead>
                                                    <tr className={`${isDarkMode ? 'bg-neutral-700/30 text-neutral-400' : 'bg-neutral-50 text-neutral-500'} text-[10px] font-bold uppercase tracking-widest border-b ${isDarkMode ? 'border-neutral-700' : 'border-neutral-100'}`}>
                                                        <th className="px-6 py-4">Category</th>
                                                        <th className="px-6 py-4">Type</th>
                                                        <th className="px-6 py-4">Age Range</th>
                                                        <th className="px-6 py-4 text-center">Color</th>
                                                        <th className="px-6 py-4">BIB Range</th>
                                                        <th className="px-6 py-4">Remarks</th>
                                                    </tr>
                                                </thead>
                                                <tbody className={`divide-y ${isDarkMode ? 'divide-neutral-700' : 'divide-neutral-100'}`}>
                                                    {categories.map((cat: any) => (
                                                        <tr key={cat.id} className={`transition-colors ${isDarkMode ? 'hover:bg-neutral-700/30' : 'hover:bg-neutral-50'}`}>
                                                            <td className="px-6 py-4">
                                                                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{cat.categoryName}</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="text-xs text-neutral-500 uppercase">{cat.type}</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`text-xs ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                                                    {cat.minAge !== null && cat.maxAge !== null
                                                                        ? `${cat.minAge}-${cat.maxAge}`
                                                                        : cat.familyCategory
                                                                            ? cat.familyCategory
                                                                            : 'All Ages'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <div
                                                                    className="inline-block w-12 h-6 rounded border border-neutral-200"
                                                                    style={{
                                                                        backgroundColor: cat.hexColor
                                                                    }}
                                                                ></div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`font-mono text-xs ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>{cat.regRange}</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`text-xs ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>{cat.remarks || '—'}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Registration details side panel */}
            {isDetailsOpen && selectedRegistration && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={() => { setIsDetailsOpen(false); setSelectedRegistration(null); }}
                        aria-hidden
                    />
                    <aside
                        className={`fixed top-0 right-0 w-full max-w-md h-full z-50 overflow-y-auto border-l ${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}`}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                    Registration details
                                </h2>
                                <button
                                    onClick={() => { setIsDetailsOpen(false); setSelectedRegistration(null); }}
                                    className={`size-9 rounded-lg flex items-center justify-center ${isDarkMode ? 'hover:bg-neutral-700 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-500'}`}
                                >
                                    <AiOutlineClose className="text-xl" />
                                </button>
                            </div>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Pass ID</p>
                                    <p className={`font-mono font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{selectedRegistration.id}</p>
                                </div>
                                <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Participant</p>
                                    <p className={isDarkMode ? 'text-white' : 'text-neutral-900'}>
                                        {capitalizeWords(selectedRegistration.firstName || '')} {capitalizeWords(selectedRegistration.lastName || '')}
                                    </p>
                                    {selectedRegistration.teamName && (
                                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Team: {selectedRegistration.teamName}</p>
                                    )}
                                </div>
                                <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Category / Circuit</p>
                                    <p className={isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}>{selectedRegistration.category || '—'} · {CIRCUITS.find(c => c.id === selectedRegistration.circuitId)?.title || selectedRegistration.circuitId}</p>
                                </div>
                                <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Type / T-shirt</p>
                                    <p className={isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}>{selectedRegistration.type} · {selectedRegistration.tshirtSize || '—'}</p>
                                </div>
                                <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Contact</p>
                                    <p className={isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}>{selectedRegistration.email || '—'}</p>
                                    <p className={isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}>{selectedRegistration.phoneNumber || '—'}</p>
                                </div>
                                <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Emergency</p>
                                    <p className={isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}>{selectedRegistration.emergencyContactName || '—'}</p>
                                    <p className={isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}>{selectedRegistration.emergencyPhone || '—'}</p>
                                </div>
                                <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Payment</p>
                                    <p className={isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}>Status: {selectedRegistration.status} · KES {(selectedRegistration.totalAmount ?? 0).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="mt-8 flex flex-col gap-2">
                                <a
                                    href={`/profile/${selectedRegistration.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3 rounded-xl bg-primary text-white text-center text-sm font-bold hover:bg-primary-dark transition-all"
                                >
                                    Open full profile
                                </a>
                                <a
                                    href={`/payment/${selectedRegistration.id}`}
                                    className={`w-full py-3 rounded-xl border text-center text-sm font-bold transition-all ${isDarkMode ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-700' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'}`}
                                >
                                    Go to payment
                                </a>
                            </div>
                        </div>
                    </aside>
                </>
            )}

            {/* Hidden Print Containers */}
            <div className="hidden pointer-events-none absolute invisible overflow-hidden h-0 w-0">
                {isPrintingRaffle && <AdminRaffleTicketsPrint tickets={raffleTickets} />}
                {isPrintingBibs && <AdminBibNumbersPrint registrations={getBibRegistrationData()} />}
            </div>
        </div>
    );
};

const StatCardFlat = ({ label, value, icon, color, trend, isDarkMode }: any) => {
    const iconBg = color === 'primary' ? 'bg-primary/10' : color === 'amber' ? 'bg-amber-500/10' : color === 'blue' ? 'bg-blue-500/10' : color === 'red' ? 'bg-red-500/10' : 'bg-green-500/10';
    const iconColor = color === 'primary' ? 'text-primary' : color === 'amber' ? 'text-amber-600' : color === 'blue' ? 'text-blue-600' : color === 'red' ? 'text-red-500' : 'text-green-600';

    return (
        <div className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} p-8 rounded-[32px] border transition-all hover:border-primary/30 group`}>
            <div className="flex justify-between items-start mb-6">
                <div className={`size-14 rounded-2xl flex items-center justify-center text-2xl ${iconBg} ${iconColor} transition-transform group-hover:scale-110`}>
                    {icon}
                </div>
                <div className="text-right">
                    <p className={`text-[10px] font-black ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-[0.2em] mb-1`}>{label}</p>
                    {trend && <span className="text-[10px] font-black text-primary opacity-80">{trend}</span>}
                </div>
            </div>
            <div className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-neutral-900'} tracking-tighter`}>
                {value}
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color, isDarkMode, isString }: any) => {
    const iconBg = color === 'primary' ? 'bg-primary/10' : color === 'amber' ? 'bg-amber-500/10' : color === 'red' ? 'bg-red-500/10' : 'bg-primary/10';
    const iconColor = color === 'primary' ? 'text-primary' : color === 'amber' ? 'text-amber-600' : color === 'red' ? 'text-red-600' : 'text-primary';
    return (
        <div className={`${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} p-6 rounded-2xl border`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`size-10 rounded-xl flex items-center justify-center text-xl ${iconBg} ${iconColor}`}>
                    {icon}
                </div>
                <span className={`text-[10px] font-bold ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-[0.2em]`}>{label}</span>
            </div>
            <div className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                {isString ? value : (typeof value === 'number' ? value.toLocaleString() : value)}
            </div>
        </div>
    );
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'PAID': return 'bg-primary/20 text-primary-dark dark:text-primary-light';
        case 'CONFIRMED': return 'bg-primary text-white';
        case 'CANCELLED': return 'bg-red-500/10 text-red-500';
        default: return 'bg-yellow-500/10 text-yellow-500';
    }
};

export { AdminDashboard as default };
