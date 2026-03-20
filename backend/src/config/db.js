import pkg from 'pg';
import { env } from './env.js';

const { Pool } = pkg;

export const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
});

pool.on('error', (err) => {
  // Non-fatal: log and let process decide what to do
  // eslint-disable-next-line no-console
  console.error('Unexpected PG pool error', err);
});

export const query = (text, params) => pool.query(text, params);

