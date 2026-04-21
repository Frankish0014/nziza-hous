import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import useAuth from '../hooks/useAuth';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Experiences' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background,box-shadow,border-color] duration-300 ${
        scrolled
          ? 'border-[var(--nh-border)] bg-[var(--nh-cream)]/92 shadow-[0_8px_32px_rgba(20,18,16,0.06)] backdrop-blur-xl'
          : 'border-transparent bg-[var(--nh-cream)]/70 backdrop-blur-md'
      } border-b`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 md:py-4">
        <BrandLogo height={100} className="text-[var(--nh-ink)]" onNavigate={() => setMenuOpen(false)} />

        <button
          type="button"
          className="relative z-[60] flex h-11 w-11 flex-col items-center justify-center rounded-xl border border-[var(--nh-border)] bg-white/80 text-[var(--nh-ink)] shadow-sm md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((p) => !p)}
        >
          <span
            className={`block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
              menuOpen ? 'translate-y-[3px] rotate-45' : ''
            }`}
          />
          <span
            className={`mt-1.5 block h-0.5 w-5 rounded-full bg-current transition-opacity duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`mt-1.5 block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
              menuOpen ? '-translate-y-[9px] -rotate-45' : ''
            }`}
          />
        </button>

        <nav className="hidden items-center gap-1 md:flex md:gap-2">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-link-pill rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                  isActive
                    ? 'text-[var(--nh-accent)] is-active'
                    : 'text-[var(--nh-ink-muted)] hover:text-[var(--nh-ink)]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `nav-link-pill rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                  isActive ? 'text-[var(--nh-accent)] is-active' : 'text-[var(--nh-ink-muted)] hover:text-[var(--nh-ink)]'
                }`
              }
            >
              Admin
            </NavLink>
          )}
        </nav>
      </div>

      <div
        className={`fixed inset-0 z-[55] bg-[var(--nh-deep)]/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden
        onClick={() => setMenuOpen(false)}
      />

      <nav
        className={`fixed inset-x-0 top-0 z-[56] flex max-h-[min(92vh,540px)] flex-col gap-1 overflow-y-auto rounded-b-3xl border-b border-[var(--nh-border)] bg-[var(--nh-cream)] px-4 pb-8 pt-20 shadow-2xl transition-[transform,opacity] duration-300 ease-out md:hidden ${
          menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-[8px] opacity-0 pointer-events-none'
        }`}
      >
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `rounded-2xl px-4 py-3.5 text-sm font-semibold ${
                isActive ? 'bg-[var(--nh-accent-soft)] text-[var(--nh-accent)]' : 'text-[var(--nh-ink)]'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink
            to="/admin"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `rounded-2xl px-4 py-3.5 text-sm font-semibold ${
                isActive ? 'bg-[var(--nh-accent-soft)] text-[var(--nh-accent)]' : 'text-[var(--nh-ink)]'
              }`
            }
          >
            Admin
          </NavLink>
        )}
      </nav>
    </header>
  );
}
