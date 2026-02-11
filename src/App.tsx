import { Routes, Route, Navigate } from 'react-router-dom';
import { RegistrationProvider } from './context/RegistrationContext';
import Layout from './components/Layout';
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

const App = () => {
  return (
    <RegistrationProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/register/step/1" replace />} />

        {/* Registration Flow */}
        <Route path="/register/step/:stepId" element={<RegisterPage />} />

        {/* Payment & Success */}
        <Route path="/payment/:regId" element={<PaymentPage />} />
        <Route path="/success/:regId" element={<SuccessPage />} />

        {/* Profile & Search */}
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile/:id" element={<Layout><ProfilePage /></Layout>} />

        {/* Info Pages */}
        <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
        <Route path="/faqs" element={<Layout><Faqs /></Layout>} />
        <Route path="/terms-and-conditions" element={<TermsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </RegistrationProvider>
  );
};

export default App;
