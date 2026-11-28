import type { IconType } from 'react-icons';
import type { AdminRole } from './roles';
import {
    AiOutlineBarChart, AiOutlineCalendar, AiOutlineCheckSquare, AiOutlineComment, AiOutlineDashboard, AiOutlineDollar, AiOutlineHeart, AiOutlineHistory,
    AiOutlineLink, AiOutlineMessage, AiOutlineSafety, AiOutlineStar, AiOutlineTable, AiOutlineTeam,
} from 'react-icons/ai';

export interface NavItem {
    /** Path under /admin; '' is the Overview. */
    path: string;
    label: string;
    icon: IconType;
    /** Hidden from admins below this role (the server refuses them anyway). */
    minRole?: AdminRole;
}

/** Sidebar order. Paths are the old ?view names, so saved links still work. */
export const NAV_ITEMS: NavItem[] = [
    { path: '', label: 'Overview', icon: AiOutlineDashboard },
    { path: 'analytics', label: 'Analytics', icon: AiOutlineBarChart },
    { path: 'registrations', label: 'Registrations', icon: AiOutlineTeam },
    { path: 'raffle', label: 'Raffle', icon: AiOutlineHistory },
    { path: 'payments', label: 'Payments', icon: AiOutlineDollar },
    { path: 'donations', label: 'Donations', icon: AiOutlineHeart },
    { path: 'feedback', label: 'Feedback', icon: AiOutlineComment },
    { path: 'bibs', label: 'Bibs', icon: AiOutlineStar },
    { path: 'bike-hires', label: 'Bike Hires', icon: AiOutlineStar },
    { path: 'checkin', label: 'Check-in', icon: AiOutlineCheckSquare },
    { path: 'communications', label: 'Communications', icon: AiOutlineMessage },
    { path: 'referrals', label: 'Referrals', icon: AiOutlineLink },
    { path: 'pricing', label: 'Pricing', icon: AiOutlineTable },
    { path: 'events', label: 'Events', icon: AiOutlineCalendar },
    { path: 'admins', label: 'Admins', icon: AiOutlineSafety, minRole: 'super_admin' },
];
