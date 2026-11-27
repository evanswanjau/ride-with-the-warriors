import { useCallback, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FeedbackPromptModal from '../common/FeedbackPromptModal';
import { useCurrentEvent } from '../../hooks/useCurrentEvent';

// One dismissal per year: the prompt for one ride does not silence the next.
const dismissKey = (year: number) => `rwtw-feedback-prompt-dismissed-${year}`;
const wasDismissed = (year: number) => {
    try { return localStorage.getItem(dismissKey(year)) === '1'; } catch { return false; }
};

/** The year whose feedback prompt to show: only once the ride is over and feedback is open. */
function useFeedbackPrompt(pathname: string) {
    const { event, registration } = useCurrentEvent();
    const [dismissed, setDismissed] = useState<number | null>(null);
    const year = event && registration === 'finished' && event.feedbackOpen !== false ? event.year : null;
    const dismiss = useCallback(() => {
        if (year === null) return;
        try { localStorage.setItem(dismissKey(year), '1'); } catch { /* private mode: hidden until reload */ }
        setDismissed(year);
    }, [year]);
    const show = year !== null && dismissed !== year && !wasDismissed(year) && pathname !== '/feedback' && !pathname.startsWith('/admin');
    return { year: show ? year : null, dismiss };
}

const useTheme = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        if (typeof window === 'undefined') return 'dark';
        const saved = localStorage.getItem('rwtw-theme');
        if (saved === 'dark' || saved === 'light') return saved;
        return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    });
    useEffect(() => {
        const observer = new MutationObserver(() => {
            const current = document.documentElement.getAttribute('data-theme');
            if (current === 'dark' || current === 'light') setTheme(current);
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
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
    const location = useLocation();
    const feedbackPrompt = useFeedbackPrompt(location.pathname);

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
            {/* <TopBar /> */}
            <Navbar />
            <main className={`flex flex-1 flex-col ${isFullWidth ? '' : 'pt-[80px] md:pt-[90px] lg:pt-[104px]'}`}>
                <div className={`w-full ${isFullWidth ? '' : `${maxWidth} mx-auto px-4 pb-12`}`}>
                    {children}
                </div>
            </main>
            <Footer />
            {feedbackPrompt.year !== null && (
                <FeedbackPromptModal year={feedbackPrompt.year} onDismiss={feedbackPrompt.dismiss} />
            )}
        </div>
    );
};

export default Layout;