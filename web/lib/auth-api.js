import jwt from 'jsonwebtoken';
import { env } from '@/lib/server/config/env.js';
import { jsonError } from '@/lib/http.js';

export function getBearerUser(request) {
  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(auth.slice(7), env.jwtSecret);
  } catch {
    return null;
  }
}

/** @returns {{ user: object } | Response} */
export function requireAuth(request, roles) {
  const user = getBearerUser(request);
  if (!user) return jsonError('Authentication required', 401);
  if (roles?.length && !roles.includes(user.role)) return jsonError('Forbidden', 403);
  return { user };
}
