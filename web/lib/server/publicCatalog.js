import { loadFallbackCatalog } from './data/fallbackCatalog.js';
import { ensureDbReady } from './ensureDb.js';
import { env } from './config/env.js';
import * as serviceRepository from './repositories/serviceRepository.js';

/**
 * Public GET /services — prefers Postgres when available; otherwise static JSON so the site keeps working.
 */
export async function listServicesForRequest() {
  let rows = [];
  try {
    if (!env.skipDatabaseBootstrap) await ensureDbReady();
    rows = await serviceRepository.listServices();
  } catch (err) {
    console.warn(
      '[nziza] Services catalog: database unavailable — using data/catalog.fallback.json.',
      err?.message || err,
    );
    return loadFallbackCatalog();
  }
  if (Array.isArray(rows) && rows.length > 0) return rows;
  return loadFallbackCatalog();
}

/**
 * Public GET /services/:id — same resilience as list.
 */
export async function getServiceByIdForRequest(id) {
  const numId = Number(id);
  try {
    if (!env.skipDatabaseBootstrap) await ensureDbReady();
    const row = await serviceRepository.getServiceById(numId);
    if (row) return row;
  } catch (err) {
    console.warn(
      '[nziza] Service detail: database unavailable for id',
      id,
      '— using static catalog.',
      err?.message || err,
    );
    const catalog = await loadFallbackCatalog();
    return catalog.find((s) => Number(s.id) === numId) || null;
  }
  const catalog = await loadFallbackCatalog();
  return catalog.find((s) => Number(s.id) === numId) || null;
}
