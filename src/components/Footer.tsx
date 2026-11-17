import { RotateCcw } from 'lucide-react';
import { CITIES, type City } from '../types';
import { goTo } from '../router';
import { Logo } from './Logo';
import { NAV_LINKS } from './Navbar';

interface FooterProps {
  onPickCity: (c: City) => void;
  onOpenFavorites: () => void;
  onOpenReservations: () => void;
  onResetDemo: () => void;
}

export function Footer({ onPickCity, onOpenFavorites, onOpenReservations, onResetDemo }: FooterProps) {
  const linkCls = 'text-sm text-white/70 transition hover:text-white';
  return (
    <footer className="bg-forest-900 pb-28 pt-16 text-white md:pb-10">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs font-display text-xl italic text-white/90">Save food. Save money. Make a difference.</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
              AfterBite connects Moroccan restaurants with customers every evening to rescue fresh surplus food.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sage">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.id}><button onClick={() => goTo(l.id)} className={linkCls}>{l.label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sage">Cities (demo)</p>
            <ul className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-1">
              {CITIES.map((c) => (
                <li key={c}><button onClick={() => onPickCity(c)} className={linkCls}>Deals in {c}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sage">Your account</p>
            <ul className="mt-4 space-y-2.5">
              <li><button onClick={onOpenFavorites} className={linkCls}>Favorites</button></li>
              <li><button onClick={onOpenReservations} className={linkCls}>My reservations</button></li>
            </ul>
            <button onClick={onResetDemo} className="btn-base mt-6 border border-white/20 px-4 py-2.5 text-xs text-white hover:bg-white/10">
              <RotateCcw className="h-3.5 w-3.5" /> Reset demo data
            </button>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/50">
          <p>
            © {new Date().getFullYear()} AfterBite — university Shark Tank prototype. All offers, prices, ratings, locations and statistics are fictional
            demonstration data. Brand names belong to their respective owners and are used for illustration only; the offers shown are fictional and imply no partnership or endorsement. Reservations are
            simulated; no payments are processed.
          </p>
        </div>
      </div>
    </footer>
  );
}
