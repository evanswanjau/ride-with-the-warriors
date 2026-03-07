import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const useTheme = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>(() =>
        document.documentElement.getAttribute('data-theme') === 'dark' ||
            document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
    useEffect(() => {
        const observer = new MutationObserver(() =>
            setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ||
                document.documentElement.classList.contains('dark') ? 'dark' : 'light')
        );
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
        return () => observer.disconnect();
    }, []);
    return theme;
};

interface LayoutProps {
    children: React.ReactNode;
    registrationType?: string;
    isFullWidth?: boolean;
    maxWidth?: string;
}

const Layout = ({ children, registrationType, isFullWidth = false, maxWidth = 'max-w-6xl' }: LayoutProps) => {
    const theme = useTheme();

    return (
        <div
            className="relative flex min-h-screen flex-col overflow-x-hidden font-display antialiased"
            data-theme={theme}
            data-registration-type={registrationType}
            style={{ backgroundColor: 'var(--page-bg)', color: 'var(--text-1)' }}
        >
            <style>{`
                :root, [data-theme="dark"], .dark {
                    --color-primary:       #2d6a2d;
                    --color-primary-dark:  #1e4d1e;
                    --color-primary-light: #4caf50;
                    --color-accent:        #f59e0b;
                    --page-bg:   #0a0a0a;
                    --raised-bg: #111111;
                    --mid-bg:    rgb(10,10,10);
                    --text-1: #ffffff;
                    --text-2: rgba(255,255,255,0.60);
                    --text-3: rgba(255,255,255,0.38);
                    --border-1: rgba(255,255,255,0.08);
                    --border-2: rgba(255,255,255,0.14);
                }
                [data-theme="light"], :root:not(.dark) {
                    --color-primary:       #245924;
                    --color-primary-dark:  #1a421a;
                    --color-primary-light: #2d6a2d;
                    --color-accent:        #d97706;
                    --page-bg:   #f5f2eb;
                    --raised-bg: #edeae2;
                    --mid-bg:    #ebe8df;
                    --text-1: #111111;
                    --text-2: rgba(20,20,20,0.62);
                    --text-3: rgba(20,20,20,0.42);
                    --border-1: rgba(0,0,0,0.09);
                    --border-2: rgba(0,0,0,0.16);
                }
            `}</style>
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