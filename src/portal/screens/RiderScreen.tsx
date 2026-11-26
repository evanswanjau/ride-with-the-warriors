import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LuLock } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import { usePortalData } from '../PortalData';
import { ridersOf } from './RidersScreen';
import type { Rider } from '../types';
import { circuitName, dobInput, fmtDob, fmtKes, fullName, initials, isPaid } from '../format';
import { Callout, ScreenHeader, Sheet, StatusChip, errorMessage } from '../ui';

type Field = 'dob' | 'gender' | 'tshirt' | 'emergency';

const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

function EditSheet({ field, rider, onClose, onSaved }: { field: Field; rider: Rider; onClose: () => void; onSaved: (msg: string) => void }) {
    const { apiFetch } = useAuth();
    const [dob, setDob] = useState(dobInput(rider.dob));
    const [dobConfirmed, setDobConfirmed] = useState(false);
    const [gender, setGender] = useState(rider.gender ?? '');
    const [tshirt, setTshirt] = useState(rider.tshirtSize ?? '');
    const [ecName, setEcName] = useState(rider.emergencyContactName ?? '');
    const [ecPhone, setEcPhone] = useState(rider.emergencyPhone ?? '');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const titles: Record<Field, string> = { dob: 'Date of birth', gender: 'Gender', tshirt: 'T-shirt size', emergency: 'Emergency contact' };

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        const body =
            field === 'dob' ? { dob } :
            field === 'gender' ? { gender } :
            field === 'tshirt' ? { tshirtSize: tshirt } :
            { emergencyContactName: ecName.trim() || null, emergencyPhone: ecPhone.trim() || null };
        setBusy(true);
        setError('');
        const res = await apiFetch(`/me/riders/${encodeURIComponent(rider.id)}`, { method: 'PATCH', body: JSON.stringify(body) });
        setBusy(false);
        if (!res.ok) {
            setError(res.status === 404 ? "You can't change this rider's details. Ask the person who registered them." : await errorMessage(res, 'Could not save. Please try again.'));
            return;
        }
        const data = await res.json();
        onSaved(data.requoted ? `Saved. The entry price is now ${fmtKes(data.totalAmount)}.` : 'Saved');
    };

    return (
        <Sheet title={titles[field]} onClose={onClose}>
            <form className="rp-stack" onSubmit={save}>
                <p className="rp-muted rp-small">{fullName(rider)}</p>
                {field === 'dob' && (
                    <>
                        <Callout kind="warn">
                            <strong>This must match the date on the rider's ID or birth certificate.</strong> We check it at check-in, and riders whose details don't match won't be allowed to ride. Categories are set by age on race day.
                        </Callout>
                        <div className="rp-field">
                            <label className="rp-label" htmlFor="rp-dob">Date of birth</label>
                            <input id="rp-dob" className="rp-input" type="date" max={new Date().toISOString().slice(0, 10)} value={dob} onChange={e => setDob(e.target.value)} required />
                        </div>
                        {!isPaid(rider.status) && (
                            <p className="rp-muted rp-small">This entry isn't paid yet, so its category and price may change.</p>
                        )}
                        <label className="rp-check">
                            <input type="checkbox" checked={dobConfirmed} onChange={e => setDobConfirmed(e.target.checked)} />
                            <span>I confirm this matches the rider's ID or birth certificate.</span>
                        </label>
                    </>
                )}
                {field === 'gender' && (
                    <div className="rp-field">
                        <label className="rp-label" htmlFor="rp-gender">Gender</label>
                        <select id="rp-gender" className="rp-input" value={gender} onChange={e => setGender(e.target.value)} required>
                            <option value="" disabled>Choose</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                )}
                {field === 'tshirt' && (
                    <div className="rp-field">
                        <label className="rp-label" htmlFor="rp-tshirt">T-shirt size</label>
                        <select id="rp-tshirt" className="rp-input" value={tshirt} onChange={e => setTshirt(e.target.value)} required>
                            <option value="" disabled>Choose</option>
                            {[...new Set([...TSHIRT_SIZES, ...(rider.tshirtSize ? [rider.tshirtSize] : [])])].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                )}
                {field === 'emergency' && (
                    <>
                        <div className="rp-field">
                            <label className="rp-label" htmlFor="rp-ec-name">Name</label>
                            <input id="rp-ec-name" className="rp-input" autoComplete="off" value={ecName} onChange={e => setEcName(e.target.value)} />
                        </div>
                        <div className="rp-field">
                            <label className="rp-label" htmlFor="rp-ec-phone">Phone</label>
                            <input id="rp-ec-phone" className="rp-input" type="tel" inputMode="tel" autoComplete="off" placeholder="0712 345 678" value={ecPhone} onChange={e => setEcPhone(e.target.value)} />
                        </div>
                    </>
                )}
                {error && <p className="rp-error" role="alert">{error}</p>}
                <button type="submit" className="rp-btn rp-btn--primary rp-btn--block" disabled={busy || (field === 'dob' && !dobConfirmed)}>
                    {busy ? 'Saving…' : field === 'dob' ? 'Save date of birth' : 'Save'}
                </button>
            </form>
        </Sheet>
    );
}

