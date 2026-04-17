import * as bookingService from '@/lib/server/services/bookingService.js';
import { updateBookingStatusSchema } from '@/lib/server/validations/bookingValidation.js';
import { validateRequest, jsonSuccess, jsonError } from '@/lib/http.js';
import { handleRouteError } from '@/lib/handleRouteError.js';
import { requireAuth } from '@/lib/auth-api.js';
import { ensureDbReady } from '@/lib/server/ensureDb.js';
import { env } from '@/lib/server/config/env.js';

export async function PUT(request, { params }) {
  try {
    const { id: idParam } = await params;
    const denied = requireAuth(request, ['admin']);
    if (denied instanceof Response) return denied;
    if (env.skipDatabaseBootstrap) return jsonError('Database is not configured', 503);
    await ensureDbReady();
    const id = Number(idParam);
    const body = await request.json();
    const err = await validateRequest(updateBookingStatusSchema, {
      params: { id },
      body,
    });
    if (err) return err;
    const data = await bookingService.updateBookingStatus(id, body.status);
    if (!data) return jsonError('Booking not found', 404);
    await bookingService.sendBookingStatusEmail(data);
    return jsonSuccess(data, 'Booking updated');
  } catch (e) {
    return handleRouteError(e);
  }
}
