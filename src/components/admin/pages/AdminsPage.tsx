import { useState, type FormEvent } from 'react';
import type { AdminAccount } from '../../../adminTypes';
import { adminApi } from '../api/adminApi';
import { errorMessage } from '../api/http';
import { useLoad } from '../hooks/useLoad';
import { ROLE_LABELS, hasRole, type AdminRole } from '../roles';
import { useAdminShell } from '../useAdminShell';
import { EmptyState, ErrorBanner, LoadingOverlay, SuccessBanner, TableHead } from '../ui/Feedback';
import PageHeader from '../ui/PageHeader';
import { formatDate } from '../ui/format';

const ROLES: AdminRole[] = ['viewer', 'admin', 'super_admin'];
const ADMIN_COLUMNS = ['Name', 'Email', 'Role', 'Last login', 'Status', ''];
const INVITE_COLUMNS = ['Name', 'Email', 'Role', 'Link expires', ''];

/** Super admins invite admins, change roles, and disable or re-enable accounts. */
export default function AdminsPage() {
    const { admin: me } = useAdminShell();
    const list = useLoad(() => adminApi.admins.list(), 'admins', 'Failed to load admins');
    const [form, setForm] = useState({ email: '', name: '', role: 'admin' as AdminRole });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    if (!hasRole(me, 'super_admin')) return <EmptyState>Only a super admin can manage admins.</EmptyState>;

    const run = async (action: () => Promise<unknown>, done: string, failure: string) => {
        setBusy(true);
        setError(null);
        setNotice(null);
        try {
            await action();
            setNotice(done);
            list.reload();
            return true;
        } catch (e) {
            setError(errorMessage(e, failure));
            return false;
        } finally {
            setBusy(false);
        }
    };

    const invite = async (e: FormEvent) => {
        e.preventDefault();
        const ok = await run(() => adminApi.admins.invite(form), `Invite sent to ${form.email.trim()}. The link works once, for 48 hours.`, 'Could not send the invite');
        if (ok) setForm({ email: '', name: '', role: 'admin' });
    };

    const changeRole = (a: AdminAccount, role: AdminRole) => {
        if (!window.confirm(`Make ${a.name} ${ROLE_LABELS[role].toLowerCase()}?`)) return;
        run(() => adminApi.admins.update(a.id, { role }), `${a.name} is now ${ROLE_LABELS[role].toLowerCase()}.`, 'Could not change the role');
    };

    const setDisabled = (a: AdminAccount, disabled: boolean) => {
        const question = disabled ? `Disable ${a.name}? They are signed out at once and cannot log in.` : `Enable ${a.name} again?`;
        if (!window.confirm(question)) return;
        run(() => adminApi.admins.update(a.id, { disabled }), `${a.name} ${disabled ? 'disabled' : 'enabled'}.`, 'Could not change the account');
    };

    const admins = list.data?.admins ?? [];
    const invites = list.data?.invites ?? [];

    return (
        <>
            {notice && <SuccessBanner message={notice} onClose={() => setNotice(null)} />}
            {(error || list.error) && <ErrorBanner message={error ?? list.error ?? ''} onAction={() => { setError(null); list.reload(); }} />}
            <PageHeader eyebrow="Access" title="Admins" />

            <div className="ad-panel">
                <div className="ad-panel-head"><div className="ad-panel-title">Invite an admin</div></div>
                <form className="ad-filters" onSubmit={invite} style={{ borderBottom: 'none' }}>
                    <div className="ad-filter-group" style={{ flex: 1, minWidth: 180 }}>
                        <label className="ad-filter-label" htmlFor="invite-name">Name</label>
                        <input id="invite-name" className="ad-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="ad-filter-group" style={{ flex: 1, minWidth: 220 }}>
                        <label className="ad-filter-label" htmlFor="invite-email">Email</label>
                        <input id="invite-email" className="ad-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                    </div>
                    <div className="ad-filter-group">
                        <label className="ad-filter-label" htmlFor="invite-role">Role</label>
                        <select id="invite-role" className="ad-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as AdminRole }))}>
                            {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                        </select>
                    </div>
                    <button className="ad-btn ad-btn-primary" type="submit" disabled={busy}>Send invite</button>
                </form>
                <div className="ad-insight" style={{ margin: '0 20px 20px' }}>
                    Viewer: reads only. Admin: also edits registrations and marks payments. Super admin: also events, admins, deletes and bulk messages.
                </div>
            </div>

            <div className="ad-panel">
                <div className="ad-panel-head"><div className="ad-panel-title">Admins</div></div>
                <div className="ad-panel-rel">
                    {list.loading && <LoadingOverlay />}
                    <div className="ad-table-wrap">
                        <table className="ad-table">
                            <TableHead columns={ADMIN_COLUMNS} />
                            <tbody>
                                {admins.map(a => (
                                    <tr key={a.id} className="ad-tr" style={a.disabledAt ? { opacity: 0.55 } : undefined}>
                                        <td className="ad-td">{a.name}{a.id === me?.id ? ' (you)' : ''}</td>
                                        <td className="ad-td">{a.email}</td>
                                        <td className="ad-td">
                                            <select className="ad-status-select" aria-label={`Role of ${a.name}`} value={a.role} disabled={busy || !!a.disabledAt} onChange={e => changeRole(a, e.target.value as AdminRole)}>
                                                {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                                            </select>
                                        </td>
                                        <td className="ad-td ad-mono" style={{ fontSize: '0.72rem' }}>{a.lastLogin ? formatDate(a.lastLogin) : 'Never'}</td>
                                        <td className="ad-td"><span className={`ad-badge ad-badge-${a.disabledAt ? 'cancelled' : 'paid'}`}>{a.disabledAt ? 'Disabled' : 'Active'}</span></td>
                                        <td className="ad-td" style={{ textAlign: 'right' }}>
                                            <button className="ad-page-btn" disabled={busy} onClick={() => setDisabled(a, !a.disabledAt)}>{a.disabledAt ? 'Enable' : 'Disable'}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {invites.length > 0 && (
                <div className="ad-panel">
                    <div className="ad-panel-head"><div className="ad-panel-title">Waiting invites</div></div>
                    <div className="ad-table-wrap">
                        <table className="ad-table">
                            <TableHead columns={INVITE_COLUMNS} />
                            <tbody>
                                {invites.map(i => (
                                    <tr key={i.id} className="ad-tr">
                                        <td className="ad-td">{i.name}</td>
                                        <td className="ad-td">{i.email}</td>
                                        <td className="ad-td">{ROLE_LABELS[i.role as AdminRole] ?? i.role}</td>
                                        <td className="ad-td ad-mono" style={{ fontSize: '0.72rem' }}>{formatDate(i.expiresAt)}</td>
                                        <td className="ad-td" style={{ textAlign: 'right' }}>
                                            <button className="ad-page-btn" disabled={busy} onClick={() => run(() => adminApi.admins.revokeInvite(i.id), `Invite to ${i.email} withdrawn.`, 'Could not withdraw the invite')}>Withdraw</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}
