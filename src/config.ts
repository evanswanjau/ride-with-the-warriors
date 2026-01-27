const IS_PROD = import.meta.env.PROD;

export const API_BASE_URL = IS_PROD
    ? 'https://ride-with-the-warriors-server.vercel.app/api/v1'
    : (import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1');

