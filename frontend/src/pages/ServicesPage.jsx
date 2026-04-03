import { useEffect, useMemo, useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import ScrollReveal from '../components/ScrollReveal';
import { asArray } from '../lib/asArray';
import { getServices } from '../services/platformService';

const venueFilters = [
  { id: 'all', label: 'All' },
  { id: 'gym', label: 'Gym' },
  { id: 'apartment', label: 'Apartments' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'sauna', label: 'Sauna' },
  { id: 'massage', label: 'Massage' },
  { id: 'lodge', label: 'Lodge' },
];

function matchesFilter(service, filterId) {
  if (filterId === 'all') return true;
  const t = String(service.type || '').toLowerCase();
  if (filterId === 'apartment') return t.includes('apartment') || t.includes('apt');
  return t.includes(filterId);
}

const loadServicesErrorMsg =
  'Could not load services. The API is offline or PostgreSQL is not running. Fix: (1) Start Postgres locally, or add DATABASE_URL from neon.tech to backend/.env. (2) From repo root run npm run db:check — then npm run dev:all. (3) frontend/.env: VITE_API_URL=http://localhost:4000/api';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const run = async () => {
      setLoadError('');
      try {
        const list = await getServices();
        setServices(asArray(list));
      } catch {
        setServices([]);
        setLoadError(loadServicesErrorMsg);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const filtered = useMemo(
    () => asArray(services).filter((s) => matchesFilter(s, activeFilter)),
    [services, activeFilter],
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <ScrollReveal>
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--nh-accent)]">The collection</p>
          <h1 className="font-display mt-4 text-4xl font-medium tracking-tight text-[var(--nh-ink)] md:text-6xl">
            Experiences shaped for real life
          </h1>
          <p className="mt-5 text-lg text-[var(--nh-ink-muted)]">
            Filter by venue, explore details, then book the rhythm that fits your week — training, stay, coffee, heat, touch,
            or a full lodge escape.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={80} className="mt-10">
        <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible">
          {venueFilters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`snap-start rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                activeFilter === f.id
                  ? 'bg-[var(--nh-deep)] text-[#faf6ef] shadow-md'
                  : 'border border-[var(--nh-border)] bg-white/80 text-[var(--nh-ink-muted)] hover:border-[var(--nh-accent)]/35 hover:text-[var(--nh-ink)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {loadError && (
        <div className="glass-panel mt-10 rounded-3xl border border-amber-200/80 bg-amber-50/90 p-6 text-sm text-amber-950">
          {loadError}
        </div>
      )}
      {loading ? (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="overflow-hidden rounded-3xl border border-[var(--nh-border)] bg-white/50">
              <div className="nh-skeleton h-60 w-full" />
              <div className="space-y-3 p-6">
                <div className="nh-skeleton h-6 w-2/3 rounded-lg" />
                <div className="nh-skeleton h-4 w-full rounded-lg" />
                <div className="nh-skeleton h-4 w-5/6 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length ? (
        <section className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service, idx) => (
            <ScrollReveal key={service.id} delay={idx * 50}>
              <ServiceCard service={service} />
            </ScrollReveal>
          ))}
        </section>
      ) : (
        <div className="glass-panel mt-12 rounded-3xl p-10 text-center">
          <p className="font-display text-xl text-[var(--nh-ink)]">No experiences in this category yet</p>
          <p className="mt-2 text-[var(--nh-ink-muted)]">Try another filter or check back after the team publishes new services.</p>
        </div>
      )}
    </main>
  );
}
