import { ArrowRight, Clock3, Leaf, MapPin, Moon, Store, Wallet } from 'lucide-react';
import type { CityFilter, OfferView } from '../types';
import { heroImages } from '../data/images';
import { formatMAD } from '../utils/calculations';
import { goTo } from '../router';
import { SafeImage } from './SafeImage';
import { CitySelect } from './CitySelect';
import { EveningClock } from './EveningClock';

interface HeroProps {
  city: CityFilter;
  onCityChange: (c: CityFilter) => void;
  cityCounts: Record<string, number>;
  previewOffers: OfferView[];
  onOpenOffer: (id: string) => void;
}

export function Hero({ city, onCityChange, cityCounts, previewOffers, onOpenOffer }: HeroProps) {
  const featured = previewOffers[0];
  const maxDiscount = previewOffers.reduce((m, o) => Math.max(m, o.discount), 0);

  return (
    <section id="home" className="relative overflow-hidden">
      {/* soft decorative shapes */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-sage/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-tangerine/10 blur-3xl" aria-hidden="true" />

      <div className="container-x relative grid items-center gap-10 pb-14 pt-6 sm:pt-10 lg:grid-cols-[1.02fr_1fr] lg:gap-12 lg:pb-24 lg:pt-14">
        {/* Copy */}
        <div className="animate-slide-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-forest/10 bg-white px-3.5 py-1.5 text-xs font-bold text-forest shadow-sm">
            <Moon className="h-3.5 w-3.5 text-tangerine-dark" />
            Every evening from 8 PM · Morocco
          </span>

          <h1 className="mt-5 font-display text-[2.75rem] font-semibold leading-[1.02] tracking-tight text-forest sm:text-6xl lg:text-[4.3rem]">
            Good food deserves a{' '}
            <span className="relative whitespace-nowrap italic text-sage-dark">
              second chance.
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 9c60-6 150-8 296-3" stroke="#F29A54" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal-soft sm:text-xl">
            Discover amazing food deals near you every evening. Save money while fighting food waste.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => goTo('deals')} className="btn-primary px-7 py-4 text-[15px]">
              Explore Tonight’s Deals <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => goTo('partner')} className="btn-secondary px-7 py-4 text-[15px]">
              <Store className="h-4 w-4" /> Become a Partner
            </button>
          </div>

          {/* Location selector */}
          <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-forest/10 bg-white/80 p-4 shadow-card backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-tangerine-light text-tangerine-dark">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-charcoal">Deals near you</p>
                <p className="text-xs text-charcoal-muted">
                  <strong className="text-forest">{cityCounts[city] ?? 0} offers</strong> tonight in {city === 'All' ? 'Morocco' : city} · demo locations
                </p>
              </div>
            </div>
            <CitySelect value={city} onChange={onCityChange} />
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-charcoal-soft">
            <li className="flex items-center gap-2"><Wallet className="h-4 w-4 text-sage-dark" /> Up to {maxDiscount || 60}% off</li>
            <li className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-sage-dark" /> Pickup 20:00 – 23:00</li>
            <li className="flex items-center gap-2"><Leaf className="h-4 w-4 text-sage-dark" /> Pay at pickup</li>
          </ul>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-xl animate-slide-up [animation-delay:120ms] lg:max-w-none">
          <div className="relative grid grid-cols-[1.35fr_1fr] gap-3 sm:gap-4">
            <SafeImage
              photoId={heroImages.spread}
              alt="A table of freshly prepared dishes"
              width={900}
              height={1100}
              eager
              className="row-span-2 h-full min-h-[300px] rounded-[2rem] shadow-lift"
            />
            <SafeImage photoId={heroImages.croissant} alt="Fresh croissants" width={500} height={500} eager className="aspect-square rounded-[1.6rem] shadow-card" />
            <SafeImage photoId={heroImages.sushi} alt="Sushi platter" width={500} height={500} eager className="aspect-square rounded-[1.6rem] shadow-card" />

            {/* 8 PM concept */}
            <EveningClock className="absolute -left-2 top-5 sm:-left-6 sm:top-8" />

            {/* Discount stamp */}
            <div className="absolute right-[34%] top-[44%] hidden h-20 w-20 animate-float place-items-center rounded-full bg-tangerine text-center font-display text-charcoal shadow-float sm:grid">
              <span className="leading-none">
                <span className="block text-[10px] font-sans font-bold uppercase tracking-wider">up to</span>
                <span className="text-2xl font-bold">-{maxDiscount || 60}%</span>
              </span>
            </div>
          </div>

          {/* Featured preview card */}
          {featured && (
            <button
              onClick={() => onOpenOffer(featured.id)}
              className="group absolute -bottom-8 left-3 right-3 flex items-center gap-3 rounded-3xl bg-white p-3 text-left shadow-float transition hover:-translate-y-1 sm:-bottom-6 sm:left-auto sm:right-6 sm:w-[340px]"
            >
              <SafeImage photoId={featured.image} alt={featured.title} width={160} height={160} className="h-16 w-16 shrink-0 rounded-2xl" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-sage-dark">Best deal tonight · {featured.city}</p>
                <p className="truncate text-sm font-bold text-charcoal">{featured.title}</p>
                <p className="mt-0.5 flex items-baseline gap-2">
                  <span className="text-base font-extrabold text-forest">{formatMAD(featured.price)}</span>
                  <span className="text-xs text-charcoal-muted line-through">{formatMAD(featured.originalPrice)}</span>
                </p>
              </div>
              <span className="rounded-full bg-tangerine px-2.5 py-1 text-xs font-extrabold text-charcoal">-{featured.discount}%</span>
            </button>
          )}
        </div>
      </div>

      {/* Preview strip */}
      {previewOffers.length > 1 && (
        <div className="container-x relative pb-4 pt-6 lg:pt-0">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-charcoal-muted">Tonight’s preview</p>
            <button onClick={() => goTo('deals')} className="text-sm font-bold text-forest hover:underline">
              See all deals
            </button>
          </div>
          <div className="no-scrollbar -mx-4 mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
            {previewOffers.slice(1, 5).map((o) => (
              <button
                key={o.id}
                onClick={() => onOpenOffer(o.id)}
                className="group flex w-[78%] shrink-0 snap-start items-center gap-3 rounded-2xl border border-forest/10 bg-white p-2.5 text-left transition hover:-translate-y-0.5 hover:shadow-card sm:w-auto"
              >
                <SafeImage photoId={o.image} alt={o.title} width={140} height={140} className="h-14 w-14 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-charcoal">{o.title}</p>
                  <p className="truncate text-xs text-charcoal-muted">{o.restaurant.name} · {o.city}</p>
                  <p className="mt-0.5 text-[13px]">
                    <span className="font-extrabold text-forest">{formatMAD(o.price)}</span>{' '}
                    <span className="text-xs font-bold text-tangerine-dark">-{o.discount}%</span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
