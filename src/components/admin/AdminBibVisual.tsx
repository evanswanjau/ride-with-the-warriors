import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface BibRegistration {
    id: string;
    firstName: string;
    lastName: string;
    category: string;
    hexColor: string;
    circuitId: string;
}

interface AdminBibVisualProps {
    registrations: BibRegistration[];
}

const AdminBibVisual: React.FC<AdminBibVisualProps> = ({ registrations }) => {
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
                    height: 18%;
                    width: 100%;
                }
                .ad-bib-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 10px;
                }
                .ad-bib-num {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 80px;
                    font-weight: 900;
                    line-height: 0.8;
                    margin: 0;
                    color: #000;
                }
                .ad-bib-name {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 14px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-top: 8px;
                    color: #111;
                }
                .ad-bib-cat {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: #666;
                }
                .ad-bib-footer {
                    height: 18%;
                    width: 100%;
                    position: relative;
                    display: flex;
                    align-items: center;
                    padding: 0 15px;
                }
                .ad-bib-brand {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 10px;
                    font-weight: 900;
                    font-style: italic;
                    text-transform: uppercase;
                    color: #fff;
                    letter-spacing: 0.05em;
                }
                .ad-bib-qr {
                    position: absolute;
                    right: 15px;
                    bottom: 10px;
                    background: #fff;
                    padding: 4px;
                    border-radius: 4px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }
            `}</style>
            {registrations.map((reg) => (
                <div key={reg.id} className="ad-bib-card bib-visual-item" data-bib-id={reg.id}>
                    {/* Top Band */}
                    <div className="ad-bib-band" style={{ backgroundColor: reg.hexColor }} />

                    {/* Main Content */}
                    <div className="ad-bib-main">
                        <div className="ad-bib-num">{reg.id}</div>
                        <div className="ad-bib-name">{reg.firstName} {reg.lastName}</div>
                        <div className="ad-bib-cat">{reg.category}</div>
                    </div>

                    {/* Bottom Band / Footer */}
                    <div className="ad-bib-footer" style={{ backgroundColor: reg.hexColor }}>
                        <span className="ad-bib-brand">Ride With The Warriors 2026</span>
                        <div className="ad-bib-qr">
                            <QRCodeCanvas
                                value={`https://airbornefraternity.org/profile/${reg.id}`}
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
