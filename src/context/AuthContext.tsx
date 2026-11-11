import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { API_BASE_URL } from '../config';
import { authHeaders, getSessionToken, setSessionToken } from '../auth/session';

export interface Account {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    createdAt: string;
}

interface AuthState {
    account: Account | null;
    /** True until the stored session has been checked with the server. */
    loading: boolean;
    signIn: (token: string, account: Account) => void;
    signOut: () => Promise<void>;
    setAccount: (account: Account) => void;
    /** fetch() against the API with the session attached; signs out on 401. */
    apiFetch: (path: string, init?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [account, setAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState(() => !!getSessionToken());

    const clear = useCallback(() => {
        setSessionToken(null);
        setAccount(null);
    }, []);

    const apiFetch = useCallback(async (path: string, init: RequestInit = {}) => {
        const headers: Record<string, string> = { ...authHeaders(), ...(init.headers as Record<string, string> | undefined) };
        if (init.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
        const res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
        if (res.status === 401 && getSessionToken()) clear();
        return res;
    }, [clear]);

    // Restore a stored session.
    useEffect(() => {
        if (!getSessionToken()) return;
        let cancelled = false;
        fetch(`${API_BASE_URL}/auth/me`, { headers: authHeaders() })
            .then(async res => {
                if (cancelled) return;
                if (res.ok) setAccount((await res.json()).account);
                else if (res.status === 401) setSessionToken(null);
            })
            .catch(() => { /* offline: keep token, try again next load */ })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    const signIn = useCallback((token: string, acc: Account) => {
        setSessionToken(token);
        setAccount(acc);
        setLoading(false);
    }, []);

    const signOut = useCallback(async () => {
        try {
            await apiFetch('/auth/logout', { method: 'POST' });
        } catch {
            /* ignore: clearing locally is what matters */
        }
        clear();
    }, [apiFetch, clear]);

    const value = useMemo(
        () => ({ account, loading, signIn, signOut, setAccount, apiFetch }),
        [account, loading, signIn, signOut, apiFetch],
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
