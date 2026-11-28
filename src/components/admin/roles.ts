/**
 * Admin roles, lowest first. The server enforces them; the screens only hide
 * what a role cannot do. Mirrors server/src/middleware/auth.ts.
 */
import type { AdminUser } from '../../types';

export type AdminRole = 'viewer' | 'admin' | 'super_admin';
const RANK: Record<AdminRole, number> = { viewer: 0, admin: 1, super_admin: 2 };

export const ROLE_LABELS: Record<AdminRole, string> = { viewer: 'Viewer', admin: 'Admin', super_admin: 'Super admin' };

/** True when the admin's role is at least `needed`. An unknown role counts as viewer. */
export function hasRole(admin: AdminUser | null | undefined, needed: AdminRole): boolean {
    return (RANK[admin?.role as AdminRole] ?? RANK.viewer) >= RANK[needed];
}