function DetailRow({ label, value, onEdit, locked }: { label: string; value: React.ReactNode; onEdit?: () => void; locked?: boolean }) {
    return (
        <li className="rp-detail">
            <div className="rp-detail-main">
                <p className="rp-detail-label">{label}</p>
                <p className={`rp-detail-value${locked ? ' rp-detail-value--locked' : ''}`}>{value}</p>
            </div>
            {locked ? (
                <span className="rp-lock"><LuLock size={16} aria-hidden /> Locked</span>
            ) : onEdit ? (
                <button type="button" className="rp-linkbtn" onClick={onEdit} aria-label={`Edit ${label.toLowerCase()}`}>Edit</button>
            ) : null}
        </li>
    );
}

const RiderScreen = () => {
    const { riderId } = useParams();
    const { history, loading, reload } = usePortalData();
    const [editing, setEditing] = useState<Field | null>(null);
    const [toast, setToast] = useState('');
    const found = history ? ridersOf(history.registrations).find(r => r.rider.id === riderId) : undefined;

    if (!found) {
        return (
            <>
                <ScreenHeader title="Rider" back="/account/riders" />
                <div className="rp-page">
                    {loading ? <p className="rp-muted">Loading…</p> : (
                        <div className="rp-empty">
                            <p>We couldn't find that rider.</p>
                            <Link to="/account/riders" className="rp-btn rp-btn--quiet">Back to riders</Link>
                        </div>
                    )}
                </div>
            </>
        );
    }

    const { rider, entry } = found;
    const editable = entry.status !== 'CANCELLED';
    const edit = (f: Field) => (editable ? () => setEditing(f) : undefined);

    return (
        <>
            <ScreenHeader title={fullName(rider)} back="/account/riders" />
            <div className="rp-page">
                <div className="rp-person">
                    <span className="rp-av rp-av--lg" aria-hidden>{initials(rider)}</span>
                    <div>
                        <p className="rp-person-name">{fullName(rider)}</p>
                        <p className="rp-muted rp-small">
                            RWTW {history!.year} · {circuitName(entry.circuitId)}{rider.category ? ` · ${rider.category}` : ''}{rider.bibNumber ? ` · Bib ${rider.bibNumber}` : ''}
                        </p>
                    </div>
                    <StatusChip status={entry.status} />
                </div>

                {toast && <Callout kind="ok">{toast}</Callout>}

                <section className="rp-stack" aria-labelledby="rp-details">
                    <h2 id="rp-details" className="rp-h2">Details</h2>
                    <ul className="rp-card rp-details">
                        <DetailRow label="Name" value={fullName(rider)} />
                        <DetailRow label="ID or passport number" value="On file" locked />
                        <DetailRow label="Date of birth" value={fmtDob(rider.dob)} onEdit={edit('dob')} />
                        <DetailRow label="Gender" value={rider.gender ? rider.gender.charAt(0).toUpperCase() + rider.gender.slice(1) : 'Not set'} onEdit={edit('gender')} />
                        <DetailRow label="T-shirt size" value={rider.tshirtSize ?? 'Not set'} onEdit={edit('tshirt')} />
                        <DetailRow
                            label="Emergency contact"
                            value={rider.emergencyContactName || rider.emergencyPhone ? [rider.emergencyContactName, rider.emergencyPhone].filter(Boolean).join(' · ') : 'Not set'}
                            onEdit={edit('emergency')}
                        />
                    </ul>
                    <Callout kind="info">
                        The ID number and name can't be changed here because they're tied to the entry and event insurance.
                        If either is wrong, <Link to="/contact" className="rp-inline-link">contact the organisers</Link> with a photo of the ID.
                    </Callout>
                    {!editable && <p className="rp-muted rp-small">This entry is cancelled, so its details can't be changed.</p>}
                </section>

                <Link to={`/account/entries/${encodeURIComponent(entry.groupId)}`} className="rp-btn rp-btn--ghost rp-btn--block">View entry</Link>
            </div>
            {editing && (
                <EditSheet
                    field={editing}
                    rider={rider}
                    onClose={() => setEditing(null)}
                    onSaved={msg => { setEditing(null); setToast(msg); void reload(); }}
                />
            )}
        </>
    );
};

export default RiderScreen;
