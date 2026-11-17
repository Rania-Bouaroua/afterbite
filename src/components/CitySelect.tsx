import { ChevronDown, MapPin } from 'lucide-react';
import { CITIES, type CityFilter } from '../types';

interface CitySelectProps {
  value: CityFilter;
  onChange: (city: CityFilter) => void;
  counts?: Record<string, number>;
  variant?: 'pill' | 'field' | 'compact';
  id?: string;
}

/** Native select (accessible + great on mobile) styled for AfterBite. */
export function CitySelect({ value, onChange, counts, variant = 'pill', id }: CitySelectProps) {
  const base =
    variant === 'field'
      ? 'field no-chevron pl-11 pr-10 font-semibold'
      : variant === 'compact'
        ? 'rounded-full border border-forest/15 bg-white py-2 pl-8 pr-7 text-[13px] font-bold text-forest'
        : 'rounded-full border border-forest/15 bg-white py-2.5 pl-10 pr-9 text-sm font-bold text-forest shadow-sm hover:border-forest/30';
  const label = (c: string) => (counts ? `${c} (${counts[c] ?? 0})` : c);

  return (
    <div className="relative inline-flex w-full items-center sm:w-auto">
      <MapPin
        className={`pointer-events-none absolute text-tangerine-dark ${variant === 'compact' ? 'left-2.5 h-4 w-4' : variant === 'field' ? 'left-4 h-5 w-5' : 'left-3.5 h-4 w-4'}`}
        aria-hidden="true"
      />
      <select
        id={id}
        aria-label="Select your city (demo locations)"
        value={value}
        onChange={(e) => onChange(e.target.value as CityFilter)}
        className={`w-full cursor-pointer appearance-none transition focus:outline-none focus-visible:ring-2 focus-visible:ring-forest ${base}`}
      >
        <option value="All">{counts ? `All Morocco (${counts.All ?? 0})` : 'All Morocco'}</option>
        {CITIES.map((c) => (
          <option key={c} value={c}>
            {label(c)}
          </option>
        ))}
      </select>
      <ChevronDown
        className={`pointer-events-none absolute text-forest/60 ${variant === 'compact' ? 'right-2 h-3.5 w-3.5' : 'right-3.5 h-4 w-4'}`}
        aria-hidden="true"
      />
    </div>
  );
}
