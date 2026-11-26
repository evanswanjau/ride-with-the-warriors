import { useEffect, useId, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuChevronLeft, LuX, LuTriangleAlert, LuInfo, LuCircleCheck } from 'react-icons/lu';
import { statusKind, statusLabel } from './format';

export function StatusChip({ status }: { status: string }) {
    return <span className={`rp-chip rp-chip--${statusKind(status)}`}>{statusLabel(status)}</span>;
}

/** Screen title row. With `back`, shows a back button to that path. */
export function ScreenHeader({ title, back, actions }: { title: ReactNode; back?: string; actions?: ReactNode }) {
    const navigate = useNavigate();
    return (
        <header className="rp-topbar">
            {back && (
                <button type="button" className="rp-iconbtn" aria-label="Back" onClick={() => navigate(back)}>
                    <LuChevronLeft size={24} aria-hidden />
                </button>
            )}
            <h1 className="rp-topbar-title">{title}</h1>
            {actions}
        </header>
    );
}

export function Callout({ kind, children }: { kind: 'warn' | 'info' | 'ok' | 'error'; children: ReactNode }) {
    const Icon = kind === 'warn' || kind === 'error' ? LuTriangleAlert : kind === 'ok' ? LuCircleCheck : LuInfo;
    return (
        <div className={`rp-callout rp-callout--${kind}`} role={kind === 'error' ? 'alert' : undefined}>
            <Icon size={18} aria-hidden />
            <div>{children}</div>
        </div>
    );
}

/**
 * Bottom sheet on phones, centred dialog on desktop. Escape and the backdrop close it;
 * focus moves into the sheet when it opens and back to where it was when it closes.
 */
export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const closeRef = useRef(onClose);
    const titleId = useId();

    useEffect(() => { closeRef.current = onClose; }, [onClose]);

    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null;
        const first = ref.current?.querySelector<HTMLElement>('input, select, textarea, button:not([data-sheet-close])');
        (first ?? ref.current)?.focus();
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRef.current(); };
        document.addEventListener('keydown', onKey);
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = overflow;
            previous?.focus?.();
        };
    }, []);

    return (
        <div className="rp-scrim" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="rp-sheet" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={ref} tabIndex={-1}>
                <div className="rp-sheet-grab" aria-hidden />
                <div className="rp-sheet-head">
                    <h2 id={titleId} className="rp-sheet-title">{title}</h2>
                    <button type="button" className="rp-iconbtn" aria-label="Close" data-sheet-close onClick={onClose}>
                        <LuX size={22} aria-hidden />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

/** One field for the whole 6-digit code, so paste and SMS autofill work. */
export function CodeInput({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
    return (
        <input
            id={id}
            className="rp-input rp-input--code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            value={value}
            onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
        />
    );
}

/** Reads a server error body ({ error: { message } }) or falls back to `fallback`. */
// eslint-disable-next-line react-refresh/only-export-components
export async function errorMessage(res: Response, fallback: string): Promise<string> {
    try {
        const data = await res.json();
        return data?.error?.message || fallback;
    } catch {
        return fallback;
    }
}
