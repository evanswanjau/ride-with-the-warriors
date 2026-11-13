import { EDITION, phaseAt } from './edition';
import { isOn } from './features';

/** The main button in the menu, home page and recap pages. */
export function primaryCta(now: Date = new Date()): { label: string; to: string } {
    if (isOn('registration') && phaseAt(now) === 'registration-open') {
        return { label: 'Register now', to: '/register' };
    }
    return { label: `Pre-register ${EDITION.year}`, to: '/register/notify' };
}
