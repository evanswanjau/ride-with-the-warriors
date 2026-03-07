import '../../styles/registration/SuccessPage.css';
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