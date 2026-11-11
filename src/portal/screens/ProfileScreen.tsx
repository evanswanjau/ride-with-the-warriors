import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuLogOut, LuSmartphone, LuLifeBuoy, LuChevronRight } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import { clearPortalCache } from '../PortalData';
import { useInstallAction } from '../InstallCard';
import { Callout, CodeInput, ScreenHeader, Sheet, errorMessage } from '../ui';

type Kind = 'email' | 'phone';

/** Shows a 2547… number as 07… */
const localPhone = (p: string | null) => (p ? `0${p.slice(3)}` : null);

/** Email or phone change: code goes to the NEW address, nothing is saved until it's entered. */
function ContactSheet({ kind, onClose, onDone }: { kind: Kind; onClose: () => void; onDone: (msg: string) => void }) {
    const { apiFetch, account, setAccount } = useAuth();
    const current = kind === 'email' ? account?.email : localPhone(account?.phone ?? null);
    const what = kind === 'email' ? 'email address' : 'mobile number';
    const [step, setStep] = useState<1 | 2>(1);
    const [value, setValue] = useState('');
    const [sentTo, setSentTo] = useState('');
    const [devCode, setDevCode] = useState('');
    const [code, setCode] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const start = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setBusy(true);
        setError('');
        const res = await apiFetch('/auth/contact/start', { method: 'POST', body: JSON.stringify({ identifier: value.trim() }) });
        setBusy(false);
        if (!res.ok) {
            setError(await errorMessage(res, 'Could not send the code. Please try again.'));
            return;
        }
        const data = await res.json();
        setSentTo(data.sentTo || value.trim());
        setDevCode(data.devCode || '');
        setCode('');
        setStep(2);
    };

    const verify = async (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);
        setError('');
        const res = await apiFetch('/auth/contact/verify', { method: 'POST', body: JSON.stringify({ identifier: value.trim(), code }) });
        setBusy(false);
        if (!res.ok) {
            setError(await errorMessage(res, 'That code is not correct.'));
            return;
        }
        const data = await res.json();
        setAccount(data.account);
        onDone(current ? `Your ${what} has been changed. We've told your old ${what}.` : `Your ${what} has been added.`);
    };

    return (
        <Sheet title={`${current ? 'Change' : 'Add'} ${what}`} onClose={onClose}>
            <div className="rp-progress" aria-hidden><i className="on" /><i className={step === 2 ? 'on' : ''} /></div>
            {step === 1 ? (
                <form className="rp-stack" onSubmit={start}>
                    {current && <p className="rp-muted">Current: <strong className="rp-strong">{current}</strong></p>}
                    <div className="rp-field">
                        <label className="rp-label" htmlFor="rp-new-contact">New {what}</label>
                        <input
                            id="rp-new-contact"
                            className="rp-input"
                            type={kind === 'email' ? 'email' : 'tel'}
                            inputMode={kind === 'email' ? 'email' : 'tel'}
                            autoComplete={kind === 'email' ? 'email' : 'tel'}
                            placeholder={kind === 'email' ? 'name@example.com' : '0712 345 678'}
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            required
                        />
                    </div>
                    <Callout kind="info">
                        We'll send a 6-digit code to the new {what}. Nothing changes until you enter it.
                        {kind === 'phone' && ' M-Pesa prompts and SMS updates will go to the new number.'}
                    </Callout>
                    {error && <p className="rp-error" role="alert">{error}</p>}
                    <button type="submit" className="rp-btn rp-btn--primary rp-btn--block" disabled={busy || !value.trim()}>
                        {busy ? 'Sending…' : 'Send code'}
                    </button>
                </form>
            ) : (
                <form className="rp-stack" onSubmit={verify}>
                    <p className="rp-muted">Enter the 6-digit code we sent to <strong className="rp-strong">{sentTo}</strong>. It expires in 10 minutes.</p>
                    {devCode && <p className="rp-muted rp-small">Test mode: your code is <strong>{devCode}</strong></p>}
                    <div className="rp-field">
                        <label className="rp-label" htmlFor="rp-contact-code">6-digit code</label>
                        <CodeInput id="rp-contact-code" value={code} onChange={setCode} />
                    </div>
                    {error && <p className="rp-error" role="alert">{error}</p>}
                    <button type="submit" className="rp-btn rp-btn--primary rp-btn--block" disabled={busy || code.length !== 6}>
                        {busy ? 'Checking…' : 'Verify and save'}
                    </button>
                    <div className="rp-inline rp-inline--between">
                        <button type="button" className="rp-linkbtn" disabled={busy} onClick={() => start()}>Resend code</button>
                        <button type="button" className="rp-linkbtn" onClick={() => { setStep(1); setError(''); }}>Use a different {kind === 'email' ? 'email' : 'number'}</button>
                    </div>
                </form>
            )}
        </Sheet>
    );
}

