import { useEffect, useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import { getServices } from '../services/platformService';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        setServices(await getServices());
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#F77F00]">Curated Collection</p>
        <h1 className="mt-3 text-4xl font-semibold text-stone-900 md:text-5xl">Services</h1>
        <p className="mt-3 max-w-2xl text-stone-700">
          Choose from wellness, hospitality, and lifestyle experiences crafted for comfort and modern luxury.
        </p>
      </div>
      {loading ? (
        <div className="glass-panel rounded-2xl p-6 text-stone-600">Loading services...</div>
      ) : (
        <section className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </section>
      )}
    </main>
  );
}

