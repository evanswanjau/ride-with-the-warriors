import Layout from '../components/Layout';
import { TermsAndConditions } from '../components/LegalContent';

const TermsPage = () => {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="bg-white dark:bg-[#1c170d] rounded-[32px] border border-neutral-100 dark:border-neutral-800 p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <TermsAndConditions />
                </div>
            </div>
        </Layout>
    );
};

export default TermsPage;
