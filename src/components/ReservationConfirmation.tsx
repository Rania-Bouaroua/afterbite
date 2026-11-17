import { useState } from 'react';
import { Check, CalendarCheck, Copy, CopyCheck, Leaf } from 'lucide-react';
import type { Reservation } from '../types';
import { formatMAD } from '../utils/calculations';
import { Modal } from './Modal';
import { SafeImage } from './SafeImage';
import { StatusPill } from './StatusPill';

interface Props {
  reservation: Reservation | null;
  onClose: () => void;
  onViewReservations: () => void;
}

export function ReservationConfirmation({ reservation, onClose, onViewReservations }: Props) {
  const [copied, setCopied] = useState(false);
  if (!reservation) return null;
  const r = reservation;
  const saved = (r.originalUnitPrice - r.unitPrice) * r.quantity;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(r.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const rows: [string, string][] = [
    ['Restaurant', r.restaurantName],
    ['Offer', r.offerTitle],
    ['Quantity', `${r.quantity}`],
    ['Pickup time', `Tonight, ${r.pickupStart} – ${r.pickupEnd}`],
    ['Address', r.address],
  ];

  return (
    <Modal open onClose={onClose} title="Reservation confirmed" hideTitle size="sm">
      <div className="pt-7 text-center">
        <div className="relative mx-auto h-20 w-20">
          <span className="absolute inset-0 animate-ping rounded-full bg-sage/30 [animation-iteration-count:2]" />
          <span className="relative grid h-20 w-20 animate-scale-in place-items-center rounded-full bg-forest text-white shadow-lift">
            <Check className="h-10 w-10" strokeWidth={3} />
          </span>
        </div>
        <h3 className="mt-5 font-display text-[1.9rem] font-semibold leading-tight text-forest">Your food is saved!</h3>
        <p className="mt-1 text-lg text-charcoal-soft">See you soon.</p>
      </div>

      {/* Ticket */}
      <div className="relative mt-6 overflow-hidden rounded-3xl bg-white shadow-card">
        <div className="flex items-center gap-3 p-4">
          <SafeImage photoId={r.image} alt={r.offerTitle} width={160} height={160} className="h-14 w-14 shrink-0 rounded-2xl" />
          <div className="min-w-0 flex-1 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">Reservation ID</p>
            <p className="font-mono text-lg font-bold tracking-wider text-charcoal">{r.id}</p>
          </div>
          <button onClick={copy} className="grid h-10 w-10 place-items-center rounded-full bg-cream text-forest transition hover:bg-forest-50" aria-label="Copy reservation ID">
            {copied ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <div className="relative border-t-2 border-dashed border-cream-dark">
          <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-cream" />
          <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-cream" />
        </div>
        <dl className="space-y-2.5 p-4 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <dt className="shrink-0 text-charcoal-muted">{k}</dt>
              <dd className="text-right font-semibold text-charcoal">{v}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4">
            <dt className="text-charcoal-muted">Status</dt>
            <dd><StatusPill status={r.status} /></dd>
          </div>
          <div className="flex items-end justify-between gap-4 border-t border-cream-dark pt-3">
            <dt className="font-bold text-charcoal">Total (pay at pickup)</dt>
            <dd className="font-display text-2xl font-bold text-forest">{formatMAD(r.total)}</dd>
          </div>
        </dl>
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-sage-light px-4 py-3 text-sm font-semibold text-forest">
        <Leaf className="h-4 w-4" /> You saved {formatMAD(saved)} and rescued {r.quantity} {r.quantity > 1 ? 'meals' : 'meal'}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button onClick={onClose} className="btn-secondary" data-autofocus>Keep exploring</button>
        <button onClick={onViewReservations} className="btn-primary">
          <CalendarCheck className="h-4 w-4" /> My reservations
        </button>
      </div>
      <p className="mt-4 text-center text-xs text-charcoal-muted">Demo simulation — no real order or payment was made.</p>
    </Modal>
  );
}
