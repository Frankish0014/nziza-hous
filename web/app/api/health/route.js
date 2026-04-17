import { query } from '@/lib/server/config/db.js';
import { env } from '@/lib/server/config/env.js';
import { ensureDbReady } from '@/lib/server/ensureDb.js';
import { jsonSuccess, jsonError } from '@/lib/http.js';

const startedAt = Date.now();

export async function GET() {
  if (env.skipDatabaseBootstrap) {
    return jsonSuccess({
      ok: true,
      database: 'skipped',
      catalog: 'json',
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    });
  }

  try {
    await ensureDbReady();
    await query('SELECT 1');
    return jsonSuccess({
      ok: true,
      database: 'up',
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    });
  } catch {
    return jsonError('Database unavailable', 503);
  }
}
