import axios from 'axios';

function resolveApiBase() {
  const raw = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
  const trimmed = raw.replace(/\/$/, '');
  if (trimmed.endsWith('/api')) return trimmed;
  // If user set only origin (e.g. http://localhost:4000), append /api
  if (/^https?:\/\/[^/]+(:\d+)?$/i.test(trimmed)) return `${trimmed}/api`;
  return trimmed;
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

