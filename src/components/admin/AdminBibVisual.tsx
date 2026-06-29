import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { SITE_URL } from '../../config';

interface BibRegistration {
    id: string;
    firstName: string;
    lastName: string;
    category: string;
    hexColor: string;
    circuitId: string;
    teamName?: string;
    type: string;
}

interface AdminBibVisualProps {
    registrations: BibRegistration[];
}

const AdminBibVisual: React.FC<AdminBibVisualProps> = ({ registrations }) => {
    const getDisplayCategory = (reg: BibRegistration) => {
        if (reg.type === 'team') {
            const team = reg.teamName || 'Team';
            const displayTeam = team.length > 22 ? team.substring(0, 19) + '...' : team;
            return `${displayTeam} - ${reg.category}`;
        }
        return `${reg.circuitId} - ${reg.category}`;
    };

    return (
        <div className="ad-bib-grid">
            <style>{`
                .ad-bib-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 24px;
                    padding: 20px 0;
                }
                .ad-bib-card {
                    background: #ffffff;
                    aspect-ratio: 210 / 148.5; /* A5 Landscape ratio */
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                    border-radius: 4px;
                    overflow: hidden;
                    position: relative;
                    color: #000;
                }
                .ad-bib-band {
                    height: 22%;
                    width: 100%;
                }
                .ad-bib-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 0 10px 4% 10px;
                }
                .ad-bib-num {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 140px;
                    font-weight: 700;
                    line-height: 0.85;
                    letter-spacing: 0.05em;
                    margin: 0;
                    color: #000;
                    white-space: nowrap;
                }
                .ad-bib-footer {
                    height: 30%;
                    width: 100%;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 15px;
                }
                .ad-bib-footer-left {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 1px;
                }
                .ad-bib-brand {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 10px;
                    font-weight: 900;
                    font-style: italic;
                    text-transform: uppercase;
                    color: #fff;
                    letter-spacing: 0.05em;
                    line-height: 1.2;
                }
                .ad-bib-name {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 9px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: #fff;
                    line-height: 1.2;
                }
                .ad-bib-cat {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 7px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: rgba(255,255,255,0.8);
                    line-height: 1.2;
                }
                .ad-bib-qr {
                    background: #fff;
                    padding: 4px;
                    border-radius: 4px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    flex-shrink: 0;
                }
            `}</style>
            {registrations.map((reg) => (
                <div key={reg.id} className="ad-bib-card bib-visual-item" data-bib-id={reg.id}>
                    {/* Top Band */}
                    <div className="ad-bib-band" style={{ backgroundColor: reg.hexColor }} />

                    {/* Main Content */}
                    <div className="ad-bib-main">
                        <div className="ad-bib-num" style={{ fontSize: `${Math.min(140, Math.max(60, Math.floor(560 / reg.id.length)))}px` }}>{reg.id}</div>
                    </div>

                    {/* Bottom Band / Footer */}
                    <div className="ad-bib-footer" style={{ backgroundColor: reg.hexColor }}>
                        <div className="ad-bib-footer-left">
                            <span className="ad-bib-brand">Ride With The Warriors 2026</span>
                            <div className="ad-bib-name">{reg.firstName} {reg.lastName}</div>
                            <div className="ad-bib-cat">{getDisplayCategory(reg)}</div>
                        </div>
                        <div className="ad-bib-qr">
                            <QRCodeCanvas
                                value={`${SITE_URL}/profile/${reg.id}`}
                                size={40}
                                level="H"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminBibVisual;
