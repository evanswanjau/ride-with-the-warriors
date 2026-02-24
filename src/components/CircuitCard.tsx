import { useState } from "react";

const MapIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
);

const TrophyIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M6 4h12v10a6 6 0 0 1-12 0V4ZM8 21h8M12 17v4" />
    </svg>
);

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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

    return (
        <div
            onClick={() => onSelect(id)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: "relative",
                borderRadius: "20px",
                overflow: "hidden",
                cursor: "pointer",
                background: "#fff",
                boxShadow: isSelected
                    ? "0 0 0 3px #2d6a4f, 0 20px 60px rgba(45,106,79,0.18)"
                    : hovered
                        ? "0 16px 48px rgba(0,0,0,0.12)"
                        : "0 2px 16px rgba(0,0,0,0.07)",
                transform: isSelected ? "translateY(-4px)" : hovered ? "translateY(-2px)" : "none",
                transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            {/* Selection indicator */}
            <div
                style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    zIndex: 10,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: isSelected ? "#2d6a4f" : "rgba(255,255,255,0.9)",
                    border: isSelected ? "none" : "2px solid rgba(255,255,255,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isSelected ? "#fff" : "rgba(0,0,0,0.3)",
                    transition: "all 0.2s ease",
                    boxShadow: isSelected ? "0 4px 12px rgba(45,106,79,0.4)" : "0 2px 8px rgba(0,0,0,0.15)",
                    backdropFilter: "blur(4px)",
                }}
            >
                <CheckIcon />
            </div>

            {/* Image */}
            <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                <img
                    src={imageUrl}
                    alt={title}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                        transform: hovered ? "scale(1.05)" : "scale(1)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                    }}
                />
                <div style={{ position: "absolute", bottom: 14, left: 14, display: "flex", gap: 8, alignItems: "center" }}>
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "5px 10px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 700,
                            background: "rgba(255,255,255,0.95)",
                            color: "#1a1a1a",
                            backdropFilter: "blur(8px)",
                            letterSpacing: "0.01em",
                        }}
                    >
                        <MapIcon /> {distance}
                    </span>
                    {isCompetitive && (
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "5px 10px",
                                borderRadius: 20,
                                fontSize: 10,
                                fontWeight: 800,
                                background: "#2d6a4f",
                                color: "#fff",
                                backdropFilter: "blur(8px)",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                            }}
                        >
                            <TrophyIcon /> Competitive
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: "20px 22px 22px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                    <p
                        style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#2d6a4f",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: 4,
                            margin: 0,
                        }}
                    >
                        {subtitle}
                    </p>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111", lineHeight: 1.2, margin: "4px 0 0" }}>
                        {title}
                    </h3>
                </div>
                <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.65, margin: 0, flex: 1 }}>
                    {description}
                </p>
                {/* Bottom CTA hint */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    color: isSelected ? "#2d6a4f" : "#999",
                    transition: "color 0.2s",
                }}>
                    {isSelected ? (
                        <><CheckIcon /> Selected</>
                    ) : (
                        <>Tap to select</>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CircuitCard;