import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { getServiceById } from '../services/platformService';
import gymRoomPhotoOne from '../images/Gym 1.jpeg';
import gymRoomPhotoTwo from '../images/Gym 2.jpeg';

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

function getLocalGalleryMedia(service) {
  const serviceName = String(service?.name || '').toLowerCase();
  const serviceType = String(service?.type || '').toLowerCase();
  const isGym = serviceName.includes('gym') || serviceType.includes('gym');
  if (!isGym) return [];

  return [
    { id: 'gym-local-1', url: gymRoomPhotoOne, alt_text: 'Nziza Gym room view' },
    { id: 'gym-local-2', url: gymRoomPhotoTwo, alt_text: 'Nziza Gym training area' },
  ];
}

function getServiceDetails(type) {
  const t = String(type || '').toLowerCase();
  if (t.includes('gym')) {
    return {
      standardUnit: 'per session',
      duration: '60-90 minutes',
      audience: 'Beginners to advanced members',
      highlights: ['Modern cardio + strength equipment', 'Trainers available on request', 'Clean changing and shower access'],
    };
  }
  if (t.includes('apartment')) {
    return {
      standardUnit: 'per night',
      duration: 'Overnight stays',
      audience: 'Solo guests, couples, and business travelers',
      highlights: ['Private furnished room', 'Calm work and rest environment', 'Housekeeping support'],
    };
  }
  if (t.includes('coffee')) {
    return {
      standardUnit: 'menu pricing',
      duration: 'All day service',
      audience: 'Guests, meetings, and remote workers',
      highlights: ['Coffee and light meals', 'Comfortable seating zones', 'Fast service for meetings'],
    };
  }
  if (t.includes('sauna')) {
    return {
      standardUnit: 'per heat session',
      duration: '45-60 minutes',
      audience: 'Recovery and wellness-focused guests',
      highlights: ['Relaxation-focused heat therapy', 'Private booking windows', 'Staff-supported check-in'],
    };
  }
  if (t.includes('massage')) {
    return {
      standardUnit: 'per therapy session',
      duration: '60-90 minutes',
      audience: 'Guests seeking recovery and stress relief',
      highlights: ['Therapist-led personalized treatment', 'Targeted muscle recovery', 'Quiet treatment setting'],
    };
  }
  if (t.includes('lodge')) {
    return {
      standardUnit: 'per stay package',
      duration: 'Overnight / weekend packages',
      audience: 'Travelers, families, and weekend guests',
      highlights: ['Comfortable lodge accommodation', 'Hospitality-led guest support', 'Easy access to all on-site amenities'],
    };
  }
  return {
    standardUnit: 'per booking',
    duration: 'Depends on service',
    audience: 'All guests',
    highlights: ['Curated hospitality experience'],
  };
}

export default function ServiceDetailsPage() {
  const { id } = useParams();
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

  const apiMedia = Array.isArray(service.media) ? service.media : [];
  const localMedia = getLocalGalleryMedia(service);
  const media = [...apiMedia, ...localMedia].filter(
    (item, index, arr) => arr.findIndex((candidate) => candidate.url === item.url) === index,
  );
  const presentation = getPresentationContent(service);
  const details = getServiceDetails(service.type);
  const standardPriceText = 'Custom pricing';

  return (
    <main className="pb-20">
      <section className="border-b border-[var(--nh-border)] bg-gradient-to-b from-[var(--nh-bg-warm)] to-[var(--nh-bg)]">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--nh-accent)]">{formatType(service.type)}</p>
            <h1 className="font-display mt-4 max-w-4xl text-4xl font-medium tracking-tight text-[var(--nh-ink)] md:text-6xl">
              {presentation.name}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--nh-ink-muted)]">{presentation.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="inline-flex rounded-full border border-[var(--nh-border)] bg-white/90 px-5 py-2 font-semibold text-[var(--nh-accent)] shadow-sm">
                Custom pricing
              </span>
              <Link
                to="/booking"
                className="btn-primary rounded-full px-8 py-3 text-sm font-semibold"
              >
                Book this experience
              </Link>
              <Link
                to="/services"
                className="rounded-full border border-[var(--nh-border)] bg-white/80 px-6 py-3 text-sm font-semibold text-[var(--nh-ink)] transition hover:border-[var(--nh-accent)]/35"
              >
                ← All experiences
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <ScrollReveal>
            <article className="rounded-3xl border border-[var(--nh-border)] bg-white/85 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--nh-accent)]">Standard pricing</p>
              <p className="font-display mt-3 text-2xl text-[var(--nh-ink)]">{standardPriceText}</p>
            </article>
          </ScrollReveal>
          <ScrollReveal delay={50}>
            <article className="rounded-3xl border border-[var(--nh-border)] bg-white/85 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--nh-accent)]">Typical duration</p>
              <p className="font-display mt-3 text-2xl text-[var(--nh-ink)]">{details.duration}</p>
            </article>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <article className="rounded-3xl border border-[var(--nh-border)] bg-white/85 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--nh-accent)]">Ideal for</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--nh-ink-muted)]">{details.audience}</p>
            </article>
          </ScrollReveal>
        </div>
        <ScrollReveal delay={140}>
          <article className="mt-6 rounded-3xl border border-[var(--nh-border)] bg-[var(--nh-bg)]/55 p-6 shadow-sm">
            <h2 className="font-display text-2xl font-medium text-[var(--nh-ink)]">What to expect</h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--nh-ink-muted)]">
              {details.highlights.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--nh-accent)]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        </ScrollReveal>
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
            <Link to="/booking" className="btn-primary shrink-0 rounded-full px-8 py-3 text-sm font-semibold">
              Continue to booking
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
