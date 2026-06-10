
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
export const PAYMENT_MODE = import.meta.env.VITE_PAYMENT_MODE || 'live';

const _base = import.meta.env.BASE_URL; // '/ride-with-the-warriors/' in prod, '/' in dev
export const SITE_URL = window.location.origin + (_base === '/' ? '' : _base.slice(0, -1));
