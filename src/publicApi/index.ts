/**
 * Every public API call, typed. Public pages call these; none of them builds a URL
 * or a header itself (see http.ts).
 */
import { request } from './http';
import type { Donation, Enquiry, FeedbackForm, HostedPhoto, PublicEvent } from './types';

export { PublicApiError } from './http';
export type * from './types';

const id = (v: string) => encodeURIComponent(v);

export const publicApi = {
    events: {
        current: () => request<{ event: PublicEvent }>('/events/current'),
    },

    enquiry: (form: Enquiry) => request<{ ok?: boolean }>('/enquiry', { method: 'POST', body: form }),

    notify: (form: { email: string; firstName?: string }) => request<{ ok?: boolean }>('/notify', { method: 'POST', body: form }),

    feedback: (form: FeedbackForm) => request<{ notifyRegistered?: boolean }>('/feedback', { method: 'POST', body: form }),

    gallery: () => request<{ cloudName: string | null; photos: HostedPhoto[] }>('/gallery'),

    donations: {
        create: (form: { amount: string; name: string; email: string; phone: string }) =>
            request<{ donationId: string; donationToken: string }>('/donations', { method: 'POST', body: form, session: true }),
        pay: (form: { donationId: string; donationToken: string; phoneNumber: string }) =>
            request<{ ok?: boolean }>('/donations/pay/stk-push', { method: 'POST', body: form, session: true }),
        /** `token` (from create) proves this browser made the donation. */
        status: (donationId: string, token: string) =>
            request<{ donation?: Donation }>(`/donations/${id(donationId)}`, { headers: { 'X-Donation-Token': token }, session: true }),
    },

    raffle: {
        ticket: (ticketId: string) => request<{ ticket?: { ticketNumber?: string | null } }>(`/raffle/${id(ticketId)}`, { session: true }),
    },

    referrals: {
        click: (code: string) => request<{ ok?: boolean }>('/referrals/click', { method: 'POST', body: { code } }),
    },
};
