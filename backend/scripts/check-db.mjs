/**
 * Quick test: can we reach PostgreSQL with current backend/.env?
 * Run from backend folder: npm run db:check
 */
import { env } from '../src/config/env.js';
import { pool } from '../src/config/db.js';

function connectionTargetLabel() {
  const url = env.db.databaseUrl?.trim();
  if (url) {
    try {
      const u = new URL(url);
      return `${u.hostname}:${u.port || 5432} (from DATABASE_URL)`;
    } catch {
      return 'DATABASE_URL (could not parse as URL)';
    }
  }
  return `${env.db.host}:${env.db.port} / db "${env.db.database}"`;
}

function isTimeoutLike(err) {
  if (!err) return false;
  if (err.code === 'ETIMEDOUT' || err.code === 'ECONNABORTED') return true;
  if (err.message && /ETIMEDOUT|ECONNABORTED|timeout/i.test(err.message)) return true;
  if (Array.isArray(err.errors)) {
    return err.errors.some((e) => e?.code === 'ETIMEDOUT' || e?.code === 'ECONNABORTED');
  }
  return false;
}

function printTimeoutHelp() {
  const url = env.db.databaseUrl?.trim();
  let host = '';
  try {
    if (url) host = new URL(url).hostname;
  } catch {
    /* ignore */
  }
  const onPooler = host.includes('-pooler');

  const neonLines = onPooler
    ? [
        '  • Your DATABASE_URL already uses a Neon pooler host (-pooler).',
        '    Timeouts here usually mean this network blocks or drops outbound TCP port 5432 (try no-VPN / hotspot).',
      ]
    : [
        '  • Neon dashboard → Connection details → try the "Pooled" string (host often contains "-pooler").',
      ];

  // eslint-disable-next-line no-console
  console.error(`
Target: ${connectionTargetLabel()}

This is a network reachability problem: nothing answered on PostgreSQL port 5432 in time.

Try, in order:
  • Disconnect VPN / use phone hotspot / another Wi‑Fi — many networks block outbound 5432.
${neonLines.join('\n')}
  • Neon: confirm project is active (not paused) and IP allowlist (if enabled) includes your network.
  • Install Postgres on this PC (or Docker), set DB_HOST=127.0.0.1 and DB_* in .env — avoids cloud port 5432.

Windows: if DATABASE_URL is set in System Environment Variables, that value wins over .env
(dotenv does not override existing vars). Remove it there if you want .env to apply.
`);
}

try {
  const r = await pool.query('SELECT current_database() AS db, NOW() AS t');
  const row = r.rows[0];
  // eslint-disable-next-line no-console
  console.log(`OK — connected to database "${row.db}" (${row.t.toISOString?.() || row.t})`);
  await pool.end();
  process.exit(0);
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('FAILED —', e.message || e);
  if (isTimeoutLike(e)) {
    printTimeoutHelp();
  } else {
    // eslint-disable-next-line no-console
    console.error(`
Target: ${connectionTargetLabel()}

Fix DATABASE_URL (Neon / Supabase) or local DB_* in backend/.env, then run this again.
`);
  }
  await pool.end().catch(() => {});
  process.exit(1);
}
