import { useNavigate, useParams, Navigate } from 'react-router-dom';
import SuccessPage from '../components/SuccessPage';
import { useRegistration } from '../context/RegistrationContext';
import { API_BASE_URL } from '../config';

const SuccessPageRoute = () => {
    const { regId } = useParams();
    const navigate = useNavigate();
    const { setFoundRegistration } = useRegistration() as any; // Temporary cast until we refine the context

    if (!regId) return <Navigate to="/" replace />;

    return (
        <SuccessPage
            registrationId={regId}
            onViewProfile={async () => {
                const response = await fetch(`${API_BASE_URL}/profile/search`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ searchType: 'id', searchValue: regId })
                });
                const data = await response.json();
                if (response.ok) {
                    setFoundRegistration(data.registration);
                    navigate(`/profile/${regId}`);
                }
            }}
            onDone={() => navigate('/')}
        />
    );
};

export default SuccessPageRoute;
