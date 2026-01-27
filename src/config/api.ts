const IS_PROD = import.meta.env.PROD;

export const API_BASE_URL = IS_PROD
    ? 'https://ride-with-the-warriors-server.vercel.app/api/v1'
    : (import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1');

export const getApiUrl = (endpoint: string) => {
    const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
};
