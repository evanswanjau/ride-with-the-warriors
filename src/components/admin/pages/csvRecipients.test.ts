import { describe, expect, it, vi } from 'vitest';

// config.ts reads window.location when it is imported.
vi.hoisted(() => { Object.assign(globalThis, { window: { location: { origin: 'http://test' } } }); });

import { parseCsvRecipients } from './csvRecipients';
import { bibsFileName } from './generateBibs';
import { toCsv } from '../api/csv';
import { sliceRange } from '../ui/chartRange';

describe('parseCsvRecipients', () => {
    it('reads firstName and email, skipping bad rows', () => {
        const { recipients, errors } = parseCsvRecipients('First Name,Email,Phone\n"Doe, Jane",JANE@x.org,0712\n,missing\nBob,not-an-email');
        expect(recipients).toEqual([{ firstName: 'Doe, Jane', lastName: undefined, email: 'jane@x.org', phone: '0712' }]);
        expect(errors).toHaveLength(2);
    });

    it('needs an email column', () => {
        expect(parseCsvRecipients('name\nJane').errors[0]).toMatch(/email/);
    });
});

describe('toCsv', () => {
    it('quotes commas, quotes and new lines, and starts with a BOM', async () => {
        const blob = toCsv(['a', 'b'], [['x,y', 'say "hi"'], [null, 3]]);
        // Blob.text() drops the BOM, so check the bytes for it.
        expect([...new Uint8Array(await blob.arrayBuffer()).slice(0, 3)]).toEqual([0xef, 0xbb, 0xbf]);
        expect(await blob.text()).toBe('a,b\r\n"x,y","say ""hi"""\r\n,3');
    });
});

describe('bibsFileName', () => {
    it('names the PDF after the filters', () => {
        expect(bibsFileName('PAID', 'Under 18')).toMatch(/^RWTW_Bibs_Under_18_Paid_\d{4}-\d{2}-\d{2}\.pdf$/);
        expect(bibsFileName('', '')).toMatch(/^RWTW_Bibs_All_/);
    });
});

describe('sliceRange', () => {
    it('keeps the last 7 or 30 days, or everything', () => {
        const days = Array.from({ length: 180 }, (_, i) => i);
        expect(sliceRange(days, '7d')).toHaveLength(7);
        expect(sliceRange(days, '30d')[0]).toBe(150);
        expect(sliceRange(days, '6m')).toHaveLength(180);
        expect(sliceRange(undefined, '7d')).toEqual([]);
    });
});
