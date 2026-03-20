import { useEffect, useState } from 'react';
import {
  createBooking,
  getBookings,
  getServiceAvailability,
  getServices,
  uploadPaymentProof,
} from '../services/platformService';

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
  const [availability, setAvailability] = useState([]); // [{ date: 'YYYY-MM-DD', slots: ['08:00-09:00', ...] }]
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState('');

  const loadServices = async () => {
    setServicesLoading(true);
    setServicesError('');
    try {
      const serviceData = await getServices();
      setServices(Array.isArray(serviceData) ? serviceData : []);
    } catch {
      setServices([]);
      setServicesError('Could not load services. Check that the API is running and your VITE_API_URL is correct.');
    } finally {
      setServicesLoading(false);
    }
  };

  const loadHistory = async (email) => {
    if (!email) {
      setHistory([]);
      return;
    }
    setHistoryLoading(true);
    try {
      const bookingData = await getBookings(email);
      setHistory(bookingData);
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadAvailability = async (serviceId) => {
    if (!serviceId) {
      setAvailability([]);
      setAvailabilityError('');
      setAvailabilityLoading(false);
      return;
    }

    setAvailabilityLoading(true);
    setAvailabilityError('');
    try {
      const resp = await getServiceAvailability(serviceId);
      // resp shape: { serviceId, from, to, data: [{date, slots}] }
      const next = Array.isArray(resp?.data) ? resp.data : [];
      setAvailability(next);

      if (!form.bookingDate && next.length) {
        // First load for a fresh service selection: pick the first available date.
        setForm((prev) => ({ ...prev, bookingDate: next[0].date, timeSlot: '' }));
      } else if (form.bookingDate && !next.some((d) => d.date === form.bookingDate)) {
        // If the selected date is not in the returned list, clear selections.
        setForm((prev) => ({ ...prev, bookingDate: '', timeSlot: '' }));
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

  const availableSlots =
    form.bookingDate && availability.length
      ? availability.find((d) => d.date === form.bookingDate)?.slots || []
      : [];

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
    if (!proofFile) {
      setMessage('Please upload proof of payment before submitting.');
      return;
    }
    try {
      const uploaded = await uploadPaymentProof(proofFile);
      await createBooking({
        ...form,
        serviceId: Number(form.serviceId),
        paymentProofUrl: uploaded.url,
      });
      setMessage('Booking submitted successfully. A confirmation email has been sent to you.');
      setProofFile(null);
      setForm((prev) => ({ ...prev, bookingDate: '', timeSlot: '' }));
      await loadHistory(form.email);
      await loadAvailability(form.serviceId);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not create booking');
    }
  };

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-2">
      <section className="glass-panel rounded-2xl p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-[#F77F00]">Instant Reservation</p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-900 md:text-4xl">Book an Experience</h1>
        <p className="mt-2 text-sm text-stone-700">
          Fill in your contact details and payment proof. We will confirm your booking via email and phone.
        </p>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          {[
            ['Step 1', 'Select your service'],
            ['Step 2', 'Upload payment proof'],
            ['Step 3', 'Receive confirmation'],
          ].map(([step, desc]) => (
            <div key={step} className="rounded-xl border border-stone-200 bg-white/80 p-3">
              <p className="text-xs uppercase tracking-wider text-[#F77F00]">{step}</p>
              <p className="mt-1 text-sm text-stone-700">{desc}</p>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
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
          <div>
            <label htmlFor="booking-service" className="mb-1 block text-sm font-medium text-stone-700">
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
                  className="text-sm font-medium text-[#F77F00] underline"
                >
                  Retry
                </button>
              </div>
            )}
            {!servicesLoading && !servicesError && services.length === 0 && (
              <p className="mt-2 text-sm text-stone-600">
                No active services in the database yet. Start the backend with PostgreSQL connected — default services are
                created automatically on first run.
              </p>
            )}
          </div>
          <div>
            <label htmlFor="booking-date" className="mb-1 block text-sm font-medium text-stone-700">
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

          <div>
            <label htmlFor="booking-slot" className="mb-1 block text-sm font-medium text-stone-700">
              Time slot
            </label>
            <select
              id="booking-slot"
              value={form.timeSlot}
              onChange={(e) => setForm((prev) => ({ ...prev, timeSlot: e.target.value }))}
              className="input-brand"
              required
              disabled={!form.bookingDate || availabilityLoading || !availableSlots.length}
            >
              <option value="">
                {!form.bookingDate
                  ? 'Select a date first'
                  : !availableSlots.length
                    ? 'No slots available'
                    : 'Select a time slot'}
              </option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
          <select
            value={form.paymentMethod}
            onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
            className="input-brand"
            required
          >
            <option value="mobile_money">Mobile Money</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="card">Card</option>
          </select>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setProofFile(e.target.files?.[0] || null)}
            className="input-brand"
            required
          />
          <textarea
            placeholder="Additional notes (optional)"
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            className="input-brand h-24"
          />
          <button type="submit" className="btn-primary rounded-full px-7 py-3 font-semibold">
            Submit Booking
          </button>
        </form>
        {message && (
          <p className="mt-4 rounded-xl border border-stone-300 bg-white/90 p-3 text-stone-800">{message}</p>
        )}
      </section>

      <section className="glass-panel rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-stone-900">Your Booking History (by email)</h2>
        <p className="mt-2 text-sm text-stone-700">Enter the same email used during booking to see your latest status updates.</p>
        <div className="mt-4 flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            value={historyEmail}
            onChange={(e) => setHistoryEmail(e.target.value)}
            className="input-brand"
          />
          <button
            type="button"
            onClick={() => loadHistory(historyEmail)}
            className="btn-primary rounded-full px-5 py-2 font-semibold"
          >
            Check
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {historyLoading && <p className="text-stone-600">Checking bookings...</p>}
          {history.map((booking) => (
            <article key={booking.id} className="elevated-hover rounded-2xl border border-stone-200 bg-white/85 p-4">
              <p className="font-medium text-stone-900">{booking.service_name}</p>
              <p className="text-sm text-stone-600">
                {booking.booking_date} | {booking.time_slot}
              </p>
              <p className="mt-2 inline-flex rounded-full border-2 border-[#F77F00]/40 bg-[#F77F00]/10 px-3 py-1 text-xs uppercase tracking-wider text-[#d96d00]">
                {booking.status}
              </p>
            </article>
          ))}
          {!historyLoading && !history.length && <p className="text-stone-500">No bookings found for this email yet.</p>}
        </div>
      </section>
    </main>
  );
}

