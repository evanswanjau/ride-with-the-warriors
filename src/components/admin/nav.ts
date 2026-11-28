import type { IconType } from 'react-icons';
import {
    AiOutlineBarChart, AiOutlineCalendar, AiOutlineComment, AiOutlineDashboard, AiOutlineDollar, AiOutlineHeart, AiOutlineHistory,
    AiOutlineLink, AiOutlineMessage, AiOutlineStar, AiOutlineTable, AiOutlineTeam,
} from 'react-icons/ai';

export interface NavItem {
    /** Path under /admin; '' is the Overview. */
    path: string;
    label: string;
    icon: IconType;
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
    { path: 'communications', label: 'Communications', icon: AiOutlineMessage },
    { path: 'referrals', label: 'Referrals', icon: AiOutlineLink },
    { path: 'pricing', label: 'Pricing', icon: AiOutlineTable },
    { path: 'events', label: 'Events', icon: AiOutlineCalendar },
];
