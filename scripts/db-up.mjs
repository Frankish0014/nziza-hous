import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const isWin = process.platform === 'win32';

function printHelp() {
  const winExtra = isWin
    ? `
  --- On Windows without Docker (recommended order) ---

  1) Free cloud DB (no install, ~2 minutes)
     • https://neon.tech → New project → copy the connection string
     • In backend/.env add ONE line (quote if password has special chars):
         DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
     • Run: npm run dev:all
     (npm run db:up is not needed.)

  2) PostgreSQL installer
     • https://www.postgresql.org/download/windows/
     • Remember the postgres password; create database nziza_house (pgAdmin)
     • backend/.env:
         DB_HOST=127.0.0.1
         DB_PORT=5432
         DB_USER=postgres
         DB_PASSWORD=<your password>
         DB_NAME=nziza_house
     • Run: npm run dev:all

  Optional: install Docker Desktop if you prefer containers:
     https://docs.docker.com/desktop/install/windows-install/
     Then: npm run db:up

`
    : `
  Quick cloud option (no local install):
     Create a Postgres DB at https://neon.tech or Supabase, set DATABASE_URL in backend/.env
     Then: npm run dev:all

  PostgreSQL locally:
     https://www.postgresql.org/download/
     Set DB_* in backend/.env → npm run dev:all

  Docker:
     https://docs.docker.com/get-docker/ → npm run db:up
`;

  // eslint-disable-next-line no-console
  console.error(`
Docker is not available (not installed or not in your PATH).

You do NOT have to use Docker. The API needs any PostgreSQL database.
${winExtra}
`);
}

const shell = isWin;

const probe = spawnSync('docker', ['--version'], {
  cwd: root,
  encoding: 'utf8',
  shell,
  env: process.env,
});

const probeOut = `${probe.stderr || ''}${probe.stdout || ''}`;
if (probe.error?.code === 'ENOENT' || (probe.status !== 0 && /not recognized|not found|^'docker' /i.test(probeOut))) {
  printHelp();
  process.exit(1);
}

const result = spawnSync('docker', ['compose', 'up', '-d'], {
  cwd: root,
  stdio: 'inherit',
  shell,
  env: process.env,
});

if (result.error) {
  if (result.error.code === 'ENOENT') {
    printHelp();
    process.exit(1);
  }
  throw result.error;
}

process.exit(result.status ?? 1);
