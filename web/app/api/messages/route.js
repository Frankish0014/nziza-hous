import * as messageService from '@/lib/server/services/messageService.js';
import { createMessageSchema } from '@/lib/server/validations/messageValidation.js';
import { validateRequest, jsonSuccess, jsonError } from '@/lib/http.js';
import { handleRouteError } from '@/lib/handleRouteError.js';
import { requireAuth } from '@/lib/auth-api.js';
import { ensureDbReady } from '@/lib/server/ensureDb.js';
import { env } from '@/lib/server/config/env.js';

export async function POST(request) {
  try {
    if (env.skipDatabaseBootstrap) {
      return jsonError('Database is not configured', 503);
    }
    await ensureDbReady();
    const body = await request.json();
    const err = await validateRequest(createMessageSchema, { body });
    if (err) return err;
    const data = await messageService.createMessage(body);
    return jsonSuccess(data, 'Message submitted', 201);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function GET(request) {
  try {
    const denied = requireAuth(request, ['admin']);
    if (denied instanceof Response) return denied;
    if (env.skipDatabaseBootstrap) return jsonError('Database is not configured', 503);
    await ensureDbReady();
    const data = await messageService.listMessages();
    return jsonSuccess(data);
  } catch (e) {
    return handleRouteError(e);
  }
}
