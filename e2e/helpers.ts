import { expect, type Page } from '@playwright/test';

const MAILPIT = 'http://localhost:8025/api/v1';
const MOCK_DTB = 'http://localhost:4110';

type MailSummary = { ID: string; To: { Address: string }[]; Subject: string; Created: string };

/**
 * Waits for the newest message to `address` that arrived after `since`, and returns its text.
 * Queued notifications are sent by the outbox worker once a minute, so allow a little over that.
 */
export const MAIL_WAIT_MS = 75_000;

export async function waitForMessage(address: string, since: Date, timeoutMs = MAIL_WAIT_MS): Promise<{ subject: string; text: string }> {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        const res = await fetch(`${MAILPIT}/search?query=${encodeURIComponent(`to:"${address}"`)}&limit=10`);
        if (res.ok) {
            const { messages } = (await res.json()) as { messages: MailSummary[] };
            const fresh = messages.find(m => new Date(m.Created) >= since);
            if (fresh) {
                const full = (await (await fetch(`${MAILPIT}/message/${fresh.ID}`)).json()) as { Text: string; HTML: string };
                return { subject: fresh.Subject, text: full.Text || full.HTML.replace(/<[^>]+>/g, ' ') };
            }
        }
        await new Promise(r => setTimeout(r, 500));
    }
    throw new Error(`No message for ${address} in Mailpit within ${timeoutMs}ms`);
}

/** SMS are delivered to Mailpit as emails to sms+<2547…>@sms.local. */
export const smsAddress = (phone254: string) => `sms+${phone254}@sms.local`;

export function codeFrom(text: string): string {
    const m = text.match(/\b(\d{6})\b/);
    if (!m) throw new Error(`No 6-digit code in: ${text.slice(0, 200)}`);
    return m[1];
}

/** Logs in through the real UI; the code is read from Mailpit (email or SMS). */
export async function login(page: Page, identifier: string, inbox: string) {
    const since = new Date(Date.now() - 1000);
    await page.goto('/login');
    await page.getByLabel('Email or phone number').fill(identifier);
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('heading', { name: 'Enter your code' })).toBeVisible();
    const { text } = await waitForMessage(inbox, since);
    await page.getByLabel('6-digit code').fill(codeFrom(text));
    await page.getByRole('button', { name: /verify|log in|continue/i }).first().click();
}

/** Sets what the mock DTB does with the next STK push. */
export async function dtbNext(mode: 'success' | 'fail' | 'timeout' | 'duplicate' | 'fail_after_success' | 'reject') {
    const res = await fetch(`${MOCK_DTB}/__control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, once: true, delayMs: 500 }),
    });
    expect(res.ok).toBe(true);
}
