import { useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import PaymentPage from '../components/PaymentPage';

const PaymentPageRoute = () => {
    const { regId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { amount, email } = (location.state as any) || { amount: 0, email: '' };

    if (!regId) return <Navigate to="/" replace />;

    return (
        <PaymentPage
            registrationId={regId}
            amount={amount}
            email={email}
            onBack={() => navigate(-1)}
            onSuccess={() => navigate(`/success/${regId}`)}
        />
    );
};

export default PaymentPageRoute;
