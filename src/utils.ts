
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
    const matches = categories.filter(cat => cat.circuitId === circuitId && cat.type === type);

    if (circuitId === 'family' || type === 'family') {
        const familyMatch = matches.find(cat => {
            if (cat.familyCategory && cat.familyCategory !== familyCategory) return false;
            if (!cat.familyCategory && familyCategory) return false;
            return true;
        });
        if (familyMatch) return {
            category: familyMatch.categoryName,
            regRange: familyMatch.regRange,
            price: familyMatch.price,
            colorCode: familyMatch.colorCode,
            hexColor: familyMatch.hexColor,
            remarks: familyMatch.remarks || '',
        };
    }

    // For individual categories, prioritize exact age match
    if (age !== null) {
        const ageMatch = matches.find(cat => {
            if (cat.minAge === null && cat.maxAge === null) return false;
            const min = cat.minAge ?? 0;
            const max = cat.maxAge ?? 999;
            return age >= min && age <= max;
        });
        if (ageMatch) return {
            category: ageMatch.categoryName,
            regRange: ageMatch.regRange,
            price: ageMatch.price,
            colorCode: ageMatch.colorCode,
            hexColor: ageMatch.hexColor,
            remarks: ageMatch.remarks || '',
        };
    }

    // Fallback to first non-age-ranged match in circuit
    const firstMatch = matches.find(cat => cat.minAge === null && cat.maxAge === null) || matches[0];
    if (firstMatch) {
        return {
            category: firstMatch.categoryName,
            regRange: firstMatch.regRange,
            price: firstMatch.price,
            colorCode: firstMatch.colorCode,
            hexColor: firstMatch.hexColor,
            remarks: firstMatch.remarks || '',
        };
    }

    // Fallback
    return { category: 'Rider', regRange: 'TBD', price: 2000, colorCode: 'Black', hexColor: '#000000', remarks: '' };
};

export const getCategoryColor = (id: string | null | undefined): string => {
    if (!id) return '#9ca3af'; // Gray-400 for unknown

    // Parse numeric ID if possible (for pure numeric IDs or prefixed IDs)
    const numPart = id.replace(/\D/g, '');
    const numId = parseInt(numPart, 10);
    const hasCPrefix = id.toUpperCase().startsWith('C');
    const hasTPrefix = id.toUpperCase().startsWith('T');

    // Individual Corporate 8001-9999 -> Burgundy
    if (numId >= 8001 && numId <= 9999 && !hasCPrefix) return '#800020';

    // Parent (T101...) or Family special cases
    if (hasTPrefix || hasCPrefix) {
        if (hasTPrefix) return '#ec4899'; // Pink (Parents)
        if (hasCPrefix) {
            if (numId >= 201 && numId <= 299) return '#ef4444'; // Red (Cubs)
            if (numId >= 301 && numId <= 999) return '#78350f'; // Brown (Champs)
        }
    }

    // Teams (Blitz) 7001-7999 -> Sky Blue
    if (numId >= 7001 && numId <= 7999) return '#0ea5e9';

    // Veterans 6001-6999 -> Navy Blue
    if (numId >= 6001 && numId <= 6999) return '#1e3a8a';

    // Vanguard 5001-5999 -> Green
    if (numId >= 5001 && numId <= 5999) return '#22c55e';

    // Airborne 4001-4999 -> Purple
    if (numId >= 4001 && numId <= 4999) return '#a855f7';

    // Commanders 3001-3999 -> White
    if (numId >= 3001 && numId <= 3999) return '#ffffff';

    // Recon Individual 2001-2999 -> Yellow
    if (numId >= 2001 && numId <= 2999) return '#eab308';

    // Corporate Teams 1001-1999 -> Orange
    if (numId >= 1001 && numId <= 1999) return '#f97316';

    // Recon Teams 0001-0999 -> Grey
    if (numId >= 1 && numId <= 999) return '#6b7280';

    return '#9ca3af'; // Default
};

export const getContrastText = (hexColor: string): string => {
    if (!hexColor || hexColor === 'transparent') return 'inherit';

    let hex = hexColor.replace('#', '');

    // Handle short hex codes like #fff
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) return 'inherit';

    // Standard relative luminance formula
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // If too light, return dark text. Else return white.
    // 165 is a good threshold for "light"
    return luma > 165 ? '#111827' : '#ffffff';
};
