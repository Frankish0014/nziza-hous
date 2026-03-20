import { query } from '../config/db.js';

export const createBooking = async ({
  userId,
  serviceId,
  fullName,
  email,
  phone,
  bookingDate,
  timeSlot,
  paymentMethod,
  paymentProofUrl,
  notes,
}) => {
  const { rows } = await query(
    `INSERT INTO bookings
       (user_id, service_id, full_name, email, phone, booking_date, time_slot, payment_method, payment_proof_url, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [userId || null, serviceId, fullName || null, email || null, phone || null, bookingDate, timeSlot, paymentMethod || null, paymentProofUrl || null, notes || null],
  );
  return rows[0];
};

export const listBookings = async () => {
  const { rows } = await query(
    `SELECT b.*, u.name AS user_name, u.email AS user_email,
            s.name AS service_name, s.type AS service_type
     FROM bookings b
     JOIN users u ON u.id = b.user_id
     JOIN services s ON s.id = b.service_id
     ORDER BY b.created_at DESC`,
  );
  return rows;
};

export const listBookingsForUser = async (userId) => {
  const { rows } = await query(
    `SELECT b.*, s.name AS service_name, s.type AS service_type
     FROM bookings b
     JOIN services s ON s.id = b.service_id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [userId],
  );
  return rows;
};

export const listBookingsByEmail = async (email) => {
  const { rows } = await query(
    `SELECT b.*, s.name AS service_name, s.type AS service_type
     FROM bookings b
     JOIN services s ON s.id = b.service_id
     WHERE b.email = $1
     ORDER BY b.created_at DESC`,
    [email],
  );
  return rows;
};

export const listBookedSlotsByServiceAndDates = async ({ serviceId, dates }) => {
  const { rows } = await query(
    `SELECT booking_date, time_slot
     FROM bookings
     WHERE service_id = $1
       AND booking_date = ANY($2::date[])
       AND status IN ('pending', 'confirmed')`,
    [serviceId, dates],
  );

  const map = new Map();
  for (const r of rows) {
    const dateKey = r.booking_date.toISOString().slice(0, 10);
    if (!map.has(dateKey)) map.set(dateKey, new Set());
    map.get(dateKey).add(r.time_slot);
  }
  return map; // Map<YYYY-MM-DD, Set<time_slot>>
};

export const updateBookingStatus = async (id, status) => {
  const { rows } = await query(
    `UPDATE bookings
     SET status = $2
     WHERE id = $1
     RETURNING *`,
    [id, status],
  );
  return rows[0] || null;
};

