/** Recipients for a bulk message from an uploaded CSV file (Messages page). */
import type { CsvRecipient } from '../../../adminTypes';

export const CSV_TEMPLATE = `firstName,email
James,james@example.com
Sarah,sarah@example.com`;

export function parseCsvRecipients(text: string): { recipients: CsvRecipient[]; errors: string[] } {
    const lines = text.trim().split(/\r?\n/).filter(line => line.trim());
    const errors: string[] = [];
    if (lines.length < 2) {
        return { recipients: [], errors: ['CSV must include a header row and at least one data row.'] };
    }

    const splitRow = (row: string) => {
        const cells: string[] = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < row.length; i++) {
            const ch = row[i];
            if (ch === '"') {
                inQuotes = !inQuotes;
                continue;
            }
            if (ch === ',' && !inQuotes) {
                cells.push(current.trim());
                current = '';
                continue;
            }
            current += ch;
        }
        cells.push(current.trim());
        return cells;
    };

    const headers = splitRow(lines[0]).map(h => h.toLowerCase().replace(/^\ufeff/, ''));
    const firstNameIdx = headers.findIndex(h => ['firstname', 'first name', 'first_name', 'name'].includes(h));
    const lastNameIdx = headers.findIndex(h => ['lastname', 'last name', 'last_name', 'surname'].includes(h));
    const emailIdx = headers.findIndex(h => ['email', 'email address', 'email_address'].includes(h));
    const phoneIdx = headers.findIndex(h => ['phone', 'phone number', 'phonenumber', 'mobile'].includes(h));

    if (emailIdx === -1) {
        return { recipients: [], errors: ['CSV must include an "email" column.'] };
    }
    if (firstNameIdx === -1) {
        return { recipients: [], errors: ['CSV must include a "firstName" column.'] };
    }

    const recipients: CsvRecipient[] = [];
    for (let i = 1; i < lines.length; i++) {
        const cols = splitRow(lines[i]);
        const email = (cols[emailIdx] || '').trim().toLowerCase();
        const firstName = (cols[firstNameIdx] || '').trim();
        const lastName = lastNameIdx >= 0 ? (cols[lastNameIdx] || '').trim() : '';
        const phone = phoneIdx >= 0 ? (cols[phoneIdx] || '').trim() : '';

        if (!email) {
            errors.push(`Row ${i + 1}: missing email — skipped.`);
            continue;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push(`Row ${i + 1}: invalid email "${email}" — skipped.`);
            continue;
        }

        recipients.push({
            firstName: firstName || 'Friend',
            lastName: lastName || undefined,
            email,
            phone: phone || undefined,
        });
    }

    return { recipients, errors };
}
