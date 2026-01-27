
export const calculateAge = (dob: string): number | null => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export const isValidKenyanPhone = (phone: string) => {
    const kenyanPhoneRegex = /^(?:254|\+254|0)?(7|1)\d{8}$/;
    return kenyanPhoneRegex.test(phone.replace(/\s+/g, ''));
};

export const isValidID = (id: string) => {
    return /^\d{8,10}$/.test(id);
};

export interface Classification {
    category: string;
    regRange: string;
    price: number;
    colorCode: string;
    remarks: string;
    hexColor: string;
}

export const getClassification = (circuitId: string, type: string, age: number | null = null, familyCategory: string = ''): Classification => {
    // Family Circuit / 5 KM
    if (circuitId === 'family' || type === 'family' || (circuitId === 'family' && type === 'individual')) {
        if (familyCategory === 'tigers' || (type === 'individual' && circuitId === 'family')) {
            return { category: 'Moms', regRange: 'T101–T200', price: 2000, colorCode: 'Pink', hexColor: '#ec4899', remarks: 'Moms only' };
        }
        if (familyCategory === 'cubs') {
            return { category: 'Cubs', regRange: '8001–9000', price: 1000, colorCode: 'Red', hexColor: '#ef4444', remarks: 'Kids 4–8' };
        }
        if (familyCategory === 'champs') {
            return { category: 'Champs', regRange: '9001–10000', price: 1000, colorCode: 'Brown', hexColor: '#78350f', remarks: 'Kids 9–13' };
        }
    }

    // Corporate Circuit (30 KM)
    if (circuitId === 'corporate') {
        return { category: 'Corporate Team', regRange: '1000–1999', price: 9000, colorCode: 'Orange', hexColor: '#f97316', remarks: 'Must have a lady, Open Classification' };
    }

    // Recon (Intermediate) Circuit (60 KM)
    if (circuitId === 'intermediate') {
        if (type === 'team') {
            return { category: 'Recon Team', regRange: '0001–0999', price: 9000, colorCode: 'Grey', hexColor: '#6b7280', remarks: 'Must have a lady, Open Classification' };
        }
        return { category: 'Individual', regRange: '2000–2999', price: 2000, colorCode: 'Yellow', hexColor: '#eab308', remarks: 'Male & Female Classification' };
    }

    // Blitz Circuit (120 KM)
    if (circuitId === 'blitz') {
        if (type === 'team') {
            return { category: 'Blitz Team', regRange: '7000–7999', price: 9000, colorCode: 'Sky Blue', hexColor: '#0ea5e9', remarks: 'Must have a lady, Open Classification' };
        }

        const a = age || 0;

        if (a <= 23) {
            return { category: 'Vanguard', regRange: '5000–5999', price: 2000, colorCode: 'Green', hexColor: '#22c55e', remarks: 'Under 23, Open Classification' };
        }
        if (a >= 24 && a <= 40) {
            return { category: 'Airborne', regRange: '4000–4999', price: 2000, colorCode: 'Purple', hexColor: '#a855f7', remarks: '24–40, Male & Female Classification' };
        }
        if (a >= 41 && a <= 49) {
            return { category: 'Commanders', regRange: '3000–3999', price: 2000, colorCode: 'White', hexColor: '#ffffff', remarks: '41–49, Male & Female Classification' };
        }
        return { category: 'Veterans', regRange: '6000–6999', price: 2000, colorCode: 'Navy Blue', hexColor: '#1e3a8a', remarks: 'Over 50 years, Open Classification' };
    }

    // Fallback
    return { category: 'Rider', regRange: 'TBD', price: 2000, colorCode: 'Black', hexColor: '#000000', remarks: '' };
};

export const getCategoryColor = (id: string | null | undefined): string => {
    if (!id) return '#9ca3af'; // Gray-400 for unknown

    // Parse numeric ID if possible (for pure numeric IDs)
    const numId = parseInt(id.replace(/\D/g, ''), 10);

    // Tigers (T101...) or Family special cases might be non-numeric or specific ranges
    if (id.toUpperCase().startsWith('T') || (id.startsWith('8') && id.length === 4) || (id.startsWith('9') && id.length === 4)) {
        if (id.toUpperCase().startsWith('T')) return '#ec4899'; // Pink (Moms)
        if (numId >= 8001 && numId <= 9000) return '#ef4444'; // Red (Cubs)
        if (numId >= 9001 && numId <= 10000) return '#78350f'; // Brown (Champs)
    }

    // Teams (Blitz) 7000-7999 -> Sky Blue
    if (numId >= 7000 && numId <= 7999) return '#87CEEB';

    // Veterans 6000-6999 -> Navy Blue
    if (numId >= 6000 && numId <= 6999) return '#000080';

    // Vanguard 5000-5999 -> Green
    if (numId >= 5000 && numId <= 5999) return '#22c55e';

    // Airborne 4000-4999 -> Purple
    if (numId >= 4000 && numId <= 4999) return '#a855f7';

    // Commanders 3000-3999 -> White
    if (numId >= 3000 && numId <= 3999) return '#ffffff';

    // Recon Individual 2000-2999 -> Yellow
    if (numId >= 2000 && numId <= 2999) return '#eab308';

    // Corporate Teams 1000-1999 -> Orange
    if (numId >= 1000 && numId <= 1999) return '#f97316';

    // Recon Teams 0001-1000 -> Grey
    if (numId >= 1 && numId <= 1000) return '#6b7280';

    return '#9ca3af'; // Default
};
