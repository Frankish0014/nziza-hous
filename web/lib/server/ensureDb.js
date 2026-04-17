import { env } from './config/env.js';
import { waitForDatabase } from './config/waitForDatabase.js';
import { initDb } from './data/initDb.js';

let ready;

export async function ensureDbReady() {
  if (env.skipDatabaseBootstrap) return;
  if (!ready) {
    ready = (async () => {
      await waitForDatabase();
      await initDb();
    })();
  }
  await ready;
}
