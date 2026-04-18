import { Link } from 'react-router-dom';
import { COFFEE_THEMATIC_OBJECT_POSITION, EXPERIENCE_IMAGE } from '../lib/experiencePhotos';
import ScrollReveal from '../components/ScrollReveal';
import heroBackground from '../images/nziza_background.jpeg';

const marqueeItems = [
  'Gym',
  'Apartments',
  'Coffee',
  'Sauna',
  'Massage',
  'Lodge',
  'Wellness',
  'Hospitality',
];

const icons = {
  gym: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M6 4v16M10 9v6M14 9v6M18 4v16M4 8h4M16 8h4M4 16h4M16 16h4" strokeLinecap="round" />
    </svg>
  ),
  home: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" strokeLinejoin="round" />
    </svg>
  ),
  coffee: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M6 7h8a4 4 0 010 8H6V7zM18 10v2M6 19h8" strokeLinecap="round" />
    </svg>
  ),
  sauna: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M8 16c2-2 2-4 0-6M12 18c3-3 3-7 0-10M16 15c1.5-1.5 1.5-3.5 0-5" strokeLinecap="round" />
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  ),
  massage: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 5v14M9 8c0-1.5 1-2 3-2s3 .5 3 2-1.5 2-3 2-3 .5-3 2M7 20h10" strokeLinecap="round" />
    </svg>
  ),
  lodge: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 3l9 7H3l9-7zM5 10h14v10a1 1 0 01-1 1H6a1 1 0 01-1-1V10z" strokeLinejoin="round" />
    </svg>
  ),
};

const experiences = [
  {
    title: 'Gym',
    tag: 'Strength & energy',
    description:
      'Train in a premium fitness space with modern equipment, expert guidance, and a motivating atmosphere built for real progress.',
    cta: 'Book training',
    href: '/booking',
    icon: icons.gym,
    image: EXPERIENCE_IMAGE.gym,
    accent: 'from-amber-500/25 to-orange-600/10',
    ring: 'ring-amber-500/30',
  },
  {
    title: 'Apartments',
    tag: 'Short & long stay',
    description:
      'Designer apartments for short or long stays — privacy, kitchen comforts, and the feel of a true second home.',
    cta: 'Reserve a stay',
    href: '/booking',
    icon: icons.home,
    image: EXPERIENCE_IMAGE.apartment,
    accent: 'from-emerald-500/20 to-teal-600/10',
    ring: 'ring-emerald-500/25',
  },
  {
    title: 'Coffee shop',
    tag: 'Slow mornings',
    description:
      'Artisan coffee, fresh bites, and calm corners for meetings, remote work, and unhurried conversation.',
    cta: 'Plan a visit',
    href: '/services',
    icon: icons.coffee,
    image: EXPERIENCE_IMAGE.coffee,
    imageObjectPosition: COFFEE_THEMATIC_OBJECT_POSITION,
    accent: 'from-orange-400/25 to-amber-800/10',
    ring: 'ring-orange-400/35',
  },
  {
    title: 'Sauna',
    tag: 'Deep recovery',
    description:
      'Warm, restorative heat rituals to improve circulation, soothe muscles, and reset a busy mind.',
    cta: 'Schedule sauna',
    href: '/booking',
    icon: icons.sauna,
    image: EXPERIENCE_IMAGE.sauna,
    accent: 'from-rose-400/20 to-red-900/15',
    ring: 'ring-rose-400/30',
  },
  {
    title: 'Massage',
    tag: 'Therapeutic calm',
    description:
      'Personalized bodywork that releases tension, supports recovery, and leaves you grounded.',
    cta: 'Book massage',
    href: '/booking',
    icon: icons.massage,
    image: EXPERIENCE_IMAGE.massage,
    accent: 'from-violet-400/20 to-indigo-900/10',
    ring: 'ring-violet-400/30',
  },
  {
    title: 'Lodge',
    tag: 'Nature-quiet stay',
    description:
      'Serene lodge nights where thoughtful design, soft textures, and attentive hosting come together.',
    cta: 'Lodge experience',
    href: '/booking',
    icon: icons.lodge,
    image: EXPERIENCE_IMAGE.lodge,
    accent: 'from-sky-400/15 to-slate-800/20',
    ring: 'ring-sky-500/25',
  },
];

const trustMetrics = [
  { label: 'Experiences on-site', value: '6' },
  { label: 'Booking steps', value: '3' },
  { label: 'Concierge reply', value: '<24h' },
  { label: 'Comfort-first design', value: '100%' },
];

