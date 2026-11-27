import { Link } from 'react-router-dom';
import { LuCreditCard, LuBike, LuQrCode, LuChevronRight, LuPlus } from 'react-icons/lu';
import type { Entry } from './types';
import { entrySubtitle, entryTitle, fmtKes, initials, isPaid } from './format';
import { NEXT_EVENT, isPastYear } from './event';
import { StatusChip } from './ui';

/** Link to an entry's page; the year makes it open the right year after a reload. */
// eslint-disable-next-line react-refresh/only-export-components
export const entryPath = (e: Entry) => `/account/entries/${encodeURIComponent(e.groupId)}?year=${e.eventYear}`;

/**
 * Where "Register for 2027" goes from a past entry. The prefilled flow (Phase 4) can read
 * `from` to copy that entry's riders; until then /register opens as it is.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const registerAgainPath = (e: Entry) => `/register?from=${encodeURIComponent(e.groupId)}`;

/**
 * The one thing to do next for an entry, shown as the card's main button. A past year's
 * entry is read-only: no paying or booking, only "register for the next ride" when the
 * account has no entry for it yet (`registeredNext`).
 */
// eslint-disable-next-line react-refresh/only-export-components
export function nextAction(e: Entry, registeredNext = false): { label: string; to: string; primary: boolean; icon: typeof LuCreditCard } {
    const detail = entryPath(e);
    if (isPastYear(e.eventYear)) {
        return registeredNext
            ? { label: 'View entry', to: detail, primary: false, icon: LuChevronRight }
            : { label: `Register for ${NEXT_EVENT.year}`, to: registerAgainPath(e), primary: true, icon: LuPlus };
    }
    if (e.status === 'UNPAID' && e.role === 'owner' && e.paymentRegistrationId) {
        return { label: `Pay ${e.totalAmount != null ? fmtKes(e.totalAmount) : 'now'}`, to: `/payment/${e.paymentRegistrationId}`, primary: true, icon: LuCreditCard };
    }
    if (isPaid(e.status) && e.role === 'owner' && e.riders.some(r => r.bikeHire?.status === 'PENDING')) {
        return { label: 'Pay for bike hire', to: detail, primary: true, icon: LuBike };
    }
    if (isPaid(e.status) && e.riders.some(r => r.bibNumber)) {
        return { label: e.riders.length > 1 ? 'Show bibs' : 'Show bib', to: detail, primary: false, icon: LuQrCode };
    }
    return { label: 'View entry', to: detail, primary: false, icon: LuChevronRight };
}

/** True when the account already has an entry for the next ride. */
// eslint-disable-next-line react-refresh/only-export-components
export const hasNextYear = (years: number[] | undefined) => !!years?.includes(NEXT_EVENT.year);

export function EntryCard({ entry, registeredNext }: { entry: Entry; registeredNext: boolean }) {
    const next = nextAction(entry, registeredNext);
    return (
        <article className="rp-card rp-entry" aria-label={entryTitle(entry)}>
            <div className="rp-entry-head">
                <div>
                    <h3 className="rp-entry-title">{entryTitle(entry)}</h3>
                    <p className="rp-entry-sub">{entrySubtitle(entry)}</p>
                </div>
                <StatusChip status={entry.status} />
            </div>
            <ul className="rp-pills" aria-label="Riders">
                {entry.riders.map(r => (
                    <li key={r.id} className="rp-pill">
                        <span className="rp-av" aria-hidden>{initials(r)}</span>
                        <span>{r.firstName}{r.category ? ` · ${r.category}` : ''}</span>
                        {r.bibNumber && <span className="rp-pill-bib">{r.bibNumber}</span>}
                    </li>
                ))}
            </ul>
            <div className="rp-entry-foot">
                <Link to={entryPath(entry)} className="rp-linkbtn">Details</Link>
                <Link to={next.to} className={`rp-btn ${next.primary ? 'rp-btn--primary' : 'rp-btn--quiet'}`}>
                    <next.icon size={18} aria-hidden /> {next.label}
                </Link>
            </div>
        </article>
    );
}

/** Event-year buttons. Hidden when the account only has one year. */
export function YearSwitch({ years, year, onChange }: { years: number[]; year: number | null; onChange: (y: number) => void }) {
    if (years.length < 2) return null;
    return (
        <div className="rp-years" role="group" aria-label="Event year">
            {years.map(y => (
                <button key={y} type="button" aria-pressed={y === year} onClick={() => onChange(y)}>{y}</button>
            ))}
        </div>
    );
}
