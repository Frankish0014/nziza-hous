import { env } from './env.js';
import { query } from './db.js';

function printConnectionHelp() {
  const target = env.db.databaseUrl?.trim()
    ? 'configured Postgres URL (POSTGRES_URL / DATABASE_URL / LOCAL_POSTGRES_URL)'
    : `${env.db.host}:${env.db.port} / database "${env.db.database}"`;

  console.error(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PostgreSQL is not reachable at ${target}

  Fix one of these:

  • Hosting (Vercel Postgres, Neon, etc.): set POSTGRES_URL or DATABASE_URL — same string works with \`pg\`.
  • Local dev: LOCAL_POSTGRES_URL or DATABASE_URL in web/.env.local (see lib/server/config/pickDatabaseUrl.js for order).

  • Windows installer: https://www.postgresql.org/download/windows/
    Create database nziza_house → set DB_USER / DB_PASSWORD in web/.env.local

  • Docker (if installed): from repo root run  npm run db:up

  Catalog-only demo (no DB): CATALOG_SOURCE=json — serves GET /services from data/catalog.fallback.json
  (bookings/auth still need Postgres).

  Test:  cd backend && npm run db:check  (legacy) or connect with web/.env.local + npm run dev -w web
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

/**
 * In development, retry until Postgres is up (e.g. you start the service after the API).
 * In production, single attempt unless DB_CONNECT_RETRIES is set.
 */
export async function waitForDatabase() {
  const max = env.dbConnectRetries;
  const delayMs = env.dbConnectDelayMs;
  let lastErr;

  for (let attempt = 1; attempt <= max; attempt += 1) {
    try {
      await query('SELECT 1');
      if (attempt > 1) {
        console.log(`[db] Connected on attempt ${attempt}/${max}`);
      }
      return;
    } catch (err) {
      lastErr = err;
      const hostLabel = env.db.databaseUrl?.trim()
        ? 'Postgres URL'
        : `${env.db.host}:${env.db.port}`;
      console.warn(
        `[db] PostgreSQL not reachable (${hostLabel}) — attempt ${attempt}/${max}${
          attempt < max ? ` · next retry in ${delayMs}ms` : ''
        }`,
      );
      if (attempt < max) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }

  printConnectionHelp();
  throw lastErr ?? new Error('Database connection failed');
}
