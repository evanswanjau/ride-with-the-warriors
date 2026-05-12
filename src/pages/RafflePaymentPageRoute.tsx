import { useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import RafflePaymentPage from '../components/raffle/RafflePaymentPage';

const RafflePaymentPageRoute = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    if (!id) return <Navigate to="/raffle/step/1" replace />;

    const queryParams = new URLSearchParams(location.search);
    const queryIds = queryParams.get('ids');
    
    const state = (location.state as any) || {};
    
    // Determine ticket IDs: Priority 1: Query Params (for bulk), Priority 2: State, Priority 3: URL ID
    let ticketIdsToUse: string[] = [];
    if (id === 'bulk' && queryIds) {
        ticketIdsToUse = queryIds.split(',').filter(i => !!i);
    } else if (state.ticketIds && state.ticketIds.length > 0) {
        ticketIdsToUse = state.ticketIds;
    } else {
        ticketIdsToUse = [id];
    }

    const { firstName = '', lastName = '', email = '', phoneNumber = '', amount } = state;
    
    // Calculate amount: Priority 1: State amount, Priority 2: Calculated from ticketIds
    const calculatedAmount = amount || (ticketIdsToUse.length * 1000);

    return (
        <RafflePaymentPage
            ticketId={id === 'bulk' ? ticketIdsToUse[0] : id}
            ticketIds={ticketIdsToUse}
            firstName={firstName}
            lastName={lastName}
            email={email}
            phoneNumber={phoneNumber}
            amount={calculatedAmount}
            onBack={() => navigate(`/raffle/step/2`, { state: location.state })}
            onSuccess={() => navigate(`/raffle/success/${id === 'bulk' ? ticketIdsToUse[0] : id}`, { state: { ticketIds: ticketIdsToUse } })}
        />
    );
};

export default RafflePaymentPageRoute;
