import Layout from '../components/Layout';
import { PrivacyPolicy } from '../components/LegalContent';

const PrivacyPage = () => {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="bg-white dark:bg-[#1c170d] rounded-[32px] border border-neutral-100 dark:border-neutral-800 p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <PrivacyPolicy />
                </div>
            </div>
        </Layout>
    );
};

export default PrivacyPage;
