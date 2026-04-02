import pkg from 'pg';
import { env } from './env.js';

const { Pool } = pkg;

/**
 * Avoid Node/pg "sslmode=require" deprecation noise with Neon & similar hosts.
 * @see https://github.com/brianc/node-postgres/issues
 */
function normalizeDatabaseUrl(url) {
  const s = url?.trim();
  if (!s) return s;
  if (/uselibpqcompat\s*=/i.test(s)) return s;
  if (!/sslmode=require/i.test(s)) return s;
  return s.includes('?') ? `${s}&uselibpqcompat=true` : `${s}?uselibpqcompat=true`;
}

const useUrl = Boolean(env.db.databaseUrl?.trim());

const poolConfig = useUrl
  ? {
      connectionString: normalizeDatabaseUrl(env.db.databaseUrl),
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      database: env.db.database,
      ...(env.db.useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    };

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Unexpected PG pool error', err);
});

export const query = (text, params) => pool.query(text, params);
