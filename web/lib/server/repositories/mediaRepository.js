import { query } from '../config/db.js';

export const addMedia = async ({ serviceId, url, altText }) => {
  const { rows } = await query(
    `INSERT INTO media (service_id, url, alt_text)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [serviceId, url, altText],
  );
  return rows[0];
};

export const listMediaForService = async (serviceId) => {
  const { rows } = await query('SELECT * FROM media WHERE service_id = $1 ORDER BY created_at DESC', [
    serviceId,
  ]);
  return rows;
};

