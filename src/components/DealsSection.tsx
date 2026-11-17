import { useMemo, useState } from 'react';
import { ArrowUpDown, Info, RotateCcw, SearchX, SlidersHorizontal } from 'lucide-react';
import type { Availability, CityFilter, Filters, OfferView, SortOption } from '../types';
import { filterAndSortOffers } from '../utils/calculations';
import { SearchBar } from './SearchBar';
import { CategoryFilter } from './CategoryFilter';
import { CitySelect } from './CitySelect';
import { OfferCard, OfferCardSkeleton } from './OfferCard';

export const PRICE_CEILING = 150;

export const DEFAULT_FILTERS: Filters = {
  search: '',
  category: 'All',
  maxPrice: PRICE_CEILING,
  minDiscount: 0,
  availability: 'all',
  sort: 'discount',
};

interface DealsSectionProps {
  offers: OfferView[]; // already scoped to the selected city
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
  city: CityFilter;
  onCityChange: (c: CityFilter) => void;
  cityCounts: Record<string, number>;
  loading: boolean;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onOpenOffer: (id: string) => void;
}

const sortLabels: Record<SortOption, string> = {
  discount: 'Highest discount',
  priceAsc: 'Lowest price',
  priceDesc: 'Highest price',
  popular: 'Most popular',
};

