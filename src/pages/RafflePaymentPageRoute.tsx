import { useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import RafflePaymentPage from '../components/RafflePaymentPage';

const RafflePaymentPageRoute = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    if (!id) return <Navigate to="/raffle/step/1" replace />;

    const { email = '', phoneNumber = '' } = (location.state as any) || {};

    return (
        <RafflePaymentPage
            ticketId={id}
            email={email}
            phoneNumber={phoneNumber}
            onBack={() => navigate(`/raffle/step/2`, { state: location.state })}
            onSuccess={() => navigate(`/raffle/success/${id}`)}
        />
    );
};

export default RafflePaymentPageRoute;
