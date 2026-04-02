import fs from 'node:fs/promises';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';
import { query } from '../config/db.js';
import { createUser, findByEmail } from '../repositories/userRepository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedAdminFromEnv() {
  if (!env.seedAdminEmail || !env.seedAdminPassword) return;
  const existing = await findByEmail(env.seedAdminEmail);
  if (existing) return;
  const passwordHash = await bcrypt.hash(env.seedAdminPassword, 12);
  await createUser({
    name: env.seedAdminName,
    email: env.seedAdminEmail,
    passwordHash,
    roleName: 'admin',
  });
  // eslint-disable-next-line no-console
  console.log(`[db] Seeded admin user: ${env.seedAdminEmail}`);
}

export const initDb = async () => {
  const schemaPath = path.resolve(__dirname, '../models/schema.sql');
  const sql = await fs.readFile(schemaPath, 'utf8');
  await query(sql);

  await query(
    `INSERT INTO roles (name) VALUES ('customer') ON CONFLICT (name) DO NOTHING;
     INSERT INTO roles (name) VALUES ('admin') ON CONFLICT (name) DO NOTHING;`,
  );

  // Backward-compatible booking fields for existing databases
  await query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS full_name VARCHAR(160);`);
  await query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS email VARCHAR(160);`);
  await query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS phone VARCHAR(50);`);
  await query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_method VARCHAR(60);`);
  await query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;`);
  await query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes TEXT;`);
  await query(`CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);`);

  await seedDefaultServicesIfEmpty();
  await seedAdminFromEnv();
};

const DEFAULT_SERVICES = [
  {
    type: 'gym',
    name: 'Wellness Gym',
    description:
      'Premium fitness space with modern equipment and a motivating atmosphere for strength, cardio, and guided training.',
  },
  {
    type: 'apartments',
    name: 'Nziza Apartments',
    description:
      'Short and long-stay apartments with comfort, privacy, and everything you need for a relaxed residential stay.',
  },
  {
    type: 'coffee_shop',
    name: 'Coffee House',
    description:
      'Artisan coffee, fresh bites, and a calm setting ideal for meetings, remote work, or a quiet break.',
  },
  {
    type: 'sauna',
    name: 'Restorative Sauna',
    description:
      'Warm sauna sessions designed for relaxation, recovery, and a full reset for body and mind.',
  },
  {
    type: 'massage',
    name: 'Therapeutic Massage',
    description:
      'Personalized massage therapy to ease tension, reduce stress, and support deep recovery.',
  },
  {
    type: 'lodge',
    name: 'Nziza Lodge',
    description:
      'Serene lodge stays blending hospitality, comfort, and a peaceful escape from the everyday.',
  },
];

async function seedDefaultServicesIfEmpty() {
  const { rows } = await query('SELECT COUNT(*)::int AS c FROM services');
  if (rows[0].c > 0) return;

  for (const s of DEFAULT_SERVICES) {
    await query(
      `INSERT INTO services (type, name, description, price, currency, is_active)
       VALUES ($1, $2, $3, NULL, 'USD', TRUE)`,
      [s.type, s.name, s.description],
    );
  }
  // eslint-disable-next-line no-console
  console.log('[db] Seeded default services (6)');
}

