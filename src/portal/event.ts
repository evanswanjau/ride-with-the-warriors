/**
 * The next event. Set `date` (local time, Nairobi) once the organisers confirm it;
 * until then the portal says "Date to be announced" instead of a countdown.
 */
export const NEXT_EVENT: { year: number; name: string; date: string | null; venue: string | null } = {
    year: 2027,
    name: 'Ride With The Warriors 2027',
    date: null,
    venue: null,
};

export function countdown(targetIso: string, now = Date.now()) {
    const ms = Math.max(0, new Date(targetIso).getTime() - now);
    const days = Math.floor(ms / 86_400_000);
    const hours = Math.floor((ms % 86_400_000) / 3_600_000);
    const minutes = Math.floor((ms % 3_600_000) / 60_000);
    return { days, hours, minutes, done: ms === 0 };
}
