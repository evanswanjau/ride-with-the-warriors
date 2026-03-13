import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
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
import RegisterPage from './pages/RegisterPage';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import RafflePage from './pages/RafflePage';
import RaffleSuccessPage from './pages/RaffleSuccessPage';
import RaffleProfilePage from './pages/RaffleProfilePage';
import RafflePaymentPageRoute from './pages/RafflePaymentPageRoute';

import ScrollToTop from './utils/ScrollToTop';
import PageTitle from './utils/PageTitle';

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
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Layout isFullWidth><HomePage /></Layout>} />
        <Route path="/military" element={<MilitaryRedirect />} />
        <Route path="/about" element={<Layout isFullWidth><AboutUs /></Layout>} />
        <Route path="/circuits" element={<Layout isFullWidth><Circuits /></Layout>} />
        <Route path="/contact" element={<Layout isFullWidth><ContactUs /></Layout>} />
        <Route path="/gallery" element={<Layout isFullWidth><Gallery /></Layout>} />
        <Route path="/faqs" element={<Layout isFullWidth><Faqs /></Layout>} />

        {/* Registration Flow */}
        <Route path="/register/step/:stepId" element={<RegisterPage />} />
        <Route path="/military/register/step/:stepId" element={<RegisterPage />} />

        {/* Payment & Success */}
        <Route path="/payment/:regId" element={<PaymentPage />} />
        <Route path="/success/:regId" element={<SuccessPage />} />

        {/* Profile & Search */}
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile/:id" element={<Layout><ProfilePage /></Layout>} />

        {/* Raffle Flow */}
        <Route path="/raffle/step/:stepId" element={<RafflePage />} />
        <Route path="/raffle/payment/:id" element={<RafflePaymentPageRoute />} />
        <Route path="/raffle/success/:id" element={<RaffleSuccessPage />} />
        <Route path="/raffle/profile/:id" element={<RaffleProfilePage />} />

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

