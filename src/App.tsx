import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { RegistrationProvider, useRegistration } from './context/RegistrationContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import RequireAuth from './components/auth/RequireAuth';

import ScrollToTop from './utils/ScrollToTop';
import PageTitle from './utils/PageTitle';
import ReferralCapture from './components/ReferralCapture';

// Everything except the homepage loads on demand, so visitors only download
// the code (and heavy libraries such as recharts/xlsx/jspdf) for pages they open.
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Circuits = lazy(() => import('./pages/Circuits'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Faqs = lazy(() => import('./pages/Faqs'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const RegistrationClosedPage = lazy(() => import('./pages/RegistrationClosedPage'));
const NotifyPage = lazy(() => import('./pages/NotifyPage'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const SuccessPage = lazy(() => import('./pages/SuccessPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
// Rider portal (/account/*)
const PortalLayout = lazy(() => import('./portal/PortalLayout'));
const HomeScreen = lazy(() => import('./portal/screens/HomeScreen'));
const EntriesScreen = lazy(() => import('./portal/screens/EntriesScreen'));
const EntryScreen = lazy(() => import('./portal/screens/EntryScreen'));
const RidersScreen = lazy(() => import('./portal/screens/RidersScreen'));
const RiderScreen = lazy(() => import('./portal/screens/RiderScreen'));
const TicketsScreen = lazy(() => import('./portal/screens/TicketsScreen'));
const ProfileScreen = lazy(() => import('./portal/screens/ProfileScreen'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const RaffleClosedPage = lazy(() => import('./pages/RaffleClosedPage'));
const RaffleSuccessPage = lazy(() => import('./pages/RaffleSuccessPage'));
const RafflePaymentPageRoute = lazy(() => import('./pages/RafflePaymentPageRoute'));
const DonatePage = lazy(() => import('./pages/DonatePage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const RaffleWinnersPage = lazy(() => import('./pages/RaffleWinnersPage'));

const RouteFallback = () => <div className="min-h-screen" role="status" aria-label="Loading" />;

const MilitaryRedirect = () => {
  const { setIsMilitary } = useRegistration();
  const navigate = useNavigate();
  React.useEffect(() => {
    setIsMilitary(true);
    navigate('/military/register/step/1', { replace: true });
  }, [setIsMilitary, navigate]);
  return null;
};

const App = () => {
  return (
    <RegistrationProvider>
      <ScrollToTop />
      <PageTitle />
      <ReferralCapture />
      <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Layout isFullWidth><HomePage /></Layout>} />
        <Route path="/military" element={<MilitaryRedirect />} />
        <Route path="/about" element={<Layout isFullWidth><AboutUs /></Layout>} />
        <Route path="/circuits" element={<Layout isFullWidth><Circuits /></Layout>} />
        <Route path="/contact" element={<Layout isFullWidth><ContactUs /></Layout>} />
        <Route path="/gallery" element={<Layout isFullWidth><Gallery /></Layout>} />
        <Route path="/faqs" element={<Layout isFullWidth><Faqs /></Layout>} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/results" element={<Layout isFullWidth><ResultsPage /></Layout>} />
        <Route path="/raffle-winners" element={<Layout isFullWidth><RaffleWinnersPage /></Layout>} />

        {/* Participant accounts */}
        <Route path="/login" element={<Layout isFullWidth><LoginPage /></Layout>} />
        <Route path="/account" element={<RequireAuth><PortalLayout /></RequireAuth>}>
          <Route index element={<HomeScreen />} />
          <Route path="entries" element={<EntriesScreen />} />
          <Route path="entries/:groupId" element={<EntryScreen />} />
          <Route path="riders" element={<RidersScreen />} />
          <Route path="riders/:riderId" element={<RiderScreen />} />
          <Route path="tickets" element={<TicketsScreen />} />
          <Route path="profile" element={<ProfileScreen />} />
          <Route path="*" element={<Navigate to="/account" replace />} />
        </Route>

        {/* Registration Flow — closed; redirect all register paths to closed page.
            When it reopens, wrap the flow in <RequireAuth> (the API requires login). */}
        <Route path="/register/closed" element={<RegistrationClosedPage />} />
        <Route path="/register/notify" element={<NotifyPage />} />
        <Route path="/register/*" element={<RegistrationClosedPage />} />
        <Route path="/military/register/*" element={<RegistrationClosedPage />} />

        {/* Payment & Success */}
        <Route path="/payment/:regId" element={<RequireAuth><PaymentPage /></RequireAuth>} />
        <Route path="/success/:regId" element={<RequireAuth><SuccessPage /></RequireAuth>} />

        {/* Old public profile links now live in the participant's account */}
        <Route path="/search" element={<Navigate to="/account" replace />} />
        <Route path="/profile/:id" element={<Navigate to="/account" replace />} />

        {/* Raffle Flow — closed; profiles and payments for existing tickets remain reachable */}
        <Route path="/raffle/closed" element={<RaffleClosedPage />} />
        <Route path="/raffle/step/*" element={<RaffleClosedPage />} />
        <Route path="/raffle/payment/:id" element={<RequireAuth><RafflePaymentPageRoute /></RequireAuth>} />
        <Route path="/raffle/success/:id" element={<RequireAuth><RaffleSuccessPage /></RequireAuth>} />
        <Route path="/raffle/profile/*" element={<Navigate to="/account" replace />} />

        {/* Legal */}
        <Route path="/terms-and-conditions" element={<TermsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />

        {/* Admin */}
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
      </Suspense>
    </RegistrationProvider>
  );
};

export default App;

