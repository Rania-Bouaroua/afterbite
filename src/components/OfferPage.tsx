import { useEffect, useRef, useState } from 'react';
import { Clock3, Heart, Info, Loader2, MapPin, Minus, Package, Plus, ShieldCheck, Star, TriangleAlert } from 'lucide-react';
import type { OfferView } from '../types';
import { MAX_PER_ORDER } from '../data/offers';
import { formatMAD } from '../utils/calculations';
import type { ReserveResult } from '../hooks/useReservations';
import { PageHeader } from './PageHeader';
import { SafeImage } from './SafeImage';
import { RestaurantLogo } from './RestaurantLogo';

interface OfferPageProps {
  offer: OfferView;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onReserve: (offer: OfferView, qty: number) => ReserveResult;
}

export function OfferPage({ offer, isFavorite, onToggleFavorite, onReserve }: OfferPageProps) {
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const timer = useRef<number>();

  // If the user leaves the page mid-request, abandon the simulated reservation.
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const soldOut = offer.available <= 0;
  const maxQty = Math.max(1, Math.min(offer.available, MAX_PER_ORDER));
  const total = offer.price * qty;
  const saved = (offer.originalPrice - offer.price) * qty;

  const changeQty = (next: number) => {
    setError('');
    if (next < 1) return setError('Minimum quantity is 1.');
    if (next > offer.available) return setError(`Only ${offer.available} available tonight.`);
    if (next > MAX_PER_ORDER) return setError(`Maximum ${MAX_PER_ORDER} per reservation.`);
    setQty(next);
  };

  const handleReserve = () => {
    if (submitting) return;
    setError('');
    setSubmitting(true);
    // Simulated network latency for a realistic feel.
    timer.current = window.setTimeout(() => {
      const res = onReserve(offer, qty);
      setSubmitting(false);
      if (!res.ok) setError(res.error);
    }, 700);
  };

  return (
    <section className="container-x py-6 sm:py-10" aria-labelledby="offer-title">
      <PageHeader title="" backTo="deals" backLabel="Back to deals" />
      <div className="mt-2 grid overflow-hidden rounded-4xl bg-white shadow-lift md:grid-cols-[1.05fr_1fr]">
        {/* Image */}
        <div className="relative">
          <SafeImage photoId={offer.image} alt={offer.title} width={1100} height={1000} eager className="aspect-[4/3] md:aspect-auto md:h-full md:min-h-[600px]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-tangerine px-3.5 py-1.5 text-sm font-extrabold text-charcoal shadow">
            -{offer.discount}% tonight
          </span>
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            {offer.items.slice(0, 4).map((it) => (
              <span key={it} className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold capitalize text-forest backdrop-blur">
                {it}
              </span>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col p-5 sm:p-7">
          <div className="flex items-center gap-2 text-sm">
            <RestaurantLogo restaurant={offer.restaurant} size={32} />
            <span className="font-bold text-sage-dark">{offer.restaurant.name}</span>
            <span className="text-charcoal-muted">·</span>
            <span className="inline-flex items-center gap-1 font-semibold text-charcoal-soft">
              <Star className="h-4 w-4 fill-tangerine text-tangerine" />
              {offer.restaurant.rating.toFixed(1)} <span className="font-normal text-charcoal-muted">({offer.restaurant.reviews})</span>
            </span>
          </div>
          <h1 id="offer-title" className="mt-1.5 font-display text-3xl font-semibold leading-tight text-forest sm:text-[2.1rem]">{offer.title}</h1>
          <p className="mt-3 leading-relaxed text-charcoal-soft">{offer.description}</p>

          <div className="mt-5 flex items-end gap-3 rounded-3xl bg-white p-4 shadow-card">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">Tonight</p>
              <p className="font-display text-4xl font-bold leading-none text-forest">{formatMAD(offer.price)}</p>
            </div>
            <div className="pb-0.5">
              <p className="text-sm text-charcoal-muted line-through">{formatMAD(offer.originalPrice)}</p>
              <p className="text-sm font-bold text-tangerine-dark">Save {formatMAD(offer.originalPrice - offer.price)} ({offer.discount}%)</p>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-forest/10 bg-white/60 p-3">
              <dt className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted"><Clock3 className="h-3.5 w-3.5" /> Pickup starts</dt>
              <dd className="mt-0.5 text-base font-bold text-charcoal">{offer.pickupStart}</dd>
            </div>
            <div className="rounded-2xl border border-forest/10 bg-white/60 p-3">
              <dt className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted"><Clock3 className="h-3.5 w-3.5" /> Pickup ends</dt>
              <dd className="mt-0.5 text-base font-bold text-charcoal">{offer.pickupEnd}</dd>
            </div>
            <div className="col-span-2 rounded-2xl border border-forest/10 bg-white/60 p-3">
              <dt className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted"><MapPin className="h-3.5 w-3.5" /> Restaurant address</dt>
              <dd className="mt-0.5 font-semibold text-charcoal">{offer.address}</dd>
            </div>
            <div className="col-span-2 flex items-center justify-between rounded-2xl border border-forest/10 bg-white/60 p-3">
              <dt className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted"><Package className="h-3.5 w-3.5" /> Available quantity</dt>
              <dd className={`font-bold ${soldOut ? 'text-tangerine-dark' : 'text-forest'}`}>{soldOut ? 'Sold out' : `${offer.available} left`}</dd>
            </div>
          </dl>

          {/* Quantity */}
          {!soldOut && (
            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-charcoal">Quantity</p>
                <p className="text-xs text-charcoal-muted">Max {maxQty} for this offer</p>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-forest/15 bg-white p-1">
                <button onClick={() => changeQty(qty - 1)} disabled={qty <= 1} className="grid h-10 w-10 place-items-center rounded-full text-forest transition hover:bg-forest-50 disabled:opacity-30" aria-label="Decrease quantity">
                  <Minus className="h-4 w-4" />
                </button>
                <output className="w-10 text-center text-lg font-extrabold tabular-nums" aria-live="polite" aria-label="Selected quantity">{qty}</output>
                <button onClick={() => changeQty(qty + 1)} disabled={qty >= maxQty} className="grid h-10 w-10 place-items-center rounded-full text-forest transition hover:bg-forest-50 disabled:opacity-30" aria-label="Increase quantity">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 flex items-center gap-2 rounded-2xl bg-tangerine-light px-4 py-3 text-sm font-semibold text-tangerine-dark" role="alert">
              <TriangleAlert className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}

          <div className="mt-auto pt-6">
            {!soldOut && (
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-charcoal-soft">Total · you save <strong className="text-sage-dark">{formatMAD(saved)}</strong></span>
                <span className="font-display text-2xl font-bold text-forest">{formatMAD(total)}</span>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => onToggleFavorite(offer.id)}
                className={`btn-base h-[52px] w-[52px] shrink-0 border p-0 ${isFavorite ? 'border-tangerine bg-tangerine-light text-tangerine-dark' : 'border-forest/15 bg-white text-charcoal hover:border-forest/40'}`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                aria-pressed={isFavorite}
              >
                <Heart key={String(isFavorite)} className={`h-5 w-5 ${isFavorite ? 'animate-pop fill-tangerine text-tangerine' : ''}`} />
              </button>
              <button onClick={handleReserve} disabled={soldOut || submitting} className="btn-primary h-[52px] flex-1 text-[15px]">
                {submitting ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Reserving…</>
                ) : soldOut ? (
                  'Sold out tonight'
                ) : (
                  <>Reserve Now · {formatMAD(total)}</>
                )}
              </button>
            </div>
            <p className="mt-3 flex items-start gap-2 text-xs text-charcoal-muted">
              <ShieldCheck className="mt-px h-4 w-4 shrink-0 text-sage-dark" />
              Reservation simulation only — no payment is taken. In the real product you’d pay at pickup.
            </p>
            <p className="mt-1.5 flex items-start gap-2 text-xs text-charcoal-muted">
              <Info className="mt-px h-4 w-4 shrink-0" /> Fictional demo offer in {offer.city}; not affiliated with or endorsed by {offer.restaurant.name}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
