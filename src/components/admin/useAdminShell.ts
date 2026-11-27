import { useOutletContext } from 'react-router-dom';
import type { AdminUser } from '../../types';

/** What every admin page gets from the layout. */
export interface AdminShell {
    admin: AdminUser | null;
    /** Dark theme on (charts pick their tooltip colours from it). */
    dark: boolean;
    /** Event year chosen in the header (?year=); undefined means every year. */
    year: number | undefined;
}

export const useAdminShell = () => useOutletContext<AdminShell>();
