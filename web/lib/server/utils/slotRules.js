/** Venue-local calendar + slot timing for availability and validation. */

export function venueCalendarDate(now, timeZone) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function minutesSinceMidnightInTimeZone(now, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    hourCycle: 'h23',
  }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const m = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  return h * 60 + m;
}

/** End time of slot "HH:MM-HH:MM" as minutes from midnight (venue-local comparison is done with wall-clock on the booking date). */
export function slotEndMinutes(slot) {
  const endPart = (slot || '').split('-')[1]?.trim() || '';
  const [h, mm = '0'] = endPart.split(':');
  const hv = Number(h);
  const mv = Number(mm);
  if (Number.isNaN(hv)) return 0;
  return hv * 60 + (Number.isNaN(mv) ? 0 : mv);
}

/** True when the slot window has ended in the venue timezone for that calendar day. */
export function isSlotPastForVenueDate(dateISO, slot, now, timeZone) {
  if (!dateISO || !slot) return true;
  const today = venueCalendarDate(now, timeZone);
  if (dateISO < today) return true;
  if (dateISO > today) return false;
  return minutesSinceMidnightInTimeZone(now, timeZone) >= slotEndMinutes(slot);
}

export function addCalendarDays(isoDate, days) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}
