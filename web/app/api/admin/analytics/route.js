import * as adminService from '@/lib/server/services/adminService.js';
import { jsonSuccess, jsonError } from '@/lib/http.js';
import { handleRouteError } from '@/lib/handleRouteError.js';
import { requireAuth } from '@/lib/auth-api.js';
import { ensureDbReady } from '@/lib/server/ensureDb.js';
import { env } from '@/lib/server/config/env.js';

export async function GET(request) {
  try {
    const denied = requireAuth(request, ['admin']);
    if (denied instanceof Response) return denied;
    if (env.skipDatabaseBootstrap) return jsonError('Database is not configured', 503);
    await ensureDbReady();
    const data = await adminService.getAnalytics();
    return jsonSuccess(data);
  } catch (e) {
    return handleRouteError(e);
  }
}
