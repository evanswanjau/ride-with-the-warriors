import Layout from '../components/Layout';
import ProfileLookup from '../components/ProfileLookup';
import { useRegistration } from '../context/RegistrationContext';

const SearchPage = () => {
    const { setFoundRegistration } = useRegistration();

    return (
        <Layout>
            <ProfileLookup onFound={(reg) => setFoundRegistration(reg)} />
        </Layout>
    );
};

export default SearchPage;
