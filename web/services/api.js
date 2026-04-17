import axios from 'axios';

function resolveApiBase() {
  // Browser always calls this Next app’s Route Handlers (`/api/*`). A leftover
  // NEXT_PUBLIC_API_URL from the old Vite + Express setup breaks dev when only `npm run dev:web` runs.
  if (typeof window !== 'undefined') return '/api';

  const rawU = (process.env.NEXT_PUBLIC_API_URL || '').trim();
  if (rawU) {
    const trimmed = rawU.replace(/\/$/, '');
    if (trimmed.endsWith('/api')) return trimmed;
    if (/^https?:\/\/[^/]+(:\d+)?$/i.test(trimmed)) return `${trimmed}/api`;
    return trimmed;
  }
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}/api`;
  return 'http://localhost:3000/api';
}

const api = axios.create({
  baseURL: resolveApiBase(),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('nziza_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };
