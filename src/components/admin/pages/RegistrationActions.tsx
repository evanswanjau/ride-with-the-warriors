import { useState, type FormEvent, type ReactNode } from 'react';
import type { AdminRegistration, RiderDetailsEdit } from '../../../adminTypes';
import { adminApi } from '../api/adminApi';
import { errorMessage } from '../api/http';
import { useLoad } from '../hooks/useLoad';
import { ErrorBanner, SuccessBanner } from '../ui/Feedback';
import { formatDate, kes } from '../ui/format';

type Panel = 'edit' | 'move' | 'cancel' | 'refund' | null;

const EDIT_FIELDS: { key: keyof RiderDetailsEdit; label: string; type?: string }[] = [
    { key: 'firstName', label: 'First name' },
    { key: 'lastName', label: 'Last name' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'dob', label: 'Date of birth', type: 'date' },
    { key: 'tshirtSize', label: 'T-shirt size' },
    { key: 'emergencyContactName', label: 'Emergency contact' },
    { key: 'emergencyPhone', label: 'Emergency phone' },
];

function Field({ label, children }: { label: string; children: ReactNode }) {
    return <label className="ad-m-field"><span className="ad-m-label">{label}</span>{children}</label>;
}

/** Actions under the registration detail drawer: edit, move, cancel, refund note, and the history. */
export default function RegistrationActions({ reg, onChanged }: { reg: AdminRegistration; onChanged: () => void }) {
    const history = useLoad(() => adminApi.registrations.history(reg.id), reg.id, 'Could not load the history');
    const [panel, setPanel] = useState<Panel>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const [edit, setEdit] = useState<RiderDetailsEdit>(() => Object.fromEntries(EDIT_FIELDS.map(f => [f.key, String(reg[f.key as keyof AdminRegistration] ?? '')])) as RiderDetailsEdit);
    const [reason, setReason] = useState('');
    const [target, setTarget] = useState('');
    const [note, setNote] = useState('');
    const [amount, setAmount] = useState('');

    const open = (p: Panel) => { setPanel(panel === p ? null : p); setError(null); setReason(''); };
    const run = async (e: FormEvent, action: () => Promise<unknown>, done: string, failure: string) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
            await action();
            setNotice(done);
            setPanel(null);
            setReason('');
            history.reload();
            onChanged();
        } catch (err) {
            setError(errorMessage(err, failure));
        } finally {
            setBusy(false);
        }
    };

    const reasonInput = <Field label="Reason (kept in the audit log)"><input className="ad-input" value={reason} onChange={e => setReason(e.target.value)} required minLength={3} /></Field>;
    const cancelled = reg.status === 'CANCELLED';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {notice && <SuccessBanner message={notice} onClose={() => setNotice(null)} />}
            {error && <ErrorBanner message={error} actionLabel="Close" onAction={() => setError(null)} />}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <button className="ad-page-btn" onClick={() => open('edit')}>Edit rider</button>
                {!cancelled && <button className="ad-page-btn" onClick={() => open('move')}>Move to another entry</button>}
                {!cancelled && <button className="ad-page-btn" onClick={() => open('cancel')}>Cancel entry</button>}
                <button className="ad-page-btn" onClick={() => open('refund')}>Refund note</button>
            </div>

            {panel === 'edit' && (
                <form onSubmit={e => run(e, () => adminApi.registrations.editDetails(reg.id, { ...edit, reason }), 'Rider details saved.', 'Could not save the details')} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {EDIT_FIELDS.map(f => (
                        <Field key={f.key} label={f.label}>
                            <input className="ad-input" type={f.type ?? 'text'} value={edit[f.key] ?? ''} onChange={e => setEdit(v => ({ ...v, [f.key]: e.target.value }))} />
                        </Field>
                    ))}
                    {reasonInput}
                    <button className="ad-btn ad-btn-primary" disabled={busy}>Save rider</button>
                </form>
            )}

            {panel === 'move' && (
                <form onSubmit={e => run(e, () => adminApi.registrations.move(reg.id, target.trim(), reason), 'Rider moved.', 'Could not move the rider')} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="ad-insight">Moves this rider into another rider's entry (for example another team). Same circuit, both paid or both unpaid. The rider keeps their bib and amount.</div>
                    <Field label="Reference of a rider in the other entry"><input className="ad-input ad-mono" value={target} onChange={e => setTarget(e.target.value)} required /></Field>
                    {reasonInput}
                    <button className="ad-btn ad-btn-primary" disabled={busy}>Move rider</button>
                </form>
            )}

            {panel === 'cancel' && (
                <form onSubmit={e => run(e, () => adminApi.registrations.cancel(reg.id, reason), 'Entry cancelled.', 'Could not cancel the entry')} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="ad-insight">Cancels the whole entry (every rider in the team or family). Bibs and payments are kept for the records.</div>
                    {reasonInput}
                    <button className="ad-btn ad-btn-primary" disabled={busy}>Cancel entry</button>
                </form>
            )}

            {panel === 'refund' && (
                <form onSubmit={e => run(e, () => adminApi.registrations.addRefundNote(reg.id, note.trim(), amount ? Number(amount) : null), 'Refund note saved.', 'Could not save the note')} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Field label="Amount refunded (KES, optional)"><input className="ad-input" type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} /></Field>
                    <Field label="Note"><textarea className="ad-input" value={note} onChange={e => setNote(e.target.value)} required minLength={3} rows={3} /></Field>
                    <button className="ad-btn ad-btn-primary" disabled={busy}>Save note</button>
                </form>
            )}

            <div>
                <div className="ad-drawer-field-label">Refund notes</div>
                {(history.data?.notes ?? []).length === 0 ? <div className="ad-drawer-field-val">None</div>
                    : history.data!.notes.map(n => (
                        <div key={n.id} className="ad-drawer-field-val" style={{ fontWeight: 500, marginBottom: 6 }}>
                            {n.amountKes != null && <strong>{kes(n.amountKes)} · </strong>}{n.note}
                            <div className="ad-feed-sub">{n.adminEmail} · {formatDate(n.createdAt)}</div>
                        </div>
                    ))}
            </div>
            <div>
                <div className="ad-drawer-field-label">Changes</div>
                {(history.data?.audit ?? []).length === 0 ? <div className="ad-drawer-field-val">None</div>
                    : history.data!.audit.map(a => (
                        <div key={a.id} className="ad-feed-sub" style={{ marginBottom: 4 }}>{formatDate(a.createdAt)} · {a.adminEmail} · {a.action.replace(/^registration:/, '')}</div>
                    ))}
            </div>
        </div>
    );
}
