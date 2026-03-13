import { QRCodeCanvas } from 'qrcode.react';

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

interface AdminBibNumbersPrintProps {
    registrations: BibRegistration[];
}

const AdminBibNumbersPrint = ({ registrations }: AdminBibNumbersPrintProps) => {
    const getDisplayCategory = (reg: BibRegistration) => {
        if (reg.type === 'team') {
            const team = reg.teamName || 'Team';
            const displayTeam = team.length > 25 ? team.substring(0, 22) + '...' : team;
            return `${displayTeam} - ${reg.circuitId}`;
        }
        return `${reg.circuitId} - ${reg.type}`;
    };

    return (
        <div id="bib-print-container" style={{ background: '#fff', width: '210mm' }}>
            <style>
                {`
                .bib-a4-page {
                    width: 210mm;
                    height: 297mm;
                    display: flex;
                    flex-direction: column;
                    background: #ffffff;
                    position: relative;
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                    box-sizing: border-box;
                    page-break-after: always;
                }
                .bib-a5-half {
                    height: 148.5mm;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    box-sizing: border-box;
                    border-bottom: 1px dashed #ccc; /* Cut line */
                }
                .bib-a5-half:last-child {
                    border-bottom: none;
                }
                .color-band {
                    height: 35mm;
                    width: 100%;
                }
                .bib-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 10px;
                }
                .bib-number {
                    font-size: 160px;
                    font-weight: 900;
                    line-height: 0.8;
                    font-family: 'Barlow Condensed', sans-serif;
                    margin: 0;
                    color: #000;
                    text-align: center;
                }
                .bib-name {
                    font-size: 24px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-top: 10px;
                    color: #000;
                    text-align: center;
                }
                .bib-cat {
                    font-size: 16px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: #666;
                    text-align: center;
                }
                .bib-footer {
                    height: 35mm;
                    width: 100%;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 40px;
                    box-sizing: border-box;
                }
                .bib-brand {
                    font-size: 24px;
                    font-weight: 900;
                    font-style: italic;
                    text-transform: uppercase;
                    color: #ffffff;
                }
                .bib-qr-wrap {
                    background: #ffffff;
                    padding: 6px;
                    border-radius: 8px;
                    margin-bottom: 0;
                }
                `}
            </style>
            {/* Split registrations into pairs for A4 pages */}
            {Array.from({ length: Math.ceil(registrations.length / 2) }).map((_, pageIdx) => (
                <div key={pageIdx} className="bib-a4-page">
                    {registrations.slice(pageIdx * 2, (pageIdx + 1) * 2).map((reg) => (
                        <div key={reg.id} className="bib-a5-half">
                            {/* Top Band */}
                            <div className="color-band" style={{ backgroundColor: reg.hexColor }} />

                            {/* Middle Section */}
                            <div className="bib-content">
                                <div className="bib-number">{reg.id}</div>
                                <div className="bib-name">{reg.firstName} {reg.lastName}</div>
                                <div className="bib-cat">{getDisplayCategory(reg)}</div>
                            </div>

                            {/* Bottom Band */}
                            <div className="bib-footer" style={{ backgroundColor: reg.hexColor }}>
                                <span className="bib-brand">Ride With The Warriors 2026</span>
                                <div className="bib-qr-wrap">
                                    <QRCodeCanvas
                                        value={`https://airbornefraternity.org/profile/${reg.id}`}
                                        size={80}
                                        level="H"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default AdminBibNumbersPrint;
