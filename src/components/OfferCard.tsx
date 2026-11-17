import { Clock3, Heart, MapPin, Package, Star } from 'lucide-react';
import type { OfferView } from '../types';
import { LAST_FEW_THRESHOLD } from '../data/offers';
import { categoryMeta } from '../data/categories';
import { formatMAD } from '../utils/calculations';
import { SafeImage } from './SafeImage';
import { RestaurantLogo } from './RestaurantLogo';

interface OfferCardProps {
  offer: OfferView;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (id: string) => void;
}

export function OfferCard({ offer, isFavorite, onToggleFavorite, onOpen }: OfferCardProps) {
  const soldOut = offer.available <= 0;
  const lastFew = !soldOut && offer.available <= LAST_FEW_THRESHOLD;
  const CatIcon = categoryMeta[offer.category].icon;

  return (
    <article className={`group flex flex-col overflow-hidden rounded-[1.75rem] border border-forest/10 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift ${soldOut ? 'opacity-75' : ''}`}>
      <div className="relative">
        <button onClick={() => onOpen(offer.id)} className="block w-full" aria-label={`View offer: ${offer.title}`} tabIndex={-1}>
          <SafeImage
            photoId={offer.image}
            alt={offer.title}
            width={640}
            height={480}
            className={`aspect-[4/3] transition duration-500 group-hover:scale-[1.04] ${soldOut ? 'grayscale' : ''}`}
          />
        </button>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

        <span className="absolute left-3 top-3 rounded-full bg-tangerine px-3 py-1 text-[13px] font-extrabold text-charcoal shadow-sm">
          -{offer.discount}%
        </span>
        <button
          onClick={() => onToggleFavorite(offer.id)}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-card transition hover:scale-110"
          aria-label={isFavorite ? `Remove ${offer.title} from favorites` : `Add ${offer.title} to favorites`}
          aria-pressed={isFavorite}
        >
          <Heart key={String(isFavorite)} className={`h-[18px] w-[18px] ${isFavorite ? 'animate-pop fill-tangerine text-tangerine' : 'text-charcoal'}`} />
        </button>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-forest backdrop-blur">
          <CatIcon className="h-3.5 w-3.5" /> {offer.category}
        </span>
        {soldOut ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-charcoal px-2.5 py-1 text-xs font-bold text-white">Sold out</span>
        ) : lastFew ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-tangerine-dark">
            Only {offer.available} left
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2">
            <RestaurantLogo restaurant={offer.restaurant} size={26} />
            <p className="truncate text-[13px] font-bold text-sage-dark">{offer.restaurant.name}</p>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-charcoal-soft">
            <Star className="h-3.5 w-3.5 fill-tangerine text-tangerine" /> {offer.restaurant.rating.toFixed(1)}
          </span>
        </div>
        <h3 className="mt-1 font-display text-[1.3rem] font-semibold leading-snug text-charcoal">
          <button onClick={() => onOpen(offer.id)} className="text-left hover:text-forest">
            {offer.title}
          </button>
        </h3>

        <ul className="mt-3 space-y-1.5 text-[13px] text-charcoal-soft">
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-charcoal-muted" />
            <span className="truncate">{offer.neighborhood}, {offer.city}</span>
          </li>
          <li className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 shrink-0 text-charcoal-muted" />
            Pickup {offer.pickupStart} – {offer.pickupEnd}
          </li>
          <li className="flex items-center gap-2">
            <Package className="h-4 w-4 shrink-0 text-charcoal-muted" />
            {soldOut ? 'None left tonight' : `${offer.available} available`}
          </li>
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-xs text-charcoal-muted line-through">{formatMAD(offer.originalPrice)}</p>
            <p className="font-display text-[1.65rem] font-bold leading-none text-forest">{formatMAD(offer.price)}</p>
          </div>
          <button onClick={() => onOpen(offer.id)} className={soldOut ? 'btn-secondary px-4 py-2.5' : 'btn-primary px-4 py-2.5'}>
            View Offer
          </button>
        </div>
      </div>
    </article>
  );
}

export function OfferCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-forest/10 bg-white" aria-hidden="true">
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 rounded-full bg-cream-dark" />
        <div className="h-5 w-3/4 rounded-full bg-cream-dark" />
        <div className="h-3 w-1/2 rounded-full bg-cream-dark" />
        <div className="h-3 w-2/3 rounded-full bg-cream-dark" />
        <div className="flex justify-between pt-4">
          <div className="h-7 w-20 rounded-full bg-cream-dark" />
          <div className="h-10 w-28 rounded-full bg-cream-dark" />
        </div>
      </div>
    </div>
  );
}
