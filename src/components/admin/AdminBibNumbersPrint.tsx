import { QRCodeCanvas } from 'qrcode.react';

interface BibRegistration {
    id: string;
    firstName: string;
    lastName: string;
    category: string;
    hexColor: string;
    circuitId: string;
}

interface AdminBibNumbersPrintProps {
    registrations: BibRegistration[];
}

const AdminBibNumbersPrint = ({ registrations }: AdminBibNumbersPrintProps) => {
    return (
        <div id="bib-print-container" className="bg-white p-0 w-[210mm]">
            <style>
                {`
                @media screen {
                    #bib-print-container {
                        margin: 0 auto;
                        border: 1px solid #ddd;
                    }
                }
                .bib-page {
                    page-break-after: always;
                    width: 210mm;
                    height: 148.5mm; /* A5 Landscape */
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    background: white;
                    position: relative;
                    border: 1px solid #eee;
                }
                .color-band {
                    height: 25mm;
                    width: 100%;
                }
                .bib-number {
                    font-size: 200px;
                    font-weight: 900;
                    line-height: 1;
                    text-align: center;
                    font-family: sans-serif;
                }
                `}
            </style>

            {registrations.map((reg) => (
                <div key={reg.id} className="bib-page">
                    {/* Top Color Band */}
                    <div className="color-band" style={{ backgroundColor: reg.hexColor }} />

                    <div className="flex-1 flex flex-col justify-center items-center">
                        <h1 className="bib-number">{reg.id}</h1>
                        <p className="text-2xl font-black uppercase tracking-widest text-neutral-900 mt-2">
                            {reg.firstName} {reg.lastName}
                        </p>
                        <p className="text-xl font-bold uppercase tracking-widest text-neutral-500">
                            {reg.category}
                        </p>
                    </div>

                    {/* Bottom Section */}
                    <div className="relative">
                        <div className="color-band" style={{ backgroundColor: reg.hexColor }} />
                        <div className="absolute inset-0 flex items-center justify-between px-12">
                            <span className="text-white text-2xl font-black italic tracking-tighter uppercase">
                                Ride With The Warriors 2026
                            </span>
                            <div className="bg-white p-2 rounded-xl border border-neutral-200 transform -translate-y-4">
                                <QRCodeCanvas
                                    value={`https://airbornefraternity.org/profile/${reg.id}`}
                                    size={80}
                                    level="H"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminBibNumbersPrint;
