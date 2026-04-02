/**
 * Quick test: can we reach PostgreSQL with current backend/.env?
 * Run from backend folder: npm run db:check
 */
import 'dotenv/config';
import { pool } from '../src/config/db.js';

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
  // eslint-disable-next-line no-console
  console.error('\nFix connection (Neon DATABASE_URL or local Postgres), then run this again.\n');
  await pool.end().catch(() => {});
  process.exit(1);
}
