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
