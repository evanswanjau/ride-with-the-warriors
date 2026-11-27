import { useCallback, useEffect, useRef, useState } from 'react';
import { errorMessage } from '../api/http';

export interface Loaded<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    reload: () => void;
    clearError: () => void;
}

/**
 * Loads data, and loads it again whenever `key` changes (build the key from
 * the filters the load uses). An answer that arrives after a newer request
 * started is dropped, so a slow old search never overwrites a new one.
 */
export function useLoad<T>(load: () => Promise<T>, key: string, failure: string): Loaded<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tick, setTick] = useState(0);
    const loadRef = useRef(load);
    const latest = useRef(0);

    useEffect(() => { loadRef.current = load; });

    useEffect(() => {
        const id = ++latest.current;
        const current = () => id === latest.current;
        // Loading starts in the same tick; setState here is the point of the hook.
        Promise.resolve().then(() => {
            if (!current()) return;
            setLoading(true);
            setError(null);
            return loadRef.current()
                .then(result => { if (current()) setData(result); })
                .catch(err => { if (current()) setError(errorMessage(err, failure)); })
                .finally(() => { if (current()) setLoading(false); });
        });
    }, [key, tick, failure]);

    const reload = useCallback(() => setTick(t => t + 1), []);
    const clearError = useCallback(() => setError(null), []);
    return { data, loading, error, reload, clearError };
}
