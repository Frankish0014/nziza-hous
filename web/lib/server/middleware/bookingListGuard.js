import { authMiddleware, requireRole } from './authMiddleware.js';

/**
 * Guest lookup: ?email=... is public. Full list requires admin JWT.
 */
export const bookingListGuard = (req, res, next) => {
  const email = req.query.email;
  if (email !== undefined && String(email).trim() !== '') {
    return next();
  }
  authMiddleware(req, res, () => requireRole(['admin'])(req, res, next));
};
