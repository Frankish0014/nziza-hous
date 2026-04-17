import * as mediaService from '@/lib/server/services/mediaService.js';
import { jsonSuccess } from '@/lib/http.js';
import { handleRouteError } from '@/lib/handleRouteError.js';
import { ensureDbReady } from '@/lib/server/ensureDb.js';
import { env } from '@/lib/server/config/env.js';
import { jsonError } from '@/lib/http.js';

export async function GET(request, { params }) {
  try {
    const { serviceId } = await params;
    if (env.skipDatabaseBootstrap) return jsonSuccess([]);
    await ensureDbReady();
    const data = await mediaService.listMediaForService(Number(serviceId));
    return jsonSuccess(data);
  } catch (e) {
    return handleRouteError(e);
  }
}
