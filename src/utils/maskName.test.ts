import { describe, expect, it } from 'vitest';
import { displayName, maskName, maskSurname } from './maskName';

describe('maskSurname', () => {
    it('masks the first 3 letters', () => {
        expect(maskSurname('Kibet')).toBe('***et');
        expect(maskSurname('Njuguna')).toBe('***guna');
        expect(maskSurname('Oyugi')).toBe('***gi');
    });

    it('turns surnames of 3 letters or fewer into ***', () => {
        expect(maskSurname('Oyu')).toBe('***');
        expect(maskSurname('Li')).toBe('***');
        expect(maskSurname('A')).toBe('***');
    });

    it('masks each word of a multi-word surname', () => {
        expect(maskSurname('Van Der Berg')).toBe('*** *** ***g');
    });

    it('handles empty input', () => {
        expect(maskSurname('')).toBe('');
        expect(maskSurname('   ')).toBe('');
    });
});

describe('maskName', () => {
    it('keeps the first name and masks the surname', () => {
        expect(maskName('Hannah Kibet')).toBe('Hannah ***et');
        expect(maskName('Dedan Njuguna')).toBe('Dedan ***guna');
        expect(maskName('Jacob Oyugi')).toBe('Jacob ***gi');
    });

    it('turns a short surname into ***', () => {
        expect(maskName('Jane Ong')).toBe('Jane ***');
        expect(maskName('Jane Wu')).toBe('Jane ***');
    });

    it('keeps the first word and masks every other word', () => {
        expect(maskName('Mary Jane Wanjiku')).toBe('Mary ***e ***jiku');
        expect(maskName('Ann Marie Van Der Berg')).toBe('Ann ***ie *** *** ***g');
    });

    it('collapses extra spaces', () => {
        expect(maskName('  Hannah    Kibet  ')).toBe('Hannah ***et');
    });

    it('returns empty for empty input', () => {
        expect(maskName('')).toBe('');
        expect(maskName('   ')).toBe('');
    });

    it('leaves a single word alone', () => {
        expect(maskName('Madonna')).toBe('Madonna');
    });

    it('is idempotent on already-masked names', () => {
        expect(maskName('Hannah ***et')).toBe('Hannah ***et');
        expect(maskName('***')).toBe('***');
    });

    it('never leaks the first 3 letters of a masked word', () => {
        expect(maskName('Hannah Kibet')).not.toContain('Kib');
    });
});

describe('displayName', () => {
    it('title-cases the first name and keeps the mask lowercase', () => {
        expect(displayName('nancy ***ambu')).toBe('Nancy ***ambu');
        expect(displayName('BENJAMIN ***KOSGEI')).toBe('Benjamin ***kosgei');
    });

    it('capitalises after hyphens and apostrophes', () => {
        expect(displayName("mary-jane o'neil")).toBe("Mary-Jane O'Neil");
    });

    it('keeps a bare mask as is and handles empty input', () => {
        expect(displayName('***')).toBe('***');
        expect(displayName('  ')).toBe('');
    });
});
