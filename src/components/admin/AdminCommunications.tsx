import React, { useState } from 'react';
import { AiOutlineExclamationCircle, AiOutlineReload } from 'react-icons/ai';
import { API_BASE_URL } from '../../config';

export const AdminCommunications: React.FC = () => {
    const [mode, setMode] = useState<'sms' | 'email' | 'both'>('sms');
    const [targetEntity, setTargetEntity] = useState<'cyclist' | 'raffle' | 'donor' | 'custom'>('cyclist');
    const [targetStatus, setTargetStatus] = useState<'all' | 'paid' | 'unpaid'>('all');
    
    const [customPhones, setCustomPhones] = useState('');
    const [customEmails, setCustomEmails] = useState('');

    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [testMode, setTestMode] = useState(true);
    const [loading, setLoading] = useState(false);
    
    const [preview, setPreview] = useState<any>(null);
    const [balance, setBalance] = useState<any>(null);
    const [showRenewInfo, setShowRenewInfo] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBalance = async () => {
        setRefreshing(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE_URL}/admin/email/sms-balance`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setBalance(data);
            }
        } catch (e) {
            console.error('Failed to fetch SMS balance', e);
        } finally {
            setRefreshing(false);
        }
    };

    React.useEffect(() => {
        fetchBalance();
    }, []);

    const handleSend = async () => {
        setErrorMsg(null);
        setSuccessMsg(null);

        if (!message) {
            setErrorMsg('Please enter a message');
            return;
        }
        if ((mode === 'email' || mode === 'both') && !subject) {
            setErrorMsg('Please enter a subject');
            return;
        }
        if (targetEntity === 'custom') {
            if ((mode === 'sms' || mode === 'both') && !customPhones) {
                setErrorMsg('Please enter custom phone numbers');
                return;
            }
            if ((mode === 'email' || mode === 'both') && !customEmails) {
                setErrorMsg('Please enter custom emails');
                return;
            }
        }

        const confirmMsg = testMode 
            ? 'This will run in test mode and only return a preview.' 
            : 'WARNING: This will send real messages to actual users. Are you sure you want to proceed?';

        if (!window.confirm(confirmMsg)) return;

        setLoading(true);
        setPreview(null);
        try {
            const payload = {
                mode,
                targetEntity,
                targetStatus,
                customPhones,
                customEmails,
                message,
                subject,
                testMode
            };

            const token = localStorage.getItem('adminToken');
            
            const res = await fetch(`${API_BASE_URL}/admin/email/bulk-send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData?.error || errorData?.message || 'Send failed');
            }

            const data = await res.json();

            if (testMode) {
                setSuccessMsg('Test preview generated');
                setPreview(data);
            } else {
                setSuccessMsg(`Communications sent successfully!`);
                setMessage('');
                setSubject('');
                setPreview(data); // Will show the final sent stats on the right side
                fetchBalance(); // Refresh balance after live send
            }
        } catch (error: any) {
            console.error('Error sending message:', error);
            setErrorMsg(error.message || 'Send failed. Check console logs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div className="ad-section-head">
                        <div className="ad-section-line" />
                        <span className="ad-section-eyebrow">Communication</span>
                    </div>
                    <div className="ad-page-title">Bulk SMS/Email</div>
                </div>
                
                {balance && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                                <span style={{ fontSize: '0.55rem', color: 'var(--ad-t3)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1 }}>SMS Credits</span>
                                <span style={{ fontSize: '1rem', fontFamily: "'Bebas Neue', sans-serif", color: 'var(--ad-pl)', lineHeight: 1 }}>{balance.UserData?.balance || 'N/A'}</span>
                            </div>
                            <button 
                                className={`ad-hbtn ad-hbtn-icon ${refreshing ? 'ad-spin' : ''}`} 
                                onClick={fetchBalance}
                                style={{ padding: '2px', minWidth: 'auto', border: 'none', background: 'none', color: 'var(--ad-t3)' }}
                                title="Refresh Balance"
                            >
                                <AiOutlineReload size={12} />
                            </button>
                        </div>
                        <button 
                            className="ad-hbtn ad-hbtn-primary" 
                            style={{ padding: '4px 12px', fontSize: '0.7rem', height: '26px', minWidth: 'auto' }}
                            onClick={() => setShowRenewInfo(true)}
                        >
                            Top Up Credits
                        </button>
                    </div>
                )}
            </div>

            {/* Top Up Modal */}
            {showRenewInfo && (
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
                                    <li>Business Number: <strong>525900</strong></li>
                                    <li>Account: <strong>{balance?.username || 'evansw'}</strong></li>
                                    <li>Amount: <strong>Enter any amount</strong></li>
                                </ol>
                                <div style={{ fontSize: '0.75rem', color: 'var(--ad-t3)', marginTop: '25px', fontStyle: 'italic', lineHeight: '1.5' }}>
                                    Your SMS credits will be updated automatically in your Africa's Talking account after payment.
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--ad-border)', paddingTop: '20px' }}>
                                <button className="ad-hbtn" onClick={() => setShowRenewInfo(false)} style={{ border: '1px solid var(--ad-border)', background: 'transparent' }}>
                                    Close
                                </button>
                                <button className="ad-hbtn ad-hbtn-primary" onClick={() => window.location.reload()}>
                                    Complete & Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {errorMsg && (
                <div className="ad-error" style={{ marginBottom: '20px' }}>
                    <AiOutlineExclamationCircle />
                    <span>{errorMsg}</span>
                    <button style={{ marginLeft: 'auto', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setErrorMsg(null)}>Close</button>
                </div>
            )}
            {successMsg && (
                <div style={{ padding: '14px 18px', background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.3)', borderLeft: '3px solid var(--ad-pl)', color: 'var(--ad-pl)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', marginBottom: '20px' }}>
                    <span>{successMsg}</span>
                    <button style={{ marginLeft: 'auto', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setSuccessMsg(null)}>Close</button>
                </div>
            )}

            {/* Split layout: 2fr for composer, 1fr for preview inside standard grid container or flex */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '20px', alignItems: 'flex-start' }}>
                <div className="ad-panel">
                    <div className="ad-panel-head">
                        <div className="ad-panel-title">Composer</div>
                    </div>

                    <div className="ad-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <div className="ad-filter-group" style={{ flex: 1 }}>
                                <label className="ad-filter-label">Mode</label>
                                <select className="ad-select" value={mode} onChange={(e) => setMode(e.target.value as any)}>
                                    <option value="sms">SMS Only</option>
                                    <option value="email">Email Only</option>
                                    <option value="both">Both SMS & Email</option>
                                </select>
                            </div>

                            <div className="ad-filter-group" style={{ flex: 1 }}>
                                <label className="ad-filter-label">Target Group</label>
                                <select className="ad-select" value={targetEntity} onChange={(e) => setTargetEntity(e.target.value as any)}>
                                    <option value="cyclist">Cyclists</option>
                                    <option value="raffle">Raffle Entries</option>
                                    <option value="donor">Donors</option>
                                    <option value="custom">Custom (Manual Entry)</option>
                                </select>
                            </div>

                            {targetEntity !== 'custom' && (
                                <div className="ad-filter-group" style={{ flex: 1 }}>
                                    <label className="ad-filter-label">Payment Status</label>
                                    <select className="ad-select" value={targetStatus} onChange={(e) => setTargetStatus(e.target.value as any)}>
                                        <option value="all">All</option>
                                        <option value="paid">Paid Only</option>
                                        <option value="unpaid">Unpaid Only</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {targetEntity === 'custom' && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', background: 'var(--ad-bg)', padding: '12px', borderRadius: '4px', border: '1px solid var(--ad-border)' }}>
                                {(mode === 'sms' || mode === 'both') && (
                                    <div className="ad-filter-group" style={{ flex: 1 }}>
                                        <label className="ad-filter-label">Custom Phones (comma separated)</label>
                                        <input className="ad-input" type="text" placeholder="+254700000000, 0722000000" value={customPhones} onChange={(e) => setCustomPhones(e.target.value)} />
                                    </div>
                                )}
                                {(mode === 'email' || mode === 'both') && (
                                    <div className="ad-filter-group" style={{ flex: 1 }}>
                                        <label className="ad-filter-label">Custom Emails (comma separated)</label>
                                        <input className="ad-input" type="text" placeholder="example@email.com" value={customEmails} onChange={(e) => setCustomEmails(e.target.value)} />
                                    </div>
                                )}
                            </div>
                        )}

                        {(mode === 'email' || mode === 'both') && (
                            <div className="ad-filter-group">
                                <label className="ad-filter-label">Subject</label>
                                <input 
                                    className="ad-input" 
                                    type="text" 
                                    placeholder="Message Subject..."
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="ad-filter-group">
                            <label className="ad-filter-label">Message Content</label>
                            <div style={{ fontSize: '0.75rem', color: 'var(--ad-t3)', marginBottom: '6px' }}>
                                Variables: <code>{'{firstName}'}</code>, <code>{'{lastName}'}</code>, <code>{'{idNumber}'}</code>, <code>{'{bibNumber}'}</code>
                            </div>
                            <textarea 
                                className="ad-input" 
                                style={{ minHeight: '180px', resize: 'vertical' }}
                                placeholder="Type your message here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(245,158,11,0.1)', padding: '10px 14px', borderRadius: '4px', border: '1px solid rgba(245,158,11,0.3)' }}>
                            <input 
                                type="checkbox" 
                                id="testMode" 
                                checked={testMode} 
                                onChange={(e) => setTestMode(e.target.checked)}
                                style={{ accentColor: 'var(--ad-accent)' }}
                            />
                            <label htmlFor="testMode" style={{ color: 'var(--ad-accent)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                                TEST MODE ACTIVE - Generates preview without real sends
                            </label>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-start', borderTop: '1px solid var(--ad-border)', paddingTop: '20px' }}>
                            <button 
                                className="ad-hbtn ad-hbtn-primary" 
                                onClick={handleSend}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : testMode ? 'Generate Preview' : 'Send Communication Now'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="ad-panel" style={{ position: 'sticky', top: '80px' }}>
                    <div className="ad-panel-head">
                        <div className="ad-panel-title">Preview & Stats</div>
                    </div>
                    <div className="ad-panel-body">
                        {!preview && !loading && (
                            <div style={{ color: 'var(--ad-t3)', textAlign: 'center', padding: '40px 0', fontSize: '0.85rem' }}>
                                Enter your message and click "Generate Preview" to see how it looks and who will receive it.
                            </div>
                        )}
                        {loading && (
                            <div style={{ color: 'var(--ad-t3)', textAlign: 'center', padding: '40px 0', fontSize: '0.85rem' }}>
                                Loading preview...
                            </div>
                        )}
                        {preview && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '10px' }}>
                                    <div style={{ background: 'var(--ad-bg)', padding: '12px', borderRadius: '4px', border: '1px solid var(--ad-border)' }}>
                                        <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ad-t3)', marginBottom: '5px', fontWeight: 'bold' }}>Targeted Uses</div>
                                        <div style={{ fontSize: '1.4rem', fontFamily: "'Bebas Neue', sans-serif", color: 'var(--ad-t1)' }}>{preview.recipientsCount}</div>
                                    </div>
                                    <div style={{ background: 'var(--ad-bg)', padding: '12px', borderRadius: '4px', border: '1px solid var(--ad-border)' }}>
                                        <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ad-t3)', marginBottom: '5px', fontWeight: 'bold' }}>Test Run</div>
                                        <div style={{ fontSize: '0.8rem', color: testMode ? 'var(--ad-accent)' : 'var(--ad-pl)', fontWeight: 'bold', paddingTop: '4px' }}>
                                            {testMode ? 'SIMULATED' : 'EXECUTED'}
                                        </div>
                                    </div>
                                </div>
                                
                                {preview.sampleRecipients && preview.sampleRecipients.length > 0 && (
                                    <div>
                                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ad-t2)', marginBottom: '10px', fontWeight: 'bold' }}>
                                            Sample Generated Messages
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }} className="ad-feed">
                                            {preview.sampleRecipients.map((r: any, idx: number) => (
                                                <div key={idx} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--ad-border)', borderRadius: '4px' }}>
                                                    <div style={{ fontWeight: 600, color: 'var(--ad-pl)', fontSize: '0.85rem', marginBottom: '2px' }}>{r.name || 'Unknown User'}</div>
                                                    <div style={{ color: 'var(--ad-t3)', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", marginBottom: '8px' }}>{r.contact || 'No Info'}</div>
                                                    <div style={{ color: 'var(--ad-t1)', fontSize: '0.85rem', lineHeight: '1.5', whiteSpace: 'pre-wrap', background: 'var(--ad-bg)', padding: '8px', borderRadius: '4px', borderLeft: '2px solid var(--ad-border2)' }}>
                                                        {r.compiledMessage}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(preview.smsStats || preview.emailStats) && (
                                    <div style={{ borderTop: '1px solid var(--ad-border)', paddingTop: '15px' }}>
                                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ad-t2)', marginBottom: '10px', fontWeight: 'bold' }}>
                                            Delivery Results
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {preview.smsStats && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', background: 'var(--ad-bg)', padding: '10px', borderRadius: '4px', border: '1px solid var(--ad-border)' }}>
                                                    <span style={{ color: 'var(--ad-t2)' }}>SMS SUCCESS</span>
                                                    <span style={{ color: 'var(--ad-pl)', fontWeight: 'bold' }}>{preview.smsStats.success}</span>
                                                </div>
                                            )}
                                            {preview.emailStats && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', background: 'var(--ad-bg)', padding: '10px', borderRadius: '4px', border: '1px solid var(--ad-border)' }}>
                                                    <span style={{ color: 'var(--ad-t2)' }}>EMAIL SUCCESS</span>
                                                    <span style={{ color: 'var(--ad-pl)', fontWeight: 'bold' }}>{preview.emailStats.success}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
