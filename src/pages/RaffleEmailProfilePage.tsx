import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { API_BASE_URL } from '../config';
import { 
    AiOutlineArrowLeft, 
    AiOutlineCreditCard,
    AiOutlineArrowRight,
    AiOutlineCheckCircle,
    AiOutlineClockCircle,
    AiOutlineTeam
} from 'react-icons/ai';

interface RaffleTicket {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    createdAt: string;
}

const RaffleEmailProfilePage = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<RaffleTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [registration, setRegistration] = useState<any>(null);

    useEffect(() => {
        if (!email) return;

        // Find if user has a cycling registration
        fetch(`${API_BASE_URL}/profile/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchType: 'email', searchValue: email })
        })
            .then(res => res.json())
            .then(data => {
                if (data.registration) setRegistration(data.registration);
            })
            .catch(console.error);
    }, [email]);

    useEffect(() => {
        if (!email) return;

        setLoading(true);
        fetch(`${API_BASE_URL}/raffle/by-email/${encodeURIComponent(email)}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to load tickets');
                return res.json();
            })
            .then(data => {
                if (data.tickets) {
                    setTickets(data.tickets);
                } else {
                    setError('No raffle tickets found for this email.');
                }
            })
            .catch(err => {
                console.error('Error fetching tickets:', err);
                setError('Failed to load your tickets. Please try again later.');
            })
            .finally(() => setLoading(false));
    }, [email]);

    const unpaidTickets = tickets.filter(t => t.status === 'UNPAID');
    const paidTickets = tickets.filter(t => t.status !== 'UNPAID');

    const handlePayAll = () => {
        const ticketIds = unpaidTickets.map(t => t.id);
        const idsParam = ticketIds.join(',');
        navigate(`/raffle/payment/bulk?ids=${idsParam}`, { state: { ticketIds, amount: ticketIds.length * 1000 } });
    };

    const handlePayOne = (id: string) => {
        navigate(`/raffle/payment/${id}`, { state: { ticketIds: [id], amount: 1000 } });
    };

    if (loading) {
        return (
            <Layout>
                <div className="py-24 flex flex-col items-center gap-6">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="section-label animate-pulse text-neutral-500">Retrieving raffle entries...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="py-24 flex flex-col items-center text-center">
                    <div className="text-5xl mb-6">🏜️</div>
                    <h2 className="display-heading text-4xl mb-4 text-neutral-900 dark:text-white">No Tickets Found</h2>
                    <p className="text-neutral-500 dark:text-white/60 mb-8 max-w-sm">{error}</p>
                    <button
                        onClick={() => navigate('/search')}
                        className="shimmer-btn shimmer-btn--primary"
                    >
                        Back to Search
                    </button>
                </div>
            </Layout>
        );
    }

    const TicketList = ({ list, type }: { list: RaffleTicket[], type: 'unpaid' | 'paid' }) => (
        <div className="w-full overflow-hidden border border-neutral-200 dark:border-white/5 rounded-xl bg-white dark:bg-white/[0.02]">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-neutral-50 dark:bg-white/[0.03] border-b border-neutral-200 dark:border-white/5">
                            <th className="px-6 py-4 text-left font-display font-bold text-[10px] uppercase tracking-widest text-neutral-500 dark:text-white/40">Ticket ID</th>
                            <th className="px-6 py-4 text-left font-display font-bold text-[10px] uppercase tracking-widest text-neutral-500 dark:text-white/40">Registered On</th>
                            <th className="px-6 py-4 text-left font-display font-bold text-[10px] uppercase tracking-widest text-neutral-500 dark:text-white/40">Status</th>
                            <th className="px-6 py-4 text-left font-display font-bold text-[10px] uppercase tracking-widest text-neutral-500 dark:text-white/40">Amount</th>
                            <th className="px-6 py-4 text-right font-display font-bold text-[10px] uppercase tracking-widest text-neutral-500 dark:text-white/40">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                        {list.map((ticket) => (
                            <tr key={ticket.id} className="group hover:bg-neutral-50/50 dark:hover:bg-white/[0.01] transition-colors">
                                <td className="px-6 py-5 font-mono text-sm font-bold text-neutral-900 dark:text-white">{ticket.id}</td>
                                <td className="px-6 py-5 text-sm text-neutral-500 dark:text-white/50">
                                    {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-5">
                                    {type === 'unpaid' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                                            <AiOutlineClockCircle /> Pending
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                                            <AiOutlineCheckCircle /> Confirmed
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-5 text-sm font-bold text-neutral-900 dark:text-white">KES 1,000</td>
                                <td className="px-6 py-5 text-right">
                                    {type === 'unpaid' ? (
                                        <button
                                            onClick={() => handlePayOne(ticket.id)}
                                            className="shimmer-btn shimmer-btn--amber !px-4 !py-2 !text-[10px]"
                                            style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                                        >
                                            <AiOutlineArrowRight /> Pay Now
                                        </button>
                                    ) : (
                                        <Link
                                            to={`/raffle/profile/${ticket.id}`}
                                            className="shimmer-btn shimmer-btn--ghost !px-4 !py-2 !text-[10px]"
                                            style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                                        >
                                            <AiOutlineArrowRight /> Details
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <Layout maxWidth="max-w-7xl">
            <div className="py-12">
                <button 
                    onClick={() => navigate('/search')}
                    className="flex items-center gap-2 section-label hover:text-primary transition-colors mb-12 group"
                >
                    <AiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back to Search
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-px w-10 bg-primary" />
                            <span className="section-label">Raffle Records</span>
                        </div>
                        <h1 className="display-heading text-[clamp(2.5rem,5vw,4rem)] text-neutral-900 dark:text-white mb-2">
                            Your <span className="text-primary-light">Tickets</span>
                        </h1>
                        <p className="text-neutral-500 dark:text-white/50 font-medium">Managing entries for {email}</p>
                    </div>

                    {registration && (
                        <div 
                            className="p-4 bg-primary/5 border border-primary/20 flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-700"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
                        >
                            <div 
                                className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary text-xl"
                                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                            >
                                <AiOutlineTeam />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Cycling Entry Found</div>
                                <div className="text-xs font-bold text-neutral-900 dark:text-white mb-1">
                                    {registration.firstName} {registration.lastName}
                                </div>
                                <button 
                                    onClick={() => navigate(`/profile/${registration.id}`)}
                                    className="text-[10px] font-bold uppercase tracking-wider text-primary-light hover:underline flex items-center gap-1"
                                >
                                    View Cycle Profile <AiOutlineArrowRight />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* UNPAID SECTION */}
                {unpaidTickets.length > 0 && (
                    <div className="mb-20">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div>
                                <h2 className="display-heading text-3xl text-neutral-900 dark:text-white">Unpaid Entries</h2>
                                <p className="text-sm text-neutral-500 dark:text-white/40">These tickets require payment to be entered into the draw.</p>
                            </div>
                            {unpaidTickets.length > 1 && (
                                <button
                                    onClick={handlePayAll}
                                    className="shimmer-btn shimmer-btn--amber flex items-center gap-3 px-10"
                                >
                                    <AiOutlineCreditCard size={18} />
                                    Pay All Unpaid (KES {(unpaidTickets.length * 1000).toLocaleString()})
                                </button>
                            )}
                        </div>
                        <TicketList list={unpaidTickets} type="unpaid" />
                    </div>
                )}

                {/* PAID SECTION */}
                {paidTickets.length > 0 && (
                    <div className="mb-12">
                        <div className="mb-8">
                            <h2 className="display-heading text-3xl text-neutral-900 dark:text-white">Confirmed Entries</h2>
                            <p className="text-sm text-neutral-500 dark:text-white/40">Verified tickets safely recorded for the mission draw.</p>
                        </div>
                        <TicketList list={paidTickets} type="paid" />
                    </div>
                )}

                {tickets.length === 0 && !loading && (
                    <div className="text-center py-24 border border-dashed border-neutral-200 dark:border-white/10 rounded-2xl bg-neutral-50/30 dark:bg-white/[0.01]">
                        <p className="section-label opacity-40">No entries recorded under this account.</p>
                        <Link to="/raffle/step/1" className="shimmer-btn shimmer-btn--primary mt-10">Purchase Tickets</Link>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default RaffleEmailProfilePage;
