import { useOutletContext } from 'react-router-dom';
import type { AdminUser } from '../../types';

/** What every admin page gets from the layout. */
export interface AdminShell {
    admin: AdminUser | null;
    /** Dark theme on (charts pick their tooltip colours from it). */
    dark: boolean;
}

export const useAdminShell = () => useOutletContext<AdminShell>();
