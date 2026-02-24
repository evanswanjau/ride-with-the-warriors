import { useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import PaymentPage from '../components/registration/PaymentPage';

const PaymentPageRoute = () => {
    const { regId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { amount, email, phoneNumber } = (location.state as any) || { amount: 0, email: '', phoneNumber: '' };

    if (!regId) return <Navigate to="/" replace />;

    return (
        <PaymentPage
            registrationId={regId}
            amount={amount}
            email={email}
            phoneNumber={phoneNumber}
            onBack={() => navigate(-1)}
            onSuccess={() => navigate(`/success/${regId}`)}
        />
    );
};

export default PaymentPageRoute;
