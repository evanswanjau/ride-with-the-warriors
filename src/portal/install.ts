/**
 * "Add to home screen" support. Chrome/Edge/Android fire `beforeinstallprompt`
 * once, early; main.tsx calls captureInstallPrompt() before React renders so the
 * event isn't missed. iOS Safari has no prompt: the portal shows steps instead.
 */
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(l => l());

export function captureInstallPrompt() {
    if (typeof window === 'undefined') return;
    window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault();
        deferred = e as BeforeInstallPromptEvent;
        notify();
    });
    window.addEventListener('appinstalled', () => {
        deferred = null;
        notify();
    });
}

export function isStandalone(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
}

export function isIos(): boolean {
    if (typeof navigator === 'undefined') return false;
    return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

const DISMISS_KEY = 'rwtwInstallDismissed';

export function wasDismissed(): boolean {
    try {
        return localStorage.getItem(DISMISS_KEY) === '1';
    } catch {
        return false;
    }
}

export function dismissInstall() {
    try {
        localStorage.setItem(DISMISS_KEY, '1');
    } catch {
        /* ignore */
    }
}

/** canPrompt: the browser's own install dialog is available. */
export function useInstall() {
    const [canPrompt, setCanPrompt] = useState(() => deferred !== null);
    useEffect(() => {
        const l = () => setCanPrompt(deferred !== null);
        listeners.add(l);
        return () => { listeners.delete(l); };
    }, []);

    const prompt = async (): Promise<boolean> => {
        if (!deferred) return false;
        const e = deferred;
        deferred = null;
        notify();
        await e.prompt();
        const choice = await e.userChoice;
        return choice.outcome === 'accepted';
    };

    return { canPrompt, prompt, installed: isStandalone(), ios: isIos() };
}

/** Registers the service worker (production builds only, so dev never serves stale files). */
export function registerServiceWorker() {
    if (!import.meta.env.PROD || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL }).catch(() => {
            /* the site still works without it */
        });
    });
}