export default function HomePage() {
  const duplicatedMarquee = [...marqueeItems, ...marqueeItems];

  return (
    <main className="overflow-x-hidden">
      <section className="relative overflow-hidden bg-[var(--nh-bg)]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-4 pt-14 md:gap-12 md:pb-8 md:pt-16 lg:min-h-[min(90vh,56rem)] lg:grid-cols-2 lg:gap-14 lg:py-16">
          {/* Copy — left on desktop; below hero image on small screens */}
          <div className="order-2 flex flex-col justify-center lg:order-1 lg:max-w-xl lg:pr-2 xl:max-w-2xl">
            <ScrollReveal>
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--nh-border)] bg-[var(--nh-cream)]/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--nh-ink-muted)] shadow-sm">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--nh-accent)]" />
                Nziza House
              </p>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <h1 className="font-display mt-6 max-w-4xl text-4xl font-medium leading-[1.08] tracking-tight text-[var(--nh-ink)] md:text-5xl xl:text-6xl">
                One address.{' '}
                <span className="bg-[linear-gradient(105deg,#c45c26,#e8a878,#3d5c54)] bg-clip-text text-transparent">
                  Six ways
                </span>{' '}
                to feel at home.
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={140}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--nh-ink-muted)] md:text-xl">
                Gym, apartments, coffee, sauna, massage, and lodge — woven into a single, seamless guest journey. Book what you
                need; we handle the rest with warmth and precision.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link to="/booking" className="btn-primary rounded-full px-8 py-3.5 text-sm font-semibold shadow-lg">
                  Reserve your experience
                </Link>
                <Link
                  to="/services"
                  className="rounded-full border-2 border-[var(--nh-border)] bg-white/90 px-8 py-3.5 text-sm font-semibold text-[var(--nh-ink)] shadow-sm transition hover:border-[var(--nh-accent)]/40 hover:text-[var(--nh-accent)]"
                >
                  Browse offerings
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={260}>
              <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:max-w-2xl">
                {trustMetrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-2xl border border-[var(--nh-border)] bg-white/85 px-3 py-3 text-left shadow-sm backdrop-blur-sm md:px-4"
                  >
                    <p className="font-display text-2xl font-medium text-[var(--nh-accent)] md:text-3xl">{m.value}</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase leading-tight tracking-wider text-[var(--nh-ink-muted)] sm:text-[11px]">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Property photo — right on desktop; first on mobile */}
          <div className="order-1 lg:order-2">
            <ScrollReveal className="lg:h-full">
              <div className="relative mx-auto aspect-[5/4] max-h-[min(72vw,22rem)] w-full max-w-lg overflow-hidden rounded-3xl border border-[var(--nh-border)] shadow-[0_24px_60px_-12px_rgba(20,18,16,0.18)] sm:max-h-none sm:aspect-[4/5] lg:mx-0 lg:aspect-auto lg:max-h-none lg:min-h-[22rem] lg:max-w-none xl:min-h-[28rem]">
                <img
                  src={heroBackground}
                  alt="Nziza House property"
                  width={1200}
                  height={1500}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: 'center 42%' }}
                  decoding="async"
                  fetchPriority="high"
                />
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5"
                  aria-hidden
                />
              </div>
            </ScrollReveal>
          </div>
        </div>

        <div className="relative border-y border-white/[0.09] bg-gradient-to-r from-[rgb(12_11_10/0.96)] via-[rgb(22_32_29/0.94)] to-[rgb(12_11_10/0.96)] py-3 text-[#d2cbc1] shadow-[inset_0_1px_0_rgba(255,250,240,0.05)] backdrop-blur-md">
          <div className="nh-marquee-track gap-12 pr-12">
            {duplicatedMarquee.map((word, i) => (
              <span key={`${word}-${i}`} className="flex items-center gap-12 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.45em]">
                {word}
                <span className="text-[var(--nh-accent)]">◆</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 pt-14 md:pb-8 md:pt-16">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--nh-border)] bg-gradient-to-r from-[var(--nh-deep)] via-[#1f2f2a] to-[var(--nh-sage)] px-6 py-8 text-white shadow-[0_24px_55px_-24px_rgba(20,18,16,0.55)] md:px-10 md:py-10">
            <div className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-[var(--nh-accent)]/30 blur-3xl" aria-hidden />
            <div className="relative grid gap-6 lg:grid-cols-[1.45fr_0.9fr] lg:items-end">
              <div>
                <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90">
                  New at Nziza House
                </p>
                <h2 className="font-display mt-4 max-w-3xl text-3xl font-medium tracking-tight md:text-4xl">
                  Introducing our new Business Center.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 md:text-base">
                  Bring your meetings, focused work sessions, and business networking to Nziza House. Work in comfort, then
                  unwind with coffee, wellness, and hospitality experiences in one address.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link
                  to="/booking"
                  className="inline-flex items-center rounded-full bg-[var(--nh-accent)] px-6 py-3 text-sm font-semibold text-[var(--nh-deep)] transition hover:bg-[#f4b286]"
                >
                  Book your visit
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Ask about business packages
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <ScrollReveal>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--nh-accent)]">On the property</p>
            <h2 className="font-display mt-4 text-3xl font-medium tracking-tight text-[var(--nh-ink)] md:text-5xl">
              Move through spaces designed for different moods — all minutes apart.
            </h2>
            <p className="mt-4 text-[var(--nh-ink-muted)] md:text-lg">
              Tap a card to continue your journey. Every venue shares the same quiet standard of service: intentional, human,
              never rushed.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((item, idx) => (
            <ScrollReveal key={item.title} delay={idx * 60}>
              <article
                className={`card-rise group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--nh-border)] bg-[var(--nh-cream)]/90 p-6 shadow-sm ring-1 ${item.ring} ring-inset transition-colors hover:bg-white`}
              >
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${item.accent} opacity-70 blur-2xl transition duration-500 group-hover:opacity-100`}
                  aria-hidden
                />
                <div className="relative -mx-6 -mt-6 mb-5 aspect-[16/10] overflow-hidden rounded-t-3xl border-b border-[var(--nh-border)]">
                  <img
                    src={item.image}
                    alt={`${item.title} — Nziza House`}
                    width={800}
                    height={520}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    style={item.imageObjectPosition ? { objectPosition: item.imageObjectPosition } : undefined}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="relative flex items-start justify-between gap-4">
                  <div className="rounded-2xl border border-[var(--nh-border)] bg-white/80 p-3 text-[var(--nh-accent)] shadow-sm">
                    {item.icon}
                  </div>
                  <span className="rounded-full bg-[var(--nh-accent-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--nh-accent)]">
                    {item.tag}
                  </span>
                </div>
                <h3 className="font-display relative mt-5 text-2xl font-medium text-[var(--nh-ink)]">{item.title}</h3>
                <p className="relative mt-3 flex-1 text-sm leading-relaxed text-[var(--nh-ink-muted)]">{item.description}</p>
                <Link
                  to={item.href}
                  className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--nh-accent)] transition group-hover:gap-3"
                >
                  {item.cta}
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--nh-border)] bg-gradient-to-br from-[var(--nh-bg-warm)] via-[var(--nh-bg)] to-[var(--nh-sage-soft)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <ScrollReveal>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--nh-sage)]">Guest journey</p>
              <h2 className="font-display mt-4 text-3xl font-medium text-[var(--nh-ink)] md:text-4xl">
                Booking that respects your time
              </h2>
              <p className="mt-4 text-[var(--nh-ink-muted)]">
                No maze of forms — just clear steps, human confirmation, and the little details handled before you arrive.
              </p>
            </ScrollReveal>
            <div className="space-y-4">
              {[
                ['01', 'Choose', 'Pick gym time, apartment nights, spa sessions, or lodge stays.'],
                ['02', 'Confirm', 'Share contact details and payment proof securely in one flow.'],
                ['03', 'Arrive', 'We confirm by email & phone and prepare your space with care.'],
              ].map(([step, title, desc], i) => (
                <ScrollReveal key={step} delay={i * 80}>
                  <article className="group flex gap-5 rounded-3xl border border-[var(--nh-border)] bg-white/75 p-5 shadow-sm transition hover:border-[var(--nh-accent)]/35 hover:shadow-md md:p-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--nh-deep)] font-display text-lg font-medium text-[#f5ebe0] shadow-inner">
                      {step}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-medium text-[var(--nh-ink)]">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--nh-ink-muted)]">{desc}</p>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
        <ScrollReveal>
          <div className="glass-panel relative overflow-hidden rounded-[2rem] p-8 md:p-12 lg:p-14">
            <div
              className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-[var(--nh-accent)]/15 blur-3xl"
              aria-hidden
            />
            <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <h2 className="font-display text-3xl font-medium text-[var(--nh-ink)] md:text-4xl">
                  Ready when you are
                </h2>
                <p className="mt-4 max-w-xl text-[var(--nh-ink-muted)]">
                  Tell us what you are celebrating — a training block, a long stay, or a full weekend of restoration. We will
                  tailor the rhythm to you.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link to="/contact" className="btn-primary rounded-full px-7 py-3 text-sm font-semibold">
                  Talk to concierge
                </Link>
                <Link
                  to="/about"
                  className="rounded-full border border-[var(--nh-border)] bg-white/80 px-7 py-3 text-sm font-semibold text-[var(--nh-ink)] transition hover:border-[var(--nh-accent)]/40"
                >
                  Our story
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
