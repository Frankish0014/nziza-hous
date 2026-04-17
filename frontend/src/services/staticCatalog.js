import { TIME_SLOTS } from '../lib/bookingTimeSlots.js';

export const isStaticCatalogMode = () => import.meta.env.VITE_USE_STATIC_CATALOG === 'true';

let cache = null;

export async function fetchStaticCatalog() {
  if (cache) return cache;
  const base = import.meta.env.BASE_URL || '/';
  const url = `${base.endsWith('/') ? base : `${base}/`}catalog.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Missing catalog (${res.status}). Add frontend/public/catalog.json`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('catalog.json must be a JSON array');
  cache = data;
  return cache;
}

function dateRangeISO(fromStr, toStr) {
  const out = [];
  const start = new Date(`${fromStr}T00:00:00Z`);
  const end = new Date(`${toStr}T00:00:00Z`);
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

/** Same shape as backend serviceAvailabilityService response inner payload. */
export function staticAvailabilityPayload(serviceId, from, to) {
  const today = new Date();
  const defaultFrom = from || today.toISOString().slice(0, 10);
  const t2 = new Date(today.getTime() + 14 * 86400000);
  const defaultTo = to || t2.toISOString().slice(0, 10);
  const dates = dateRangeISO(defaultFrom, defaultTo);
  const data = dates.map((date) => ({
    date,
    slots: [...TIME_SLOTS],
  }));
  return {
    serviceId: Number(serviceId),
    from: defaultFrom,
    to: defaultTo,
    data,
  };
}
