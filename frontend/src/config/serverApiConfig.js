const ensureTrailingSlash = (value) => (value.endsWith('/') ? value : `${value}/`);

const ensureApiPath = (value) => {
  const normalized = ensureTrailingSlash(value);
  return normalized.endsWith('/api/') ? normalized : `${normalized}api/`;
};

const envApiBase =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BACKEND_SERVER) ||
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_SERVER);

const envFileBase =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FILE_BASE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FILE_BASE_URL);

// Default to same-origin in production containers (Render, Docker, etc.).
export const API_BASE_URL = ensureApiPath(envApiBase || '/');
export const BASE_URL = ensureTrailingSlash(envFileBase || '/');
export const WEBSITE_URL =
  (typeof window !== 'undefined' && window.location && window.location.origin
    ? ensureTrailingSlash(window.location.origin)
    : '/');

export const DOWNLOAD_BASE_URL = BASE_URL + 'download/';
export const ACCESS_TOKEN_NAME = 'x-auth-token';

export const FILE_BASE_URL = BASE_URL;

