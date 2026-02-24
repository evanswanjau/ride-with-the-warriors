import { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import RaffleTicketView from '../components/RaffleTicketView';
import { API_BASE_URL } from '../config';

const RaffleProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetch(`${API_BASE_URL}/raffle/${id.toUpperCase()}`)
            .then(res => res.json())
            .then(data => {
                if (data.ticket) {
                    setTicket(data.ticket);
                } else {
                    setError('Raffle ticket not found.');
                }
            })
            .catch(() => setError('Failed to load ticket. Please try again.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (!id) return <Navigate to="/search" replace />;

    if (loading) {
        return (
            <Layout maxWidth="max-w-lg">
                <div className="flex items-center justify-center py-24">
                    <div className="flex flex-col items-center gap-4">
                        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <p className="text-sm text-neutral-400 font-medium">Loading raffle ticket...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout maxWidth="max-w-lg">
                <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
                    <div className="text-5xl">🎟️</div>
                    <h2 className="text-xl font-black text-neutral-900 dark:text-white">Ticket Not Found</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{error}</p>
                    <button
                        onClick={() => navigate('/search')}
                        className="px-6 py-3 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all"
                    >
                        Search Again
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout maxWidth="max-w-5xl">
            <RaffleTicketView
                ticket={ticket}
                onBack={() => navigate('/search')}
            />
        </Layout>
    );
};

export default RaffleProfilePage;
