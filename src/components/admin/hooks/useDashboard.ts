import { adminApi } from '../api/adminApi';
import { useLoad } from './useLoad';

/** GET /admin/dashboard?year= plus the headline numbers the Overview, Analytics and Raffle pages show. */
export function useDashboard(year: number | undefined) {
    const loaded = useLoad(() => adminApi.dashboard(year), `dashboard|${year ?? ''}`, 'Failed to load dashboard');
    const s = loaded.data?.summary;
    const totalPaid = s?.registrations?.paid ?? 0;
    const totalRegs = s?.registrations?.total ?? 1;
    const rafflePaid = s?.raffle?.paid ?? 0;
    const raffleTotal = s?.raffle?.total ?? 0;
    return {
        ...loaded,
        totals: {
            revenue: s?.revenue ?? 0,
            totalPaid,
            totalRegs,
            convRate: totalRegs > 0 ? Math.round((totalPaid / totalRegs) * 100) : 0,
            rafflePaid,
            raffleTotal,
            raffleUnpaid: raffleTotal - rafflePaid,
            raffleRevenue: s?.raffle?.revenue ?? 0,
            staleUnpaid: s?.pulse?.staleUnpaid ?? 0,
            avgPerDay: s?.pulse?.avgPerDay ?? 0,
        },
    };
}
