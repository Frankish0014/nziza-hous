import axios from 'axios';

function resolveApiBase() {
  let raw = (import.meta.env.VITE_API_URL || '').trim();
  const ignoredLocalhost =
    import.meta.env.PROD && raw && /localhost|127\.0\.0\.1/i.test(raw);
  if (ignoredLocalhost) {
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
   * Production: same-origin /api unless VITE_API_URL was set to a real URL at build time.
   */
  if (typeof console !== 'undefined') {
    if (ignoredLocalhost) {
      // eslint-disable-next-line no-console
      console.warn(
        '[nziza-house] Netlify had VITE_API_URL set to localhost — that points at each visitor’s own PC, so it was ignored. ' +
          'Using /api on this site instead. Fix: (1) Site settings → Environment: set VITE_API_URL to your hosted API ' +
          '(e.g. https://your-app.onrender.com/api) and redeploy, or (2) remove that var and uncomment the /api proxy in netlify.toml.',
      );
    } else if (import.meta.env.MODE === 'production') {
      console.debug(
        '[nziza-house] No VITE_API_URL in build — using /api. Set VITE_API_URL on Netlify and rebuild, or proxy /api in netlify.toml (see repo netlify.toml).',
      );
    }
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

