import '../../styles/registration/RegistrationTypeCard.css';
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