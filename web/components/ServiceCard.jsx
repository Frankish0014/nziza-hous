'use client';

import Link from 'next/link';
import {
  getThematicExperienceImage,
  getThematicImageObjectPosition,
} from '@/client/experiencePhotos';

function formatType(type) {
  if (!type) return 'Experience';
  return String(type).replace(/_/g, ' ');
}

function getPresentationContent(service) {
  const t = String(service?.type || '').toLowerCase();
  if (t.includes('gym')) {
    return {
      name: 'Nziza Gym',
      description: 'Train in a premium fitness space with modern equipment and a motivating atmosphere built for real progress.',
    };
  }
  if (t.includes('apartment') || t.includes('apt')) {
    return {
      name: 'Nziza Apartments',
      description: 'Designer apartments for short or long stays with privacy, comfort, and a true second-home feel.',
    };
  }
  if (t.includes('coffee')) {
    return {
      name: 'Nziza Coffee Shop',
      description: 'Artisan coffee, fresh bites, and calm corners for meetings, remote work, and unhurried conversation.',
    };
  }
  if (t.includes('sauna')) {
    return {
      name: 'Restorative Sauna',
      description: 'Warm, restorative heat sessions designed to improve circulation, relax muscles, and reset the mind.',
    };
  }
  if (t.includes('massage')) {
    return {
      name: 'Therapeutic Massage',
      description: 'Personalized bodywork that releases tension, supports recovery, and leaves you grounded.',
    };
  }
  if (t.includes('lodge')) {
    return {
      name: 'Nziza Lodge',
      description: 'Serene lodge stays blending hospitality, comfort, and a peaceful escape from the everyday.',
    };
  }
  return {
    name: service?.name || 'Nziza Experience',
    description: service?.description || '',
  };
}

export default function ServiceCard({ service }) {
  const image = getThematicExperienceImage(service.type);
  const objectPosition = getThematicImageObjectPosition(service.type);
  const presentation = getPresentationContent(service);

  return (
    <article className="nh-shine-wrap card-rise group flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--nh-border)] bg-[var(--nh-cream)]/80 shadow-sm">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={presentation.name}
          className="h-60 w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
          style={objectPosition ? { objectPosition } : undefined}
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--nh-deep)]/55 via-transparent to-transparent opacity-80" />
        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--nh-accent)] shadow-sm backdrop-blur-sm">
          {formatType(service.type)}
        </span>
      </div>
      <div className="flex flex-1 flex-col space-y-3 p-5 md:p-6">
        <h3 className="font-display text-xl font-medium text-[var(--nh-ink)]">{presentation.name}</h3>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--nh-ink-muted)]">{presentation.description}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <span className="text-sm font-semibold text-[var(--nh-accent)]">
            {service.price ? `${service.currency} ${service.price}` : 'Custom pricing'}
          </span>
          <Link
            href={`/services/${service.id}`}
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
