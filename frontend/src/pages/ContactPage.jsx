import { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { createMessage } from '../services/platformService';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createMessage(form);
      setStatus('Thank you — we received your note and will reply within 24 hours.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-start">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--nh-accent)]">Concierge</p>
          <h1 className="font-display mt-4 text-4xl font-medium tracking-tight text-[var(--nh-ink)] md:text-5xl">
            Let&apos;s design your stay
          </h1>
          <p className="mt-5 text-lg text-[var(--nh-ink-muted)]">
            Special occasions, longer visits, or multi-venue itineraries — send us the outline and we&apos;ll shape the details.
          </p>
          <ul className="mt-10 space-y-5 text-sm text-[var(--nh-ink-muted)]">
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--nh-accent)]" aria-hidden />
              <span>
                <strong className="text-[var(--nh-ink)]">Response time:</strong> under 24h on business days.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--nh-sage)]" aria-hidden />
              <span>
                <strong className="text-[var(--nh-ink)]">Best for:</strong> group blocks, spa bundles, apartment + gym packages.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-500" aria-hidden />
              <span>
                <strong className="text-[var(--nh-ink)]">Prefer to book solo?</strong> Use the{' '}
                <Link to="/booking" className="font-semibold text-[var(--nh-accent)] underline-offset-4 hover:underline">
                  self-serve reservation
                </Link>{' '}
                flow anytime.
              </span>
            </li>
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={90}>
          <form
            onSubmit={submit}
            className="glass-panel space-y-5 rounded-[2rem] p-6 shadow-lg md:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label htmlFor="contact-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--nh-ink-muted)]">
                  Name
                </label>
                <input
                  id="contact-name"
                  className="input-brand"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="contact-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--nh-ink-muted)]">
                  Email
                </label>
                <input
                  id="contact-email"
                  className="input-brand"
                  placeholder="you@example.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--nh-ink-muted)]">
                Message
              </label>
              <textarea
                id="contact-message"
                className="input-brand min-h-40 resize-y"
                placeholder="Tell us dates, venues, and anything we should know..."
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full rounded-full py-3.5 text-sm font-semibold sm:w-auto sm:px-10">
              Send message
            </button>
            {status && (
              <p
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  status.startsWith('Thank you')
                    ? 'border-emerald-200/80 bg-emerald-50/90 text-emerald-900'
                    : 'border-red-200/90 bg-red-50/90 text-red-900'
                }`}
                role="status"
              >
                {status}
              </p>
            )}
          </form>
        </ScrollReveal>
      </div>
    </main>
  );
}
