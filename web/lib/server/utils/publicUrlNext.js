import { env } from '../config/env.js';

export function publicUploadUrlFromRequest(request, filename) {
  const base = env.publicBaseUrl?.replace(/\/$/, '');
  if (base) return `${base}/uploads/${filename}`;
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const host =
    request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  return `${proto}://${host}/uploads/${filename}`;
}
