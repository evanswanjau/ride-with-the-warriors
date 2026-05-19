import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const STORAGE_KEY = 'rwtw_ref';

/**
 * Invisible component that captures referral codes from the URL.
 * Reads `?ref=CODE` → stores in localStorage → fires click tracking.
 * Mount once at the top level of the app.
 */
const ReferralCapture = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (!ref) return;

        const code = ref.toUpperCase().trim();
        if (!code) return;

        // Store in localStorage
        localStorage.setItem(STORAGE_KEY, code);

        // Remove `ref` param from URL to keep it clean
        searchParams.delete('ref');
        setSearchParams(searchParams, { replace: true });

        // Fire click tracking (fire-and-forget)
        fetch(`${API_BASE_URL}/referrals/click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        }).catch(() => {
            // Silently fail — don't block the user
        });
    }, [searchParams, setSearchParams]);

    return null;
};

export default ReferralCapture;

/** Helper to read the stored referral code */
export function getStoredReferralCode(): string | null {
    return localStorage.getItem(STORAGE_KEY);
}
