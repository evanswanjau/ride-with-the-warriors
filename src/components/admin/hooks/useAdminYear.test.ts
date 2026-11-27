import { describe, expect, it, vi } from 'vitest';

// config.ts reads window.location when it is imported.
vi.hoisted(() => { Object.assign(globalThis, { window: { location: { origin: 'http://test' } } }); });

import { yearFromSearch } from './useAdminYear';

describe('yearFromSearch', () => {
    it('reads a plausible ?year and ignores anything else', () => {
        expect(yearFromSearch('2026')).toBe(2026);
        expect(yearFromSearch(null)).toBeUndefined();
        expect(yearFromSearch('')).toBeUndefined();
        expect(yearFromSearch('abc')).toBeUndefined();
        expect(yearFromSearch('1999')).toBeUndefined();
        expect(yearFromSearch('2026.5')).toBeUndefined();
    });
});
