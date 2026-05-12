import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileView from '../components/profile/ProfileView';
import { useRegistration } from '../context/RegistrationContext';
import { API_BASE_URL } from '../config';

const ProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { foundRegistration, setFoundRegistration, setAllRaffleTickets } = useRegistration() as any;

    useEffect(() => {
        if (!foundRegistration && id) {
            fetch(`${API_BASE_URL}/profile/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ searchType: 'id', searchValue: id })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.registration) setFoundRegistration(data.registration);
                    if (data.allRaffleTickets) setAllRaffleTickets(data.allRaffleTickets);
                })
                .catch(console.error);
        }
    }, [id, foundRegistration, setFoundRegistration]);

    if (!foundRegistration) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

    return (
        <ProfileView
            registration={foundRegistration}
            onBack={() => navigate('/search')}
        />
    );
};

export default ProfilePage;
