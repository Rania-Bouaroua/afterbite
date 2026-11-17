import { useState } from 'react';
import { CalendarCheck, CheckCircle2, Clock3, Leaf, MapPin, Search, Wallet, XCircle } from 'lucide-react';
import type { Reservation } from '../types';
import { formatMAD, reservationTotals } from '../utils/calculations';
import { PageHeader } from './PageHeader';
import { SafeImage } from './SafeImage';
import { StatusPill } from './StatusPill';
import { ConfirmDialog } from './ConfirmDialog';

interface ReservationsPageProps {
  reservations: Reservation[];
  onCancel: (id: string) => void;
  onCollected: (id: string) => void;
  onExplore: () => void;
}

export function ReservationsPage({ reservations, onCancel, onCollected, onExplore }: ReservationsPageProps) {
  const [tab, setTab] = useState<'upcoming' | 'history'>('upcoming');
  const [toCancel, setToCancel] = useState<Reservation | null>(null);

  const upcoming = reservations.filter((r) => r.status === 'Confirmed');
  const history = reservations.filter((r) => r.status !== 'Confirmed');
  const list = tab === 'upcoming' ? upcoming : history;
  const totals = reservationTotals(reservations);

  return (
    <>
      <section className="container-x max-w-4xl py-6 sm:py-10">
        <PageHeader title="My reservations" subtitle="Your pickups for tonight and your past rescues." />
        <div className="mt-8">
        {reservations.length > 0 && (
          <div className="mb-5 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { icon: CalendarCheck, label: 'Reservations', value: String(totals.count) },
              { icon: Leaf, label: 'Meals rescued', value: String(totals.meals) },
              { icon: Wallet, label: 'Money saved', value: formatMAD(totals.saved) },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white p-3 shadow-card sm:p-4">
                <s.icon className="h-4 w-4 text-sage-dark" />
                <p className="mt-1.5 font-display text-lg font-bold text-forest sm:text-2xl">{s.value}</p>
                <p className="text-[11px] font-semibold text-charcoal-muted sm:text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mb-4 inline-flex rounded-full bg-cream-dark p-1" role="tablist" aria-label="Reservation lists">
          {(['upcoming', 'history'] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${tab === t ? 'bg-white text-forest shadow-sm' : 'text-charcoal-soft hover:text-forest'}`}
            >
              {t === 'upcoming' ? `Upcoming (${upcoming.length})` : `History (${history.length})`}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="rounded-4xl border border-dashed border-forest/20 bg-white px-6 py-12 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-forest-50 text-forest">
              <CalendarCheck className="h-8 w-8" />
            </span>
            <h3 className="mt-4 font-display text-2xl font-semibold text-forest">
              {tab === 'upcoming' ? 'No upcoming pickups' : 'No past reservations'}
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-charcoal-soft">
              {tab === 'upcoming' ? 'Reserve a deal tonight and it will appear here with your pickup details.' : 'Collected and cancelled reservations will show up here.'}
            </p>
            {tab === 'upcoming' && (
              <button onClick={onExplore} className="btn-primary mt-6">
                <Search className="h-4 w-4" /> Find a deal
              </button>
            )}
          </div>
        ) : (
          <ul className="space-y-3">
            {list.map((r) => (
              <li key={r.id} className={`rounded-3xl bg-white p-4 shadow-card ${r.status === 'Cancelled' ? 'opacity-70' : ''}`}>
                <div className="flex gap-3 sm:gap-4">
                  <SafeImage photoId={r.image} alt={r.offerTitle} width={200} height={200} className={`h-20 w-20 shrink-0 rounded-2xl sm:h-24 sm:w-24 ${r.status === 'Cancelled' ? 'grayscale' : ''}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-mono text-xs font-bold tracking-wider text-charcoal-muted">{r.id}</p>
                      <StatusPill status={r.status} />
                    </div>
                    <p className="mt-1 text-xs font-bold text-sage-dark">{r.restaurantName}</p>
                    <p className="font-bold leading-snug text-charcoal">{r.offerTitle}</p>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-charcoal-soft">
                      <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {r.pickupStart} – {r.pickupEnd}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {r.city}</span>
                      <span>Qty {r.quantity}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-cream-dark pt-3">
                  <p className="text-sm text-charcoal-soft">
                    Total <span className="font-display text-xl font-bold text-forest">{formatMAD(r.total)}</span>
                  </p>
                  {r.status === 'Confirmed' && (
                    <div className="flex gap-2">
                      <button onClick={() => setToCancel(r)} className="btn-base border border-forest/15 bg-white px-3.5 py-2 text-xs text-charcoal hover:border-tangerine hover:text-tangerine-dark">
                        <XCircle className="h-4 w-4" /> Cancel
                      </button>
                      <button onClick={() => onCollected(r.id)} className="btn-base bg-forest px-3.5 py-2 text-xs text-white hover:bg-forest-700">
                        <CheckCircle2 className="h-4 w-4" /> Mark collected
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-5 text-center text-xs text-charcoal-muted">Demo reservations are stored locally in this browser. No payment is ever taken.</p>
        </div>
      </section>

      <ConfirmDialog
        open={!!toCancel}
        title="Cancel this reservation?"
        message={toCancel ? `${toCancel.offerTitle} × ${toCancel.quantity} will be released back to ${toCancel.restaurantName} for other customers.` : ''}
        confirmLabel="Yes, cancel"
        onCancel={() => setToCancel(null)}
        onConfirm={() => {
          if (toCancel) onCancel(toCancel.id);
          setToCancel(null);
        }}
      />
    </>
  );
}
