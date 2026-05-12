import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import {
    AiOutlineSearch,
    AiOutlineExclamationCircle,
    AiOutlineArrowRight,
    AiOutlineIdcard,
    AiOutlineMail,
    AiOutlineMobile,
} from 'react-icons/ai';

type SearchType = 'id' | 'email' | 'phone';

interface ProfileLookupProps {
    onFound: (registration: any) => void;
    onRaffleFound: (ticket: any) => void;
}

const TABS: { type: SearchType; label: string; icon: React.ReactNode; placeholder: string; hint: string }[] = [
    {
        type: 'id',
        label: 'Reg / Raffle ID',
        icon: <AiOutlineIdcard />,
        placeholder: 'Registration ID or Raffle Code (e.g. AA001)',
        hint: 'Registration ID (e.g. 1001), Passport number, or Raffle Code (e.g. AA001)',
    },
    {
        type: 'email',
        label: 'Email',
        icon: <AiOutlineMail />,
        placeholder: 'e.g. john@example.com',
        hint: 'Use the email address you registered with',
    },
    {
        type: 'phone',
        label: 'Phone',
        icon: <AiOutlineMobile />,
        placeholder: 'e.g. 0712 345 678',
        hint: 'Use your M-Pesa phone number',
    },
];

const ProfileLookup = ({ onFound, onRaffleFound }: ProfileLookupProps) => {
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState<SearchType>('id');
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const active = TABS.find(t => t.type === searchType)!;

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) { setError('Please enter a value to search'); return; }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/profile/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ searchType, searchValue: searchValue.trim() }),
            });
            const data = await response.json();
            const { registration, raffleTicket } = data;
            
            if (registration) { 
                onFound(registration); 
                navigate(`/profile/${registration.id}`); 
            }
            else if (raffleTicket) { 
                onRaffleFound(raffleTicket); 
                // For email or phone searches, it's better to show the consolidated list page
                if (searchType === 'email' || searchType === 'phone') {
                    const targetEmail = raffleTicket.email || searchValue.trim();
                    navigate(`/raffle/profile/email/${encodeURIComponent(targetEmail)}`);
                } else {
                    navigate(`/raffle/profile/${raffleTicket.id}`); 
                }
            }
            else setError('Nothing found matching your search. Please try again.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                

                :root, [data-theme="dark"] {
                    --color-primary: #2d6a2d;
                    --color-primary-dark: #1e4d1e;
                    --color-primary-light: #4caf50;
                    --pl-bg:        #0a0a0a;
                    --pl-card:      #141414;
                    --pl-raised:    #111111;
                    --pl-border:    rgba(255,255,255,0.07);
                    --pl-border-2:  rgba(255,255,255,0.13);
                    --pl-text-1:    #ffffff;
                    --pl-text-2:    rgba(255,255,255,0.58);
                    --pl-text-3:    rgba(255,255,255,0.32);
                    --pl-input-bg:  #0a0a0a;
                    --pl-tab-bg:    rgba(255,255,255,0.04);
                    --pl-tab-active:#141414;
                    --pl-error-bg:  rgba(220,38,38,0.07);
                    --pl-error-bd:  rgba(220,38,38,0.22);
                    --pl-err-text:  #ef4444;
                }
                [data-theme="light"] {
                    --color-primary: #245924;
                    --color-primary-dark: #1a421a;
                    --color-primary-light: #2d6a2d;
                    --pl-bg:        #f5f2eb;
                    --pl-card:      #ffffff;
                    --pl-raised:    #edeae2;
                    --pl-border:    rgba(0,0,0,0.09);
                    --pl-border-2:  rgba(0,0,0,0.15);
                    --pl-text-1:    #111111;
                    --pl-text-2:    rgba(20,20,20,0.60);
                    --pl-text-3:    rgba(20,20,20,0.38);
                    --pl-input-bg:  #f9f7f3;
                    --pl-tab-bg:    rgba(0,0,0,0.04);
                    --pl-tab-active:#ffffff;
                    --pl-error-bg:  rgba(185,28,28,0.05);
                    --pl-error-bd:  rgba(185,28,28,0.18);
                    --pl-err-text:  #b91c1c;
                }

                .pl-page {
                    font-family: 'Barlow', sans-serif;
                    background: var(--pl-bg);
                    color: var(--pl-text-1);
                    min-height: calc(100vh - 80px);
                    display: flex; align-items: center; justify-content: center;
                    padding: 64px 24px 80px;
                    transition: background 0.3s, color 0.3s;
                }
                .pl-inner { width: 100%; max-width: 560px; }

                /* ── Header ── */
                .pl-label-row {
                    display: flex; align-items: center; gap: 12px;
                    justify-content: center; margin-bottom: 20px;
                }
                .pl-label-line { height: 1px; width: 36px; background: var(--color-primary); flex-shrink: 0; }
                .pl-eyebrow {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.65rem; font-weight: 700;
                    letter-spacing: 0.28em; text-transform: uppercase;
                    color: var(--color-primary-light);
                }
                .pl-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(3rem, 9vw, 5.5rem);
                    letter-spacing: 0.03em; line-height: 0.92;
                    color: var(--pl-text-1); text-align: center;
                    margin-bottom: 12px;
                }
                .pl-title span { color: var(--color-primary-light); }
                .pl-subtitle {
                    font-size: 0.95rem; font-weight: 300;
                    color: var(--pl-text-3); text-align: center; line-height: 1.6;
                    margin-bottom: 44px;
                }

                /* ── Panel ── */
                .pl-panel {
                    background: var(--pl-card);
                    border: 1px solid var(--pl-border);
                    padding: 40px 36px;
                    clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%);
                    margin-bottom: 20px;
                }
                @media (max-width: 480px) { .pl-panel { padding: 28px 22px; } }

                /* ── Tabs ── */
                .pl-tabs {
                    display: grid; grid-template-columns: repeat(3, 1fr);
                    gap: 3px; background: var(--pl-tab-bg);
                    border: 1px solid var(--pl-border);
                    padding: 4px; margin-bottom: 36px;
                    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
                }
                .pl-tab {
                    display: flex; align-items: center; justify-content: center; gap: 7px;
                    padding: 11px 8px;
                    background: none; border: none; cursor: pointer;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.72rem; font-weight: 700;
                    letter-spacing: 0.16em; text-transform: uppercase;
                    color: var(--pl-text-3);
                    transition: color 0.2s, background 0.2s;
                    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
                }
                .pl-tab svg { font-size: 0.9rem; }
                .pl-tab.active {
                    background: var(--pl-tab-active);
                    color: var(--color-primary-light);
                    border: 1px solid var(--pl-border);
                }
                .pl-tab:not(.active):hover { color: var(--pl-text-2); }

                /* ── Input ── */
                .pl-input-wrap {
                    position: relative; margin-bottom: 10px;
                }
                .pl-input-icon {
                    position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
                    color: var(--pl-text-3); font-size: 1.15rem;
                    pointer-events: none; transition: color 0.2s;
                }
                .pl-input-wrap:focus-within .pl-input-icon { color: var(--color-primary-light); }
                .pl-input {
                    width: 100%;
                    background: var(--pl-input-bg);
                    border: 1px solid var(--pl-border);
                    padding: 16px 18px 16px 44px;
                    font-family: 'Barlow', sans-serif;
                    font-size: 0.97rem; font-weight: 500;
                    color: var(--pl-text-1);
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
                }
                .pl-input::placeholder { color: var(--pl-text-3); font-weight: 400; }
                .pl-input:focus {
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 2px rgba(45,106,45,0.12);
                }
                .pl-hint {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.65rem; font-weight: 700;
                    letter-spacing: 0.18em; text-transform: uppercase;
                    color: var(--pl-text-3); text-align: center;
                    margin-top: 10px; line-height: 1.6;
                }

                /* ── Error ── */
                .pl-error {
                    display: flex; align-items: flex-start; gap: 10px;
                    background: var(--pl-error-bg);
                    border: 1px solid var(--pl-error-bd);
                    padding: 13px 16px; margin-top: 20px;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
                }
                .pl-error svg { color: var(--pl-err-text); font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
                .pl-error-text { font-size: 0.85rem; color: var(--pl-err-text); line-height: 1.5; }

                /* ── Submit ── */
                .pl-submit {
                    position: relative; overflow: hidden;
                    width: 100%; padding: 18px 32px;
                    margin-top: 28px;
                    background: var(--color-primary); color: #fff;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 1rem; font-weight: 800;
                    letter-spacing: 0.16em; text-transform: uppercase;
                    border: none; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 12px;
                    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
                    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
                }
                .pl-submit::before {
                    content: ''; position: absolute; top: 0; left: -80%;
                    width: 60%; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.42) 50%, transparent 80%);
                    transform: skewX(-20deg); pointer-events: none;
                }
                .pl-submit:hover:not(:disabled)::before { left: 140%; transition: left 0.55s cubic-bezier(0.25,0.46,0.45,0.94); }
                .pl-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(45,106,45,0.38); background: var(--color-primary-dark); }
                .pl-submit:active:not(:disabled) { transform: translateY(0); }
                .pl-submit:disabled { opacity: 0.55; cursor: not-allowed; }
                .pl-submit svg { font-size: 1.1rem; transition: transform 0.2s; }
                .pl-submit:hover:not(:disabled) svg { transform: translateX(3px); }

                .pl-spinner {
                    width: 18px; height: 18px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff; border-radius: 50%;
                    animation: plSpin 0.7s linear infinite;
                }
                @keyframes plSpin { to { transform: rotate(360deg); } }

                /* ── Footer ── */
                .pl-footer {
                    text-align: center;
                    font-size: 0.82rem; color: var(--pl-text-3);
                }
                .pl-footer a {
                    color: var(--color-primary-light); text-decoration: none;
                    font-weight: 600; transition: color 0.2s;
                }
                .pl-footer a:hover { color: var(--color-primary); text-decoration: underline; }
            `}</style>

            <div className="pl-page">
                <div className="pl-inner">

                    {/* ── Header ── */}
                    <div className="pl-label-row">
                        <div className="pl-label-line" />
                        <span className="pl-eyebrow">Participant Lookup</span>
                        <div className="pl-label-line" />
                    </div>
                    <h1 className="pl-title">Track My <span>Entry.</span></h1>
                    <p className="pl-subtitle">Search for your event registration or raffle ticket</p>

                    {/* ── Panel ── */}
                    <div className="pl-panel">

                        {/* Tabs */}
                        <div className="pl-tabs">
                            {TABS.map(tab => (
                                <button
                                    key={tab.type}
                                    className={`pl-tab${searchType === tab.type ? ' active' : ''}`}
                                    onClick={() => { setSearchType(tab.type); setSearchValue(''); setError(null); }}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSearch}>
                            <div className="pl-input-wrap">
                                <AiOutlineSearch className="pl-input-icon" />
                                <input
                                    type={active.type === 'email' ? 'email' : 'text'}
                                    value={searchValue}
                                    onChange={e => setSearchValue(e.target.value)}
                                    placeholder={active.placeholder}
                                    className="pl-input"
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                            </div>
                            <p className="pl-hint">{active.hint}</p>

                            {error && (
                                <div className="pl-error">
                                    <AiOutlineExclamationCircle />
                                    <span className="pl-error-text">{error}</span>
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="pl-submit">
                                {loading ? (
                                    <><div className="pl-spinner" /><span>Searching…</span></>
                                ) : (
                                    <><span>Search Profile</span><AiOutlineArrowRight /></>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <p className="pl-footer">
                        Need help? <a href="/contact">Contact Support</a>
                    </p>

                </div>
            </div>
        </>
    );
};

export default ProfileLookup;