export function DealsSection(props: DealsSectionProps) {
  const { offers, filters, onFiltersChange, city, onCityChange, cityCounts, loading, isFavorite, onToggleFavorite, onOpenOffer } = props;
  const [showFilters, setShowFilters] = useState(false);
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => onFiltersChange({ ...filters, [key]: value });

  const results = useMemo(() => filterAndSortOffers(offers, filters), [offers, filters]);

  // Category counts reflect every filter except the category itself.
  const categoryCounts = useMemo(() => {
    const base = filterAndSortOffers(offers, { ...filters, category: 'All' });
    const counts: Record<string, number> = { All: base.length };
    base.forEach((o) => (counts[o.category] = (counts[o.category] ?? 0) + 1));
    return counts;
  }, [offers, filters]);

  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.category !== 'All' ? 1 : 0) +
    (city !== 'All' ? 1 : 0) +
    (filters.maxPrice < PRICE_CEILING ? 1 : 0) +
    (filters.minDiscount > 0 ? 1 : 0) +
    (filters.availability !== 'all' ? 1 : 0);

  const clearAll = () => {
    onFiltersChange({ ...DEFAULT_FILTERS, sort: filters.sort });
    onCityChange('All');
  };

  const selectCls = 'field cursor-pointer appearance-none py-2.5 pr-9 text-sm font-semibold';

  return (
    <section id="deals" className="scroll-mt-20 py-16 sm:py-24" aria-labelledby="deals-title">
      <div className="container-x">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tangerine opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-tangerine" />
              </span>
              Live from 20:00
            </p>
            <h2 id="deals-title" className="section-title mt-3">Tonight’s Deals</h2>
            <p className="mt-3 max-w-xl text-charcoal-soft">
              Fresh surplus from local favourites in{' '}
              <strong className="text-forest">{city === 'All' ? 'all of Morocco' : city}</strong>. Reserve now, collect before closing.
            </p>
          </div>
          <span className="demo-badge self-start md:self-end">
            <Info className="h-3.5 w-3.5" /> Demo listings · fictional data
          </span>
        </div>

        {/* Search + controls */}
        <div className="mt-8 space-y-4">
          <SearchBar value={filters.search} onChange={(v) => set('search', v)} />
          <CategoryFilter value={filters.category} onChange={(c) => set('category', c)} counts={categoryCounts} />

          <div className="flex items-center justify-between gap-3 lg:hidden">
            <button onClick={() => setShowFilters((s) => !s)} className="btn-secondary py-2.5" aria-expanded={showFilters} aria-controls="filter-panel">
              <SlidersHorizontal className="h-4 w-4" /> Filters {activeCount > 0 && <span className="rounded-full bg-tangerine px-1.5 text-[11px] text-charcoal">{activeCount}</span>}
            </button>
            <label className="relative">
              <span className="sr-only">Sort offers</span>
              <ArrowUpDown className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest" />
              <select value={filters.sort} onChange={(e) => set('sort', e.target.value as SortOption)} className={`${selectCls} pl-10`}>
                {Object.entries(sortLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          </div>

          <div
            id="filter-panel"
            className={`${showFilters ? 'grid animate-fade-in' : 'hidden'} gap-4 rounded-3xl border border-forest/10 bg-white p-4 shadow-card sm:grid-cols-2 lg:grid lg:grid-cols-[1fr_1.3fr_1fr_1fr_1fr_auto] lg:items-end lg:p-5`}
          >
            <div>
              <label className="field-label text-xs uppercase tracking-wider text-charcoal-muted" htmlFor="filter-city">City</label>
              <CitySelect id="filter-city" value={city} onChange={onCityChange} counts={cityCounts} variant="field" />
            </div>
            <div>
              <label htmlFor="filter-price" className="field-label flex justify-between text-xs uppercase tracking-wider text-charcoal-muted">
                Max price <span className="normal-case tracking-normal text-forest">≤ {filters.maxPrice} MAD</span>
              </label>
              <input
                id="filter-price"
                type="range"
                min={20}
                max={PRICE_CEILING}
                step={5}
                value={filters.maxPrice}
                onChange={(e) => set('maxPrice', Number(e.target.value))}
                className="mt-3 w-full cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[11px] text-charcoal-muted"><span>20</span><span>{PRICE_CEILING}+</span></div>
            </div>
            <div>
              <label htmlFor="filter-discount" className="field-label text-xs uppercase tracking-wider text-charcoal-muted">Discount</label>
              <select id="filter-discount" value={filters.minDiscount} onChange={(e) => set('minDiscount', Number(e.target.value))} className={selectCls}>
                <option value={0}>Any discount</option>
                <option value={30}>30% or more</option>
                <option value={40}>40% or more</option>
                <option value={50}>50% or more</option>
              </select>
            </div>
            <div>
              <label htmlFor="filter-avail" className="field-label text-xs uppercase tracking-wider text-charcoal-muted">Availability</label>
              <select id="filter-avail" value={filters.availability} onChange={(e) => set('availability', e.target.value as Availability)} className={selectCls}>
                <option value="all">Show all</option>
                <option value="available">Available now</option>
                <option value="lastFew">Last few left</option>
              </select>
            </div>
            <div className="hidden lg:block">
              <label htmlFor="filter-sort" className="field-label text-xs uppercase tracking-wider text-charcoal-muted">Sort by</label>
              <select id="filter-sort" value={filters.sort} onChange={(e) => set('sort', e.target.value as SortOption)} className={selectCls}>
                {Object.entries(sortLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <button onClick={clearAll} disabled={activeCount === 0} className="btn-ghost justify-center py-3 sm:col-span-2 lg:col-span-1">
              <RotateCcw className="h-4 w-4" /> Clear filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8 flex items-center justify-between gap-4 text-sm">
          <p className="text-charcoal-soft" aria-live="polite">
            {loading ? 'Loading tonight’s offers…' : (
              <><strong className="text-charcoal">{results.length}</strong> {results.length === 1 ? 'offer' : 'offers'} found · sorted by {sortLabels[filters.sort].toLowerCase()}</>
            )}
          </p>
          {activeCount > 0 && !loading && (
            <button onClick={clearAll} className="font-bold text-forest hover:underline">Clear all ({activeCount})</button>
          )}
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <OfferCardSkeleton key={i} />)
            : results.map((o, i) => (
                <div key={o.id} className="animate-slide-up" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                  <OfferCard offer={o} isFavorite={isFavorite(o.id)} onToggleFavorite={onToggleFavorite} onOpen={onOpenOffer} />
                </div>
              ))}
        </div>

        {!loading && results.length === 0 && (
          <div className="mx-auto mt-4 max-w-md rounded-4xl border border-dashed border-forest/20 bg-white px-6 py-12 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cream text-forest">
              <SearchX className="h-8 w-8" />
            </span>
            <h3 className="mt-4 font-display text-2xl font-semibold text-forest">No deals match your search</h3>
            <p className="mt-2 text-sm text-charcoal-soft">
              Try another city, widen the price range or clear your filters — new offers drop every evening at 20:00.
            </p>
            <button onClick={clearAll} className="btn-primary mt-6">
              <RotateCcw className="h-4 w-4" /> Clear all filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
