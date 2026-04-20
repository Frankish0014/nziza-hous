'use client';

import { useEffect, useState } from 'react';
import {
  createBooking,
  getBookings,
  getServiceAvailability,
  getServices,
  uploadPaymentProof,
} from '@/services/platformService';
import ScrollReveal from '@/components/ScrollReveal';
import { asArray } from '@/client/asArray';

/** API returns either legacy string[] or { slot, booked, past }[] */
function normalizeSlotsForDay(day) {
  if (!day?.slots?.length) return [];
  const first = day.slots[0];
  if (typeof first === 'string') return day.slots.map((slot) => ({ slot, booked: false, past: false }));
  return day.slots;
}

function bookingSuccessUserMessage(notif, email) {
  if (!notif) return 'Booking submitted successfully.';
  switch (notif.userEmailStatus) {
    case 'sent':
      return `Booking submitted successfully. We've sent a confirmation to ${email} — check your inbox or spam folder.`;
    case 'smtp_off':
      return 'Booking submitted successfully. Email delivery is not set up on the server yet — your booking is saved and our team will follow up.';
    case 'failed':
      if (notif.recipientLikelyInvalid) {
        return 'Booking submitted successfully. That email address could not be reached — your booking is saved; please contact us with another email or phone so we can confirm.';
      }
      return 'Booking submitted successfully. Your booking is saved. If you do not see a confirmation email soon, check spam — or contact us. Our team will still confirm your reservation.';
    default:
      return 'Booking submitted successfully.';
  }
}

const steps = [
  { n: '1', label: 'Select service' },
  { n: '2', label: 'Time & payment' },
  { n: '3', label: 'Confirmation' },
];

const PAYMENT_DETAILS = {
  mobile_money: {
    label: 'Mobile Money (MoMo)',
    accountName: 'Nziza House',
    accountRef: '0788 000 111',
    note: 'Use your booking name as payment reference, then upload screenshot proof.',
  },
  bank_transfer: {
    label: 'Bank Transfer',
    bankName: 'Bank of Kigali',
    accountName: 'Nziza House Ltd',
    accountNumber: '000456789123',
    note: 'Transfer exact amount and upload transfer receipt or PDF slip.',
  },
};

