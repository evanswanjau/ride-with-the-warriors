import { API_BASE_URL } from './config';

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
    data?: T;
    error?: ApiError;
}

async function handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || 'An error occurred');
    }

    return data;
}

export const api = {
    async getCircuits() {
        const response = await fetch(`${API_BASE_URL}/circuits`);
        return handleResponse<{ circuits: any[] }>(response);
    },

    async createRegistration(payload: {
        circuitId: string;
        type: string;
        payload: unknown;
    }) {
        const response = await fetch(`${API_BASE_URL}/registrations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        return handleResponse<{
            registrationId: string;
            status: string;
            pricing: any;
            classifications: any;
        }>(response);
    },

    async getRegistration(id: string) {
        const response = await fetch(`${API_BASE_URL}/registrations/${id}`);
        return handleResponse<{ registration: any }>(response);
    },

    async adminLogin(payload: any) {
        const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return handleResponse<{ token: string; admin: any }>(response);
    },

    async adminLogout(token: string) {
        const response = await fetch(`${API_BASE_URL}/admin/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse<{ ok: boolean }>(response);
    },

    async getAdminMe(token: string) {
        const response = await fetch(`${API_BASE_URL}/admin/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse<{ admin: any }>(response);
    },

    async adminGetRegistrations(token: string, params: any = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/admin/registrations?${queryString}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse<any>(response);
    },

    async adminUpdateRegistration(token: string, id: string, payload: any) {
        const response = await fetch(`${API_BASE_URL}/admin/registrations/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        return handleResponse<any>(response);
    },

    async adminDeleteRegistration(token: string, id: string) {
        const response = await fetch(`${API_BASE_URL}/admin/registrations/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse<{ ok: boolean }>(response);
    },

    async adminGetStats(token: string) {
        const response = await fetch(`${API_BASE_URL}/admin/registrations/stats/summary`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse<any>(response);
    },

    async getAllRegistrations() {
        const response = await fetch(`${API_BASE_URL}/admin/registrations`);
        return handleResponse<{ registrations: any[] }>(response);
    },
};
