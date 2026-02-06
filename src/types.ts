export interface RiderDetails {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    idNumber: string;
    dob: string;
    gender: 'male' | 'female' | '';
    tshirtSize: string;
    emergencyContactName: string;
    emergencyPhone: string;
}


export type ParticipationCategory = 'military' | 'civilian';

export interface TeamMember extends RiderDetails {
    id: string;
    isCaptain: boolean;
}

export interface TeamDetails {
    teamName: string;
    members: TeamMember[];
}

export interface JuniorRider {
    id: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: 'male' | 'female' | '';
    tshirtSize: string;
    idNumber: string;
    emergencyContactName: string;
    emergencyPhone: string;
}

export interface FamilyDetails {
    guardian: {
        firstName: string;
        lastName: string;
        fullName: string; // Redundant but kept for compatibility, we will sync it
        dob: string;      // Required if participation is 'mom'
        emergencyPhone: string;
        emergencyContactName: string; // Added for plan consistency
        email: string;
        phoneNumber: string;
        idNumber: string;
        gender: 'male' | 'female' | '';
        relationship: string;
        tshirtSize: string;
        participation: 'none' | 'mom' | 'other';
    };
    riders: {
        [category: string]: JuniorRider[];
    };
}

export interface Circuit {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    imageUrl?: string;
    distance: string;
    price: number;
    date: string;
    time: string;
    location: string;
    isCompetitive?: boolean;
}
