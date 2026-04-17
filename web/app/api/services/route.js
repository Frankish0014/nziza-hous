import * as serviceService from '@/lib/server/services/serviceService.js';
import { createServiceSchema } from '@/lib/server/validations/serviceValidation.js';
import { validateRequest, jsonSuccess, jsonError } from '@/lib/http.js';
import { handleRouteError } from '@/lib/handleRouteError.js';
import { requireAuth } from '@/lib/auth-api.js';
import { ensureDbReady } from '@/lib/server/ensureDb.js';
import { env } from '@/lib/server/config/env.js';
import { listServicesForRequest } from '@/lib/server/publicCatalog.js';

export async function GET() {
  try {
    const data = await listServicesForRequest();
    return jsonSuccess(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request) {
  try {
    const denied = requireAuth(request, ['admin']);
    if (denied instanceof Response) return denied;
    if (env.skipDatabaseBootstrap) {
      return jsonError('Catalog is read-only without a database', 501);
    }
    await ensureDbReady();
    const body = await request.json();
    const err = await validateRequest(createServiceSchema, { body });
    if (err) return err;
    const data = await serviceService.createService(body);
    return jsonSuccess(data, 'Service created', 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
