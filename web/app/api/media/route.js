import * as mediaService from '@/lib/server/services/mediaService.js';
import { jsonSuccess, jsonError } from '@/lib/http.js';
import { handleRouteError } from '@/lib/handleRouteError.js';
import { requireAuth } from '@/lib/auth-api.js';
import { ensureDbReady } from '@/lib/server/ensureDb.js';
import { env } from '@/lib/server/config/env.js';

export async function POST(request) {
  try {
    const denied = requireAuth(request, ['admin']);
    if (denied instanceof Response) return denied;
    if (env.skipDatabaseBootstrap) return jsonError('Database is not configured', 503);
    await ensureDbReady();
    const body = await request.json();
    const data = await mediaService.addMedia({
      serviceId: Number(body.serviceId),
      url: body.url,
      altText: body.altText || null,
    });
    return jsonSuccess(data, 'Media attached', 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
