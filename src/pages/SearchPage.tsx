import Layout from '../components/layout/Layout';
import ProfileLookup from '../components/profile/ProfileLookup';
import { useRegistration } from '../context/RegistrationContext';

const SearchPage = () => {
    const { setFoundRegistration } = useRegistration();

    return (
        <Layout>
            <ProfileLookup
                onFound={(reg: any) => setFoundRegistration(reg)}
                onRaffleFound={(ticket: any) => {
                    // Logic for raffle ticket found if needed in global state
                    console.log('Raffle ticket found:', ticket);
                }}
            />
        </Layout>
    );
};

export default SearchPage;

