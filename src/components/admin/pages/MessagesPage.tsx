import { useEffect, useRef, useState } from 'react';
import { AiOutlineReload, AiOutlineUpload, AiOutlineDownload } from 'react-icons/ai';
import { adminApi } from '../api/adminApi';
import { errorMessage } from '../api/http';
import type { BulkSendPayload, CommsPreview, CsvRecipient, SmsBalance } from '../../../adminTypes';
import { CSV_TEMPLATE, parseCsvRecipients } from './csvRecipients';
import MessagesPreview from './MessagesPreview';
import SmsTopUpModal from './SmsTopUpModal';
import { ErrorBanner, SuccessBanner } from '../ui/Feedback';
import { saveFile } from '../api/download';

export default function MessagesPage() {
    const [mode, setMode] = useState<'sms' | 'email' | 'both'>('email');
    const [targetEntity, setTargetEntity] = useState<'cyclist' | 'raffle' | 'donor' | 'custom' | 'csv'>('cyclist');
    const [targetStatus, setTargetStatus] = useState<'all' | 'paid' | 'unpaid'>('all');
    
    const [customPhones, setCustomPhones] = useState('');
    const [customEmails, setCustomEmails] = useState('');
    const [csvRecipients, setCsvRecipients] = useState<CsvRecipient[]>([]);
    const [csvFileName, setCsvFileName] = useState('');
    const [csvErrors, setCsvErrors] = useState<string[]>([]);
    const csvInputRef = useRef<HTMLInputElement>(null);

    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [testMode, setTestMode] = useState(true);
    const [loading, setLoading] = useState(false);
    
    const [preview, setPreview] = useState<CommsPreview | null>(null);
    const [balance, setBalance] = useState<SmsBalance | null>(null);
    const [showRenewInfo, setShowRenewInfo] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBalance = async () => {
        setRefreshing(true);
        try {
            setBalance(await adminApi.messages.smsBalance());
        } catch (e) {
            console.error('Failed to fetch SMS balance', e);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    const handleCsvFile = async (file: File | null) => {
        if (!file) return;
        setCsvFileName(file.name);
        const text = await file.text();
        const { recipients, errors } = parseCsvRecipients(text);
        setCsvRecipients(recipients);
        setCsvErrors(errors);
        if (recipients.length === 0 && errors.length === 0) {
            setCsvErrors(['No valid rows found in the CSV file.']);
        }
    };

    const downloadCsvTemplate = () => {
        saveFile(new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' }), 'communications-recipients-template.csv');
    };

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
        if (targetEntity === 'csv') {
            if (csvRecipients.length === 0) {
                setErrorMsg('Please upload a CSV with at least one valid firstName and email row.');
                return;
            }
            if ((mode === 'sms' || mode === 'both') && !csvRecipients.some(r => r.phone)) {
                setErrorMsg('CSV SMS requires a phone column with at least one number. Use Email mode or add phone numbers to your CSV.');
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
            const payload: BulkSendPayload = {
                mode,
                targetEntity,
                targetStatus,
                customPhones,
                customEmails,
                csvRecipients: targetEntity === 'csv' ? csvRecipients : undefined,
                message,
                subject,
                testMode
            };
            const data = await adminApi.messages.bulkSend(payload);

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
        } catch (error) {
            console.error('Error sending message:', error);
            setErrorMsg(errorMessage(error, 'Send failed. Check console logs.'));
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
                                <span style={{ fontSize: '1.8rem', fontFamily: "'Bebas Neue', sans-serif", color: 'var(--ad-pl)', lineHeight: 1 }}>{balance.credit || 'N/A'}</span>
                            </div>
                            <button 
                                className={`ad-hbtn ad-hbtn-icon ${refreshing ? 'ad-spin' : ''}`} 
                                onClick={fetchBalance}
                                style={{ padding: '8px', minWidth: 'auto', border: 'none', background: 'none', color: 'var(--ad-t3)' }}
                                title="Refresh Balance"
                            >
                                <AiOutlineReload size={16} />
                            </button>
                        </div>
                        <button 
                            className="ad-hbtn ad-hbtn-primary" 
                            onClick={() => setShowRenewInfo(true)}
                        >
                            Top Up Credits
                        </button>
                    </div>
                )}
            </div>

            {showRenewInfo && <SmsTopUpModal onClose={() => setShowRenewInfo(false)} />}

            {errorMsg && <div style={{ marginBottom: '20px' }}><ErrorBanner message={errorMsg} actionLabel="Close" onAction={() => setErrorMsg(null)} /></div>}
            {successMsg && <SuccessBanner message={successMsg} onClose={() => setSuccessMsg(null)} />}

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
                                <select className="ad-select" value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
                                    <option value="sms">SMS Only</option>
                                    <option value="email">Email Only</option>
                                    <option value="both">Both SMS & Email</option>
                                </select>
                            </div>

                            <div className="ad-filter-group" style={{ flex: 1 }}>
                                <label className="ad-filter-label">Target Group</label>
                                <select className="ad-select" value={targetEntity} onChange={(e) => {
                                    const value = e.target.value as typeof targetEntity;
                                    setTargetEntity(value);
                                    if (value === 'csv') setMode('email');
                                }}>
                                    <option value="cyclist">Cyclists</option>
                                    <option value="raffle">Raffle Entries</option>
                                    <option value="donor">Donors</option>
                                    <option value="custom">Custom (Manual Entry)</option>
                                    <option value="csv">CSV Upload</option>
                                </select>
                            </div>

                            {targetEntity !== 'custom' && targetEntity !== 'csv' && (
                                <div className="ad-filter-group" style={{ flex: 1 }}>
                                    <label className="ad-filter-label">Payment Status</label>
                                    <select className="ad-select" value={targetStatus} onChange={(e) => setTargetStatus(e.target.value as typeof targetStatus)}>
                                        <option value="all">All</option>
                                        <option value="paid">Paid Only</option>
                                        <option value="unpaid">Unpaid Only</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {targetEntity === 'csv' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--ad-bg)', padding: '14px', borderRadius: '4px', border: '1px solid var(--ad-border)' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                                    <input
                                        ref={csvInputRef}
                                        type="file"
                                        accept=".csv,text/csv"
                                        style={{ display: 'none' }}
                                        onChange={e => handleCsvFile(e.target.files?.[0] || null)}
                                    />
                                    <button
                                        type="button"
                                        className="ad-hbtn ad-hbtn-primary"
                                        onClick={() => csvInputRef.current?.click()}
                                    >
                                        <AiOutlineUpload /> Upload CSV
                                    </button>
                                    <button
                                        type="button"
                                        className="ad-hbtn"
                                        onClick={downloadCsvTemplate}
                                        style={{ border: '1px solid var(--ad-border)', background: 'transparent' }}
                                    >
                                        <AiOutlineDownload /> Download Template
                                    </button>
                                    {csvFileName && (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--ad-t2)' }}>
                                            {csvFileName} · {csvRecipients.length} recipient{csvRecipients.length === 1 ? '' : 's'}
                                        </span>
                                    )}
                                </div>
                                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--ad-t3)', lineHeight: 1.5 }}>
                                    CSV columns: <code>firstName</code>, <code>email</code> (required). Optional: <code>lastName</code>, <code>phone</code>.
                                    Use <code>{'{firstName}'}</code> in your message for personalisation.
                                </p>
                                {csvErrors.length > 0 && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--ad-accent)', lineHeight: 1.5 }}>
                                        {csvErrors.slice(0, 5).map((err, i) => <div key={i}>{err}</div>)}
                                        {csvErrors.length > 5 && <div>…and {csvErrors.length - 5} more</div>}
                                    </div>
                                )}
                                {csvRecipients.length > 0 && (
                                    <div style={{ maxHeight: '120px', overflowY: 'auto', border: '1px solid var(--ad-border)', borderRadius: '4px' }}>
                                        <table className="ad-table" style={{ minWidth: '100%' }}>
                                            <thead>
                                                <tr>
                                                    {['First Name', 'Email'].map(h => <th key={h} className="ad-th">{h}</th>)}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {csvRecipients.slice(0, 5).map((r, i) => (
                                                    <tr key={i} className="ad-tr">
                                                        <td className="ad-td">{r.firstName}</td>
                                                        <td className="ad-td ad-mono" style={{ fontSize: '0.75rem' }}>{r.email}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {csvRecipients.length > 5 && (
                                            <div style={{ padding: '8px 12px', fontSize: '0.72rem', color: 'var(--ad-t3)' }}>
                                                + {csvRecipients.length - 5} more rows
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

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
                                Variables: <code>{'{firstName}'}</code>, <code>{'{lastName}'}</code>, <code>{'{bibNumber}'}</code>
                                {(mode === 'email' || mode === 'both') && (
                                    <> · Paste full URLs (e.g. <code>https://…</code>) — they will be clickable in email.</>
                                )}
                            </div>
                            <textarea 
                                className="ad-input" 
                                style={{ minHeight: '180px', resize: 'vertical' }}
                                placeholder={`Hi {firstName},\n\nThank you for being part of Ride With The Warriors 2026...\n\nShare your experience: https://airbornefraternity.org/ride-with-the-warriors/feedback\n\nCheck raffle results: https://airbornefraternity.org/raffle/`}
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

                <MessagesPreview preview={preview} loading={loading} testMode={testMode} />
            </div>
        </>
    );
}
