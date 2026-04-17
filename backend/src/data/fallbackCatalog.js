import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const defaultPath = path.join(backendRoot, 'data', 'catalog.fallback.json');

/**
 * @param {string} [filePath]
 * @returns {Promise<object[]>} rows shaped like listServices (includes media array)
 */
export async function loadFallbackCatalog(filePath = defaultPath) {
  const raw = await fs.promises.readFile(filePath, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    throw new Error('catalog.fallback.json must contain a JSON array of services');
  }
  return data;
}
