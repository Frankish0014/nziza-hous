import { query } from '../config/db.js';

export const findByEmail = async (email) => {
  const { rows } = await query(
    `SELECT u.id, u.name, u.email, u.password_hash, r.name AS role
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.email = $1`,
    [email],
  );
  return rows[0] || null;
};

export const createUser = async ({ name, email, passwordHash, roleName }) => {
  const roleRes = await query('SELECT id FROM roles WHERE name = $1', [roleName]);
  const role = roleRes.rows[0];
  if (!role) {
    throw new Error(`Role ${roleName} not found`);
  }
  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash, role_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email`,
    [name, email, passwordHash, role.id],
  );
  return rows[0];
};

export const listUsers = async () => {
  const { rows } = await query(
    `SELECT u.id, u.name, u.email, r.name AS role, u.created_at
     FROM users u
     JOIN roles r ON u.role_id = r.id
     ORDER BY u.created_at DESC`,
  );
  return rows;
};

