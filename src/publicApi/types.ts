/** Where registration (or the raffle) stands, as the public pages show it (docs/EVENT_LIFECYCLE_PLAN.md). */
export type LifecycleState = 'upcoming' | 'open' | 'closed' | 'finished';

export interface EventCircuit {
    id: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    icon: string | null;
    distanceKm: number;
    startTime: string;
    isCompetitive: boolean;
    sortOrder: number;
}

/** GET /events/current. Dates are ISO strings; `date` is the ride day, "YYYY-MM-DD". */
export interface PublicEvent {
    year: number;
    name: string;
    date: string | null;
    location: string | null;
    registrationOpen: boolean;
    registrationOpensAt: string | null;
    registrationClosesAt: string | null;
    raffleOpen: boolean;
    raffleOpensAt: string | null;
    raffleClosesAt: string | null;
    rafflePrice: number;
    bikeHirePrice: number;
    bikeStock: number | null;
    bikesLeft: number | null;
    // Added by the server's Phase 2 (PR #31); older servers leave them out.
    registrationState?: LifecycleState;
    raffleState?: LifecycleState;
    riderCap?: number | null;
    feedbackOpen?: boolean;
    circuits?: EventCircuit[];
}

export interface Enquiry {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

export interface FeedbackForm {
    role: 'CYCLIST' | 'ATTENDEE' | 'SPONSOR' | 'ORGANISER';
    rating: number;
    firstName?: string;
    lastName?: string;
    highlights?: string;
    improvements?: string;
    notifyEmail?: string;
}

export interface HostedPhoto {
    eventYear: number;
    album: string;
    publicId: string;
    caption: string | null;
}

export interface Donation {
    /** PENDING, PAID or FAILED. */
    status: string;
    failureReason?: string | null;
}
