import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminApi } from '../api/adminApi';

export interface AdminYear {
    /** The event year every list follows; undefined until known. */
    year: number | undefined;
    /** Years there are events for, newest first. */
    years: number[];
    ready: boolean;
    setYear: (year: number) => void;
}

/** ?year=2026 as a number, or undefined. */
export function yearFromSearch(value: string | null): number | undefined {
    const n = Number(value);
    return value && Number.isInteger(n) && n >= 2000 && n <= 2100 ? n : undefined;
}

/**
 * The admin's chosen event year, kept in the URL (?year=2026) so a link or a
 * reload shows the same year. Without ?year it is the current event.
 */
export function useAdminYear(): AdminYear {
    const [params, setParams] = useSearchParams();
    const fromUrl = yearFromSearch(params.get('year'));
    const [current, setCurrent] = useState<number | undefined>();
    const [years, setYears] = useState<number[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let live = true;
        Promise.allSettled([adminApi.events.current(), adminApi.events.list()]).then(([cur, list]) => {
            if (!live) return;
            const currentYear = cur.status === 'fulfilled' ? cur.value.event.year : undefined;
            const listed = list.status === 'fulfilled' ? list.value.events.map(e => e.year) : [];
            setCurrent(currentYear);
            setYears(listed.length ? listed : currentYear ? [currentYear] : []);
            setLoaded(true);
        });
        return () => { live = false; };
    }, []);

    const year = fromUrl ?? current;
    const shown = year && !years.includes(year) ? [...years, year].sort((a, b) => b - a) : years;

    const setYear = (y: number) => setParams(p => {
        const next = new URLSearchParams(p);
        next.set('year', String(y));
        return next;
    }, { replace: true });

    return { year, years: shown, ready: loaded || fromUrl !== undefined, setYear };
}
