'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { getServiceById } from '@/services/platformService';

function formatType(type) {
  if (!type) return 'Experience';
  return String(type).replace(/_/g, ' ');
}

export default function ServiceDetailsPage({ id }) {
  const [service, setService] = useState(null);

  useEffect(() => {
    const run = async () => setService(await getServiceById(id));
    run();
  }, [id]);

  if (!service) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-5xl items-center justify-center px-4 py-20 text-[var(--nh-ink-muted)]">
        <div className="text-center">
          <div className="nh-skeleton mx-auto h-12 w-12 rounded-full" />
          <p className="mt-4 font-medium">Loading experience…</p>
        </div>
      </main>
    );
  }

  const media = service.media || [];

  return (
    <main className="pb-20">
      <section className="border-b border-[var(--nh-border)] bg-gradient-to-b from-[var(--nh-bg-warm)] to-[var(--nh-bg)]">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--nh-accent)]">{formatType(service.type)}</p>
            <h1 className="font-display mt-4 max-w-4xl text-4xl font-medium tracking-tight text-[var(--nh-ink)] md:text-6xl">
              {service.name}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--nh-ink-muted)]">{service.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="inline-flex rounded-full border border-[var(--nh-border)] bg-white/90 px-5 py-2 font-semibold text-[var(--nh-accent)] shadow-sm">
                {service.price ? `${service.currency} ${service.price}` : 'Custom pricing'}
              </span>
              <Link href="/booking"
                className="btn-primary rounded-full px-8 py-3 text-sm font-semibold"
              >
                Book this experience
              </Link>
              <Link href="/services"
                className="rounded-full border border-[var(--nh-border)] bg-white/80 px-6 py-3 text-sm font-semibold text-[var(--nh-ink)] transition hover:border-[var(--nh-accent)]/35"
              >
                ← All experiences
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {media.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <ScrollReveal>
            <h2 className="font-display text-2xl font-medium text-[var(--nh-ink)] md:text-3xl">Gallery</h2>
            <p className="mt-2 text-sm text-[var(--nh-ink-muted)]">A closer look at the space and atmosphere.</p>
          </ScrollReveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {media.map((item, idx) => (
              <ScrollReveal key={item.id} delay={idx * 50}>
                <div className="group overflow-hidden rounded-3xl border border-[var(--nh-border)] bg-white/50 shadow-sm">
                  <img
                    src={item.url}
                    alt={item.alt_text || service.name}
                    className="h-64 w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4">
        <ScrollReveal>
          <div className="glass-panel flex flex-col items-start justify-between gap-6 rounded-[2rem] p-8 md:flex-row md:items-center md:p-10">
            <div>
              <h2 className="font-display text-2xl font-medium text-[var(--nh-ink)]">Ready to reserve?</h2>
              <p className="mt-2 max-w-xl text-[var(--nh-ink-muted)]">
                Choose a time slot, upload payment proof, and we&apos;ll confirm your visit personally.
              </p>
            </div>
            <Link href="/booking" className="btn-primary shrink-0 rounded-full px-8 py-3 text-sm font-semibold">
              Continue to booking
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
