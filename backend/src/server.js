import http from 'node:http';
import app from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';
import { waitForDatabase } from './config/waitForDatabase.js';
import { initDb } from './data/initDb.js';

const start = async () => {
  try {
    await waitForDatabase();
    await initDb();
    const server = http.createServer(app);
    server.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Nziza House API running on port ${env.port}`);
    });

    const shutdown = async (signal) => {
      // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();

