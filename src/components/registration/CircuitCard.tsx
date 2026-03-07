import '../../styles/registration/CircuitCard.css';
import { useState } from "react";

const MapIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
);

const TrophyIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M6 4h12v10a6 6 0 0 1-12 0V4ZM8 21h8M12 17v4" />
    </svg>
);

const CheckIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export interface CircuitCardProps {
    id: string;
    title: string;
    distance: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    isSelected: boolean;
    onSelect: (id: string) => void;
    isCompetitive?: boolean;
}

const CircuitCard = ({
    id,
    title,
    distance,
    subtitle,
    description,
    imageUrl,
    isSelected,
    onSelect,
    isCompetitive,
}: CircuitCardProps) => {
    const [hovered, setHovered] = useState(false);
    const active = isSelected || hovered;

    return (
        <>
            

            <div
                onClick={() => onSelect(id)}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={`cc-root${isSelected ? " cc-selected" : hovered ? " cc-hovered" : ""}`}
            >
                {/* Shimmer sweep */}
                <div className="cc-shimmer" />

                {/* Ghost distance number in body */}
                <div className="cc-ghost-number">{distance.replace(/\D/g, '')}</div>

                {/* Selection check */}
                <div className={`cc-check ${isSelected ? "cc-check-active" : "cc-check-idle"}`}>
                    <CheckIcon />
                </div>

                {/* Image */}
                <div className="cc-image-wrap">
                    <img src={imageUrl} alt={title} />
                    <div className="cc-image-overlay" />
                    <div className="cc-badge-row">
                        <span className="cc-badge">
                            <MapIcon /> {distance}
                        </span>
                        {isCompetitive && (
                            <span className="cc-badge cc-badge-competitive">
                                <TrophyIcon /> Competitive
                            </span>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="cc-body">
                    <div>
                        <p className="cc-subtitle">{subtitle}</p>
                        <h3 className="cc-title">{title}</h3>
                    </div>
                    <p className="cc-desc">{description}</p>

                    <div className="cc-footer">
                        <span className={`cc-status ${isSelected ? "cc-status-active" : active ? "cc-status-active" : "cc-status-idle"}`}>
                            {isSelected && <span className="cc-dot" />}
                            {isSelected ? "Selected" : "Select circuit"}
                        </span>
                        <span className="cc-arrow">VIEW →</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CircuitCard;