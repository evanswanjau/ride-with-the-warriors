import { describe, expect, it } from 'vitest';
import { isOn } from './features';

describe('isOn', () => {
    it('is off when the variable is missing', () => {
        expect(isOn('account', {})).toBe(false);
    });
    it("is on only for 'true'", () => {
        expect(isOn('account', { VITE_ACCOUNT_ENABLED: 'true' })).toBe(true);
        expect(isOn('registration', { VITE_REGISTRATION_ENABLED: 'true' })).toBe(true);
        expect(isOn('raffle', { VITE_RAFFLE_ENABLED: 'true' })).toBe(true);
        expect(isOn('donate', { VITE_DONATE_ENABLED: 'true' })).toBe(true);
    });
    it.each(['TRUE', '1', 'yes', 'false', ''])('is off for %j', (v) => {
        expect(isOn('account', { VITE_ACCOUNT_ENABLED: v })).toBe(false);
    });
    it('does not read another feature variable', () => {
        expect(isOn('donate', { VITE_ACCOUNT_ENABLED: 'true' })).toBe(false);
    });
});
