import { useCallback, useEffect, useState } from 'react';
import { asArray } from '../lib/asArray';
import {
  addMedia,
  createService,
  deleteService,
  getAnalytics,
  getBookings,
  getMessages,
  getServices,
  getUsers,
  uploadImage,
  updateBookingStatus,
} from '../services/platformService';

const initialService = { type: 'gym', name: '', description: '', price: '', currency: 'USD' };
const initialAnalytics = { bookings: 0, services: 0, users: 0 };

function normalizeAnalytics(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ...initialAnalytics };
  return { ...initialAnalytics, ...raw };
}

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newService, setNewService] = useState(initialService);
  const [mediaForm, setMediaForm] = useState({ serviceId: '', altText: '', file: null });

  const load = useCallback(async () => {
    try {
      const [a, b, s, u, m] = await Promise.all([
        getAnalytics(),
        getBookings(),
        getServices(),
        getUsers(),
        getMessages(),
      ]);
      setAnalytics(normalizeAnalytics(a));
      setBookings(asArray(b));
      setServices(asArray(s));
      setUsers(asArray(u));
      setMessages(asArray(m));
    } catch {
      setAnalytics(initialAnalytics);
      setBookings([]);
      setServices([]);
      setUsers([]);
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const handleStatus = async (id, status) => {
    await updateBookingStatus(id, status);
    await load();
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    await createService({ ...newService, price: newService.price ? Number(newService.price) : null });
    setNewService(initialService);
    await load();
  };

  const handleAttachMedia = async (e) => {
    e.preventDefault();
    if (!mediaForm.file) return;
    const uploaded = await uploadImage(mediaForm.file);
    await addMedia({
      serviceId: Number(mediaForm.serviceId),
      url: uploaded.url,
      altText: mediaForm.altText || null,
    });
    setMediaForm({ serviceId: '', altText: '', file: null });
    await load();
  };

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-12">
      <h1 className="text-4xl font-semibold text-stone-900">Admin Dashboard</h1>

      <section className="grid gap-4 md:grid-cols-3">
        {Object.entries(analytics).map(([key, value]) => (
          <article key={key} className="glass-panel rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#F77F00]">{key}</p>
            <p className="mt-3 text-3xl font-semibold text-stone-900">{value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-stone-900">Manage Bookings</h2>
          <div className="mt-4 space-y-3">
            {bookings.map((item) => (
              <div key={item.id} className="rounded-xl border border-stone-200 bg-white/80 p-3">
                <p className="font-medium text-stone-900">
                  {item.service_name} - {item.user_name}
                </p>
                <p className="text-sm text-stone-600">
                  {item.booking_date} | {item.time_slot} | {item.status}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatus(item.id, 'confirmed')}
                    className="btn-primary rounded px-3 py-1 text-xs text-white"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatus(item.id, 'cancelled')}
                    className="rounded border-2 border-rose-500 bg-white px-3 py-1 text-xs text-rose-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-stone-900">Create Service</h2>
          <form onSubmit={handleCreateService} className="mt-4 space-y-3">
            <select
              className="input-brand"
              value={newService.type}
              onChange={(e) => setNewService((p) => ({ ...p, type: e.target.value }))}
            >
              {['gym', 'apartments', 'coffee_shop', 'sauna', 'massage', 'lodge'].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              className="input-brand"
              placeholder="Name"
              value={newService.name}
              onChange={(e) => setNewService((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <textarea
              className="input-brand h-28"
              placeholder="Description"
              value={newService.description}
              onChange={(e) => setNewService((p) => ({ ...p, description: e.target.value }))}
              required
            />
            <input
              className="input-brand"
              placeholder="Price (optional)"
              value={newService.price}
              onChange={(e) => setNewService((p) => ({ ...p, price: e.target.value }))}
            />
            <button type="submit" className="btn-primary rounded-full px-5 py-2">
              Add Service
            </button>
          </form>
          <div className="mt-6 space-y-2">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between rounded-xl border border-stone-200 bg-white/70 p-3">
                <span className="text-stone-900">{service.name}</span>
                <button onClick={() => deleteService(service.id).then(load)} className="text-xs uppercase text-rose-400">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-stone-900">Attach Service Gallery Media</h2>
        <form onSubmit={handleAttachMedia} className="mt-4 grid gap-3 md:grid-cols-4">
          <select
            className="input-brand"
            value={mediaForm.serviceId}
            onChange={(e) => setMediaForm((p) => ({ ...p, serviceId: e.target.value }))}
            required
          >
            <option value="">Service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
          <input
            className="input-brand"
            placeholder="Alt text"
            value={mediaForm.altText}
            onChange={(e) => setMediaForm((p) => ({ ...p, altText: e.target.value }))}
          />
          <input
            type="file"
            accept="image/*"
            className="input-brand"
            onChange={(e) => setMediaForm((p) => ({ ...p, file: e.target.files?.[0] || null }))}
            required
          />
          <button type="submit" className="btn-primary rounded-full px-5 py-2">
            Upload & Attach
          </button>
        </form>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-stone-900">Users</h2>
          <div className="mt-4 space-y-2">
            {users.map((user) => (
              <p key={user.id} className="rounded-xl border border-stone-200 bg-white/80 p-2 text-sm text-stone-800">
                {user.name} ({user.email}) - {user.role}
              </p>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-stone-900">Messages</h2>
          <div className="mt-4 space-y-2">
            {messages.map((msg) => (
              <article key={msg.id} className="rounded-xl border border-stone-200 bg-white/80 p-3">
                <p className="text-sm font-medium text-stone-900">
                  {msg.name} ({msg.email})
                </p>
                <p className="text-sm text-stone-600">{msg.message}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

