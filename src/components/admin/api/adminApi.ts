/**
 * Every admin API call, typed. Pages call these; none of them builds a URL or
 * touches the token itself (see http.ts).
 *
 * `year` is passed only to endpoints the server filters by year. The others
 * still cover every year (listed in docs/STATUS.md, Phase 6).
 */
import type { AdminUser, PricingCategory } from '../../../types';
import type {
    AdminAccount, AdminBikeHire, AdminDonation, AdminInviteRow, AdminEvent, AdminFeedbackEntry, AdminPayment, AdminRaffleTicket, AdminReferral,
    AdminRegistration, BulkSendPayload, RegistrationHistory, RiderDetailsEdit, EventChanges, EventWindow, CommsPreview, DashboardData, Pagination, ReferralsStats, SmsBalance, SummaryStats,
} from '../../../adminTypes';
import { requestBlob, requestJson, send, type Query } from './http';
import type { AdminRole } from '../roles';

type Year = number | undefined;

export interface NewReferral {
    code: string;
    influencerName: string;
    influencerEmail: string;
    influencerPhone: string;
}

export const adminApi = {
    auth: {
        login: (email: string, password: string) =>
            requestJson<{ token: string; admin: AdminUser }>('/admin/auth/login', { method: 'POST', body: { email, password }, auth: false }),
        logout: () => requestJson<{ ok: boolean }>('/admin/auth/logout', { method: 'POST' }),
        invite: (token: string) =>
            requestJson<{ invite: { email: string; name: string; role: string; expiresAt: string } }>(`/admin/auth/invite/${encodeURIComponent(token)}`, { auth: false }),
        acceptInvite: (token: string, password: string) =>
            requestJson<{ token: string; admin: AdminUser }>(`/admin/auth/invite/${encodeURIComponent(token)}`, { method: 'POST', body: { password }, auth: false }),
    },

    events: {
        current: () => requestJson<{ event: AdminEvent }>('/events/current', { auth: false }),
        list: () => requestJson<{ events: AdminEvent[] }>('/admin/events'),
        /** Starts a year; circuits and prices are copied from the newest earlier year. */
        create: (year: number) => requestJson<{ event: AdminEvent; copiedPricingFrom: number | null }>('/admin/events', { method: 'POST', body: { year } }),
        update: (year: number, changes: EventChanges) => requestJson<{ event: AdminEvent }>(`/admin/events/${year}`, { method: 'PATCH', body: changes }),
        setWindow: (year: number, what: EventWindow, action: 'open' | 'close') =>
            requestJson<{ event: AdminEvent }>(`/admin/events/${year}/${what}/${action}`, { method: 'POST' }),
    },

    admins: {
        list: () => requestJson<{ admins: AdminAccount[]; invites: AdminInviteRow[] }>('/admin/admins'),
        invite: (input: { email: string; name: string; role: AdminRole }) =>
            requestJson<{ invite: AdminInviteRow }>('/admin/admins/invites', { method: 'POST', body: input }),
        revokeInvite: (id: string) => requestJson<{ ok: boolean }>(`/admin/admins/invites/${encodeURIComponent(id)}`, { method: 'DELETE' }),
        update: (id: string, change: { role?: AdminRole; disabled?: boolean }) =>
            requestJson<{ admin: AdminAccount }>(`/admin/admins/${encodeURIComponent(id)}`, { method: 'PATCH', body: change }),
    },

    dashboard: () => requestJson<DashboardData>('/admin/dashboard'),

    pricingCategories: (year: Year) =>
        requestJson<{ categories: PricingCategory[] }>('/registrations/config/categories', { auth: false, query: { year } }),

    registrations: {
        list: (query: Query) =>
            requestJson<{ registrations: AdminRegistration[]; pagination: Pagination }>('/admin/registrations', { query }),
        stats: () => requestJson<SummaryStats>('/admin/registrations/stats/summary'),
        setStatus: (id: string, status: string) =>
            requestJson<{ registration: AdminRegistration }>(`/admin/registrations/${encodeURIComponent(id)}`, { method: 'PATCH', body: { status } }),
        /** Cancels the rider's whole entry; rows, bibs and payments are kept. */
        cancel: (id: string, reason: string) =>
            requestJson<{ ok: boolean; cancelled: number }>(`/admin/registrations/${encodeURIComponent(id)}/cancel`, { method: 'POST', body: { reason } }),
        editDetails: (id: string, edit: RiderDetailsEdit & { reason: string }) =>
            requestJson<{ registration: AdminRegistration; changed: string[] }>(`/admin/registrations/${encodeURIComponent(id)}/details`, { method: 'PATCH', body: edit }),
        move: (id: string, toRegistrationId: string, reason: string) =>
            requestJson<{ registration: AdminRegistration }>(`/admin/registrations/${encodeURIComponent(id)}/move`, { method: 'POST', body: { toRegistrationId, reason } }),
        addRefundNote: (id: string, note: string, amountKes: number | null) =>
            requestJson<{ note: RegistrationHistory['notes'][number] }>(`/admin/registrations/${encodeURIComponent(id)}/refund-notes`, { method: 'POST', body: { note, amountKes } }),
        history: (id: string) => requestJson<RegistrationHistory>(`/admin/registrations/${encodeURIComponent(id)}/history`),
    },

    payments: {
        list: (query: Query) => requestJson<{ payments: AdminPayment[]; pagination: Pagination }>('/admin/payments', { query }),
        stats: () => requestJson<SummaryStats>('/admin/payments/stats/summary'),
    },

    raffle: {
        list: (query: Query) => requestJson<{ tickets: AdminRaffleTicket[]; pagination: Pagination }>('/admin/raffle', { query }),
        setStatus: (id: string, status: string) =>
            requestJson<{ ticket: AdminRaffleTicket }>(`/admin/raffle/${encodeURIComponent(id)}`, { method: 'PATCH', body: { status } }),
        remove: (id: string) => requestJson<{ ok: boolean }>(`/admin/raffle/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    },

    donations: {
        list: (query: Query) => requestJson<{ donations: AdminDonation[]; pagination: Pagination }>('/admin/donations', { query }),
        stats: () => requestJson<SummaryStats>('/admin/donations/stats/summary'),
        remove: (id: string) => requestJson<{ success: boolean }>(`/admin/donations/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    },

    referrals: {
        list: (query: Query) =>
            requestJson<{ referrals: AdminReferral[]; pagination: Pagination; stats: ReferralsStats }>('/admin/referrals', { query }),
        create: (referral: NewReferral) => requestJson<{ referral: AdminReferral }>('/admin/referrals', { method: 'POST', body: referral }),
        deactivate: (id: string) => requestJson<{ ok: boolean }>(`/admin/referrals/${encodeURIComponent(id)}`, { method: 'DELETE' }),
        exportCsv: () => requestBlob('/admin/referrals/export'),
    },

    bikeHires: {
        list: (year: Year) => requestJson<AdminBikeHire[]>('/admin/bike-hires', { query: { year } }),
        setStatus: (id: string, status: AdminBikeHire['status']) =>
            requestJson<AdminBikeHire>(`/admin/bike-hires/${encodeURIComponent(id)}/status`, { method: 'POST', body: { status } }),
    },

    feedback: () => requestJson<{ total: number; averageRating: number; entries: AdminFeedbackEntry[] }>('/admin/feedback'),

    messages: {
        smsBalance: () => requestJson<SmsBalance>('/admin/email/sms-balance'),
        bulkSend: (payload: BulkSendPayload) => requestJson<CommsPreview>('/admin/email/bulk-send', { method: 'POST', body: payload }),
    },

    bibs: {
        start: (query: Query) => requestJson<{ jobId: string; total: number }>('/admin/bibs/generate/start', { method: 'POST', query }),
        /** Server-sent events: `data: {"type":"progress"|"done"|"error", ...}` lines. */
        progress: (jobId: string) => send(`/admin/bibs/generate/progress/${encodeURIComponent(jobId)}`),
        download: (jobId: string) => requestBlob(`/admin/bibs/generate/download/${encodeURIComponent(jobId)}`),
    },

    /** Server-built CSV files; every year when `year` is undefined. */
    exports: {
        registrations: (year: Year) => requestBlob('/admin/exports/registrations.csv', { query: { year } }),
        raffle: (year: Year) => requestBlob('/admin/exports/raffle.csv', { query: { year } }),
        donations: (year: Year) => requestBlob('/admin/exports/donations.csv', { query: { year } }),
    },
};
