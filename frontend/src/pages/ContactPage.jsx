import { useState } from 'react';
import { createMessage } from '../services/platformService';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createMessage(form);
      setStatus('Message sent successfully.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to send message.');
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.25em] text-[#F77F00]">We are here for you</p>
      <h1 className="mt-3 text-4xl font-semibold text-stone-900 md:text-5xl">Contact Us</h1>
      <p className="mt-4 text-stone-700">For partnerships, bookings support, or special requests, send us a message.</p>
      <form onSubmit={submit} className="glass-panel mt-8 space-y-4 rounded-2xl p-6">
        <input
          className="input-brand"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required
        />
        <input
          className="input-brand"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          required
        />
        <textarea
          className="input-brand h-36"
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          required
        />
        <button type="submit" className="btn-primary rounded-full px-7 py-3 font-semibold">
          Send Message
        </button>
      </form>
      {status && <p className="mt-4 text-stone-700">{status}</p>}
    </main>
  );
}
