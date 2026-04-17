import { TIME_SLOTS } from '../utils/timeSlots.js';
import * as serviceRepository from '../repositories/serviceRepository.js';
import * as bookingRepository from '../repositories/bookingRepository.js';
import {
  venueCalendarDate,
  isSlotPastForVenueDate,
  addCalendarDays,
} from '../utils/slotRules.js';
import { env } from '../config/env.js';

const formatISODate = (d) => d.toISOString().slice(0, 10);

const parseISODate = (s) => {
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

function buildDaySlots(date, bookedSet, now, timeZone) {
  return TIME_SLOTS.map((slot) => ({
    slot,
    booked: bookedSet.has(slot),
    past: isSlotPastForVenueDate(date, slot, now, timeZone),
  }));
}

export const getAvailability = async ({ serviceId, from, to }) => {
  const service = await serviceRepository.getServiceById(Number(serviceId));
  if (!service || service.is_active === false) {
    const err = new Error('Service not found');
    err.status = 404;
    throw err;
  }

  const tz = env.bookingTimeZone;
  const now = new Date();
  const defaultFrom = venueCalendarDate(now, tz);
  const defaultTo = addCalendarDays(defaultFrom, 14);

  const fromISO = from || defaultFrom;
  const toISO = to || defaultTo;

  const dates = dateRange(fromISO, toISO);
  const bookedMap = await bookingRepository.listBookedSlotsByServiceAndDates({
    serviceId: Number(serviceId),
    dates,
  });

  const data = dates.map((date) => {
    const booked = bookedMap.get(date) || new Set();
    return { date, slots: buildDaySlots(date, booked, now, tz) };
  });

  return {
    serviceId: Number(serviceId),
    from: fromISO,
    to: toISO,
    timezone: tz,
    data,
  };
};
