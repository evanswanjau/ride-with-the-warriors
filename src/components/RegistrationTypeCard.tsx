import { useState } from 'react';

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

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
            <div style={{
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
            }}>
                <CheckIcon />
            </div>

            {/* Image area */}
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
                {/* Gradient overlay */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                }} />
            </div>

            {/* Content */}
            <div style={{ padding: "20px 22px 22px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                    <p style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#2d6a4f",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: 4
                    }}>
                        {subtitle || id.replace('-', ' ')}
                    </p>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111", lineHeight: 1.2, margin: 0 }}>
                        {title}
                    </h3>
                </div>

                <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.65, margin: 0 }}>
                    {description}
                </p>

                {rules && rules.length > 0 && (
                    <div style={{
                        background: "rgba(45,106,79,0.04)",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        marginTop: 4
                    }}>
                        <ul style={{
                            fontSize: "11.5px",
                            lineHeight: "1.6",
                            color: "#2d6a4f",
                            margin: 0,
                            paddingLeft: "18px",
                            fontWeight: 600,
                            listStyleType: "disc",
                        }}>
                            {rules.map((rule, index) => (
                                <li key={index} style={{ marginBottom: index === rules.length - 1 ? 0 : 4 }}>
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div style={{ flex: 1 }} />

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

export default RegistrationTypeCard;
