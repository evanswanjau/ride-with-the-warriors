/** Shapes returned by GET /me/history (server/src/routes/me.ts). */

export interface BikeHire {
    id: string;
    status: string;
    amount: number;
}

export interface Rider {
    id: string;
    firstName: string;
    lastName: string;
    category: string | null;
    bibNumber: string | null;
    status: string;
    isCaptain: boolean;
    gender?: string | null;
    dob?: string | null;
    tshirtSize: string | null;
    emergencyContactName?: string | null;
    emergencyPhone?: string | null;
    isMilitary?: boolean | null;
    email?: string | null;
    phoneNumber?: string | null;
    bikeHire: BikeHire | null;
}

export interface Entry {
    groupId: string;
    role: 'owner' | 'participant';
    type: 'individual' | 'team' | 'family';
    circuitId: string;
    teamName: string | null;
    status: string;
    paymentRegistrationId: string | null;
    totalAmount: number | null;
    createdAt: string;
    riders: Rider[];
}

export interface RaffleTicket {
    id: string;
    ticketNumber: string | null;
    status: string;
    paymentFailed?: boolean;
    createdAt: string;
}

export interface Donation {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
}

export interface History {
    year: number;
    years: number[];
    registrations: Entry[];
    raffleTickets: RaffleTicket[];
    donations: Donation[];
}
