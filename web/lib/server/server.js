import http from 'node:http';
import app from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';
import { waitForDatabase } from './config/waitForDatabase.js';
import { initDb } from './data/initDb.js';

const start = async () => {
  try {
    if (env.skipDatabaseBootstrap) {
      console.warn(
        '[api] CATALOG_SOURCE=json — catalog is read from data/catalog.fallback.json. ' +
          'Bookings, auth, and admin require PostgreSQL; unset CATALOG_SOURCE for full mode.',
      );
      if (env.db.databaseUrl) {
        console.warn(
          '[api] A Postgres URL is set but initDb was skipped — remove CATALOG_SOURCE=json to run migrations.',
        );
      }
    } else {
      await waitForDatabase();
      await initDb();
    }
    const server = http.createServer(app);
    server.listen(env.port, () => {
      console.log(`Nziza House API running on port ${env.port}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received, closing server…`);
      server.close(async () => {
        await pool.end();
        process.exit(0);
      });
      setTimeout(() => process.exit(1), 12_000).unref();
    };

    process.on('SIGTERM', () => void shutdown('SIGTERM'));
    process.on('SIGINT', () => void shutdown('SIGINT'));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();

