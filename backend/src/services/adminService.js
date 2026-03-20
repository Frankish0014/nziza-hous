import { query } from '../config/db.js';
import { listUsers } from '../repositories/userRepository.js';

export const getAnalytics = async () => {
  const [bookings, services, users] = await Promise.all([
    query('SELECT COUNT(*)::int AS count FROM bookings'),
    query('SELECT COUNT(*)::int AS count FROM services'),
    query('SELECT COUNT(*)::int AS count FROM users'),
  ]);

  return {
    bookings: bookings.rows[0].count,
    services: services.rows[0].count,
    users: users.rows[0].count,
  };
};

export const getUsers = () => listUsers();

