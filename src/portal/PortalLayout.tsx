import { NavLink, Outlet, Link } from 'react-router-dom';
import { LuHouse, LuFlag, LuUsers, LuTicket, LuUser, LuWifiOff, LuArrowLeft, LuSmartphone } from 'react-icons/lu';
import { PortalDataProvider, usePortalData } from './PortalData';
import { useInstallAction } from './InstallCard';
import logo from '../assets/logos/logo_white.png';
import '../styles/portal.css';

const TABS = [
    { to: '/account', label: 'Home', icon: LuHouse, end: true },
    { to: '/account/entries', label: 'Entries', icon: LuFlag, end: false },
    { to: '/account/riders', label: 'Riders', icon: LuUsers, end: false },
    { to: '/account/tickets', label: 'Tickets', icon: LuTicket, end: false },
    { to: '/account/profile', label: 'Profile', icon: LuUser, end: false },
];

function OfflineBanner() {
    const { offline } = usePortalData();
    if (!offline) return null;
    return (
        <div className="rp-offline" role="status">
            <LuWifiOff size={16} aria-hidden /> You're offline. Showing what was saved on this device.
        </div>
    );
}

function Rail() {
    const { installed, start, steps } = useInstallAction();
    return (
        <nav className="rp-rail" aria-label="Account">
            <Link to="/" className="rp-rail-brand">
                <img src={logo} alt="" width={34} height={34} />
                <span>Ride With<br />The Warriors</span>
            </Link>
            {TABS.map(t => (
                <NavLink key={t.to} to={t.to} end={t.end} className="rp-rail-link">
                    <t.icon size={20} aria-hidden />
                    <span>{t.label}</span>
                </NavLink>
            ))}
            <div className="rp-rail-spacer" />
            {!installed && (
                <button type="button" className="rp-rail-install" onClick={start}>
                    <LuSmartphone size={18} aria-hidden /> Install the app
                </button>
            )}
            <Link to="/" className="rp-rail-link rp-rail-link--quiet">
                <LuArrowLeft size={18} aria-hidden /> <span>Back to the website</span>
            </Link>
            {steps}
        </nav>
    );
}

/** Shell for /account/*: side rail on desktop, bottom tab bar on phones. */
const PortalLayout = () => (
    <PortalDataProvider>
        <div className="rp-app">
            <Rail />
            <div className="rp-main">
                <OfflineBanner />
                <Outlet />
            </div>
            <nav className="rp-tabbar" aria-label="Account">
                {TABS.map(t => (
                    <NavLink key={t.to} to={t.to} end={t.end} className="rp-tab">
                        <t.icon size={22} aria-hidden />
                        <span>{t.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    </PortalDataProvider>
);

export default PortalLayout;
