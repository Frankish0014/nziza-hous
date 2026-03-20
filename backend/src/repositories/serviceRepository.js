import { query } from '../config/db.js';

export const createService = async (payload) => {
  const { type, name, description, price, currency, isActive } = payload;
  const { rows } = await query(
    `INSERT INTO services (type, name, description, price, currency, is_active)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [type, name, description, price, currency || 'USD', isActive ?? true],
  );
  return rows[0];
};

export const updateService = async (id, payload) => {
  const { type, name, description, price, currency, isActive } = payload;
  const { rows } = await query(
    `UPDATE services
     SET type = COALESCE($2, type),
         name = COALESCE($3, name),
         description = COALESCE($4, description),
         price = COALESCE($5, price),
         currency = COALESCE($6, currency),
         is_active = COALESCE($7, is_active)
     WHERE id = $1
     RETURNING *`,
    [id, type, name, description, price, currency, isActive],
  );
  return rows[0] || null;
};

export const deleteService = async (id) => {
  await query('DELETE FROM services WHERE id = $1', [id]);
};

export const listServices = async () => {
  const { rows } = await query(
    `SELECT s.*, COALESCE(json_agg(m.*) FILTER (WHERE m.id IS NOT NULL), '[]') AS media
     FROM services s
     LEFT JOIN media m ON m.service_id = s.id
     WHERE s.is_active = TRUE
     GROUP BY s.id
     ORDER BY s.created_at DESC`,
  );
  return rows;
};

export const getServiceById = async (id) => {
  const { rows } = await query(
    `SELECT s.*, COALESCE(json_agg(m.*) FILTER (WHERE m.id IS NOT NULL), '[]') AS media
     FROM services s
     LEFT JOIN media m ON m.service_id = s.id
     WHERE s.id = $1
     GROUP BY s.id`,
    [id],
  );
  return rows[0] || null;
};

