import { env } from '../config/env.js';

/**
 * Absolute URL for an uploaded file. Prefer PUBLIC_BASE_URL behind reverse proxies.
 */
export const publicUploadUrl = (req, filename) => {
  const base = env.publicBaseUrl?.replace(/\/$/, '');
  if (base) {
    return `${base}/uploads/${filename}`;
  }
  const proto = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('x-forwarded-host') || req.get('host');
  return `${proto}://${host}/uploads/${filename}`;
};
