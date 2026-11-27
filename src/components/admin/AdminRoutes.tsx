import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import type { AdminUser } from '../../types';
import AdminLayout from './AdminLayout';

// Each page loads on first visit; the charts library is only fetched for Overview and Analytics.
const OverviewPage = lazy(() => import('./pages/OverviewPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const RegistrationsPage = lazy(() => import('./pages/RegistrationsPage'));
const RafflePage = lazy(() => import('./pages/RafflePage'));
const PaymentsPage = lazy(() => import('./pages/PaymentsPage'));
const DonationsPage = lazy(() => import('./pages/DonationsPage'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'));
const BibsPage = lazy(() => import('./pages/BibsPage'));
const BikeHiresPage = lazy(() => import('./pages/BikeHiresPage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));
const ReferralsPage = lazy(() => import('./pages/ReferralsPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));

/** The pages under /admin. Paths match the sidebar (nav.ts); an unknown path shows the Overview. */
export default function AdminRoutes({ admin, onLogout }: { admin: AdminUser | null; onLogout: () => void }) {
    return (
        <Routes>
            <Route element={<AdminLayout admin={admin} onLogout={onLogout} />}>
                <Route index element={<OverviewPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="registrations" element={<RegistrationsPage />} />
                <Route path="raffle" element={<RafflePage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="donations" element={<DonationsPage />} />
                <Route path="feedback" element={<FeedbackPage />} />
                <Route path="bibs" element={<BibsPage />} />
                <Route path="bike-hires" element={<BikeHiresPage />} />
                <Route path="communications" element={<MessagesPage />} />
                <Route path="referrals" element={<ReferralsPage />} />
                <Route path="pricing" element={<PricingPage />} />
                <Route path="*" element={<OverviewPage />} />
            </Route>
        </Routes>
    );
}
