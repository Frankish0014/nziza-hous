'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BrandLogo from '@/components/BrandLogo';
import useAuth from '@/hooks/useAuth';

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await register({ name: form.name, email: form.email, password: form.password, role: 'customer' });
      }
      router.push('/');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <main className="min-h-[calc(100vh-120px)]">
      <div className="mx-auto grid min-h-[calc(100vh-120px)] max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--nh-border)] bg-[var(--nh-cream)]/90 shadow-xl md:grid-cols-2 md:rounded-none md:border-x-0 md:border-y-0 md:shadow-none lg:max-w-none lg:rounded-none lg:border-0">
        <div
          className="relative hidden flex-col justify-between p-10 text-[#f5ebe0] md:flex md:p-12 lg:p-16"
          style={{
            background:
              'linear-gradient(145deg, #1a1614 0%, #2c1810 45%, #1e2e2a 100%)',
          }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
            <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[var(--nh-accent)] blur-[100px]" />
            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[var(--nh-sage)] blur-[120px]" />
          </div>
          <div className="relative">
            <BrandLogo variant="light" height={100} />
            <h1 className="font-display mt-8 max-w-md text-3xl font-medium leading-tight lg:text-4xl">
              Your guest profile, always one tap away.
            </h1>
          </div>
          <p className="relative max-w-sm text-sm leading-relaxed text-[#b8b0a4]">
            Save time on returns — manage bookings, messages, and future stays from a single calm dashboard experience.
          </p>
        </div>

        <div className="flex flex-col justify-center px-4 py-14 sm:px-10 md:px-12 lg:px-20">
          <div className="md:hidden">
            <BrandLogo height={100} />
          </div>
          <h2 className="font-display mt-4 text-3xl font-medium text-[var(--nh-ink)] md:mt-0 md:text-4xl">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-[var(--nh-ink-muted)]">
            {mode === 'login' ? 'Sign in to continue your booking journey.' : 'Join as a guest — quick, secure, minimal fields.'}
          </p>

          <form onSubmit={submit} className="relative z-0 mt-8 space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="auth-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--nh-ink-muted)]">
                  Full name
                </label>
                <input
                  id="auth-name"
                  className="input-brand"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
            )}
            <div>
              <label htmlFor="auth-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--nh-ink-muted)]">
                Email
              </label>
              <input
                id="auth-email"
                className="input-brand"
                placeholder="you@example.com"
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label htmlFor="auth-password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--nh-ink-muted)]">
                Password
              </label>
              <input
                id="auth-password"
                className="input-brand"
                placeholder="••••••••"
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full rounded-full py-3.5 text-sm font-semibold">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="relative z-[2] mt-2">
            <button
              type="button"
              onClick={() => {
                setMode((m) => (m === 'login' ? 'register' : 'login'));
                setMessage('');
              }}
              className="group w-full cursor-pointer rounded-2xl border border-transparent px-3 py-3.5 text-left text-sm text-[var(--nh-ink-muted)] transition hover:border-[var(--nh-border)] hover:bg-white/70 hover:text-[var(--nh-ink)]"
            >
              {mode === 'login' ? (
                <span className="block">
                  <span className="text-[var(--nh-ink-muted)] group-hover:text-[var(--nh-ink)]">New to Nziza House? </span>
                  <span className="font-semibold text-[var(--nh-accent)] underline decoration-transparent underline-offset-[3px] transition group-hover:decoration-[var(--nh-accent)]">
                    Create an account
                  </span>
                </span>
              ) : (
                <span className="block">
                  <span className="text-[var(--nh-ink-muted)] group-hover:text-[var(--nh-ink)]">Already registered? </span>
                  <span className="font-semibold text-[var(--nh-accent)] underline decoration-transparent underline-offset-[3px] transition group-hover:decoration-[var(--nh-accent)]">
                    Sign in instead
                  </span>
                </span>
              )}
            </button>

            <Link href="/"
              className="mt-4 inline-flex cursor-pointer items-center gap-1 rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--nh-ink-muted)] transition hover:bg-white/70 hover:text-[var(--nh-ink)]"
            >
              ← Back to home
            </Link>
          </div>

          {message && (
            <p className="mt-4 rounded-2xl border border-red-200/90 bg-red-50/90 px-4 py-3 text-sm text-red-900" role="alert">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}