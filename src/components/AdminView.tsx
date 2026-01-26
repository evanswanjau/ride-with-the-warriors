import { useState, useEffect } from 'react';

interface Registration {
    id: string;
    createdAt: string;
    circuitId: string;
    type: string;
    status: string;
    payload: any;
    pricing: any;
}

const AdminView = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:4000/api/v1/admin/registrations');
            const data = await response.json();
            setRegistrations(data.registrations || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load registrations');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getParticipantName = (reg: Registration) => {
        if (reg.type === 'individual') {
            const rider = reg.payload.riderDetails;
            return `${rider.firstName} ${rider.lastName}`;
        } else if (reg.type === 'team') {
            return reg.payload.teamDetails.teamName;
        } else {
            return reg.payload.familyDetails.guardian.fullName;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-neutral-600 dark:text-neutral-400">Loading registrations...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <button
                        onClick={fetchRegistrations}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                        Registration Admin
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Total Registrations: {registrations.length}
                    </p>
                </div>

                {registrations.length === 0 ? (
                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-12 text-center">
                        <span className="material-symbols-outlined text-6xl text-neutral-300 dark:text-neutral-600 mb-4">
                            inbox
                        </span>
                        <p className="text-neutral-600 dark:text-neutral-400">No registrations yet</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-neutral-100 dark:bg-neutral-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                                            Name/Team
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                                            Circuit
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                    {registrations.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-neutral-500 dark:text-neutral-400">
                                                {reg.id.substring(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-white">
                                                {getParticipantName(reg)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-300 capitalize">
                                                {reg.circuitId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-300 capitalize">
                                                {reg.type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">
                                                KES {reg.pricing.totalAmount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                    {reg.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                                                {formatDate(reg.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminView;
