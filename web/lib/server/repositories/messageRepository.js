import { query } from '../config/db.js';

export const createMessage = async ({ name, email, message }) => {
  const { rows } = await query(
    `INSERT INTO messages (name, email, message)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, email, message],
  );
  return rows[0];
};

export const listMessages = async () => {
  const { rows } = await query('SELECT * FROM messages ORDER BY created_at DESC');
  return rows;
};

