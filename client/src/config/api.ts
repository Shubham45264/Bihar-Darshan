const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const cleanUrl = envUrl.replace(/\/+$/, '');

/**
 * Normalized API Base URL (always ends with `/api/v1` without duplication)
 */
export const API_BASE_URL = cleanUrl.endsWith('/api/v1')
  ? cleanUrl
  : cleanUrl.endsWith('/api')
    ? `${cleanUrl}/v1`
    : `${cleanUrl}/api/v1`;

/**
 * Root backend server URL without API prefix (e.g. `https://bihar-darshan-api.vercel.app`)
 */
export const BACKEND_BASE_URL = cleanUrl.replace(/\/api(\/v1)?$/, '');
