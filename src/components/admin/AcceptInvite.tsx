import { useState, type FormEvent } from 'react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import type { AdminUser } from '../../types';
import AdminAuthShell from './AdminAuthShell';
import { adminApi } from './api/adminApi';
import { errorMessage } from './api/http';
import { useLoad } from './hooks/useLoad';
import { ROLE_LABELS, type AdminRole } from './roles';

const MIN_PASSWORD = 10;

interface AcceptInviteProps {
    token: string;
    onAccepted: (token: string, admin: AdminUser) => void;
    onBack: () => void;
}

/** /admin/invite/:token — a new admin chooses their password from the emailed link. */
export default function AcceptInvite({ token, onAccepted, onBack }: AcceptInviteProps) {
    const invite = useLoad(() => adminApi.auth.invite(token), token, 'This invite link is not valid.');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        if (password.length < MIN_PASSWORD) { setError(`Use at least ${MIN_PASSWORD} characters.`); return; }
        if (password !== confirm) { setError('The two passwords are different.'); return; }
        setSaving(true);
        setError(null);
        try {
            const res = await adminApi.auth.acceptInvite(token, password);
            onAccepted(res.token, res.admin);
        } catch (err) {
            setError(errorMessage(err, 'Could not set your password. Try again.'));
        } finally {
            setSaving(false);
        }
    };

    const details = invite.data?.invite;
    const problem = error ?? (invite.loading ? null : invite.error);

    return (
        <AdminAuthShell onBack={onBack}>
            <div className="al-card">
                <div className="al-card-eyebrow">Admin invitation</div>
                <div className="al-card-title">Set your password</div>
                <p className="al-card-sub">
                    {details
                        ? <>Welcome, {details.name}. You are joining as <strong>{ROLE_LABELS[details.role as AdminRole] ?? details.role}</strong> with {details.email}.</>
                        : invite.loading ? 'Checking your invite…' : 'This link cannot be used.'}
                </p>
                <div className="al-divider" />

                {details && (
                    <form onSubmit={submit}>
                        <div className="al-field">
                            <label className="al-label" htmlFor="invite-password">New password</label>
                            <input id="invite-password" className="al-input" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" autoFocus />
                        </div>
                        <div className="al-field">
                            <label className="al-label" htmlFor="invite-confirm">Type it again</label>
                            <input id="invite-confirm" className="al-input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" />
                        </div>
                        {problem && (
                            <div className="al-error"><AiOutlineExclamationCircle className="al-error-icon" /><span>{problem}</span></div>
                        )}
                        <button type="submit" className="al-submit" disabled={saving}>
                            {saving ? <div className="al-spinner" /> : <><span>Set password and sign in</span><span className="al-submit-arrow">&rarr;</span></>}
                        </button>
                    </form>
                )}
                {!details && problem && (
                    <div className="al-error"><AiOutlineExclamationCircle className="al-error-icon" /><span>{problem}</span></div>
                )}
            </div>
        </AdminAuthShell>
    );
}
