import { env } from './env.js';
import { query } from './db.js';

function printConnectionHelp() {
  const target = env.db.databaseUrl?.trim()
    ? 'DATABASE_URL (cloud)'
    : `${env.db.host}:${env.db.port} / database "${env.db.database}"`;

  // eslint-disable-next-line no-console
  console.error(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PostgreSQL is not reachable at ${target}

  Fix one of these:

  • Cloud (no local install): https://neon.tech
    Create a project → copy the connection string → in backend/.env add:
    DATABASE_URL=postgresql://USER:PASSWORD@ep-....neon.tech/neondb?sslmode=require
    (Comment out or remove conflicting DB_HOST / DB_NAME lines if the URL includes them.)

  • Windows installer: https://www.postgresql.org/download/windows/
    Create database nziza_house → set DB_USER / DB_PASSWORD in backend/.env

  • Docker (if installed): from repo root run  npm run db:up

  Test:  cd backend && npm run db:check
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
        // eslint-disable-next-line no-console
        console.log(`[db] Connected on attempt ${attempt}/${max}`);
      }
      return;
    } catch (err) {
      lastErr = err;
      const hostLabel = env.db.databaseUrl?.trim() ? 'DATABASE_URL' : `${env.db.host}:${env.db.port}`;
      // eslint-disable-next-line no-console
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
