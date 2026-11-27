import type { CommsPreview } from '../../../adminTypes';

interface MessagesPreviewProps {
    preview: CommsPreview | null;
    loading: boolean;
    testMode: boolean;
}

/** Right-hand panel of the Messages page: who will receive it, sample messages, delivery results. */
export default function MessagesPreview({ preview, loading, testMode }: MessagesPreviewProps) {
    return (
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
                                    {preview.sampleRecipients.map((r, idx: number) => (
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
    );
}
