import dotenv from 'dotenv';

dotenv.config();

const parseOrigins = (raw) => {
  if (!raw || raw === '*') return true;
  const list = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (list.includes('*')) return true;
  return list;
};

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  fromEmail: process.env.FROM_EMAIL || 'no-reply@nzizahouse.com',
  adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'bookings@nzizahouse.com',
  /** Base URL of this API (no trailing slash), e.g. https://api.example.com — used for upload URLs behind proxies */
  publicBaseUrl: process.env.PUBLIC_BASE_URL || '',
  trustProxy: process.env.TRUST_PROXY === 'true' || process.env.TRUST_PROXY === '1',
  /** Comma-separated origins or *. When unset, all origins are allowed (set in production). */
  corsOrigin:
    process.env.CORS_ORIGIN !== undefined && String(process.env.CORS_ORIGIN).trim() !== ''
      ? parseOrigins(process.env.CORS_ORIGIN)
      : true,
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  db: {
    /** Full URL (Neon, Supabase, Railway). When set, host/user/password/database are ignored. */
    databaseUrl: process.env.DATABASE_URL || '',
    // Prefer 127.0.0.1 on Windows dev: avoids IPv6 (::1) when Postgres is Docker-mapped
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'nziza_house',
    /** Set true if connecting to local discrete vars but server requires SSL (rare). */
    useSsl: process.env.DB_SSL === 'true' || process.env.DB_SSL === '1',
  },
  /** Optional one-time admin seed (development / first deploy). Requires both values. */
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL || '',
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || '',
  seedAdminName: process.env.SEED_ADMIN_NAME || 'Platform Admin',
  /** Dev: retry connecting to Postgres this many times (waits for DB to start). Prod: 1 unless overridden. */
  dbConnectRetries:
    process.env.NODE_ENV === 'production'
      ? Math.max(1, Number(process.env.DB_CONNECT_RETRIES || 1))
      : Math.max(1, Number(process.env.DB_CONNECT_RETRIES || 30)),
  dbConnectDelayMs: Math.max(500, Number(process.env.DB_CONNECT_DELAY_MS || 2000)),
};

