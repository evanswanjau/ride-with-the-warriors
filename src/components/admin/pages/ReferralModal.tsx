import { useState } from 'react';
import { AiOutlineCheckCircle, AiOutlineClose } from 'react-icons/ai';
import { adminApi, type NewReferral } from '../api/adminApi';
import { errorMessage } from '../api/http';

const EMPTY: NewReferral = { code: '', influencerName: '', influencerEmail: '', influencerPhone: '' };

interface ReferralModalProps {
    onClose: () => void;
    onCreated: () => void;
    onError: (message: string) => void;
}

/** "Create Code": a new referral code for an influencer. */
export default function ReferralModal({ onClose, onCreated, onError }: ReferralModalProps) {
    const [form, setForm] = useState<NewReferral>(EMPTY);
    const [saving, setSaving] = useState(false);
    const set = (patch: Partial<NewReferral>) => setForm(f => ({ ...f, ...patch }));

    const handleCreate = async () => {
        setSaving(true);
        try {
            await adminApi.referrals.create(form);
            onCreated();
        } catch (e) {
            onError(errorMessage(e, 'Failed to create referral'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="ad-modal-overlay">
            <div className="ad-modal" style={{ maxWidth: 500 }}>
                <div className="ad-modal-header">
                    <h3 className="ad-modal-title">New Referral Portal</h3>
                    <button className="ad-modal-close" onClick={onClose}><AiOutlineClose /></button>
                </div>
                <div className="ad-modal-body" style={{ position: 'relative', paddingTop: 32 }}>
                    <div className="ad-m-field">
                        <div className="ad-m-label">Referral Code (Unique)</div>
                        <input className="ad-input" style={{ textTransform: 'uppercase', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.05em' }} type="text" placeholder="e.g. JAMES2026"
                            value={form.code} onChange={e => set({ code: e.target.value.toUpperCase().replace(/\s+/g, '') })} />
                        <div style={{ fontSize: '0.65rem', color: 'var(--ad-t3)', marginTop: 4 }}>This code will be appended to URLs for tracking.</div>
                    </div>
                    <div className="ad-m-field">
                        <div className="ad-m-label">Full Name</div>
                        <input className="ad-input" type="text" placeholder="e.g. Jane Doe" value={form.influencerName} onChange={e => set({ influencerName: e.target.value })} />
                    </div>
                    <div className="ad-m-grid">
                        <div className="ad-m-field">
                            <div className="ad-m-label">Email Address</div>
                            <input className="ad-input" type="email" placeholder="jane@example.com" value={form.influencerEmail} onChange={e => set({ influencerEmail: e.target.value })} />
                        </div>
                        <div className="ad-m-field">
                            <div className="ad-m-label">Phone Number</div>
                            <input className="ad-input" type="tel" placeholder="07XX XXX XXX" value={form.influencerPhone} onChange={e => set({ influencerPhone: e.target.value })} />
                        </div>
                    </div>
                </div>
                <div className="ad-modal-footer">
                    <button className="ad-btn ad-btn-ghost" onClick={onClose}>Discard</button>
                    <button className="ad-btn ad-btn-primary" onClick={handleCreate} disabled={saving}>
                        {saving ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div className="ad-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                                <span>Processing…</span>
                            </div>
                        ) : (
                            <><AiOutlineCheckCircle /><span>Confirm &amp; Create</span></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
