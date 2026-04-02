import { Link } from 'react-router-dom';
import logoSrc from '../logo.png';

/**
 * Brand mark from `src/logo.png`.
 * Default sizing is intentionally medium-large for visibility; override `height` if needed.
 */
export default function BrandLogo({
  to = '/',
  variant = 'default',
  className = '',
  height = 100,
  onNavigate,
}) {
  const isLight = variant === 'light';
  const minH = Math.max(48, Math.round(height * 0.92));

  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={`inline-flex items-center focus-visible:outline-none ${className}`}
      style={{ minHeight: minH }}
    >
      <img
        src={logoSrc}
        alt="Nziza House"
        className={`h-auto w-auto object-contain object-left ${
          isLight
            ? 'max-w-[min(320px,78vw)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]'
            : 'max-w-[min(300px,72vw)] drop-shadow-[0_1px_3px_rgba(20,18,16,0.12)]'
        }`}
        style={{ maxHeight: height }}
        loading="eager"
        decoding="async"
      />
    </Link>
  );
}