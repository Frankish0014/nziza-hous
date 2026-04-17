import * as authService from '@/lib/server/services/authService.js';
import { loginSchema } from '@/lib/server/validations/authValidation.js';
import { validateRequest, jsonSuccess, jsonError } from '@/lib/http.js';
import { handleRouteError } from '@/lib/handleRouteError.js';
import { ensureDbReady } from '@/lib/server/ensureDb.js';
import { env } from '@/lib/server/config/env.js';

export async function POST(request) {
  try {
    if (env.skipDatabaseBootstrap) {
      return jsonError('Database is not configured for this deployment', 503);
    }
    await ensureDbReady();
    const body = await request.json();
    const err = await validateRequest(loginSchema, { body });
    if (err) return err;
    const result = await authService.login(body);
    return jsonSuccess(result, 'Login successful');
  } catch (e) {
    return handleRouteError(e);
  }
}
