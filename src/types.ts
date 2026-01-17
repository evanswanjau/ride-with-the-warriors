export interface RiderDetails {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    idNumber: string;
    dob: string;
    gender: 'male' | 'female' | '';
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
}

export interface FamilyDetails {
    guardian: {
        fullName: string;
        emergencyPhone: string;
        email: string;
        relationship: string;
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
    imageUrl: string;
    price: number;
    date: string;
    time: string;
    location: string;
}
