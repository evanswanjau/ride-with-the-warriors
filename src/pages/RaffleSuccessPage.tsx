import { useState, useEffect } from 'react';
import { useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import {
    AiOutlineCheck,
    AiOutlineBarcode,
    AiOutlineHome,
    AiOutlineIdcard,
    AiOutlineTrophy
} from 'react-icons/ai';
import Confetti from 'react-confetti';

const RaffleSuccessPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    const ticketIds: string[] = location.state?.ticketIds || (id ? [id] : []);
    const displayId = ticketIds.join(', ');

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!id) return <Navigate to="/" replace />;

    return (
        <>
            <style>{`
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
                    margin-bottom: 32px;
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
                }
                .sx-id-barcode { color: var(--color-primary-light); font-size: 2rem; flex-shrink: 0; }
                .sx-id-number {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: clamp(1.6rem, 5vw, 2.4rem);
                    font-weight: 700; letter-spacing: 0.04em;
                    color: var(--color-primary-light);
                    user-select: all; word-break: break-all;
                }

                /* ── CTA buttons ── */
                .sx-ctas {
                    width: 100%;
                    display: flex; flex-direction: column; gap: 10px;
                    animation: sxFadeUp 0.6s ease 0.55s both;
                }

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
                .sx-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(45,106,45,0.38); background: var(--color-primary-dark); }
                .sx-btn-primary:active { transform: translateY(0); }

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
                        <span className="sx-eyebrow">Entry Confirmed</span>
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
                        Raffle entry confirmed. Your ticket for{' '}
                        <strong>Ride With The Warriors 2026</strong> is secured.
                        Good luck!
                    </p>

                    {/* ── ID Card Panel ── */}
                    <div className="sx-id-panel">
                        <div className="sx-id-top">
                            <div className="sx-id-top-label">{ticketIds.length > 1 ? 'Your Raffle Codes' : 'Your Raffle Code'}</div>
                            <AiOutlineTrophy className="sx-id-trophy" />
                        </div>
                        <div className="sx-id-body">
                            <AiOutlineBarcode className="sx-id-barcode" />
                            <span className="sx-id-number">{displayId}</span>
                        </div>
                    </div>

                    {/* ── CTAs ── */}
                    <div className="sx-ctas">
                        <button onClick={() => navigate(`/raffle/profile/${id}`)} className="sx-btn-primary">
                            <AiOutlineIdcard />
                            View My Raffle Ticket
                        </button>
                        <button onClick={() => navigate('/')} className="sx-btn-ghost">
                            <AiOutlineHome />
                            Back to Home
                        </button>
                    </div>

                    <p className="sx-caption">
                        You can look up your ticket anytime using your email at the search page.<br />
                        Screenshot or note your Raffle Code — it's your entry number!
                    </p>
                </div>
            </div>
        </>
    );
};


export default RaffleSuccessPage;