function NameSheet({ onClose, onDone }: { onClose: () => void; onDone: (msg: string) => void }) {
    const { apiFetch, account, setAccount } = useAuth();
    const [firstName, setFirstName] = useState(account?.firstName ?? '');
    const [lastName, setLastName] = useState(account?.lastName ?? '');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);
        setError('');
        const res = await apiFetch('/me/account', { method: 'PATCH', body: JSON.stringify({ firstName: firstName.trim(), lastName: lastName.trim() }) });
        setBusy(false);
        if (!res.ok) {
            setError(await errorMessage(res, 'Could not save. Please try again.'));
            return;
        }
        setAccount((await res.json()).account);
        onDone('Name saved');
    };

    return (
        <Sheet title="Your name" onClose={onClose}>
            <form className="rp-stack" onSubmit={save}>
                <div className="rp-two">
                    <div className="rp-field">
                        <label className="rp-label" htmlFor="rp-first">First name</label>
                        <input id="rp-first" className="rp-input" autoComplete="given-name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                    </div>
                    <div className="rp-field">
                        <label className="rp-label" htmlFor="rp-last">Last name</label>
                        <input id="rp-last" className="rp-input" autoComplete="family-name" value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                </div>
                <p className="rp-muted rp-small">This is the name on your account. Names on entries stay as registered, to match the rider's ID.</p>
                {error && <p className="rp-error" role="alert">{error}</p>}
                <button type="submit" className="rp-btn rp-btn--primary rp-btn--block" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
            </form>
        </Sheet>
    );
}

const ProfileScreen = () => {
    const { account, signOut } = useAuth();
    const navigate = useNavigate();
    const install = useInstallAction();
    const [sheet, setSheet] = useState<null | 'name' | Kind>(null);
    const [toast, setToast] = useState('');

    if (!account) return null;
    const done = (msg: string) => { setSheet(null); setToast(msg); };

    return (
        <>
            <ScreenHeader title="Profile" />
            <div className="rp-page">
                <div className="rp-person">
                    <span className="rp-av rp-av--lg" aria-hidden>{`${account.firstName.charAt(0)}${account.lastName.charAt(0)}`.toUpperCase()}</span>
                    <div>
                        <p className="rp-person-name">{account.firstName} {account.lastName}</p>
                        <p className="rp-muted rp-small">Account since {new Date(account.createdAt).getFullYear()}</p>
                    </div>
                </div>
                {toast && <Callout kind="ok">{toast}</Callout>}

                <div className="rp-split">
                    <div className="rp-stack">
                        <section className="rp-stack" aria-labelledby="rp-account">
                            <h2 id="rp-account" className="rp-h2">Account</h2>
                            <ul className="rp-card rp-details">
                                <li className="rp-detail">
                                    <div className="rp-detail-main"><p className="rp-detail-label">Name</p><p className="rp-detail-value">{account.firstName} {account.lastName}</p></div>
                                    <button type="button" className="rp-linkbtn" aria-label="Edit name" onClick={() => setSheet('name')}>Edit</button>
                                </li>
                                <li className="rp-detail">
                                    <div className="rp-detail-main"><p className="rp-detail-label">Email</p><p className="rp-detail-value">{account.email ?? 'Not added'}</p></div>
                                    <button type="button" className="rp-linkbtn" aria-label={account.email ? 'Change email' : 'Add email'} onClick={() => setSheet('email')}>{account.email ? 'Change' : 'Add'}</button>
                                </li>
                                <li className="rp-detail">
                                    <div className="rp-detail-main"><p className="rp-detail-label">Mobile (M-Pesa and SMS)</p><p className="rp-detail-value">{localPhone(account.phone) ?? 'Not added'}</p></div>
                                    <button type="button" className="rp-linkbtn" aria-label={account.phone ? 'Change mobile number' : 'Add mobile number'} onClick={() => setSheet('phone')}>{account.phone ? 'Change' : 'Add'}</button>
                                </li>
                            </ul>
                            <p className="rp-muted rp-small">You log in with either. A code goes to the new email or number before we save a change.</p>
                        </section>

                        <section className="rp-stack" aria-labelledby="rp-riderdetails">
                            <h2 id="rp-riderdetails" className="rp-h2">Rider details</h2>
                            <Link to="/account/riders" className="rp-card rp-navrow">
                                <span>
                                    <span className="rp-detail-value">Date of birth, T-shirt, emergency contact</span>
                                    <span className="rp-detail-label">Edit them for each rider in My riders</span>
                                </span>
                                <LuChevronRight size={20} aria-hidden />
                            </Link>
                            <Callout kind="info">Your ID or passport number is locked once registered. Only the organisers can correct it.</Callout>
                        </section>
                    </div>

                    <div className="rp-stack">
                        <section className="rp-stack" aria-labelledby="rp-app">
                            <h2 id="rp-app" className="rp-h2">App</h2>
                            <ul className="rp-card rp-details">
                                {!install.installed && (
                                    <li className="rp-detail">
                                        <div className="rp-detail-main"><p className="rp-detail-value"><LuSmartphone aria-hidden /> Install on this device</p><p className="rp-detail-label">Open your bib from the home screen on race day</p></div>
                                        <button type="button" className="rp-linkbtn" onClick={install.start}>Install</button>
                                    </li>
                                )}
                                <li className="rp-detail">
                                    <div className="rp-detail-main"><p className="rp-detail-value"><LuLifeBuoy aria-hidden /> Help and support</p><p className="rp-detail-label">Questions about entries, payments or your details</p></div>
                                    <Link to="/contact" className="rp-linkbtn">Contact</Link>
                                </li>
                            </ul>
                        </section>
                        <button
                            type="button"
                            className="rp-btn rp-btn--ghost rp-btn--block"
                            onClick={async () => { clearPortalCache(); await signOut(); navigate('/login'); }}
                        >
                            <LuLogOut size={18} aria-hidden /> Log out
                        </button>
                    </div>
                </div>
            </div>
            {sheet === 'name' && <NameSheet onClose={() => setSheet(null)} onDone={done} />}
            {(sheet === 'email' || sheet === 'phone') && <ContactSheet kind={sheet} onClose={() => setSheet(null)} onDone={done} />}
            {install.steps}
        </>
    );
};

export default ProfileScreen;
