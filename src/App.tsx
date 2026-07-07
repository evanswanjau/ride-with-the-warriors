import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { RegistrationProvider, useRegistration } from './context/RegistrationContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import Circuits from './pages/Circuits';
import ContactUs from './pages/ContactUs';
import Gallery from './pages/Gallery';
import Faqs from './pages/Faqs';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import RegistrationClosedPage from './pages/RegistrationClosedPage';
import NotifyPage from './pages/NotifyPage';
import FeedbackPage from './pages/FeedbackPage';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import RaffleClosedPage from './pages/RaffleClosedPage';
import RaffleSuccessPage from './pages/RaffleSuccessPage';
import RaffleProfilePage from './pages/RaffleProfilePage';
import RaffleEmailProfilePage from './pages/RaffleEmailProfilePage';
import RafflePaymentPageRoute from './pages/RafflePaymentPageRoute';
import DonatePage from './pages/DonatePage';
import ResultsPage from './pages/ResultsPage';
import RaffleWinnersPage from './pages/RaffleWinnersPage';

import ScrollToTop from './utils/ScrollToTop';
import PageTitle from './utils/PageTitle';
import ReferralCapture from './components/ReferralCapture';

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

        {/* Registration Flow — closed; redirect all register paths to closed page */}
        <Route path="/register/closed" element={<RegistrationClosedPage />} />
        <Route path="/register/notify" element={<NotifyPage />} />
        <Route path="/register/*" element={<RegistrationClosedPage />} />
        <Route path="/military/register/*" element={<RegistrationClosedPage />} />

        {/* Payment & Success */}
        <Route path="/payment/:regId" element={<PaymentPage />} />
        <Route path="/success/:regId" element={<SuccessPage />} />

        {/* Profile — search is disabled; profiles remain reachable by direct URL */}
        <Route path="/search" element={<Navigate to="/" replace />} />
        <Route path="/profile/:id" element={<Layout><ProfilePage /></Layout>} />

        {/* Raffle Flow — closed; profiles and payments for existing tickets remain reachable */}
        <Route path="/raffle/closed" element={<RaffleClosedPage />} />
        <Route path="/raffle/step/*" element={<RaffleClosedPage />} />
        <Route path="/raffle/payment/:id" element={<RafflePaymentPageRoute />} />
        <Route path="/raffle/success/:id" element={<RaffleSuccessPage />} />
        <Route path="/raffle/profile/:id" element={<RaffleProfilePage />} />
        <Route path="/raffle/profile/email/:email" element={<RaffleEmailProfilePage />} />

        {/* Legal */}
        <Route path="/terms-and-conditions" element={<TermsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />

        {/* Admin */}
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </RegistrationProvider>
  );
};

export default App;

