import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getServiceById } from '../services/platformService';

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    const run = async () => setService(await getServiceById(id));
    run();
  }, [id]);

  if (!service) return <main className="mx-auto max-w-5xl px-4 py-16 text-stone-600">Loading service...</main>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-[#F77F00]">{service.type.replace('_', ' ')}</p>
      <h1 className="mt-3 text-4xl font-semibold text-stone-900 md:text-5xl">{service.name}</h1>
      <p className="mt-6 leading-8 text-stone-700">{service.description}</p>
      <p className="mt-4 inline-flex rounded-full border-2 border-[#F77F00]/50 bg-[#F77F00]/15 px-4 py-1.5 font-medium text-[#b35900]">
        {service.price ? `${service.currency} ${service.price}` : 'Custom pricing available'}
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {(service.media || []).map((item) => (
          <img
            key={item.id}
            src={item.url}
            alt={item.alt_text || service.name}
            className="h-64 w-full rounded-2xl border border-stone-300 object-cover shadow-sm"
            loading="lazy"
          />
        ))}
      </div>
      <Link to="/booking" className="btn-primary mt-8 inline-block rounded-full px-7 py-3 font-semibold">
        Book Now
      </Link>
    </main>
  );
}

