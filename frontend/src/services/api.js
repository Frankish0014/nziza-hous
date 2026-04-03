import axios from 'axios';

function resolveApiBase() {
  let raw = (import.meta.env.VITE_API_URL || '').trim();
  if (import.meta.env.PROD && raw && /localhost|127\.0\.0\.1/i.test(raw)) {
    // eslint-disable-next-line no-console
    console.warn(
      '[nziza-house] VITE_API_URL must not use localhost in production — that is each visitor’s own PC. ' +
        'Set a public API URL on Netlify and redeploy, or use the /api proxy in netlify.toml.',
    );
    raw = '';
  }
  if (raw) {
    const trimmed = raw.replace(/\/$/, '');
    if (trimmed.endsWith('/api')) return trimmed;
    if (/^https?:\/\/[^/]+(:\d+)?$/i.test(trimmed)) return `${trimmed}/api`;
    return trimmed;
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:4000/api';
  }

  /**
   * Production build without VITE_API_URL: same-origin /api.
   * Point Netlify at your hosted API — either set VITE_API_URL (rebuild) or add a proxy in netlify.toml.
   */
  if (typeof console !== 'undefined' && console.info) {
    console.info(
      '[nziza-house] Using API base /api. On Netlify, set VITE_API_URL to your public API ' +
        '(e.g. https://api.example.com/api) and redeploy, or proxy /api/* in netlify.toml.',
    );
  }
  return '/api';
}

const API_BASE_URL = resolveApiBase();

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nziza_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