export default function BookingPage() {
  const [services, setServices] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyEmail, setHistoryEmail] = useState('');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [form, setForm] = useState({
    serviceId: '',
    fullName: '',
    email: '',
    phone: '',
    bookingDate: '',
    timeSlot: '',
    paymentMethod: 'mobile_money',
    notes: '',
  });
  const [proofFile, setProofFile] = useState(null);
  const [message, setMessage] = useState('');
  const [availability, setAvailability] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [venueTimezone, setVenueTimezone] = useState('');
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState('');

  const loadServices = async () => {
    setServicesLoading(true);
    setServicesError('');
    try {
      const serviceData = await getServices();
      setServices(asArray(serviceData));
    } catch {
      setServices([]);
      setServicesError(
        'Could not reach the API. For local dev: start PostgreSQL (e.g. npm run db:up from the repo root), set POSTGRES_URL or DATABASE_URL in web/.env.local, then run npm run dev from the web/ folder. ' +
          'Or set CATALOG_SOURCE=json for catalog-only mode.',
      );
    } finally {
      setServicesLoading(false);
    }
  };

  const loadHistory = async (email) => {
    const key = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!key) {
      setHistory([]);
      return;
    }
    setHistoryLoading(true);
    try {
      const bookingData = await getBookings(key);
      setHistory(asArray(bookingData));
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadAvailability = async (serviceId) => {
    if (!serviceId) {
      setAvailability([]);
      setVenueTimezone('');
      setAvailabilityError('');
      setAvailabilityLoading(false);
      return;
    }

    setAvailabilityLoading(true);
    setAvailabilityError('');
    try {
      const resp = await getServiceAvailability(serviceId);
      const next = Array.isArray(resp?.data) ? resp.data : [];
      setVenueTimezone(typeof resp?.timezone === 'string' ? resp.timezone : '');
      setAvailability(next);

      const firstSelectable = next.find((d) => normalizeSlotsForDay(d).some((s) => !s.booked && !s.past));
      const fallbackDate = firstSelectable?.date ?? next[0]?.date ?? '';

      if (!form.bookingDate && next.length) {
        setForm((prev) => ({ ...prev, bookingDate: fallbackDate, timeSlot: '' }));
      } else if (form.bookingDate && !next.some((d) => d.date === form.bookingDate)) {
        setForm((prev) => ({ ...prev, bookingDate: fallbackDate, timeSlot: '' }));
      }
    } catch {
      setAvailability([]);
      setAvailabilityError('Could not load availability. Please try again.');
    } finally {
      setAvailabilityLoading(false);
    }
  };

  useEffect(() => {
    void loadServices();
  }, []);

  const slotRows =
    form.bookingDate && availability.length
      ? normalizeSlotsForDay(availability.find((d) => d.date === form.bookingDate) || { slots: [] })
      : [];

  const hasSelectableSlot = slotRows.some((s) => !s.booked && !s.past);
  const selectedService = services.find((s) => String(s.id) === String(form.serviceId));
  const amountLabel = selectedService?.price ? `${selectedService.currency} ${selectedService.price}` : 'Custom pricing';
  const selectedPaymentDetails = PAYMENT_DETAILS[form.paymentMethod];

  const formatDateLabel = (iso) => {
    const dt = new Date(`${iso}T00:00:00Z`);
    if (Number.isNaN(dt.getTime())) return iso;
    return dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.serviceId || !form.bookingDate || !form.timeSlot) {
      setMessage('Please select a service, date, and time slot.');
      return;
    }
    const chosen = slotRows.find((s) => s.slot === form.timeSlot);
    if (!chosen || chosen.booked || chosen.past) {
      setMessage('Please choose an open time slot (not booked or past).');
      return;
    }
    if (!proofFile) {
      setMessage('Please upload proof of payment before submitting.');
      return;
    }
    try {
      const uploaded = await uploadPaymentProof(proofFile);
      const result = await createBooking({
        ...form,
        serviceId: Number(form.serviceId),
        paymentProofUrl: uploaded.url,
      });
      const notif = result?.emailNotification;
      setMessage(bookingSuccessUserMessage(notif, form.email.trim()));
      setProofFile(null);
      setForm((prev) => ({ ...prev, bookingDate: '', timeSlot: '' }));
      await loadHistory(form.email);
      await loadAvailability(form.serviceId);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not create booking');
    }
  };

  const stepActive = form.serviceId ? (form.bookingDate && form.timeSlot ? 3 : 2) : 1;

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 md:py-20">
      <ScrollReveal>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--nh-accent)]">Reservations</p>
        <h1 className="font-display mt-4 text-4xl font-medium tracking-tight text-[var(--nh-ink)] md:text-5xl">
          Book an experience
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--nh-ink-muted)]">
          Select your venue, choose an available slot, and upload payment proof. Our team confirms every booking personally.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={60} className="mt-10">
        <div className="flex flex-wrap gap-3 rounded-3xl border border-[var(--nh-border)] bg-white/70 p-4 md:gap-6 md:p-5">
          {steps.map((s, i) => {
            const reached = i + 1 <= stepActive;
            return (
              <div key={s.n} className="flex min-w-[140px] flex-1 items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-medium transition ${
                    reached
                      ? 'bg-[var(--nh-deep)] text-[#faf6ef]'
                      : 'border border-[var(--nh-border)] bg-[var(--nh-bg)] text-[var(--nh-ink-muted)]'
                  }`}
                >
                  {s.n}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--nh-ink-muted)]">Step {s.n}</p>
                  <p className="text-sm font-semibold text-[var(--nh-ink)]">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollReveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12">
        <ScrollReveal>
          <section className="glass-panel rounded-[2rem] p-6 md:p-8">
            <h2 className="font-display text-xl font-medium text-[var(--nh-ink)] md:text-2xl">Your details</h2>
            <p className="mt-2 text-sm text-[var(--nh-ink-muted)]">We use this to confirm and reach you if plans shift.</p>

            <form onSubmit={submit} className="mt-8 space-y-4">
              <input
                type="text"
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                className="input-brand"
                required
              />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="input-brand"
                required
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                className="input-brand"
                required
              />

              <div className="rounded-2xl border border-[var(--nh-border)] bg-[var(--nh-bg)]/50 p-4 md:p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--nh-accent)]">Experience</p>
                <label htmlFor="booking-service" className="mt-3 mb-1.5 block text-sm font-medium text-[var(--nh-ink)]">
                  Service
                </label>
                <select
                  id="booking-service"
                  value={form.serviceId}
                  onChange={(e) => {
                    const nextServiceId = e.target.value;
                    setForm((prev) => ({ ...prev, serviceId: nextServiceId, bookingDate: '', timeSlot: '' }));
                    void loadAvailability(nextServiceId);
                  }}
                  className="input-brand"
                  required
                  disabled={servicesLoading || (!services.length && !servicesError)}
                >
                  <option value="">
                    {servicesLoading ? 'Loading services…' : services.length ? 'Select a service' : 'No services available'}
                  </option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                      {service.type ? ` — ${String(service.type).replace('_', ' ')}` : ''}
                    </option>
                  ))}
                </select>
                {servicesError && (
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <p className="text-sm text-red-700">{servicesError}</p>
                    <button
                      type="button"
                      onClick={() => void loadServices()}
                      className="text-sm font-semibold text-[var(--nh-accent)] underline underline-offset-2"
                    >
                      Retry
                    </button>
                  </div>
                )}
                {!servicesLoading && !servicesError && services.length === 0 && (
                  <p className="mt-2 text-sm text-[var(--nh-ink-muted)]">
                    No active services in the database yet. Start the backend with PostgreSQL connected — default services are
                    created automatically on first run.
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="booking-date" className="mb-1.5 block text-sm font-medium text-[var(--nh-ink)]">
                    Date
                  </label>
                  <select
                    id="booking-date"
                    value={form.bookingDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, bookingDate: e.target.value, timeSlot: '' }))}
                    className="input-brand"
                    required
                    disabled={availabilityLoading || !availability.length}
                  >
                    <option value="">
                      {availabilityLoading ? 'Loading availability…' : availability.length ? 'Select a date' : 'No available dates'}
                    </option>
                    {availability.map((d) => (
                      <option key={d.date} value={d.date}>
                        {formatDateLabel(d.date)}
                      </option>
                    ))}
                  </select>
                  {availabilityError && <p className="mt-2 text-sm text-red-700">{availabilityError}</p>}
                </div>
                <div className="md:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium text-[var(--nh-ink)]">Time slot</span>
                  {!form.bookingDate ? (
                    <p className="mt-2 text-sm text-[var(--nh-ink-muted)]">Select a date to see all slots for that day.</p>
                  ) : availabilityLoading ? (
                    <p className="mt-2 text-sm text-[var(--nh-ink-muted)]">Loading slots…</p>
                  ) : !slotRows.length ? (
                    <p className="mt-2 text-sm text-[var(--nh-ink-muted)]">No slot data for this date.</p>
                  ) : (
                    <>
                      <p className="mb-2 text-xs text-[var(--nh-ink-muted)]">
                        Past windows and taken slots are shown but cannot be selected. Slot times use the venue calendar
                        {venueTimezone ? ` (${venueTimezone}).` : '.'}
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                        {slotRows.map(({ slot, booked, past }) => {
                          const blocked = booked || past;
                          const selected = form.timeSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={blocked}
                              onClick={() => setForm((prev) => ({ ...prev, timeSlot: slot }))}
                              className={`relative flex min-h-[3.25rem] flex-col items-start justify-center rounded-xl border px-3 py-2 text-left text-xs font-medium transition ${
                                blocked
                                  ? 'cursor-not-allowed border-[var(--nh-border)] bg-stone-100/80 text-[var(--nh-ink-muted)]'
                                  : selected
                                    ? 'border-[var(--nh-accent)] bg-[var(--nh-accent-soft)] text-[var(--nh-ink)] ring-1 ring-[var(--nh-accent)]/30'
                                    : 'border-[var(--nh-border)] bg-white/90 text-[var(--nh-ink)] hover:border-[var(--nh-accent)]/40'
                              }`}
                            >
                              <span className="font-semibold tracking-tight">{slot}</span>
                              {booked && (
                                <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700">
                                  Booked
                                </span>
                              )}
                              {!booked && past && (
                                <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                                  Past
                                </span>
                              )}
                              {!booked && !past && (
                                <span className="mt-0.5 text-[10px] uppercase tracking-wider text-emerald-800/90">
                                  Available
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {!hasSelectableSlot && (
                        <p className="mt-2 text-sm text-amber-800">No open slots left on this day — pick another date.</p>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--nh-border)] bg-white/60 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--nh-accent)]">Payment preview</p>
                <div className="mt-3 rounded-xl border border-[var(--nh-border)] bg-[var(--nh-bg)]/40 p-3">
                  <p className="text-sm text-[var(--nh-ink-muted)]">Service amount</p>
                  <p className="font-display mt-1 text-2xl text-[var(--nh-ink)]">{amountLabel}</p>
                  {selectedService?.name && <p className="mt-1 text-xs text-[var(--nh-ink-muted)]">{selectedService.name}</p>}
                </div>
                <label htmlFor="booking-pay" className="mb-1.5 block text-sm font-medium text-[var(--nh-ink)]">
                  Payment method
                </label>
                <select
                  id="booking-pay"
                  value={form.paymentMethod}
                  onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                  className="input-brand"
                  required
                >
                  <option value="mobile_money">Mobile Money</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
                {selectedPaymentDetails && (
                  <div className="mt-3 rounded-xl border border-[var(--nh-border)] bg-white/70 p-3 text-sm text-[var(--nh-ink-muted)]">
                    <p className="font-semibold text-[var(--nh-ink)]">{selectedPaymentDetails.label}</p>
                    {'bankName' in selectedPaymentDetails && (
                      <p className="mt-1">
                        Bank: <span className="font-medium text-[var(--nh-ink)]">{selectedPaymentDetails.bankName}</span>
                      </p>
                    )}
                    <p className="mt-1">
                      Account name: <span className="font-medium text-[var(--nh-ink)]">{selectedPaymentDetails.accountName}</span>
                    </p>
                    {'accountNumber' in selectedPaymentDetails ? (
                      <p className="mt-1">
                        Account number:{' '}
                        <span className="font-medium text-[var(--nh-ink)]">{selectedPaymentDetails.accountNumber}</span>
                      </p>
                    ) : (
                      <p className="mt-1">
                        MoMo number: <span className="font-medium text-[var(--nh-ink)]">{selectedPaymentDetails.accountRef}</span>
                      </p>
                    )}
                    <p className="mt-2 text-xs">{selectedPaymentDetails.note}</p>
                  </div>
                )}
                <label htmlFor="booking-proof" className="mt-4 mb-1.5 block text-sm font-medium text-[var(--nh-ink)]">
                  Proof of payment
                </label>
                <input
                  id="booking-proof"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  className="input-brand py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--nh-deep)] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#faf6ef]"
                  required
                />
              </div>

              <textarea
                placeholder="Additional notes (optional)"
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                className="input-brand min-h-24"
              />

              <button type="submit" className="btn-primary w-full rounded-full py-3.5 text-sm font-semibold sm:w-auto sm:px-10">
                Submit booking
              </button>
            </form>

            {message && (
              <p
                className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                  message.includes('success')
                    ? 'border-emerald-200/90 bg-emerald-50/90 text-emerald-900'
                    : 'border-amber-200/90 bg-amber-50/90 text-amber-950'
                }`}
                role="status"
              >
                {message}
              </p>
            )}
          </section>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <section className="glass-panel rounded-[2rem] p-6 md:p-8">
            <h2 className="font-display text-xl font-medium text-[var(--nh-ink)] md:text-2xl">Booking history</h2>
            <p className="mt-2 text-sm text-[var(--nh-ink-muted)]">
              Enter the email you used when reserving — we&apos;ll pull your latest statuses.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="your@email.com"
                value={historyEmail}
                onChange={(e) => setHistoryEmail(e.target.value)}
                className="input-brand sm:flex-1"
              />
              <button
                type="button"
                onClick={() => loadHistory(historyEmail)}
                className="btn-primary rounded-full px-6 py-3 text-sm font-semibold sm:shrink-0"
              >
                Check
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {historyLoading && (
                <div className="flex items-center gap-3 text-sm text-[var(--nh-ink-muted)]">
                  <span className="nh-skeleton inline-block h-4 w-4 rounded-full" />
                  Checking bookings…
                </div>
              )}
              {history.map((booking) => (
                <article
                  key={booking.id}
                  className="card-rise rounded-2xl border border-[var(--nh-border)] bg-white/85 p-5"
                >
                  <p className="font-display text-lg font-medium text-[var(--nh-ink)]">{booking.service_name}</p>
                  <p className="mt-1 text-sm text-[var(--nh-ink-muted)]">
                    {booking.booking_date} · {booking.time_slot}
                  </p>
                  <p className="mt-3 inline-flex rounded-full bg-[var(--nh-accent-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--nh-accent)]">
                    {booking.status}
                  </p>
                </article>
              ))}
              {!historyLoading && !history.length && (
                <p className="rounded-2xl border border-dashed border-[var(--nh-border)] bg-[var(--nh-bg)]/40 px-4 py-8 text-center text-sm text-[var(--nh-ink-muted)]">
                  No bookings found for this email yet.
                </p>
              )}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </main>
  );
}
