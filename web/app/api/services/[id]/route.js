import * as serviceService from '@/lib/server/services/serviceService.js';
import { updateServiceSchema } from '@/lib/server/validations/serviceValidation.js';
import { validateRequest, jsonSuccess, jsonError } from '@/lib/http.js';
import { handleRouteError } from '@/lib/handleRouteError.js';
import { requireAuth } from '@/lib/auth-api.js';
import { ensureDbReady } from '@/lib/server/ensureDb.js';
import { env } from '@/lib/server/config/env.js';
import { getServiceByIdForRequest } from '@/lib/server/publicCatalog.js';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const data = await getServiceByIdForRequest(id);
    if (!data) return jsonError('Service not found', 404);
    return jsonSuccess(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PUT(request, { params }) {
  try {
    const { id: idParam } = await params;
    const denied = requireAuth(request, ['admin']);
    if (denied instanceof Response) return denied;
    if (env.skipDatabaseBootstrap) return jsonError('Catalog is read-only', 501);
    await ensureDbReady();
    const id = Number(idParam);
    const body = await request.json();
    const err = await validateRequest(updateServiceSchema, {
      params: { id },
      body,
    });
    if (err) return err;
    const data = await serviceService.updateService(id, body);
    if (!data) return jsonError('Service not found', 404);
    return jsonSuccess(data, 'Service updated');
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: idParam } = await params;
    const denied = requireAuth(request, ['admin']);
    if (denied instanceof Response) return denied;
    if (env.skipDatabaseBootstrap) return jsonError('Catalog is read-only', 501);
    await ensureDbReady();
    const id = Number(idParam);
    await serviceService.deleteService(id);
    return jsonSuccess(null, 'Service deleted');
  } catch (e) {
    return handleRouteError(e);
  }
}
