import * as bookingService from '@/lib/server/services/bookingService.js';
import { createBookingSchema } from '@/lib/server/validations/bookingValidation.js';
import { validateRequest, jsonSuccess, jsonError } from '@/lib/http.js';
import { handleRouteError } from '@/lib/handleRouteError.js';
import { requireAuth } from '@/lib/auth-api.js';
import { ensureDbReady } from '@/lib/server/ensureDb.js';
import { env } from '@/lib/server/config/env.js';

export async function GET(request) {
  try {
    if (env.skipDatabaseBootstrap) {
      return jsonError('Database is not configured', 503);
    }
    await ensureDbReady();
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get('email');
    if (emailParam !== null && String(emailParam).trim() !== '') {
      const data = await bookingService.listBookingsByEmail(String(emailParam).trim().toLowerCase());
      return jsonSuccess(data);
    }
    const denied = requireAuth(request, ['admin']);
    if (denied instanceof Response) return denied;
    const data = await bookingService.listBookings();
    return jsonSuccess(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request) {
  try {
    if (env.skipDatabaseBootstrap) {
      return jsonError('Database is not configured', 503);
    }
    await ensureDbReady();
    const body = await request.json();
    const err = await validateRequest(createBookingSchema, { body });
    if (err) return err;
    const data = await bookingService.createBooking(body);
    return jsonSuccess(data, 'Booking created', 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
