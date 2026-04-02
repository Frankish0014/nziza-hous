import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const result = spawnSync('docker', ['compose', 'logs', '-f', 'db'], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: process.env,
});

if (result.error?.code === 'ENOENT') {
  // eslint-disable-next-line no-console
  console.error('Docker not found. Cannot tail compose logs.');
  process.exit(1);
}

if (result.error) throw result.error;
process.exit(result.status ?? 1);
