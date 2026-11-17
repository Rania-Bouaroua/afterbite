import { Moon } from 'lucide-react';
import { useNow } from '../hooks/useNow';
import { eveningStatus, formatCountdown } from '../utils/calculations';

/** Analog-style 8 PM badge with a live countdown to tonight's drop. */
export function EveningClock({ className = '' }: { className?: string }) {
  const now = useNow(1000);
  const { live, msLeft } = eveningStatus(now);
  const minuteAngle = now.getMinutes() * 6 + now.getSeconds() * 0.1;
  const hourAngle = (now.getHours() % 12) * 30 + now.getMinutes() * 0.5;

  return (
    <div className={`flex items-center gap-3.5 rounded-3xl bg-forest p-3.5 pr-5 text-white shadow-float ${className}`}>
      <div className="relative h-14 w-14 shrink-0">
        <svg viewBox="0 0 56 56" className="h-14 w-14" aria-hidden="true">
          <circle cx="28" cy="28" r="26" fill="#F8F6EF" />
          {/* highlight the 20:00–23:00 pickup window (8 → 11 o'clock) */}
          <path d="M28 28 L5.48 41 A26 26 0 0 1 15 5.48 Z" fill="#F29A54" opacity="0.28" />
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1="28" y1="5" x2="28" y2={i % 3 === 0 ? 9 : 7.5} stroke="#174C3C" strokeWidth={i % 3 === 0 ? 2 : 1} transform={`rotate(${i * 30} 28 28)`} opacity="0.55" />
          ))}
          <line x1="28" y1="28" x2="28" y2="15" stroke="#174C3C" strokeWidth="3" strokeLinecap="round" transform={`rotate(${hourAngle} 28 28)`} />
          <line x1="28" y1="28" x2="28" y2="9.5" stroke="#174C3C" strokeWidth="2" strokeLinecap="round" transform={`rotate(${minuteAngle} 28 28)`} />
          <circle cx="28" cy="28" r="2.6" fill="#F29A54" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sage">
          {live ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tangerine opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-tangerine" />
              </span>
              Deals live now
            </>
          ) : (
            <>
              <Moon className="h-3 w-3" /> Tonight’s drop · 20:00
            </>
          )}
        </p>
        <p className="mt-0.5 font-display text-2xl font-semibold tabular-nums leading-tight" aria-live="off">
          {formatCountdown(msLeft)}
        </p>
        <p className="text-xs text-white/70">{live ? 'left to reserve & collect' : 'until deals unlock'}</p>
      </div>
    </div>
  );
}
