import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const BRAND_NAME = 'Ride With The Warriors 2026';

const metaMap: Record<string, { title: string, description: string }> = {
    '/': { title: 'Home', description: 'Join Ride With The Warriors 2026, a premier multi-national cycling event. Experience the Blitz, Recon, Corporate Challenge, and Family Fun circuits.' },
    '/about': { title: 'About Us', description: 'Learn about the history, pillars, and mission of Ride With The Warriors. Ride with honour, supporting the widows of our fallen heroes.' },
    '/circuits': { title: 'Participants', description: 'Explore the different race categories and participant lists for Ride With The Warriors 2026.' },
    '/sponsors': { title: 'Sponsors', description: 'Discover the partners and sponsors making Ride With The Warriors possible.' },
    '/contact': { title: 'Contact Us', description: 'Get in touch with the Ride With The Warriors support team for any inquiries or assistance.' },
    '/gallery': { title: 'Gallery', description: 'View incredible photos and highlights from previous Ride With The Warriors events.' },
    '/faqs': { title: 'Frequently Asked Questions', description: 'Find answers to common questions about Ride With The Warriors 2026 registration, routes, and more.' },
    '/search': { title: 'Search Registrations', description: 'Search for participant registrations and team status for Ride With The Warriors 2026.' },
    '/terms-and-conditions': { title: 'Terms & Conditions', description: 'Review the terms and conditions for participating in Ride With The Warriors 2026.' },
    '/privacy-policy': { title: 'Privacy Policy', description: 'Read our privacy policy and understand how we protect your personal data.' },
    '/admin': { title: 'Admin Dashboard', description: 'Ride With The Warriors Admin Dashboard.' },
};

const PageTitle = () => {
    const location = useLocation();
    const path = location.pathname;

    let title = BRAND_NAME;
    let description = 'A premier multi-national cycling event uniting civilians and soldiers — riding with honour, supporting the widows of our fallen heroes.';

    // Home page — brand name only
    if (path === '/') {
        description = metaMap['/'].description;
    }
    // Exact route match — page title only, no brand suffix
    else if (metaMap[path]) {
        title = metaMap[path].title;
        description = metaMap[path].description;
    }
    // Dynamic routes
    else if (path.startsWith('/register/step/')) {
        const step = path.split('/').pop();
        title = `Register – Step ${step}`;
        description = 'Register for Ride With The Warriors 2026.';
    }
    else if (path.startsWith('/raffle/step/')) {
        const step = path.split('/').pop();
        title = `Raffle – Step ${step}`;
        description = 'Enter the Grand Raffle and win amazing prizes.';
    }
    else if (path.startsWith('/payment/')) {
        title = 'Payment';
    }
    else if (path.startsWith('/success/')) {
        title = 'Registration Successful';
    }
    else if (path.startsWith('/profile/')) {
        title = 'Participant Profile';
    }
    else if (path.startsWith('/raffle/payment/')) {
        title = 'Raffle Payment';
    }
    else if (path.startsWith('/raffle/success/')) {
        title = 'Raffle Success';
    }
    else if (path.startsWith('/raffle/profile/')) {
        title = 'Raffle Ticket';
    }
    // Admin Routes
    else if (path.startsWith('/admin')) {
        const adminViews: Record<string, string> = {
            'overview': 'Overview',
            'analytics': 'Analytics',
            'registrations': 'Registrations',
            'bibs': 'Bibs',
            'payments': 'Payments',
            'raffle': 'Raffle',
            'pricing': 'Pricing'
        };
        const view = path.split('/')[2] || 'overview';
        title = `${adminViews[view] || 'Dashboard'}`;
        description = 'Restricted access admin portal.';
    }

    return (
        <Helmet>
            <title>{title}</title>
            {path.startsWith('/admin') && <meta name="robots" content="noindex, nofollow" />}
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={BRAND_NAME} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <link rel="canonical" href={`https://airbornefraternity.org${path}`} />
        </Helmet>
    );
};

export default PageTitle;
