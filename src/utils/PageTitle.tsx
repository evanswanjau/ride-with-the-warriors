import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BRAND_NAME = 'Ride With The Warriors';

const titleMap: Record<string, string> = {
    '/': 'Home',
    '/about': 'About Us',
    '/participants': 'Participants',
    '/sponsors': 'Sponsors',
    '/contact': 'Contact Us',
    '/gallery': 'Gallery',
    '/faqs': 'Frequently Asked Questions',
    '/search': 'Search Registrations',
    '/terms-and-conditions': 'Terms & Conditions',
    '/privacy-policy': 'Privacy Policy',
    '/admin': 'Admin Dashboard',
};

const PageTitle = () => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        let title = BRAND_NAME;

        // Exact matches
        if (titleMap[path]) {
            title = `${titleMap[path]} | ${BRAND_NAME}`;
        }
        // Dynamic routes
        else if (path.startsWith('/register/step/')) {
            const step = path.split('/').pop();
            title = `Register - Step ${step} | ${BRAND_NAME}`;
        }
        else if (path.startsWith('/raffle/step/')) {
            const step = path.split('/').pop();
            title = `Raffle - Step ${step} | ${BRAND_NAME}`;
        }
        else if (path.startsWith('/payment/')) {
            title = `Payment | ${BRAND_NAME}`;
        }
        else if (path.startsWith('/success/')) {
            title = `Registration Successful | ${BRAND_NAME}`;
        }
        else if (path.startsWith('/profile/')) {
            title = `Participant Profile | ${BRAND_NAME}`;
        }
        else if (path.startsWith('/raffle/payment/')) {
            title = `Raffle Payment | ${BRAND_NAME}`;
        }
        else if (path.startsWith('/raffle/success/')) {
            title = `Raffle Success | ${BRAND_NAME}`;
        }
        else if (path.startsWith('/raffle/profile/')) {
            title = `Raffle Ticket | ${BRAND_NAME}`;
        }

        document.title = title;
    }, [location]);

    return null;
};

export default PageTitle;
