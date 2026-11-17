import { BadgePercent, Heart, Recycle } from 'lucide-react';
import { CATEGORIES, type Category } from '../types';
import { categoryMeta } from '../data/categories';
import { SafeImage } from './SafeImage';

interface ValueSectionProps {
  categoryCounts: Record<string, number>;
  onPickCategory: (c: Category) => void;
}

const pillars = [
  { icon: Heart, title: 'Your favorite food', text: 'Bakeries, sushi bars, pizzerias and coffee shops you already love — not leftovers, but today’s fresh food.', tone: 'bg-tangerine-light text-tangerine-dark' },
  { icon: BadgePercent, title: 'Better prices', text: 'Enjoy 40–60% off every evening. Reserve in seconds, pay when you collect.', tone: 'bg-forest-50 text-forest' },
  { icon: Recycle, title: 'Less waste', text: 'Every box you rescue keeps good food out of the bin and helps local businesses recover revenue.', tone: 'bg-sage-light text-sage-dark' },
];

export function ValueSection({ categoryCounts, onPickCategory }: ValueSectionProps) {
  return (
    <section className="bg-white py-16 sm:py-24" aria-labelledby="value-title">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="eyebrow">Why AfterBite</p>
            <h2 id="value-title" className="section-title mt-3">
              Your favorite food. <span className="italic text-sage-dark">Better prices.</span> Less waste.
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-charcoal-soft lg:justify-self-end">
            Each day Moroccan restaurants throw away perfectly good food at closing time. AfterBite turns that surplus into
            evening deals, so you eat well for less and businesses stop losing money.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-4xl border border-forest/10 bg-cream p-7 transition hover:-translate-y-1 hover:shadow-card">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${p.tone}`}>
                <p.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold text-forest">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-charcoal-soft">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <h3 className="font-display text-2xl font-semibold text-forest sm:text-3xl">Browse by craving</h3>
            <p className="hidden text-sm text-charcoal-muted sm:block">Tap a category to filter tonight’s deals</p>
          </div>
          <div className="no-scrollbar -mx-4 mt-5 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-9">
            {CATEGORIES.map((c) => {
              const meta = categoryMeta[c];
              const n = categoryCounts[c] ?? 0;
              return (
                <button
                  key={c}
                  onClick={() => onPickCategory(c)}
                  className="group relative w-32 shrink-0 overflow-hidden rounded-3xl text-left sm:w-auto"
                  aria-label={`Show ${c} deals (${n})`}
                >
                  <SafeImage photoId={meta.photo} alt="" width={320} height={400} className="aspect-[4/5] transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                    <meta.icon className="mb-1 h-4 w-4 opacity-90" />
                    <p className="text-sm font-bold">{c}</p>
                    <p className="text-[11px] text-white/75">{n} {n === 1 ? 'deal' : 'deals'}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
