import { TIME_SLOTS } from '../utils/timeSlots.js';
import * as serviceRepository from '../repositories/serviceRepository.js';
import * as bookingRepository from '../repositories/bookingRepository.js';

const formatISODate = (d) => d.toISOString().slice(0, 10);

const parseISODate = (s) => {
  // Expect YYYY-MM-DD
  const [y, m, day] = s.split('-').map((x) => Number(x));
  const dt = new Date(Date.UTC(y, m - 1, day));
  return dt;
};

const dateRange = (fromISO, toISO) => {
  const start = parseISODate(fromISO);
  const end = parseISODate(toISO);
  const out = [];
  for (let dt = new Date(start); dt <= end; dt.setUTCDate(dt.getUTCDate() + 1)) {
    out.push(formatISODate(dt));
  }
  return out;
};

export const getAvailability = async ({ serviceId, from, to }) => {
  const service = await serviceRepository.getServiceById(Number(serviceId));
  if (!service || service.is_active === false) {
    const err = new Error('Service not found');
    err.status = 404;
    throw err;
  }

  const today = new Date();
  const defaultFrom = formatISODate(today);
  const defaultTo = formatISODate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000));

  const fromISO = from || defaultFrom;
  const toISO = to || defaultTo;

  const dates = dateRange(fromISO, toISO);
  const bookedMap = await bookingRepository.listBookedSlotsByServiceAndDates({
    serviceId: Number(serviceId),
    dates,
  });

  const data = dates
    .map((date) => {
      const booked = bookedMap.get(date) || new Set();
      const availableSlots = TIME_SLOTS.filter((slot) => !booked.has(slot));
      return availableSlots.length ? { date, slots: availableSlots } : null;
    })
    .filter(Boolean);

  return {
    serviceId: Number(serviceId),
    from: fromISO,
    to: toISO,
    data,
  };
};

