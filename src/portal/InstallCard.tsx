import { useState } from 'react';
import { LuSmartphone, LuShare } from 'react-icons/lu';
import { Sheet } from './ui';
import { dismissInstall, useInstall, wasDismissed } from './install';

/** Steps for browsers with no install prompt (iOS Safari, Firefox). */
export function InstallSteps({ onClose }: { onClose: () => void }) {
    const { ios } = useInstall();
    return (
        <Sheet title="Install RWTW" onClose={onClose}>
            <ol className="rp-steps">
                {ios ? (
                    <>
                        <li><strong>Tap Share</strong> <LuShare aria-label="(the square with an arrow)" /> at the bottom of Safari.</li>
                        <li><strong>Choose "Add to Home Screen".</strong></li>
                        <li><strong>Tap Add.</strong> The RWTW icon appears next to your apps.</li>
                    </>
                ) : (
                    <>
                        <li><strong>Open your browser menu</strong> (⋮ or ☰).</li>
                        <li><strong>Choose "Install app" or "Add to Home screen".</strong></li>
                        <li><strong>Confirm.</strong> The RWTW icon appears next to your apps.</li>
                    </>
                )}
            </ol>
            <p className="rp-muted">Your bib and QR code open from the icon on race day, even with weak signal.</p>
            <button type="button" className="rp-btn rp-btn--primary rp-btn--block" onClick={onClose}>Got it</button>
        </Sheet>
    );
}

/** Starts the browser's install dialog, or shows the manual steps. */
// eslint-disable-next-line react-refresh/only-export-components
export function useInstallAction() {
    const install = useInstall();
    const [showSteps, setShowSteps] = useState(false);
    const start = async () => {
        if (install.canPrompt) await install.prompt();
        else setShowSteps(true);
    };
    const steps = showSteps ? <InstallSteps onClose={() => setShowSteps(false)} /> : null;
    return { ...install, start, steps };
}

/** Home-screen card. Hidden once installed or dismissed. */
export function InstallCard() {
    const { installed, start, steps } = useInstallAction();
    const [hidden, setHidden] = useState(() => wasDismissed());
    if (installed || hidden) return steps;

    return (
        <section className="rp-install" aria-labelledby="rp-install-title">
            <span className="rp-install-icon" aria-hidden><LuSmartphone size={22} /></span>
            <div>
                <h2 id="rp-install-title" className="rp-install-title">Add RWTW to your home screen</h2>
                <p className="rp-muted rp-small">Open your bib and QR code in one tap on race day, even with weak signal.</p>
            </div>
            <div className="rp-install-actions">
                <button type="button" className="rp-btn rp-btn--ghost" onClick={() => { dismissInstall(); setHidden(true); }}>Not now</button>
                <button type="button" className="rp-btn rp-btn--primary" onClick={start}>Install</button>
            </div>
            {steps}
        </section>
    );
}
