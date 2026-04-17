/**
 * Postgres connection string resolution (same wire protocol everywhere: `pg`, Vercel Postgres, Neon, etc.).
 *
 * - Production (typical): Vercel / some hosts inject POSTGRES_URL — prefer that first.
 * - Local: prefer LOCAL_POSTGRES_URL or DATABASE_URL so a dev .env wins over a stray POSTGRES_URL.
 */
export function pickDatabaseUrl(nodeEnv = process.env.NODE_ENV || 'development') {
  const prod = nodeEnv === 'production';
  const candidates = prod
    ? [process.env.POSTGRES_URL, process.env.DATABASE_URL, process.env.LOCAL_POSTGRES_URL]
    : [process.env.LOCAL_POSTGRES_URL, process.env.DATABASE_URL, process.env.POSTGRES_URL];

  for (const u of candidates) {
    const s = typeof u === 'string' ? u.trim() : '';
    if (s) return s;
  }
  return '';
}
