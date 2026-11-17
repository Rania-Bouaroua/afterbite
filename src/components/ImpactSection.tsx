import { Info, Leaf, Store, Utensils, Wallet, type LucideIcon } from 'lucide-react';
import type { Reservation } from '../types';
import { impactStats, KG_CO2_PER_MEAL, KG_FOOD_PER_MEAL } from '../data/impact';
import { heroImages } from '../data/images';
import { useCountUp, useInView } from '../hooks/useInView';
import { formatMAD, formatNumber, reservationTotals } from '../utils/calculations';
import { SafeImage } from './SafeImage';

const icons: Record<string, LucideIcon> = { meals: Utensils, money: Wallet, partners: Store, waste: Leaf };

function Counter({ value, decimals, suffix, start }: { value: number; decimals: number; suffix: string; start: boolean }) {
  const v = useCountUp(value, start);
  return (
    <span className="tabular-nums">
      {formatNumber(v, decimals)}
      {suffix}
    </span>
  );
}

export function ImpactSection({ reservations }: { reservations: Reservation[] }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const mine = reservationTotals(reservations);

  return (
    <section id="impact" className="relative scroll-mt-20 overflow-hidden bg-forest-800 py-16 text-white sm:py-24" aria-labelledby="impact-title">
      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-sage/20 blur-3xl" aria-hidden="true" />
      <div className="container-x relative" ref={ref}>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="eyebrow text-sage">Our impact</p>
            <h2 id="impact-title" className="mt-3 font-display text-[2.4rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Small savings. <span className="italic text-sage">Big impact.</span>
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
              Every rescued meal keeps food out of landfill, puts money back in your pocket and helps local restaurants recover revenue.
            </p>
          </div>
          <p className="inline-flex items-start gap-2 self-start rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80 lg:justify-self-end">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-tangerine" />
            <span><strong className="text-white">Illustrative prototype data.</strong> These figures are projections for a pilot, not actual business results.</span>
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {impactStats.map((s, i) => {
            const Icon = icons[s.key];
            return (
              <div
                key={s.key}
                className={`rounded-4xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur transition duration-700 sm:p-7 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <Icon className="h-6 w-6 text-sage" />
                <p className="mt-5 font-display text-3xl font-semibold sm:text-[2.6rem]">
                  <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} start={inView} />
                </p>
                <p className="mt-1 font-semibold">{s.label}</p>
                <p className="mt-1 text-xs text-white/55">{s.note} · illustrative</p>
              </div>
            );
          })}
        </div>

        {/* Personal impact from LocalStorage reservations */}
        <div className="mt-6 grid overflow-hidden rounded-4xl bg-cream text-charcoal md:grid-cols-[0.8fr_1.2fr]">
          <SafeImage photoId={heroImages.bowl} alt="A fresh, colourful bowl of food" width={700} height={500} className="h-48 md:h-full" />
          <div className="p-6 sm:p-8">
            <p className="eyebrow">Your impact on this device</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-forest sm:text-3xl">
              {mine.meals > 0 ? 'Thank you for rescuing good food!' : 'Your impact starts with one box.'}
            </h3>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div>
                <p className="font-display text-2xl font-bold text-forest sm:text-3xl">{mine.meals}</p>
                <p className="text-xs font-semibold text-charcoal-muted">meals rescued</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-forest sm:text-3xl">{formatMAD(mine.saved)}</p>
                <p className="text-xs font-semibold text-charcoal-muted">money saved</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-forest sm:text-3xl">{formatNumber(mine.meals * KG_CO2_PER_MEAL, 1)} kg</p>
                <p className="text-xs font-semibold text-charcoal-muted">CO₂e avoided (est.)</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-charcoal-muted">
              Based on your demo reservations. Estimates assume ≈{KG_FOOD_PER_MEAL} kg of food and ≈{KG_CO2_PER_MEAL} kg CO₂e per meal saved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
