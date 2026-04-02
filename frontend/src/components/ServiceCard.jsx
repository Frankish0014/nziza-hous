import { Link } from 'react-router-dom';

const fallbackImage =
  'https://images.unsplash.com/photo-1560067174-89455598d5ac?auto=format&fit=crop&w=1200&q=80';

function formatType(type) {
  if (!type) return 'Experience';
  return String(type).replace(/_/g, ' ');
}

export default function ServiceCard({ service }) {
  const image = service.media?.[0]?.url || fallbackImage;

  return (
    <article className="nh-shine-wrap card-rise group flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--nh-border)] bg-[var(--nh-cream)]/80 shadow-sm">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={service.name}
          className="h-60 w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--nh-deep)]/55 via-transparent to-transparent opacity-80" />
        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--nh-accent)] shadow-sm backdrop-blur-sm">
          {formatType(service.type)}
        </span>
      </div>
      <div className="flex flex-1 flex-col space-y-3 p-5 md:p-6">
        <h3 className="font-display text-xl font-medium text-[var(--nh-ink)]">{service.name}</h3>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--nh-ink-muted)]">{service.description}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <span className="text-sm font-semibold text-[var(--nh-accent)]">
            {service.price ? `${service.currency} ${service.price}` : 'Custom pricing'}
          </span>
          <Link
            to={`/services/${service.id}`}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--nh-border)] bg-white/90 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nh-ink)] transition hover:border-[var(--nh-accent)]/45 hover:text-[var(--nh-accent)]"
          >
            View
            <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
