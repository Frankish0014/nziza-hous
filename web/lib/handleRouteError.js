import { jsonError } from '@/lib/http.js';

export function handleRouteError(err) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  if (status >= 500) console.error(err);
  return jsonError(message, status);
}
