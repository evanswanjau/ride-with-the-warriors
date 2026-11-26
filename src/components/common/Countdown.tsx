import { useEffect, useState } from 'react';
import { countdownTarget } from '../../config/edition';

const pad = (n: number) => String(n).padStart(2, '0');

/** Days / hours / minutes / seconds to the next milestone. Renders nothing once race day has passed. */
const Countdown = ({ className = '' }: { className?: string }) => {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const target = countdownTarget(now);
    if (!target) return null;

    const total = Math.max(0, Math.floor((target.at.getTime() - now.getTime()) / 1000));
    const cells = [
        { label: 'Days', value: String(Math.floor(total / 86400)) },
        { label: 'Hours', value: pad(Math.floor((total % 86400) / 3600)) },
        { label: 'Minutes', value: pad(Math.floor((total % 3600) / 60)) },
        { label: 'Seconds', value: pad(total % 60) },
    ];

    return (
        <div className={`rwtw-countdown ${className}`} data-testid="countdown">
            <style>{`
                .rwtw-countdown { display: inline-block; }
                .rwtw-countdown-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.85rem; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase;
                    opacity: 0.8; margin-bottom: 10px;
                }
                .rwtw-countdown-row { display: flex; gap: 10px; }
                .rwtw-countdown-cell {
                    min-width: 72px; padding: 10px 8px; text-align: center;
                    border: 1px solid currentColor;
                    border-color: color-mix(in srgb, currentColor 25%, transparent);
                    background: color-mix(in srgb, currentColor 6%, transparent);
                }
                .rwtw-countdown-num {
                    display: block;
                    font-family: 'Bebas Neue', 'Barlow Condensed', sans-serif;
                    font-size: 2.4rem; line-height: 1;
                    font-variant-numeric: tabular-nums;
                }
                .rwtw-countdown-unit {
                    display: block; margin-top: 4px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.7;
                }
                @media (max-width: 480px) {
                    .rwtw-countdown-row { gap: 6px; }
                    .rwtw-countdown-cell { min-width: 0; flex: 1; padding: 8px 4px; }
                    .rwtw-countdown-num { font-size: 1.9rem; }
                }
            `}</style>
            <div className="rwtw-countdown-label">{target.label}</div>
            <div className="rwtw-countdown-row" role="timer" aria-label={`${target.label} ${total} seconds`}>
                {cells.map((c) => (
                    <div key={c.label} className="rwtw-countdown-cell" data-testid="countdown-cell">
                        <span className="rwtw-countdown-num">{c.value}</span>
                        <span className="rwtw-countdown-unit">{c.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Countdown;
