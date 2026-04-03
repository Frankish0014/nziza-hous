import { SITE_CONTACT } from '../lib/siteContact';

const stroke = {
  width: '1.5',
  cap: 'round',
  join: 'round',
};

function IconWrapper({ children, className = '' }) {
  return (
    <svg
      className={`h-5 w-5 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function IconPhone() {
  return (
    <IconWrapper>
      <path
        stroke="currentColor"
        strokeWidth={stroke.width}
        strokeLinecap={stroke.cap}
        strokeLinejoin={stroke.join}
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </IconWrapper>
  );
}

function IconWhatsApp() {
  return (
    <IconWrapper>
      <path
        stroke="currentColor"
        strokeWidth={stroke.width}
        strokeLinecap={stroke.cap}
        strokeLinejoin={stroke.join}
        d="M12 2.25c-5.52 0-10 4-10 8.95a8.8 8.8 0 001.62 5.1L2.25 21.75l5.72-1.5A8.93 8.93 0 0012 19.95c5.52 0 10-4 10-8.95S17.52 2.25 12 2.25z"
      />
      <path
        fill="currentColor"
        stroke="none"
        d="M9 11.25a.9.9 0 11-.001 1.801A.9.9 0 019 11.25zm3 0a.9.9 0 11-.001 1.801A.9.9 0 0112 11.25zm3 0a.9.9 0 11-.001 1.801A.9.9 0 0115 11.25z"
      />
    </IconWrapper>
  );
}

function IconMail() {
  return (
    <IconWrapper>
      <path
        stroke="currentColor"
        strokeWidth={stroke.width}
        strokeLinecap={stroke.cap}
        strokeLinejoin={stroke.join}
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </IconWrapper>
  );
}

function IconInstagram() {
  return (
    <IconWrapper>
      <rect
        x="2.25"
        y="2.25"
        width="19.5"
        height="19.5"
        rx="5.5"
        ry="5.5"
        stroke="currentColor"
        strokeWidth={stroke.width}
        strokeLinecap={stroke.cap}
        strokeLinejoin={stroke.join}
      />
      <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth={stroke.width} />
      <circle cx="17.65" cy="6.35" r="1.1" fill="currentColor" stroke="none" />
    </IconWrapper>
  );
}

/**
 * @param {{ variant?: 'light' | 'footer' }} props
 */
export default function ContactChannels({ variant = 'light' }) {
  const isFooter = variant === 'footer';

  const iconShell = isFooter
    ? 'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.07] text-[#e8a878] shadow-inner shadow-black/20 transition group-hover:border-[var(--nh-accent)]/35 group-hover:bg-white/[0.12] group-hover:text-[#f0c09a]'
    : 'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--nh-border)] bg-white text-[var(--nh-accent)] shadow-sm transition group-hover:border-[var(--nh-accent)]/40 group-hover:shadow-md';

  const titleClass = isFooter
    ? 'text-xs font-semibold uppercase tracking-[0.2em] text-[var(--nh-accent)]'
    : 'text-xs font-semibold uppercase tracking-[0.22em] text-[var(--nh-accent)]';

  const labelClass = isFooter ? 'text-[10px] font-semibold uppercase tracking-wider text-[#9a9286]' : 'text-[10px] font-semibold uppercase tracking-wider text-[var(--nh-ink-muted)]';

  const valueClass = isFooter
    ? 'mt-0.5 block text-sm font-medium text-[#e8e2d8] transition group-hover:text-[#faf6ef]'
    : 'mt-0.5 block text-sm font-medium text-[var(--nh-ink)] transition group-hover:text-[var(--nh-accent)]';

  const subLinkClass = isFooter
    ? 'mt-1 inline-flex text-xs font-semibold text-[#c9c2b6] transition group-hover:text-[var(--nh-accent)]'
    : 'mt-1 inline-flex text-xs font-semibold text-[var(--nh-accent)]';

  const cardClass = isFooter ? 'mt-8 space-y-1' : 'mt-10 space-y-3 rounded-3xl border border-[var(--nh-border)] bg-white/85 p-6 shadow-sm backdrop-blur-sm';

  const rowGap = isFooter ? 'gap-3.5' : 'gap-4';

  return (
    <div className={cardClass}>
      {!isFooter && <p className={titleClass}>Reach us directly</p>}
      {isFooter && <p className={titleClass}>Contact</p>}

      <ul className={`mt-4 ${isFooter ? 'space-y-3' : 'space-y-4'}`}>
        <li>
          <a
            href={`tel:${SITE_CONTACT.phoneTel}`}
            className={`group flex items-start ${rowGap} rounded-2xl py-1 transition ${isFooter ? '-mx-1 px-1 hover:bg-white/[0.04]' : 'py-0.5'}`}
          >
            <span className={iconShell}>
              <IconPhone />
            </span>
            <span className="min-w-0 flex-1">
              <span className={labelClass}>Phone</span>
              <span className={valueClass}>{SITE_CONTACT.phoneDisplay}</span>
            </span>
          </a>
        </li>
        <li>
          <a
            href={SITE_CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-start ${rowGap} rounded-2xl py-1 transition ${isFooter ? '-mx-1 px-1 hover:bg-white/[0.04]' : 'py-0.5'}`}
          >
            <span className={iconShell}>
              <IconWhatsApp />
            </span>
            <span className="min-w-0 flex-1">
              <span className={labelClass}>WhatsApp</span>
              <span className={valueClass}>Message us</span>
              <span className={`${subLinkClass} opacity-90`}>Open chat →</span>
            </span>
          </a>
        </li>
        <li>
          <a
            href={`mailto:${SITE_CONTACT.email}`}
            className={`group flex items-start ${rowGap} rounded-2xl py-1 transition ${isFooter ? '-mx-1 px-1 hover:bg-white/[0.04]' : 'py-0.5'}`}
          >
            <span className={iconShell}>
              <IconMail />
            </span>
            <span className="min-w-0 flex-1">
              <span className={labelClass}>Email</span>
              <span className={`${valueClass} break-all`}>{SITE_CONTACT.email}</span>
            </span>
          </a>
        </li>
        <li>
          <a
            href={SITE_CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-start ${rowGap} rounded-2xl py-1 transition ${isFooter ? '-mx-1 px-1 hover:bg-white/[0.04]' : 'py-0.5'}`}
          >
            <span className={iconShell}>
              <IconInstagram />
            </span>
            <span className="min-w-0 flex-1">
              <span className={labelClass}>Instagram</span>
              <span className={valueClass}>@nziza.house</span>
              <span className={`${subLinkClass} opacity-90`}>View profile →</span>
            </span>
          </a>
        </li>
      </ul>
    </div>
  );
}
