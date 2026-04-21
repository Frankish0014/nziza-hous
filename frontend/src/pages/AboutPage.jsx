import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

const pillars = [
  {
    title: 'Human warmth',
    body: 'Technology supports the experience — it never replaces the greeting at the door, the timing of your sauna, or the quiet of your room.',
    tone: 'from-[var(--nh-accent)]/15 to-transparent',
  },
  {
    title: 'Detail that compounds',
    body: 'From coffee aroma to linen texture, we obsess over small choices that add up to a stay you remember for how effortless it felt.',
    tone: 'from-[var(--nh-sage)]/20 to-transparent',
  },
  {
    title: 'Built to grow',
    body: 'One property today, a connected network tomorrow — availability, bookings, and guest care stay unified as we expand.',
    tone: 'from-amber-500/15 to-transparent',
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-[var(--nh-border)] bg-[var(--nh-deep)] text-[#e8e2d8]">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 60% 80% at 10% 20%, rgba(196,92,38,0.35), transparent), radial-gradient(ellipse 50% 70% at 90% 60%, rgba(61,92,84,0.4), transparent)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c9a088]">About Nziza House</p>
            <h1 className="font-display mt-6 max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-6xl">
              A living campus for wellness, hosting, and unhurried days.
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#b8b0a4]">
              We brought gym, residences, café culture, heat therapy, bodywork, and lodge hospitality into one orchestrated
              guest journey — so you can move between modes without leaving the atmosphere you came for.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={180}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary rounded-full px-7 py-3 text-sm font-semibold">
                Contact us to book
              </Link>
              <Link
                to="/services"
                className="rounded-full border border-white/25 px-7 py-3 text-sm font-semibold text-[#faf6ef] transition hover:bg-white/10"
              >
                Explore venues
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <div className="grid gap-6 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 70}>
              <article
                className={`relative h-full overflow-hidden rounded-3xl border border-[var(--nh-border)] bg-gradient-to-br ${p.tone} p-8 shadow-sm`}
              >
                <h2 className="font-display text-2xl font-medium text-[var(--nh-ink)]">{p.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--nh-ink-muted)]">{p.body}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-16">
          <div className="glass-panel rounded-[2rem] p-8 md:flex md:items-center md:justify-between md:gap-10 md:p-12">
            <div>
              <h2 className="font-display text-3xl font-medium text-[var(--nh-ink)]">Visit the property</h2>
              <p className="mt-3 max-w-xl text-[var(--nh-ink-muted)]">
                Planning a longer stay or a corporate offsite? Our team can sequence gym access, apartment check-in, and dining
                reservations in one itinerary.
              </p>
            </div>
            <Link
              to="/contact"
              className="mt-6 inline-flex shrink-0 rounded-full border border-[var(--nh-border)] bg-white/90 px-7 py-3 text-sm font-semibold text-[var(--nh-ink)] transition hover:border-[var(--nh-accent)]/40 md:mt-0"
            >
              Contact concierge
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
