export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.25em] text-[#F77F00]">About Nziza House</p>
      <h1 className="mt-3 text-4xl font-semibold text-stone-900 md:text-5xl">A curated destination for living well</h1>
      <p className="mt-6 max-w-4xl leading-8 text-stone-700">
        Nziza House brings wellness, hospitality, and modern lifestyle services together under one premium brand. Our platform is designed for guests
        who value comfort, detail, and seamless digital booking.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          ['Luxury service standards', 'Every touchpoint is tailored for quality and consistency.'],
          ['Technology-first operations', 'Real-time availability, centralized management, and clear communication.'],
          ['Built for expansion', 'Ready for multi-location growth and future payment integrations.'],
        ].map(([title, desc]) => (
          <article key={title} className="glass-panel elevated-hover rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
            <p className="mt-3 text-stone-600">{desc}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

