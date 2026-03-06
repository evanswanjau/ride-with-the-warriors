import { useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import RafflePaymentPage from '../components/raffle/RafflePaymentPage';

const RafflePaymentPageRoute = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    if (!id) return <Navigate to="/raffle/step/1" replace />;

    const { email = '', phoneNumber = '', ticketIds = [], amount = 1000 } = (location.state as any) || {};

    return (
        <RafflePaymentPage
            ticketId={id}
            ticketIds={ticketIds.length > 0 ? ticketIds : [id]}
            email={email}
            phoneNumber={phoneNumber}
            amount={amount}
            onBack={() => navigate(`/raffle/step/2`, { state: location.state })}
            onSuccess={() => navigate(`/raffle/success/${id}`)}
        />
    );
};

export default RafflePaymentPageRoute;
