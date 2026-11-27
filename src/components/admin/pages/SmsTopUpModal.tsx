import { AiOutlineExclamationCircle } from 'react-icons/ai';

/** How to buy more SMS credits (M-Pesa pay bill). */
export default function SmsTopUpModal({ onClose }: { onClose: () => void }) {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="ad-panel" style={{ maxWidth: '450px', width: '100%', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                <div className="ad-panel-head">
                    <div className="ad-panel-title">Top Up SMS Credits</div>
                </div>
                <div className="ad-panel-body">
                     <div style={{ marginBottom: '25px', padding: '20px', background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: '4px', borderLeft: '4px solid var(--ad-accent)' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ad-accent)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <AiOutlineExclamationCircle size={20} /> M-Pesa Payment Instructions
                        </div>
                        <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--ad-t2)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <li>Select <strong>Pay Bill</strong> on M-Pesa</li>
                            <li>Business Number: <strong>4093753</strong></li>
                            <li>Account: <strong>Airborne</strong></li>
                            <li>Amount: <strong>Enter any amount</strong></li>
                        </ol>
                        <div style={{ fontSize: '0.75rem', color: 'var(--ad-t3)', marginTop: '25px', fontStyle: 'italic', lineHeight: '1.5' }}>
                            Your SMS credits will be updated automatically in your TextSMS account after payment.
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--ad-border)', paddingTop: '20px' }}>
                        <button className="ad-hbtn" onClick={onClose} style={{ border: '1px solid var(--ad-border)', background: 'transparent' }}>
                            Close
                        </button>
                        <button className="ad-hbtn ad-hbtn-primary" onClick={() => window.location.reload()}>
                            Complete & Refresh
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
