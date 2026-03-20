import { Link } from 'react-router-dom';

/** Place `hero.mp4` in `public/videos/` so Vite does not bundle it (keeps builds fast & dist small). */
const HERO_VIDEO_SRC = `${import.meta.env.BASE_URL}videos/hero.mp4`;

const experiences = [
  {
    title: 'Gym',
    description:
      'Train in a premium fitness space with modern equipment, expert guidance, and a motivating atmosphere built for real progress.',
    cta: 'Book Training Session',
  },
  {
    title: 'Apartments',
    description:
      'Choose short or long-stay apartments designed for comfort, privacy, and a home-away-from-home lifestyle experience.',
    cta: 'Reserve Apartment Stay',
  },
  {
    title: 'Coffee Shop',
    description:
      'Enjoy artisan coffee, fresh bites, and calm social spaces perfect for meetings, remote work, and relaxed conversations.',
    cta: 'Plan Your Visit',
  },
  {
    title: 'Sauna',
    description:
      'Reset body and mind with warm, restorative sauna sessions crafted to improve relaxation, circulation, and overall wellbeing.',
    cta: 'Book Sauna Session',
  },
  {
    title: 'Massage',
    description:
      'Experience personalized massage therapy that eases stress, releases tension, and helps you recover with total peace.',
    cta: 'Schedule Massage',
  },
  {
    title: 'Lodge',
    description:
      'Stay in serene lodge accommodations where elegant design, hospitality, and nature-inspired calm come together beautifully.',
    cta: 'Book Lodge Experience',
  },
];

const trustMetrics = [
  { label: 'Services under one roof', value: '6+' },
  { label: 'Easy booking steps', value: '3' },
  { label: 'Support response window', value: '< 24h' },
  { label: 'Designed for comfort', value: '100%' },
];

export default function HomePage() {
  return (
    <main>
      <section className="relative min-h-[76vh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={HERO_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/50 via-stone-950/65 to-stone-950/90" />
        <div className="relative mx-auto flex max-w-7xl flex-col px-4 py-24 md:py-28">
          <p className="text-xs uppercase tracking-[0.35em] text-[#F77F00]">Nziza House</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight text-white md:text-7xl">
            Refined Lifestyle & Hospitality Experiences
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-200">
            Book elevated wellness, stay, and dining services in one seamless platform designed for modern guests.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/booking" className="btn-primary rounded-full px-7 py-3 font-semibold shadow-lg shadow-[#F77F00]/35 transition">
              Book Now
            </Link>
            <Link
              to="/services"
              className="rounded-full border-2 border-white px-7 py-3 text-white transition hover:border-[#F77F00] hover:bg-[#F77F00]/20"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-3 rounded-2xl border border-stone-300/80 bg-white/70 p-4 shadow-sm md:grid-cols-4">
          {trustMetrics.map((metric) => (
            <article key={metric.label} className="rounded-xl border border-stone-200 bg-white/90 p-4">
              <p className="text-2xl font-semibold text-[#F77F00]">{metric.value}</p>
              <p className="mt-1 text-sm text-stone-700">{metric.label}</p>
            </article>
          ))}
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#F77F00]">Our Experiences</p>
        <h2 className="mt-3 text-3xl font-semibold text-stone-900 md:text-4xl">
          Discover every way to experience Nziza House
        </h2>
        <p className="mt-3 max-w-3xl text-stone-700">
          From wellness and recovery to stays and social moments, each experience is crafted to help you feel better, live better,
          and enjoy every detail of your time with us.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {experiences.map((item) => (
            <article key={item.title} className="glass-panel elevated-hover flex flex-col rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-stone-900">{item.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-stone-600">{item.description}</p>
              <Link
                to="/booking"
                className="mt-5 inline-flex w-fit rounded-full border-2 border-[#F77F00] bg-[#F77F00]/10 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#d96d00] transition hover:bg-[#F77F00] hover:text-white"
              >
                {item.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="glass-panel rounded-2xl p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[#F77F00]">Guest Journey</p>
          <h3 className="mt-3 text-2xl font-semibold text-stone-900 md:text-3xl">How your experience works</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ['01', 'Choose your experience', 'Select the service that matches your lifestyle goals and preferred schedule.'],
              ['02', 'Submit booking details', 'Share contact information and payment proof securely through our booking page.'],
              ['03', 'Receive confirmation', 'Our team confirms your request by email and phone, then prepares your visit.'],
            ].map(([step, title, desc]) => (
              <article key={step} className="rounded-xl border border-stone-200 bg-white/80 p-5">
                <p className="text-sm font-semibold tracking-widest text-[#F77F00]">{step}</p>
                <p className="mt-2 text-lg font-medium text-stone-900">{title}</p>
                <p className="mt-2 text-sm leading-7 text-stone-600">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

