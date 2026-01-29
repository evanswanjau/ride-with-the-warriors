import Navbar from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
    registrationType?: string;
}

const Layout = ({ children, registrationType }: LayoutProps) => {
    return (
        <div
            className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-display antialiased"
            data-theme={registrationType === 'team' ? 'team' : 'individual'}
        >
            <Navbar />
            <main className="flex flex-1 flex-col items-center">
                <div className="w-full max-w-[1200px] px-4 py-8 md:px-10 lg:px-40">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
