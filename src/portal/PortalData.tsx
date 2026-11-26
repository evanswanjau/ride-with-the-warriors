import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import type { History } from './types';

/**
 * Loads GET /me/history for the selected year and shares it with every portal screen.
 * The last good copy is kept in localStorage so bibs and QR codes still open on race
 * day with no signal.
 */

interface PortalDataState {
    history: History | null;
    year: number | null;
    loading: boolean;
    error: string;
    /** True when what's shown came from this device's saved copy, not the server. */
    offline: boolean;
    setYear: (year: number) => void;
    reload: () => Promise<void>;
}

const Ctx = createContext<PortalDataState | null>(null);

const CACHE_PREFIX = 'rwtwPortal:';
const cacheKey = (accountId: string, year: number | 'latest') => `${CACHE_PREFIX}${accountId}:${year}`;

function readCache(key: string): History | null {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as History) : null;
    } catch {
        return null;
    }
}

function writeCache(key: string, value: History) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* storage full or blocked: the portal still works online */
    }
}

/** Removes every saved portal copy on this device (used on log out). */
// eslint-disable-next-line react-refresh/only-export-components
export function clearPortalCache() {
    try {
        Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX)).forEach(k => localStorage.removeItem(k));
    } catch {
        /* nothing to clear */
    }
}

export function PortalDataProvider({ children }: { children: ReactNode }) {
    const { account, apiFetch } = useAuth();
    // Show this device's saved copy straight away; the server copy replaces it.
    const [history, setHistory] = useState<History | null>(() => (account ? readCache(cacheKey(account.id, 'latest')) : null));
    const [year, setYearState] = useState<number | null>(() => history?.year ?? null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [offline, setOffline] = useState(false);
    const request = useRef(0);

    const load = useCallback(async (y: number | null) => {
        if (!account) return;
        const id = ++request.current;
        try {
            const res = await apiFetch(`/me/history${y ? `?year=${y}` : ''}`);
            if (!res.ok) throw new Error(String(res.status));
            const data: History = await res.json();
            if (id !== request.current) return;
            setHistory(data);
            setYearState(data.year);
            setError('');
            setOffline(false);
            writeCache(cacheKey(account.id, data.year), data);
            if (!y) writeCache(cacheKey(account.id, 'latest'), data);
        } catch {
            if (id !== request.current) return;
            const saved = readCache(cacheKey(account.id, y ?? 'latest'));
            if (saved) {
                setHistory(saved);
                setYearState(saved.year);
                setOffline(true);
                setError('');
            } else {
                setError('We could not load your entries. Check your connection and try again.');
            }
        } finally {
            if (id === request.current) setLoading(false);
        }
    }, [account, apiFetch]);

    useEffect(() => {
        void load(null);
    }, [load]);

    const setYear = useCallback((y: number) => {
        setLoading(true);
        void load(y);
    }, [load]);
    const reload = useCallback(() => load(year), [load, year]);

    const value = useMemo(
        () => ({ history, year, loading, error, offline, setYear, reload }),
        [history, year, loading, error, offline, setYear, reload],
    );
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePortalData(): PortalDataState {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('usePortalData must be used inside <PortalDataProvider>');
    return ctx;
}
