import { CATEGORIES, type Category } from '../types';
import { categoryMeta } from '../data/categories';

interface CategoryFilterProps {
  value: Category | 'All';
  onChange: (c: Category | 'All') => void;
  counts: Record<string, number>;
}

export function CategoryFilter({ value, onChange, counts }: CategoryFilterProps) {
  const all: (Category | 'All')[] = ['All', ...CATEGORIES];
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by category">
      {all.map((c) => {
        const Icon = categoryMeta[c].icon;
        const active = value === c;
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            aria-pressed={active}
            className={`chip ${active ? 'border-forest bg-forest text-white shadow-card' : 'border-forest/15 bg-white text-charcoal hover:border-forest/40 hover:text-forest'}`}
          >
            <Icon className="h-4 w-4" />
            {c}
            <span className={`rounded-full px-1.5 text-[11px] font-bold ${active ? 'bg-white/20' : 'bg-cream text-charcoal-muted'}`}>
              {counts[c] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
