'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function BrandLogo({
  href = '/',
  variant = 'default',
  className = '',
  height = 100,
  onNavigate,
}) {
  const isLight = variant === 'light';
  const minH = Math.max(48, Math.round(height * 0.92));

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`inline-flex items-center focus-visible:outline-none ${className}`}
      style={{ minHeight: minH }}
    >
      <Image
        src="/logo.png"
        alt="Nziza House"
        width={320}
        height={120}
        className={`h-auto w-auto object-contain object-left ${
          isLight
            ? 'max-w-[min(320px,78vw)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]'
            : 'max-w-[min(300px,72vw)] drop-shadow-[0_1px_3px_rgba(20,18,16,0.12)]'
        }`}
        style={{ maxHeight: height }}
        priority
      />
    </Link>
  );
}
