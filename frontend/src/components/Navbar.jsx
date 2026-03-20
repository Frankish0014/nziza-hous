import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const navClass = ({ isActive }) =>
  `text-xs md:text-sm tracking-[0.2em] uppercase transition ${
    isActive ? 'text-[#F77F00]' : 'text-stone-600 hover:text-stone-900'
  }`;

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-300/60 bg-white/85 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link to="/" className="text-lg font-semibold tracking-[0.24em] text-stone-900 md:text-xl">
          NZIZA HOUSE
        </Link>
        <button
          type="button"
          className="rounded-md border border-stone-400 px-3 py-1 text-xs uppercase tracking-widest text-stone-700 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          Menu
        </button>
        <nav
          className={`${menuOpen ? 'flex' : 'hidden'} w-full flex-col gap-3 border-t border-stone-200 pt-3 md:flex md:w-auto md:flex-row md:items-center md:gap-5 md:border-0 md:pt-0`}
        >
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={navClass}>
            About
          </NavLink>
          <NavLink to="/services" className={navClass}>
            Services
          </NavLink>
          <NavLink to="/booking" className={navClass}>
            Booking
          </NavLink>
          <NavLink to="/contact" className={navClass}>
            Contact
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navClass}>
              Admin
            </NavLink>
          )}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-full border-2 border-[#F77F00] px-4 py-1.5 text-xs uppercase tracking-wider text-[#F77F00] transition hover:bg-[#F77F00]/10"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/auth"
              className="rounded-full border-2 border-[#F77F00] px-4 py-1.5 text-xs uppercase tracking-wider text-[#F77F00] transition hover:bg-[#F77F00]/10"
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
