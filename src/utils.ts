
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

export const getClassification = (
    categories: any[],
    circuitId: string,
    type: string,
    age: number | null = null,
    familyCategory: string = ''
): Classification => {
    const match = categories.find(cat => {
        if (cat.circuitId !== circuitId || cat.type !== type) return false;

        if (circuitId === 'family' || type === 'family') {
            if (cat.familyCategory && cat.familyCategory !== familyCategory) return false;
            if (!cat.familyCategory && familyCategory) return false;
        }

        if (age !== null && (cat.minAge !== null || cat.maxAge !== null)) {
            const min = cat.minAge ?? 0;
            const max = cat.maxAge ?? 999;
            if (age < min || age > max) return false;
        }

        return true;
    });

    if (match) {
        return {
            category: match.categoryName,
            regRange: match.regRange,
            price: match.price,
            colorCode: match.colorCode,
            hexColor: match.hexColor,
            remarks: match.remarks || '',
        };
    }

    // Fallback
    return { category: 'Rider', regRange: 'TBD', price: 2000, colorCode: 'Grey', hexColor: '#6b7280', remarks: '' };
};

export const getCategoryColor = (id: string | null | undefined): string => {
    if (!id) return '#9ca3af'; // Gray-400 for unknown

    // Parse numeric ID if possible (for pure numeric IDs or prefixed IDs)
    const numPart = id.replace(/\D/g, '');
    const numId = parseInt(numPart, 10);
    const hasCPrefix = id.toUpperCase().startsWith('C');
    const hasTPrefix = id.toUpperCase().startsWith('T');

    // Individual Corporate 8001-8999 -> Burgundy
    if (numId >= 8001 && numId <= 8999 && !hasCPrefix) return '#800020';

    // Parent (T101...) or Family special cases
    if (hasTPrefix || hasCPrefix) {
        if (hasTPrefix) return '#ec4899'; // Pink (Parents)
        if (hasCPrefix) {
            if (numId >= 200 && numId <= 299) return '#ef4444'; // Red (Cubs)
            if (numId >= 300 && numId <= 999) return '#78350f'; // Brown (Champs)
        }
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
