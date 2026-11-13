/**
 * Privacy masking for names shown on the public Results and Raffle Winners pages.
 * First name stays in full; every later word has its first 3 letters replaced by `***`
 * (words of 3 letters or fewer become just `***`). Already-masked input is left unchanged.
 * Kept free of imports and TS-only syntax so scripts/mask-data.mjs can run it directly.
 */

const MASK = '***';

const words = (value: string): string[] => value.trim().split(/\s+/).filter(Boolean);

const maskWord = (word: string): string => (word.length <= 3 ? MASK : MASK + word.slice(3));

/** Mask a surname (one or more words): "Njuguna" -> "***guna", "Oyu" -> "***". */
export function maskSurname(surname: string): string {
    return words(surname ?? '').map(maskWord).join(' ');
}

/** Mask a full name: "Hannah Kibet" -> "Hannah ***et". Single words are kept as-is. */
export function maskName(fullName: string): string {
    const [first, ...rest] = words(fullName ?? '');
    if (!first) return '';
    return [first, ...rest.map(maskWord)].join(' ');
}

/**
 * Title-case a (masked) name for display: "nancy ***ambu" -> "Nancy ***ambu".
 * Words starting with `***` keep the mask and stay lowercase; other words get a capital after
 * the start of the word, a hyphen or an apostrophe.
 */
export function displayName(name: string): string {
    return (name ?? '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) =>
            word.startsWith(MASK)
                ? word.toLowerCase()
                : word.toLowerCase().replace(/(^|[-'\u2019])([a-z])/g, (_m, sep: string, c: string) => sep + c.toUpperCase()),
        )
        .join(' ');
}
