'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import ContactChannels from '@/components/ContactChannels';

const columns = [
  {
    title: 'Visit',
    links: [
      { href: '/services', label: 'Experiences' },
      { href: '/contact', label: 'Concierge' },
    ],
  },
  {
    title: 'Property',
    links: [
      { href: '/', label: 'Overview' },
      { href: '/about', label: 'Our story' },
      { href: '/auth', label: 'Guest login' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-[var(--nh-border)] bg-[var(--nh-deep)] text-[#e8e2d8]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, var(--nh-accent), transparent 45%), radial-gradient(circle at 80% 80%, var(--nh-sage), transparent 40%)',
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <BrandLogo variant="light" height={100} className="text-[#faf6ef]" />
            <p className="mt-4 text-sm leading-relaxed text-[#b8b0a4]">
              Six experiences under one roof — train, stay, sip, restore, unwind, and retreat. Crafted for guests who want
              calm luxury without the noise.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--nh-accent)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-lg shadow-black/25 transition hover:brightness-110"
            >
              Plan your visit
              <span aria-hidden>→</span>
            </Link>
            <ContactChannels variant="footer" />
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-16">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--nh-accent)]">{col.title}</p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-[#c9c2b6] transition hover:text-[#faf6ef]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--nh-accent)]">Venues</p>
              <ul className="mt-4 space-y-2 text-sm text-[#9a9286]">
                <li>Gym</li>
                <li>Apartments</li>
                <li>Coffee shop</li>
                <li>Sauna · Massage</li>
                <li>Lodge</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center text-xs text-[#7a7268] sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Nziza House. All rights reserved.</p>
          <p className="max-w-xl">
            Experience-first booking — designed for clarity, warmth, and effortless stays.
          </p>
        </div>
      </div>
    </footer>
  );
}
