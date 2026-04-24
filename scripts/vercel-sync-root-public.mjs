/**
 * Vercel sometimes validates a root-level `public/` output folder (static / "Other" preset).
 * The Next app lives under `web/` with assets in `web/public`. When VERCEL=1, mirror those
 * files to `./public` at the repo root so that check passes. Framework should still be Next.js
 * so routes and API handlers deploy correctly.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = path.join(root, 'web', 'public');
const dest = path.join(root, 'public');

if (!process.env.VERCEL) {
  process.exit(0);
}

if (!fs.existsSync(src)) {
  console.warn('vercel-sync-root-public: web/public not found, skipping');
  process.exit(0);
}

fs.mkdirSync(dest, { recursive: true });
fs.cpSync(src, dest, { recursive: true });
console.log('vercel-sync-root-public: copied web/public -> public (repo root)');
