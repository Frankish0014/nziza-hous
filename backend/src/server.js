import app from './app.js';
import { env } from './config/env.js';
import { initDb } from './data/initDb.js';

const start = async () => {
  try {
    await initDb();
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Nziza House API running on port ${env.port}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();

