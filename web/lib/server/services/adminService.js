import { query } from '../config/db.js';
import { listUsers } from '../repositories/userRepository.js';

export const getAnalytics = async () => {
  const [
    bookings,
    bookingsPending,
    services,
    servicesActive,
    users,
    messages,
    messagesRecent,
  ] = await Promise.all([
    query('SELECT COUNT(*)::int AS count FROM bookings'),
    query(`SELECT COUNT(*)::int AS count FROM bookings WHERE status = 'pending'`),
    query('SELECT COUNT(*)::int AS count FROM services'),
    query('SELECT COUNT(*)::int AS count FROM services WHERE is_active = TRUE'),
    query('SELECT COUNT(*)::int AS count FROM users'),
    query('SELECT COUNT(*)::int AS count FROM messages'),
    query(
      `SELECT COUNT(*)::int AS count FROM messages WHERE created_at > NOW() - INTERVAL '7 days'`,
    ),
  ]);

  return {
    bookings: bookings.rows[0].count,
    bookingsPending: bookingsPending.rows[0].count,
    services: services.rows[0].count,
    servicesActive: servicesActive.rows[0].count,
    users: users.rows[0].count,
    messages: messages.rows[0].count,
    messagesLast7Days: messagesRecent.rows[0].count,
  };
};

export const getUsers = () => listUsers();

