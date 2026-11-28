// Shapes of admin API responses, limited to the fields the admin UI reads.
import type { PricingCategory } from './types';

export interface AdminRegistration {
    id: string;
    bibNumber?: string | null;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    teamName?: string | null;
    tshirtSize?: string | null;
    emergencyContactName?: string | null;
    emergencyPhone?: string | null;
    type: string;
    circuitId: string;
    category: string;
    totalAmount: number;
    mpesaCode?: string | null;
    status: string;
    createdAt: string;
    isMilitary?: boolean;
    rank?: string | null;
    service?: string | null;
    serviceNumber?: string | null;
    unit?: string | null;
}

export interface AdminPayment {
    id: string;
    amount: number;
    status: string;
    phone?: string | null;
    mpesaReceiptNumber?: string | null;
    transactionDate?: string | null;
    createdAt: string;
    registrationId?: string | null;
    bikeHireId?: string | null;
    donationId?: string | null;
    raffleTicketIds?: string[] | null;
    ticketNumbers?: string[] | null;
    bibNumber?: string | null;
}

export interface AdminRaffleTicket {
    id: string;
    ticketNumber?: string | null;
    firstName: string;
    lastName: string;
    email?: string | null;
    phoneNumber?: string | null;
    idNumber?: string | null;
    gender?: string | null;
    referralCode?: string | null;
    status: string;
    createdAt: string;
}

export interface AdminDonation {
    id: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    amount: number;
    mpesaCode?: string | null;
    status: string;
    createdAt: string;
}

export interface AdminReferral {
    id: string;
    code: string;
    influencerName: string;
    influencerEmail?: string | null;
    influencerPhone?: string | null;
    isActive: boolean;
    clicks?: number;
    totalTickets?: number;
    paidTickets?: number;
}

export interface Pagination {
    page?: number;
    pages?: number;
    total?: number;
    [key: string]: unknown;
}

export interface LabelCount {
    label: string;
    count?: number;
    pct?: number;
    color?: string;
}

export interface CircuitStat {
    id?: string;
    name?: string;
    title?: string;
    color?: string;
    value?: number;
    categoryName?: string;
    [key: string]: unknown;
}

export interface ActivityItem {
    type?: string;
    status?: string;
    title: string;
    subtitle?: string;
    date: string;
}

export interface DashboardData {
    summary?: {
        revenue?: number;
        registrations?: { total?: number; paid?: number };
        raffle?: { total?: number; paid?: number; revenue?: number };
        pulse?: { staleUnpaid?: number; avgPerDay?: number };
    };
    financials?: { conversionFunnel?: { label: string; count: number }[] };
    byCircuit?: CircuitStat[];
    revenueByCircuit?: CircuitStat[];
    demographics?: {
        genderBreakdown?: LabelCount[];
        militaryBreakdown?: LabelCount[];
        tshirtBreakdown?: Record<string, unknown>[];
    };
    activityFeed?: ActivityItem[];
    hourlyIntensity?: { registrations: number; [key: string]: unknown }[];
    dailyStats?: Record<string, unknown>[];
    statusTrend?: Record<string, unknown>[];
    ageDistribution?: Record<string, unknown>[];
}

export interface SummaryStats {
    summary: {
        paid?: number;
        unpaid?: number;
        failed?: number;
        total?: number;
        revenue?: number;
        paidCount?: number;
        unpaidCount?: number;
        totalCount?: number;
        totalAmount?: number;
    };
}

export interface ReferralsStats {
    activeReferrals?: number;
    totalClicks?: number;
    totalPaidReferred?: number;
    totalReferrals?: number;
}

export type { PricingCategory };

export interface AdminBikeHire {
    id: string;
    registrationId: string;
    bikeType: string;
    status: 'PENDING' | 'PAID' | 'COLLECTED' | 'RETURNED';
    amount: number;
    createdAt: string;
    registration: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        type: string;
    };
}

export interface AdminFeedbackEntry {
    id: string;
    role: string;
    rating: number;
    firstName: string | null;
    lastName: string | null;
    highlights: string | null;
    improvements: string | null;
    createdAt: string;
}

export interface CsvRecipient {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
}

export interface BulkSendPayload {
    mode: 'sms' | 'email' | 'both';
    targetEntity: 'cyclist' | 'raffle' | 'donor' | 'custom' | 'csv';
    targetStatus: 'all' | 'paid' | 'unpaid';
    customPhones: string;
    customEmails: string;
    csvRecipients?: CsvRecipient[];
    message: string;
    subject: string;
    testMode: boolean;
}

export interface CommsStats { success?: number; failed?: number; [key: string]: unknown }

export interface CommsPreview {
    recipientsCount?: number;
    sampleRecipients?: { name?: string; contact?: string; compiledMessage?: string }[];
    smsStats?: CommsStats;
    emailStats?: CommsStats;
    [key: string]: unknown;
}

export interface SmsBalance {
    credit?: string | number;
    [key: string]: unknown;
}

export type LifecycleState = 'upcoming' | 'open' | 'closed' | 'finished';

/** GET /events/current and each row of GET /admin/events. */
export interface AdminEvent {
    year: number;
    name: string;
    current?: boolean;
    date?: string | null;
    location?: string | null;
    registrationState?: LifecycleState;
    registrationOpensAt?: string | null;
    registrationClosesAt?: string | null;
    raffleState?: LifecycleState;
    raffleOpensAt?: string | null;
    raffleClosesAt?: string | null;
    feedbackOpen?: boolean;
    feedbackOpensAt?: string | null;
    feedbackClosesAt?: string | null;
    rafflePrice?: number;
    bikeHirePrice?: number;
    bikeStock?: number | null;
    riderCap?: number | null;
    pricingCategories?: number;
}

/** Fields PATCH /admin/events/:year accepts. */
export interface EventChanges {
    name?: string;
    date?: string | null;
    location?: string | null;
    registrationOpensAt?: string | null;
    registrationClosesAt?: string | null;
    raffleOpensAt?: string | null;
    raffleClosesAt?: string | null;
    feedbackOpensAt?: string | null;
    feedbackClosesAt?: string | null;
    rafflePrice?: number;
    bikeHirePrice?: number;
    bikeStock?: number | null;
    riderCap?: number | null;
}

export type EventWindow = 'registration' | 'raffle' | 'feedback';

export interface BibJobProgress { pct: number; processed: number; total: number }


/** GET /admin/admins */
export interface AdminAccount {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    lastLogin: string | null;
    disabledAt: string | null;
}

export interface AdminInviteRow {
    id: string;
    email: string;
    name: string;
    role: string;
    expiresAt: string;
    createdAt: string;
}
