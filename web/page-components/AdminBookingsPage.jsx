'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { asArray } from '@/client/asArray';
import { getBookings, updateBookingStatus } from '@/services/platformService';

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso).slice(0, 10);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const b = await getBookings();
      setBookings(asArray(b));
    } catch {
      setBookings([]);
      setError('Could not load bookings. Sign in as admin and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const sorted = useMemo(() => {
    const rank = (s) => (s === 'pending' ? 0 : s === 'confirmed' ? 1 : 2);
    return [...bookings].sort((a, b) => {
      const ra = rank(a.status);
      const rb = rank(b.status);
      if (ra !== rb) return ra - rb;
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });
  }, [bookings]);

  const setStatus = async (id, status) => {
    setBusyId(id);
    setError('');
    try {
      await updateBookingStatus(id, status);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Update failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <div className="flex flex-col gap-4 border-b border-[var(--nh-border)] pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--nh-accent)]">Admin</p>
          <h1 className="font-display mt-2 text-3xl font-medium tracking-tight text-[var(--nh-ink)] md:text-4xl">
            Review &amp; confirm bookings
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--nh-ink-muted)]">
            Verify payment proof, then confirm the reservation. The guest receives an email as soon as you confirm.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin"
            className="rounded-full border border-[var(--nh-border)] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--nh-ink)]"
          >
            Full dashboard
          </Link>
          <Link href="/contact" className="btn-primary rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider">
            Public contact page
          </Link>
        </div>
      </div>

      {error && (
        <p className="mt-6 rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-900" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-10 text-sm text-[var(--nh-ink-muted)]">Loading bookings…</p>
      ) : sorted.length === 0 ? (
        <p className="mt-10 text-sm text-[var(--nh-ink-muted)]">No bookings yet.</p>
      ) : (
        <ul className="mt-10 space-y-4">
          {sorted.map((b) => {
            const pending = b.status === 'pending';
            const proof = b.payment_proof_url;
            return (
              <li
                key={b.id}
                className="rounded-2xl border border-[var(--nh-border)] bg-white/85 p-5 shadow-sm backdrop-blur-sm md:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-medium text-[var(--nh-ink)]">{b.service_name || 'Service'}</p>
                    <p className="mt-1 text-sm text-[var(--nh-ink-muted)]">
                      <span className="font-medium text-[var(--nh-ink)]">{b.full_name || b.user_name || 'Guest'}</span>
                      {' · '}
                      <a href={`mailto:${b.email}`} className="text-[var(--nh-accent)] underline-offset-2 hover:underline">
                        {b.email || '—'}
                      </a>
                      {b.phone ? ` · ${b.phone}` : ''}
                    </p>
                    <p className="mt-2 text-sm text-[var(--nh-ink)]">
                      {formatDate(b.booking_date)} · <span className="font-medium">{b.time_slot}</span> ·{' '}
                      <span className="capitalize">{b.payment_method?.replace(/_/g, ' ') || '—'}</span>
                    </p>
                    {proof && (
                      <p className="mt-2 text-sm">
                        <a
                          href={proof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[var(--nh-accent)] underline underline-offset-2"
                        >
                          Open payment proof
                        </a>
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      pending
                        ? 'bg-amber-100 text-amber-900'
                        : b.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                {pending && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busyId === b.id}
                      onClick={() => setStatus(b.id, 'confirmed')}
                      className="btn-primary rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider disabled:opacity-60"
                    >
                      {busyId === b.id ? 'Saving…' : 'Confirm booking'}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === b.id}
                      onClick={() => setStatus(b.id, 'cancelled')}
                      className="rounded-full border-2 border-rose-400 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wider text-rose-700 disabled:opacity-60"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
