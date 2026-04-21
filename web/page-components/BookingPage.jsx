'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

export default function BookingPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 md:py-24">
      <ScrollReveal>
        <section className="glass-panel rounded-[2rem] border border-[var(--nh-border)] p-8 text-center md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--nh-accent)]">Booking status</p>
          <h1 className="font-display mt-4 text-3xl font-medium tracking-tight text-[var(--nh-ink)] md:text-5xl">
            Booking is temporarily inactive
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[var(--nh-ink-muted)] md:text-lg">
            We have paused online booking while experience pricing and packages are being finalized. Please contact Nziza House
            and our team will guide you personally.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className="btn-primary rounded-full px-8 py-3 text-sm font-semibold">
              Contact us
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-[var(--nh-border)] bg-white/85 px-8 py-3 text-sm font-semibold text-[var(--nh-ink)] transition hover:border-[var(--nh-accent)]/35"
            >
              View experiences
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}
