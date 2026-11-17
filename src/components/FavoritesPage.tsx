import { Heart, MapPin, Search, Trash2 } from 'lucide-react';
import type { OfferView } from '../types';
import { formatMAD } from '../utils/calculations';
import { PageHeader } from './PageHeader';
import { SafeImage } from './SafeImage';

interface FavoritesPageProps {
  favorites: OfferView[];
  onOpenOffer: (id: string) => void;
  onRemove: (id: string) => void;
  onExplore: () => void;
}

export function FavoritesPage({ favorites, onOpenOffer, onRemove, onExplore }: FavoritesPageProps) {
  return (
    <section className="container-x py-6 sm:py-10">
      <PageHeader title="Your favorites" />
      <p className="mb-6 mt-2 text-charcoal-soft">
        {favorites.length > 0 ? `${favorites.length} saved ${favorites.length === 1 ? 'offer' : 'offers'} · stored on this device` : 'Tap the heart on any offer to save it here.'}
      </p>

      {favorites.length === 0 ? (
        <div className="rounded-4xl border border-dashed border-forest/20 bg-white px-6 py-12 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-tangerine-light text-tangerine-dark">
            <Heart className="h-8 w-8" />
          </span>
          <h3 className="mt-4 font-display text-2xl font-semibold text-forest">No favorites yet</h3>
          <p className="mx-auto mt-2 max-w-xs text-sm text-charcoal-soft">Save the deals you love and find them again in one tap.</p>
          <button onClick={onExplore} className="btn-primary mt-6">
            <Search className="h-4 w-4" /> Explore tonight’s deals
          </button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((o) => {
            const soldOut = o.available <= 0;
            return (
              <li key={o.id} className="flex gap-3 rounded-3xl bg-white p-3 shadow-card">
                <button onClick={() => onOpenOffer(o.id)} className="shrink-0" aria-label={`Open ${o.title}`}>
                  <SafeImage photoId={o.image} alt={o.title} width={220} height={220} className={`h-24 w-24 rounded-2xl ${soldOut ? 'grayscale' : ''}`} />
                </button>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate text-xs font-bold text-sage-dark">{o.restaurant.name}</p>
                  <button onClick={() => onOpenOffer(o.id)} className="text-left text-[15px] font-bold leading-snug text-charcoal hover:text-forest">
                    {o.title}
                  </button>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-charcoal-muted">
                    <MapPin className="h-3 w-3" /> {o.city} · {soldOut ? <span className="font-bold text-tangerine-dark">Sold out</span> : `${o.available} left`}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <p className="text-sm">
                      <span className="font-extrabold text-forest">{formatMAD(o.price)}</span>{' '}
                      <span className="text-xs text-charcoal-muted line-through">{formatMAD(o.originalPrice)}</span>
                    </p>
                    <div className="flex gap-1">
                      <button onClick={() => onRemove(o.id)} className="grid h-9 w-9 place-items-center rounded-full text-charcoal-muted transition hover:bg-tangerine-light hover:text-tangerine-dark" aria-label={`Remove ${o.title} from favorites`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => onOpenOffer(o.id)} className="rounded-full bg-forest px-3.5 text-xs font-bold text-white transition hover:bg-forest-700">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
