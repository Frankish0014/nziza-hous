import { query } from '../config/db.js';
import { env } from '../config/env.js';
import { successResponse } from '../utils/apiResponse.js';

const startedAt = Date.now();

export const getHealth = async (req, res) => {
  if (env.skipDatabaseBootstrap) {
    return successResponse(res, {
      ok: true,
      database: 'skipped',
      catalog: 'json',
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    });
  }

  try {
    await query('SELECT 1');
    return successResponse(res, {
      ok: true,
      database: 'up',
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    });
  } catch {
    return res.status(503).json({
      success: false,
      message: 'Database unavailable',
      data: { ok: false, database: 'down' },
    });
  }
};
