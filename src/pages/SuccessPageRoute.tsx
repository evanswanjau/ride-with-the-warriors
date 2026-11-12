import { useNavigate, useParams, Navigate } from 'react-router-dom';
import SuccessPage from '../components/registration/SuccessPage';

const SuccessPageRoute = () => {
    const { regId } = useParams();
    const navigate = useNavigate();

    if (!regId) return <Navigate to="/" replace />;

    return (
        <SuccessPage
            registrationId={regId}
            onViewProfile={() => navigate('/account')}
            onDone={() => navigate('/')}
        />
    );
};

export default SuccessPageRoute;
