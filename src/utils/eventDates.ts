/** Event dates as the site writes them, always in Nairobi time. */
const TZ = 'Africa/Nairobi';

/** "2027-05-09" (ride day) -> "Sunday 9 May 2027"; null when there is no date. */
export function rideDayLabel(date: string | null, withWeekday = true): string | null {
    if (!date) return null;
    const d = new Date(`${date}T12:00:00Z`);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric', ...(withWeekday ? { weekday: 'long' } : {}) }).replace(',', '');
}

/** An ISO instant -> "10 February 2027"; null when there is none. */
export function dayLabel(iso: string | null): string | null {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-GB', { timeZone: TZ, day: 'numeric', month: 'long', year: 'numeric' });
}

/** "1st", "2nd", "3rd", "4th", "11th" ... */
export function ordinal(n: number): string {
    const tens = n % 100;
    const suffix = tens >= 11 && tens <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th';
    return `${n}${suffix}`;
}
