import * as serviceAvailabilityService from '@/lib/server/services/serviceAvailabilityService.js';
import { jsonSuccess, jsonError } from '@/lib/http.js';
import { handleRouteError } from '@/lib/handleRouteError.js';
import { ensureDbReady } from '@/lib/server/ensureDb.js';
import { env } from '@/lib/server/config/env.js';

export async function GET(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from') || undefined;
  const to = searchParams.get('to') || undefined;

  try {
    if (!env.skipDatabaseBootstrap) await ensureDbReady();
    const data = await serviceAvailabilityService.getAvailability({ serviceId: id, from, to });
    return jsonSuccess(data);
  } catch (e) {
    if (e.status === 404) return jsonError(e.message, 404);
    try {
      const data = await serviceAvailabilityService.getAvailabilityFromCatalogOnly({
        serviceId: id,
        from,
        to,
      });
      return jsonSuccess(data);
    } catch (inner) {
      if (inner.status === 404) return jsonError(inner.message, 404);
      return handleRouteError(e);
    }
  }
}
