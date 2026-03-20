import { Link } from 'react-router-dom';

export default function ServiceCard({ service }) {
  const image = service.media?.[0]?.url || 'https://images.unsplash.com/photo-1560067174-89455598d5ac?auto=format&fit=crop&w=1200&q=80';

  return (
    <article className="glass-panel elevated-hover group overflow-hidden rounded-2xl border border-stone-200">
      <div className="overflow-hidden">
        <img
          src={image}
          alt={service.name}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="space-y-3 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#F77F00]">{service.type.replace('_', ' ')}</p>
        <h3 className="text-xl font-semibold text-stone-900">{service.name}</h3>
        <p className="line-clamp-3 text-stone-600">{service.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-medium text-[#d96d00]">
            {service.price ? `${service.currency} ${service.price}` : 'Custom Pricing'}
          </span>
          <Link
            to={`/services/${service.id}`}
            className="rounded-full border-2 border-[#F77F00] px-4 py-1.5 text-xs uppercase tracking-wider text-[#F77F00] transition hover:bg-[#F77F00] hover:text-white"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
