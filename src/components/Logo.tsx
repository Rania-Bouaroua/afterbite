import { useId } from 'react';

interface LogoMarkProps {
  size?: number;
  variant?: 'color' | 'light';
  className?: string;
}

/**
 * AfterBite mark: a plate with a bite taken out of it (food), clock hands set
 * at 8 o'clock (the evening drop), and a fresh leaf growing from the bite (sustainability).
 */
export function LogoMark({ size = 40, variant = 'color', className = '' }: LogoMarkProps) {
  const id = useId().replace(/:/g, '');
  const bg = variant === 'color' ? '#174C3C' : '#F8F6EF';
  const plate = variant === 'color' ? '#F8F6EF' : '#174C3C';
  const hands = variant === 'color' ? '#174C3C' : '#F8F6EF';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <mask id={`bite-${id}`}>
          <rect width="48" height="48" fill="#fff" />
          <circle cx="36.5" cy="11.5" r="6" fill="#000" />
          <circle cx="40.5" cy="18" r="4.6" fill="#000" />
        </mask>
      </defs>
      <rect width="48" height="48" rx="13" fill={bg} />
      <circle cx="24" cy="25" r="15" fill={plate} mask={`url(#bite-${id})`} />
      {/* hour ticks */}
      <g fill={hands} opacity="0.35">
        <circle cx="24" cy="13.6" r="1" />
        <circle cx="12.6" cy="25" r="1" />
        <circle cx="24" cy="36.4" r="1" />
      </g>
      {/* 8 o'clock */}
      <path d="M24 25V15.8M24 25l-7.2 4.1" stroke={hands} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="25" r="2.1" fill="#F29A54" />
      {/* leaf */}
      <path d="M32.6 14.2c.9-5.3 5-8 10.4-8.1-.3 5.2-3.5 8.9-8.7 9.4" fill="#79A879" />
      <path d="M33.6 14.6c2.2-2.6 4.6-4.6 7.3-6.2" stroke={bg} strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.6" />
    </svg>
  );
}

export function Logo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={compact ? 34 : 38} variant={light ? 'light' : 'color'} />
      <span className={`font-display text-[1.45rem] font-semibold leading-none tracking-tight ${light ? 'text-cream' : 'text-forest'}`}>
        After<span className={light ? 'text-sage' : 'text-sage-dark'}>Bite</span>
      </span>
    </span>
  );
}
