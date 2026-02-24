import type { CSSProperties } from "react";
import CircuitCard from "./CircuitCard";
import { CIRCUITS } from "../constants";
import blitzImage from "../assets/images/blitz.jpeg";
import intermediateImage from "../assets/images/recon.jpeg";
import corporateImage from "../assets/images/corporate.jpeg";
import familyImage from "../assets/images/family.jpeg";

const CIRCUIT_IMAGES: Record<string, string> = {
    blitz: blitzImage,
    recon: intermediateImage,
    corporate: corporateImage,
    family: familyImage,
};

const ArrowIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

interface Step2ChooseCircuitProps {
    selectedCircuit: string;
    onSelect: (id: string) => void;
    onNext: () => void;
}

const Step2ChooseCircuit = ({ selectedCircuit, onSelect, onNext }: Step2ChooseCircuitProps) => {


    const buttonStyle: CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 28px",
        borderRadius: 14,
        border: "none",
        fontSize: 14,
        fontWeight: 700,
        fontFamily: "system-ui, sans-serif",
        letterSpacing: "0.02em",
        cursor: selectedCircuit ? "pointer" : "not-allowed",
        background: selectedCircuit
            ? "linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)"
            : "#d0cec9",
        color: selectedCircuit ? "#fff" : "#999",
        boxShadow: selectedCircuit ? "0 8px 24px rgba(45,106,79,0.35)" : "none",
        transition: "all 0.2s ease",
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Header */}
            <div style={{ marginBottom: 36 }}>
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        background: "#2d6a4f",
                        color: "#fff",
                        borderRadius: 20,
                        padding: "4px 12px",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: 14,
                        fontFamily: "system-ui, sans-serif",
                    }}
                >
                    Step 2 of 4
                </div>
                <h1
                    style={{
                        fontSize: "clamp(28px, 5vw, 42px)",
                        fontWeight: 900,
                        color: "#111",
                        lineHeight: 1.1,
                        margin: "0 0 10px",
                        letterSpacing: "-0.02em",
                    }}
                >
                    Choose Your Circuit
                </h1>
                <p
                    style={{ fontSize: 13.5, color: "#555", lineHeight: 1.65, margin: 0, flex: 1 }}
                >
                    Select the course that matches your pace and ambition.
                </p>
            </div>

            {/* Card grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 360px), 1fr))",
                    gap: 20,
                    marginBottom: 36,
                }}
            >
                {CIRCUITS.map((circuit) => (
                    <CircuitCard
                        key={circuit.id}
                        id={circuit.id}
                        title={circuit.title}
                        distance={circuit.distance}
                        subtitle={circuit.subtitle}
                        description={circuit.description}
                        imageUrl={CIRCUIT_IMAGES[circuit.id] ?? circuit.imageUrl ?? ""}
                        isSelected={selectedCircuit === circuit.id}
                        onSelect={onSelect}
                        isCompetitive={circuit.isCompetitive}
                    />
                ))}
            </div>

            {/* Footer */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    paddingTop: 24,
                    borderTop: "1px solid #e0dbd0",
                }}
            >
                <button
                    onClick={onNext}
                    disabled={!selectedCircuit}
                    style={buttonStyle}
                    onMouseEnter={(e) => {
                        if (selectedCircuit) {
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 12px 32px rgba(45,106,79,0.45)";
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = selectedCircuit
                            ? "0 8px 24px rgba(45,106,79,0.35)"
                            : "none";
                    }}
                >
                    Continue to Registration
                    <ArrowIcon />
                </button>
            </div>
        </div>
    );
};

export default Step2ChooseCircuit;