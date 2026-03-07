import { useState, useEffect } from 'react';
import {
    AiOutlineCheck,
    AiOutlineBarcode,
    AiOutlineUp,
    AiOutlineDown,
    AiOutlineIdcard,
    AiOutlineHome,
    AiOutlineTrophy,
} from 'react-icons/ai';
import Confetti from 'react-confetti';
import { calculateAge } from '../../utils';
import { API_BASE_URL } from '../../config';

interface SuccessPageProps {
    registrationId: string;
    onViewProfile: () => void;
    onDone: () => void;
}

const SuccessPage = ({ registrationId, onViewProfile, onDone }: SuccessPageProps) => {
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [registration, setRegistration] = useState<any>(null);
    const [showMembers, setShowMembers] = useState(false);

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);

        fetch(`${API_BASE_URL}/profile/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchType: 'id', searchValue: registrationId }),
        })
            .then(res => res.json())
            .then(data => { if (data.registration) setRegistration(data.registration); })
            .catch(console.error);

        return () => window.removeEventListener('resize', handleResize);
    }, [registrationId]);

    const isTeam = registration?.type === 'team';
    const members = registration?.payload?.teamDetails?.members || [];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

                :root, [data-theme="dark"] {
                    --color-primary: #2d6a2d;
                    --color-primary-dark: #1e4d1e;
                    --color-primary-light: #4caf50;
                    --color-accent: #f59e0b;
                    --sx-bg:         #0a0a0a;
                    --sx-raised:     #111111;
                    --sx-card:       #141414;
                    --sx-card-alt:   #0e0e0e;
                    --sx-border:     rgba(255,255,255,0.07);
                    --sx-border-2:   rgba(255,255,255,0.13);
                    --sx-text-1:     #ffffff;
                    --sx-text-2:     rgba(255,255,255,0.58);
                    --sx-text-3:     rgba(255,255,255,0.32);
                    --sx-divider:    rgba(255,255,255,0.05);
                    --sx-member-bg:  #0e0e0e;
                    --sx-id-bg:      rgba(45,106,45,0.06);
                    --sx-id-bd:      rgba(45,106,45,0.2);
                    --sx-caption-color: rgba(255,255,255,0.55);
                }
                [data-theme="light"] {
                    --color-primary: #245924;
                    --color-primary-dark: #1a421a;
                    --color-primary-light: #2d6a2d;
                    --color-accent: #d97706;
                    --sx-bg:         #f5f2eb;
                    --sx-raised:     #edeae2;
                    --sx-card:       #ffffff;
                    --sx-card-alt:   #f9f7f3;
                    --sx-border:     rgba(0,0,0,0.09);
                    --sx-border-2:   rgba(0,0,0,0.15);
                    --sx-text-1:     #111111;
                    --sx-text-2:     rgba(20,20,20,0.60);
                    --sx-text-3:     rgba(20,20,20,0.38);
                    --sx-divider:    rgba(0,0,0,0.06);
                    --sx-member-bg:  #f9f7f3;
                    --sx-id-bg:      rgba(36,89,36,0.05);
                    --sx-id-bd:      rgba(36,89,36,0.18);
                    --sx-caption-color: rgba(20,20,20,0.45);
                }

                .sx-page {
                    font-family: 'Barlow', sans-serif;
                    background: var(--sx-bg);
                    color: var(--sx-text-1);
                    min-height: 100vh;
                    display: flex; align-items: center; justify-content: center;
                    padding: 48px 24px 80px;
                    overflow-x: hidden;
                    transition: background 0.3s, color 0.3s;
                }

                .sx-inner {
                    max-width: 600px; width: 100%;
                    display: flex; flex-direction: column; align-items: center;
                    gap: 0; position: relative; z-index: 10;
                }

                /* ── Label row ── */
                .sx-label-row {
                    display: flex; align-items: center; gap: 12px;
                    justify-content: center; margin-bottom: 32px;
                }
                .sx-label-line { height: 1px; width: 36px; background: var(--color-primary); flex-shrink: 0; }
                .sx-eyebrow {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.65rem; font-weight: 700;
                    letter-spacing: 0.28em; text-transform: uppercase;
                    color: var(--color-primary-light);
                }

                /* ── Check icon ── */
                .sx-check-wrap {
                    margin-bottom: 28px;
                    animation: sxPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                @keyframes sxPop {
                    from { transform: scale(0); opacity: 0; }
                    to   { transform: scale(1); opacity: 1; }
                }
                .sx-check-outer {
                    width: 80px; height: 80px;
                    border: 2px solid rgba(45,106,45,0.35);
                    background: rgba(45,106,45,0.1);
                    display: flex; align-items: center; justify-content: center;
                    position: relative;
                    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
                }
                .sx-check-outer::before {
                    content: '';
                    position: absolute; inset: -1px;
                    background: conic-gradient(var(--color-primary-light) 0deg, transparent 360deg);
                    animation: sxSpin 3s linear infinite;
                    opacity: 0.25;
                    clip-path: inherit;
                }
                @keyframes sxSpin { to { transform: rotate(360deg); } }
                .sx-check-icon {
                    color: var(--color-primary-light); font-size: 2.2rem;
                    position: relative; z-index: 1;
                }

                /* ── Title ── */
                .sx-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(3rem, 8vw, 5rem);
                    letter-spacing: 0.03em; line-height: 0.92;
                    color: var(--sx-text-1);
                    text-align: center; margin-bottom: 16px;
                    animation: sxFadeUp 0.6s ease 0.15s both;
                }
                .sx-title span { color: var(--color-primary-light); }
                @keyframes sxFadeUp {
                    from { transform: translateY(16px); opacity: 0; }
                    to   { transform: translateY(0); opacity: 1; }
                }

                .sx-subtitle {
                    font-size: 0.97rem; font-weight: 300; line-height: 1.72;
                    color: var(--sx-text-2); text-align: center; max-width: 420px;
                    margin-bottom: 44px;
                    animation: sxFadeUp 0.6s ease 0.25s both;
                }
                .sx-subtitle strong { color: var(--sx-text-1); font-weight: 700; }

                /* ── ID panel ── */
                .sx-id-panel {
                    width: 100%;
                    background: var(--sx-card);
                    border: 1px solid var(--sx-border);
                    overflow: hidden;
                    clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%);
                    margin-bottom: 16px;
                    animation: sxFadeUp 0.6s ease 0.4s both;
                }

                /* Top strip */
                .sx-id-top {
                    background: var(--sx-id-bg);
                    border-bottom: 1px solid var(--sx-id-bd);
                    padding: 20px 32px;
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 12px;
                }
                .sx-id-top-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.62rem; font-weight: 700;
                    letter-spacing: 0.28em; text-transform: uppercase;
                    color: var(--sx-text-3);
                }
                .sx-id-trophy {
                    color: var(--color-accent); font-size: 1.1rem;
                }

                /* ID number */
                .sx-id-body {
                    padding: 28px 32px;
                    display: flex; align-items: center; justify-content: center;
                    gap: 14px;
                    border-bottom: 1px solid var(--sx-divider);
                }
                .sx-id-barcode { color: var(--color-primary-light); font-size: 2rem; flex-shrink: 0; }
                .sx-id-number {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: clamp(1.6rem, 5vw, 2.4rem);
                    font-weight: 700; letter-spacing: 0.04em;
                    color: var(--color-primary-light);
                    user-select: all; word-break: break-all;
                }

                /* Dashed perforation line (like a ticket) */
                .sx-id-perf {
                    display: flex; align-items: center; gap: 0;
                    padding: 0 24px;
                    overflow: hidden;
                }
                .sx-id-notch {
                    width: 14px; height: 14px; flex-shrink: 0;
                    background: var(--sx-bg);
                    border-radius: 50%;
                    margin: -7px;
                }
                .sx-id-perf-line {
                    flex: 1; border-top: 1px dashed var(--sx-border-2);
                }

                /* Members toggle */
                .sx-members-section { padding: 20px 32px; }
                .sx-members-toggle {
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    width: 100%; background: none; border: none; cursor: pointer;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.75rem; font-weight: 700;
                    letter-spacing: 0.16em; text-transform: uppercase;
                    color: var(--sx-text-3);
                    transition: color 0.2s; padding: 8px 0;
                }
                .sx-members-toggle:hover { color: var(--color-primary-light); }

                .sx-members-list { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
                .sx-member-card {
                    background: var(--sx-member-bg);
                    border: 1px solid var(--sx-border);
                    padding: 14px 18px;
                    display: flex; align-items: center; justify-content: space-between;
                    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
                    transition: border-color 0.2s;
                }
                .sx-member-card:hover { border-color: var(--color-primary); }
                .sx-member-name { font-size: 0.88rem; font-weight: 700; color: var(--sx-text-1); }
                .sx-member-captain {
                    display: inline-flex; align-items: center;
                    margin-left: 8px; padding: 1px 7px;
                    background: rgba(45,106,45,0.12);
                    border: 1px solid rgba(45,106,45,0.25);
                    color: var(--color-primary-light);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.55rem; font-weight: 800;
                    letter-spacing: 0.14em; text-transform: uppercase;
                    vertical-align: middle;
                }
                .sx-member-reg {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.65rem; color: var(--sx-text-3); margin-top: 2px;
                }
                .sx-member-meta {
                    text-align: right;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.65rem; font-weight: 700;
                    letter-spacing: 0.14em; text-transform: uppercase;
                    color: var(--sx-text-3);
                    line-height: 1.6;
                }

                /* ── CTA buttons ── */
                .sx-ctas {
                    width: 100%;
                    display: flex; flex-direction: column; gap: 10px;
                    animation: sxFadeUp 0.6s ease 0.55s both;
                }

                /* Primary shimmer */
                .sx-btn-primary {
                    position: relative; overflow: hidden;
                    width: 100%; padding: 17px 32px;
                    background: var(--color-primary); color: #fff;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.92rem; font-weight: 800;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    border: none; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
                    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
                }
                .sx-btn-primary::before {
                    content: ''; position: absolute; top: 0; left: -80%;
                    width: 60%; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.42) 50%, transparent 80%);
                    transform: skewX(-20deg); pointer-events: none;
                }
                .sx-btn-primary:hover::before { left: 140%; transition: left 0.55s cubic-bezier(0.25,0.46,0.45,0.94); }
                .sx-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(45,106,45,0.38); background: var(--color-primary-dark); }
                .sx-btn-primary:active { transform: translateY(0); }

                /* Ghost */
                .sx-btn-ghost {
                    width: 100%; padding: 13px;
                    background: none;
                    border: 1px solid var(--sx-border);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.78rem; font-weight: 700;
                    letter-spacing: 0.16em; text-transform: uppercase;
                    color: var(--sx-text-3); cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    transition: border-color 0.2s, color 0.2s;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
                }
                .sx-btn-ghost:hover { border-color: var(--sx-border-2); color: var(--sx-text-2); }

                /* ── Caption ── */
                .sx-caption {
                    font-size: 0.78rem; color: var(--sx-caption-color);
                    text-align: center; line-height: 1.65;
                    margin-top: 28px;
                    animation: sxFadeUp 0.6s ease 0.7s both;
                }
            `}</style>

            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                recycle={false}
                numberOfPieces={220}
                colors={['#4caf50', '#2d6a2d', '#f59e0b', '#ffffff', '#a3e635']}
            />

            <div className="sx-page">
                <div className="sx-inner">

                    {/* ── Label row ── */}
                    <div className="sx-label-row">
                        <div className="sx-label-line" />
                        <span className="sx-eyebrow">Payment Confirmed</span>
                        <div className="sx-label-line" />
                    </div>

                    {/* ── Check icon ── */}
                    <div className="sx-check-wrap">
                        <div className="sx-check-outer">
                            <AiOutlineCheck className="sx-check-icon" />
                        </div>
                    </div>

                    {/* ── Title ── */}
                    <h1 className="sx-title">
                        You're <span>In!</span>
                    </h1>
                    <p className="sx-subtitle">
                        Payment received. Your registration for{' '}
                        <strong>Ride With The Warriors 2026</strong> is confirmed.
                        See you on the road.
                    </p>

                    {/* ── ID Card Panel ── */}
                    <div className="sx-id-panel">
                        {/* Top strip */}
                        <div className="sx-id-top">
                            <div>
                                <div className="sx-id-top-label">
                                    {isTeam ? 'Team Registration ID' : 'Your Registration ID'}
                                </div>
                            </div>
                            <AiOutlineTrophy className="sx-id-trophy" />
                        </div>

                        {/* ID number */}
                        <div className="sx-id-body">
                            <AiOutlineBarcode className="sx-id-barcode" />
                            <span className="sx-id-number">{registrationId}</span>
                        </div>

                        {/* Perforated separator */}
                        <div className="sx-id-perf">
                            <div className="sx-id-notch" />
                            <div className="sx-id-perf-line" />
                            <div className="sx-id-notch" />
                        </div>

                        {/* Team members */}
                        {isTeam && members.length > 0 && (
                            <div className="sx-members-section">
                                <button className="sx-members-toggle" onClick={() => setShowMembers(!showMembers)}>
                                    {showMembers ? <AiOutlineUp /> : <AiOutlineDown />}
                                    {showMembers ? 'Hide Member Details' : `View All ${members.length} Member Details`}
                                </button>

                                {showMembers && (
                                    <div className="sx-members-list">
                                        {members.map((m: any, idx: number) => (
                                            <div key={idx} className="sx-member-card">
                                                <div>
                                                    <div className="sx-member-name">
                                                        {m.firstName} {m.lastName}
                                                        {m.isCaptain && <span className="sx-member-captain">Captain</span>}
                                                    </div>
                                                    <div className="sx-member-reg">
                                                        {m.regId || `${registrationId}-${idx + 1}`}
                                                    </div>
                                                </div>
                                                <div className="sx-member-meta">
                                                    <div>{m.gender}</div>
                                                    <div>{calculateAge(m.dob)} yrs</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── CTAs ── */}
                    <div className="sx-ctas">
                        <button onClick={onViewProfile} className="sx-btn-primary">
                            <AiOutlineIdcard />
                            View My Full Profile
                        </button>
                        <button onClick={onDone} className="sx-btn-ghost">
                            <AiOutlineHome />
                            Back to Home
                        </button>
                    </div>

                    {/* ── Caption ── */}
                    <p className="sx-caption">
                        A confirmation email has been sent to the registered email address.<br />
                        Save your Registration ID — you'll need it on race day.
                    </p>

                </div>
            </div>
        </>
    );
};

export default SuccessPage;