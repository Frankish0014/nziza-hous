import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Next.js bundles server code; `import.meta.url` may not sit under `web/`. Prefer cwd-based paths
 * so GET /services can always read `data/catalog.fallback.json` on Vercel (Root Directory `web`).
 */
function resolveDefaultCatalogPath() {
  const candidates = [
    path.join(process.cwd(), 'data', 'catalog.fallback.json'),
    path.join(process.cwd(), 'web', 'data', 'catalog.fallback.json'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  const legacy = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'data', 'catalog.fallback.json');
  if (fs.existsSync(legacy)) return legacy;
  throw new Error(
    `catalog.fallback.json not found (cwd=${process.cwd()}). Tried: ${[...candidates, legacy].join(' | ')}`,
  );
}

/**
 * @param {string} [filePath]
 * @returns {Promise<object[]>} rows shaped like listServices (includes media array)
 */
export async function loadFallbackCatalog(filePath) {
  const resolved = filePath || resolveDefaultCatalogPath();
  const raw = await fs.promises.readFile(resolved, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    throw new Error('catalog.fallback.json must contain a JSON array of services');
  }
  return data;
}
