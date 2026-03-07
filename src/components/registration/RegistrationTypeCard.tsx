import { useState } from 'react';

const CheckIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const UserIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const TeamIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const FamilyIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const RuleIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const TYPE_META: Record<string, { icon: React.ReactNode; accentColor: string; accentBg: string; accentBorder: string }> = {
    individual: {
        icon: <UserIcon />,
        accentColor: '#4caf50',
        accentBg: 'rgba(45,106,45,0.08)',
        accentBorder: 'rgba(45,106,45,0.25)',
    },
    team: {
        icon: <TeamIcon />,
        accentColor: '#fbbf24',
        accentBg: 'rgba(245,158,11,0.08)',
        accentBorder: 'rgba(245,158,11,0.25)',
    },
    family: {
        icon: <FamilyIcon />,
        accentColor: '#a5b4fc',
        accentBg: 'rgba(99,102,241,0.08)',
        accentBorder: 'rgba(99,102,241,0.25)',
    },
};

interface RegistrationTypeCardProps {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    isSelected: boolean;
    onSelect: (id: string) => void;
    rules?: string[];
    subtitle?: string;
}

const RegistrationTypeCard = ({
    id,
    title,
    description,
    imageUrl,
    isSelected,
    onSelect,
    rules,
    subtitle,
}: RegistrationTypeCardProps) => {
    const [hovered, setHovered] = useState(false);
    const meta = TYPE_META[id] ?? TYPE_META['individual'];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700;800&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');

                :root, [data-theme="dark"] {
                    --rtc-bg:           #111111;
                    --rtc-border:       rgba(255,255,255,0.08);
                    --rtc-border-sel:   #2d6a2d;
                    --rtc-text-1:       #ffffff;
                    --rtc-text-2:       rgba(255,255,255,0.55);
                    --rtc-text-3:       rgba(255,255,255,0.32);
                    --rtc-primary:      #2d6a2d;
                    --rtc-primary-lt:   #4caf50;
                    --rtc-divider:      rgba(255,255,255,0.07);
                    --rtc-sel-glow:     rgba(45,106,45,0.22);
                    --rtc-rules-bg:     rgba(255,255,255,0.03);
                    --rtc-rules-border: rgba(255,255,255,0.07);
                    --rtc-number:       rgba(45,106,45,0.09);
                    --rtc-number-sel:   rgba(45,106,45,0.22);
                    --rtc-check-idle-bg:    rgba(0,0,0,0.45);
                    --rtc-check-idle-bd:    rgba(255,255,255,0.22);
                    --rtc-check-idle-txt:   rgba(255,255,255,0.3);
                    --rtc-badge-bg:     rgba(0,0,0,0.55);
                    --rtc-badge-bd:     rgba(255,255,255,0.15);
                }
                [data-theme="light"] {
                    --rtc-bg:           #ffffff;
                    --rtc-border:       rgba(0,0,0,0.09);
                    --rtc-border-sel:   #245924;
                    --rtc-text-1:       #111111;
                    --rtc-text-2:       rgba(20,20,20,0.60);
                    --rtc-text-3:       rgba(20,20,20,0.40);
                    --rtc-primary:      #245924;
                    --rtc-primary-lt:   #2d6a2d;
                    --rtc-divider:      rgba(0,0,0,0.07);
                    --rtc-sel-glow:     rgba(36,89,36,0.14);
                    --rtc-rules-bg:     rgba(0,0,0,0.02);
                    --rtc-rules-border: rgba(0,0,0,0.07);
                    --rtc-number:       rgba(36,89,36,0.06);
                    --rtc-number-sel:   rgba(36,89,36,0.17);
                    --rtc-check-idle-bg:    rgba(255,255,255,0.85);
                    --rtc-check-idle-bd:    rgba(0,0,0,0.18);
                    --rtc-check-idle-txt:   rgba(0,0,0,0.28);
                    --rtc-badge-bg:     rgba(0,0,0,0.45);
                    --rtc-badge-bd:     rgba(255,255,255,0.2);
                }

                .rtc-root {
                    font-family: 'Barlow', sans-serif;
                    position: relative;
                    background: var(--rtc-bg);
                    border: 1px solid var(--rtc-border);
                    display: flex; flex-direction: column;
                    height: 100%; width: 100%;
                    overflow: hidden; cursor: pointer;
                    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);
                    transition: border-color 0.25s, transform 0.28s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.28s;
                }
                .rtc-root.rtc-hovered {
                    border-color: rgba(45,106,45,0.35);
                    transform: translateY(-4px);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.18);
                }
                .rtc-root.rtc-selected {
                    border-color: var(--rtc-border-sel);
                    transform: translateY(-6px);
                    box-shadow: 0 0 0 1px var(--rtc-border-sel), 0 24px 60px var(--rtc-sel-glow);
                }

                /* Shimmer */
                .rtc-shimmer {
                    position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.05) 50%, transparent 80%);
                    transform: skewX(-20deg); pointer-events: none; z-index: 4; transition: left 0s;
                }
                .rtc-root.rtc-hovered .rtc-shimmer,
                .rtc-root.rtc-selected .rtc-shimmer {
                    left: 150%;
                    transition: left 0.65s cubic-bezier(0.25,0.46,0.45,0.94);
                }

                /* Ghost label */
                .rtc-ghost {
                    position: absolute; bottom: 0; right: 12px;
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 5.5rem; line-height: 0.85;
                    color: var(--rtc-number); pointer-events: none;
                    user-select: none; transition: color 0.3s; z-index: 1;
                }
                .rtc-root.rtc-hovered .rtc-ghost,
                .rtc-root.rtc-selected .rtc-ghost { color: var(--rtc-number-sel); }

                /* Check */
                .rtc-check {
                    position: absolute; top: 13px; right: 13px; z-index: 10;
                    width: 30px; height: 30px;
                    display: flex; align-items: center; justify-content: center;
                    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
                    transition: background 0.2s, box-shadow 0.2s;
                }
                .rtc-check-idle {
                    background: var(--rtc-check-idle-bg);
                    border: 1px solid var(--rtc-check-idle-bd);
                    backdrop-filter: blur(6px);
                    color: var(--rtc-check-idle-txt);
                }
                .rtc-check-active {
                    background: var(--rtc-primary);
                    border: 1px solid var(--rtc-primary-lt);
                    color: #fff;
                    box-shadow: 0 4px 14px var(--rtc-sel-glow);
                }

                /* Image */
                .rtc-img-wrap {
                    position: relative; height: 196px; overflow: hidden; flex-shrink: 0;
                }
                .rtc-img-wrap img {
                    width: 100%; height: 100%; object-fit: cover;
                    transition: transform 0.55s ease;
                }
                .rtc-root.rtc-hovered .rtc-img-wrap img,
                .rtc-root.rtc-selected .rtc-img-wrap img { transform: scale(1.06); }
                .rtc-img-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 55%, transparent 100%);
                }
                .rtc-type-badge {
                    position: absolute; bottom: 12px; left: 14px;
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 4px 11px;
                    background: var(--rtc-badge-bg);
                    border: 1px solid var(--rtc-badge-bd);
                    backdrop-filter: blur(8px);
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 10px; font-weight: 700;
                    letter-spacing: 0.1em; text-transform: uppercase;
                    color: #ffffff;
                    clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%);
                    z-index: 3;
                }

                /* Body */
                .rtc-body {
                    padding: 20px 22px 22px;
                    flex: 1; display: flex; flex-direction: column; gap: 10px;
                    position: relative; z-index: 2;
                }
                .rtc-subtitle {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 10px; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase;
                    color: var(--rtc-primary-lt); margin: 0 0 4px;
                }
                .rtc-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.8rem; letter-spacing: 0.04em; line-height: 0.95;
                    color: var(--rtc-text-1); margin: 0;
                }
                .rtc-desc {
                    font-size: 13px; line-height: 1.72;
                    color: var(--rtc-text-2); margin: 0;
                }

                /* Rules panel */
                .rtc-rules {
                    background: var(--rtc-rules-bg);
                    border: 1px solid var(--rtc-rules-border);
                    padding: 12px 14px;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
                    display: flex; flex-direction: column; gap: 7px;
                }
                .rtc-rules-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 9px; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase;
                    color: var(--rtc-text-3); margin-bottom: 2px;
                }
                .rtc-rule-row {
                    display: flex; align-items: flex-start; gap: 8px;
                }
                .rtc-rule-icon {
                    flex-shrink: 0; margin-top: 1px;
                }
                .rtc-rule-text {
                    font-size: 11.5px; line-height: 1.55; font-weight: 600;
                    color: var(--rtc-text-2);
                }

                /* Footer */
                .rtc-footer {
                    display: flex; align-items: center; justify-content: space-between;
                    padding-top: 14px;
                    border-top: 1px solid var(--rtc-divider);
                    margin-top: auto;
                }
                .rtc-status {
                    display: inline-flex; align-items: center; gap: 6px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 10px; font-weight: 700;
                    letter-spacing: 0.18em; text-transform: uppercase;
                    transition: color 0.2s;
                }
                .rtc-status-idle { color: var(--rtc-text-3); }
                .rtc-status-active { color: var(--rtc-primary-lt); }
                .rtc-dot {
                    width: 5px; height: 5px; border-radius: 50%; background: currentColor;
                    animation: rtcPulse 1.6s ease-in-out infinite;
                }
                @keyframes rtcPulse {
                    0%,100% { opacity:1; transform:scale(1); }
                    50%     { opacity:0.4; transform:scale(0.65); }
                }
                .rtc-arrow {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
                    color: var(--rtc-text-3);
                    transition: color 0.2s, transform 0.2s;
                }
                .rtc-root.rtc-hovered .rtc-arrow,
                .rtc-root.rtc-selected .rtc-arrow {
                    color: var(--rtc-primary-lt); transform: translateX(3px);
                }
            `}</style>

            <div
                onClick={() => onSelect(id)}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={`rtc-root${isSelected ? ' rtc-selected' : hovered ? ' rtc-hovered' : ''}`}
            >
                <div className="rtc-shimmer" />
                <div className="rtc-ghost">{id === 'individual' ? 'SOLO' : id === 'team' ? 'TEAM' : 'FAM'}</div>

                {/* Check */}
                <div className={`rtc-check ${isSelected ? 'rtc-check-active' : 'rtc-check-idle'}`}>
                    <CheckIcon />
                </div>

                {/* Image */}
                <div className="rtc-img-wrap">
                    <img src={imageUrl} alt={title} />
                    <div className="rtc-img-overlay" />
                    <div
                        className="rtc-type-badge"
                        style={{ color: meta.accentColor, background: meta.accentBg, borderColor: meta.accentBorder }}
                    >
                        {meta.icon}
                        {subtitle || id}
                    </div>
                </div>

                {/* Body */}
                <div className="rtc-body">
                    <div>
                        <p className="rtc-subtitle" style={{ color: meta.accentColor }}>{subtitle || id}</p>
                        <h3 className="rtc-title">{title}</h3>
                    </div>
                    <p className="rtc-desc">{description}</p>

                    {rules && rules.length > 0 && (
                        <div className="rtc-rules">
                            <div className="rtc-rules-label">Team Rules</div>
                            {rules.map((rule, i) => (
                                <div key={i} className="rtc-rule-row">
                                    <span className="rtc-rule-icon" style={{ color: meta.accentColor }}>
                                        <RuleIcon />
                                    </span>
                                    <span className="rtc-rule-text">{rule}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="rtc-footer">
                        <span className={`rtc-status ${isSelected ? 'rtc-status-active' : 'rtc-status-idle'}`}>
                            {isSelected && <span className="rtc-dot" />}
                            {isSelected ? 'Selected' : 'Select type'}
                        </span>
                        <span className="rtc-arrow">VIEW →</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegistrationTypeCard;