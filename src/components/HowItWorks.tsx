import { ArrowRight, MapPin, Search, ShoppingBag, Smartphone, Store, Timer } from 'lucide-react';
import { goTo } from '../router';

const steps = [
  {
    n: '01',
    title: 'Discover',
    text: 'Find discounted food offers near you. Filter by city, craving, price or discount.',
    icon: Search,
    art: (
      <div className="space-y-2">
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs text-charcoal-muted shadow-sm"><Search className="h-3.5 w-3.5" /> pastries near Agdal…</div>
        <div className="flex gap-2">
          {['Bakery', 'Sushi', 'Pizza'].map((c, i) => (
            <span key={c} className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${i === 0 ? 'bg-forest text-white' : 'bg-white text-forest'}`}>{c}</span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-forest"><MapPin className="h-3.5 w-3.5 text-tangerine-dark" /> 12 offers within 2 km</div>
      </div>
    ),
  },
  {
    n: '02',
    title: 'Reserve',
    text: 'Choose your favorite offer and reserve it in seconds. Your food is set aside for you.',
    icon: Smartphone,
    art: (
      <div className="rounded-2xl bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between text-[11px]"><span className="font-bold text-charcoal">Surprise Pastry Box</span><span className="rounded-full bg-tangerine px-1.5 font-extrabold">-50%</span></div>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-forest">40 MAD</span>
          <span className="rounded-full bg-forest px-3 py-1 text-[11px] font-bold text-white">Reserve ✓</span>
        </div>
      </div>
    ),
  },
  {
    n: '03',
    title: 'Collect',
    text: 'Pick up your food before the restaurant closes. Show your reservation ID and enjoy.',
    icon: ShoppingBag,
    art: (
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-forest shadow-sm"><Store className="h-6 w-6" /></span>
        <div className="text-[11px]">
          <p className="font-bold text-charcoal">Pickup window</p>
          <p className="flex items-center gap-1 font-semibold text-forest"><Timer className="h-3.5 w-3.5" /> 20:00 – 22:30</p>
          <p className="font-mono text-charcoal-muted">AB-K7Q2-91XF</p>
        </div>
      </div>
    ),
  },
];

const timeline = [
  { time: 'Before 20:00', title: 'Restaurants list surplus', text: 'Partners estimate what will remain unsold and publish it in under a minute.' },
  { time: '20:00', title: 'Deals go live', text: 'Customers nearby get access to tonight’s discounted offers.' },
  { time: '20:00 – 23:00', title: 'Pickup before closing', text: 'Food is collected fresh — nothing ends up in the bin.' },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 bg-white py-16 sm:py-24" aria-labelledby="how-title">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">How it works</p>
          <h2 id="how-title" className="section-title mt-3">Three steps to a better evening</h2>
          <p className="mt-4 text-lg text-charcoal-soft">From discovery to pickup in under a minute — no complicated checkout, no waste.</p>
        </div>

        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.n} className="group relative flex flex-col rounded-4xl border border-forest/10 bg-cream p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
              <div className="flex items-start justify-between">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-forest text-white shadow-card transition group-hover:rotate-[-6deg]">
                  <s.icon className="h-7 w-7" />
                </span>
                <span className="font-display text-5xl font-semibold text-forest/15">{s.n}</span>
              </div>
              <h3 className="mt-6 font-display text-3xl font-semibold uppercase tracking-wide text-forest">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-charcoal-soft">{s.text}</p>
              <div className="mt-6 rounded-3xl bg-cream-dark/70 p-4">{s.art}</div>
              {i < steps.length - 1 && (
                <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 rounded-full bg-tangerine p-1.5 text-charcoal shadow-card md:block" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>

        {/* Evening timeline */}
        <div className="mt-16 overflow-hidden rounded-4xl bg-forest p-7 text-white sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_2fr] lg:items-center">
            <div>
              <p className="eyebrow text-sage">The 8 PM concept</p>
              <h3 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">One evening drop. Zero guesswork.</h3>
            </div>
            <ol className="relative grid gap-6 sm:grid-cols-3">
              <div className="absolute left-[11px] top-3 h-[calc(100%-24px)] w-px bg-white/20 sm:left-0 sm:right-0 sm:top-[11px] sm:h-px sm:w-full" aria-hidden="true" />
              {timeline.map((t, i) => (
                <li key={t.time} className="relative pl-10 sm:pl-0 sm:pt-10">
                  <span className={`absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-full ring-4 ring-forest ${i === 1 ? 'bg-tangerine' : 'bg-sage'}`}>
                    <span className="h-2 w-2 rounded-full bg-forest" />
                  </span>
                  <p className="text-sm font-bold text-tangerine">{t.time}</p>
                  <p className="mt-1 text-lg font-bold">{t.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{t.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-7 sm:flex-row">
            <button onClick={() => goTo('deals')} className="btn-accent">Browse tonight’s deals <ArrowRight className="h-4 w-4" /></button>
            <button onClick={() => goTo('partner')} className="btn-base border border-white/20 text-white hover:bg-white/10">I own a restaurant</button>
          </div>
        </div>
      </div>
    </section>
  );
}
