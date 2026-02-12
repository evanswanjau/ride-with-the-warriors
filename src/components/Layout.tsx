import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
    children: React.ReactNode;
    registrationType?: string;
    isFullWidth?: boolean;
    maxWidth?: string;
}

const Layout = ({ children, registrationType, isFullWidth = false, maxWidth = 'max-w-6xl' }: LayoutProps) => {
    return (
        <div
            className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-display antialiased"
            data-theme={registrationType === 'team' ? 'team' : 'individual'}
        >
            <Navbar />
            <main className={`flex flex-1 flex-col ${isFullWidth ? '' : 'pt-20 md:pt-24 lg:pt-28'}`}>
                <div className={`w-full ${isFullWidth ? '' : `${maxWidth} mx-auto px-4 pb-12`}`}>
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
