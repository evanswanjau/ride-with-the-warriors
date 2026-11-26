/**
 * Runs `fn` once the page has loaded and the main thread is idle, so optional
 * work (error tracking, analytics) never competes with the first render.
 */
export function whenIdle(fn: () => void, timeout = 4000): void {
    if (typeof window === 'undefined') return;
    const schedule = () => {
        if ('requestIdleCallback' in window) window.requestIdleCallback(() => fn(), { timeout });
        else setTimeout(fn, 1500);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
}
