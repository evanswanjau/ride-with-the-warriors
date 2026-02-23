import { Routes, Route } from 'react-router-dom';
import { RegistrationProvider } from './context/RegistrationContext';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import AboutUs from './components/AboutUs';
import Participants from './components/Participants';
import Sponsors from './components/Sponsors';
import ContactUs from './components/ContactUs';
import Gallery from './components/Gallery';
import Faqs from './components/Faqs';
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

const App = () => {
  return (
    <RegistrationProvider>
      <ScrollToTop />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Layout isFullWidth><HomePage /></Layout>} />
        <Route path="/about" element={<Layout isFullWidth><AboutUs /></Layout>} />
        <Route path="/participants" element={<Layout><Participants /></Layout>} />
        <Route path="/sponsors" element={<Layout><Sponsors /></Layout>} />
        <Route path="/contact" element={<Layout><ContactUs /></Layout>} />
        <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
        <Route path="/faqs" element={<Layout><Faqs /></Layout>} />

        {/* Registration Flow */}
        <Route path="/register/step/:stepId" element={<RegisterPage />} />

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
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </RegistrationProvider>
  );
};

export default App;

