import { useEffect, useState } from 'react';
import { CalendarCheck, Heart, Menu, X, Home, Search, Sparkles, Leaf, Store, ChevronRight } from 'lucide-react';
import type { CityFilter, Page, SectionId } from '../types';
import { Logo } from './Logo';
import { CitySelect } from './CitySelect';
import { goTo } from '../router';

export const NAV_LINKS: { id: SectionId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'deals', label: 'Explore Deals', icon: Search },
  { id: 'how', label: 'How It Works', icon: Sparkles },
  { id: 'impact', label: 'Our Impact', icon: Leaf },
  { id: 'partner', label: 'Become a Partner', icon: Store },
];

interface NavbarProps {
  active: Page;
  city: CityFilter;
  onCityChange: (c: CityFilter) => void;
  cityCounts: Record<string, number>;
  favoritesCount: number;
  reservationsCount: number;
  onOpenFavorites: () => void;
  onOpenReservations: () => void;
}

function CountBadge({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="absolute -right-2.5 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-tangerine px-1 text-[9px] font-extrabold text-charcoal ring-2 ring-cream">
      {n > 9 ? '9+' : n}
    </span>
  );
}

export function Navbar(props: NavbarProps) {
  const { active, city, onCityChange, cityCounts, favoritesCount, reservationsCount, onOpenFavorites, onOpenReservations } = props;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const go = (id: SectionId) => {
    setMenuOpen(false);
    goTo(id);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? 'border-b border-forest/10 bg-cream/85 shadow-[0_6px_24px_-18px_rgba(23,76,60,.5)] backdrop-blur-lg' : 'bg-cream'
        }`}
      >
        <nav className="container-x flex h-16 items-center justify-between gap-3 lg:h-[76px]" aria-label="Main navigation">
          <button onClick={() => go('home')} className="shrink-0 rounded-xl" aria-label="AfterBite — back to top">
            <span className="hidden sm:inline-flex"><Logo /></span>
            <span className="sm:hidden"><Logo compact /></span>
          </button>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  aria-current={active === l.id ? 'page' : undefined}
                  className={`relative rounded-full px-3 py-2 text-[13.5px] font-semibold transition xl:px-3.5 ${
                    active === l.id ? 'text-forest' : 'text-charcoal-soft hover:text-forest'
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-tangerine transition-transform duration-300 ${
                      active === l.id ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden w-auto md:block">
              <CitySelect value={city} onChange={onCityChange} variant="compact" />
            </div>
            <button
              onClick={onOpenFavorites}
              className={`relative inline-flex h-10 items-center gap-2 rounded-full px-2.5 text-forest transition hover:bg-forest-50 xl:px-3 ${active === 'favorites' ? 'bg-forest-50' : ''}`}
              aria-label={`Favorites (${favoritesCount})`}
              aria-current={active === 'favorites' ? 'page' : undefined}
            >
              <span className="relative">
                <Heart className={`h-5 w-5 ${active === 'favorites' ? 'fill-tangerine text-tangerine' : ''}`} />
                <CountBadge n={favoritesCount} />
              </span>
              <span className="hidden text-[13.5px] font-semibold 2xl:inline">Favorites</span>
            </button>
            <button
              onClick={onOpenReservations}
              className="relative hidden h-10 items-center gap-2 rounded-full bg-forest px-3 text-white shadow-card transition hover:bg-forest-700 sm:inline-flex xl:px-4"
              aria-label={`My reservations (${reservationsCount} upcoming)`}
              aria-current={active === 'reservations' ? 'page' : undefined}
            >
              <span className="relative">
                <CalendarCheck className="h-[18px] w-[18px]" />
                <CountBadge n={reservationsCount} />
              </span>
              <span className="hidden text-[13.5px] font-bold xl:inline">My Reservations</span>
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-forest/15 bg-white text-forest lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>

        {/* Mobile city strip */}
        <div className="container-x -mt-1 pb-2.5 md:hidden">
          <CitySelect value={city} onChange={onCityChange} counts={cityCounts} variant="compact" />
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 animate-fade-in bg-forest-900/50 backdrop-blur-[2px]" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm animate-[slide-in_.3s_cubic-bezier(.2,.8,.2,1)_both] flex-col bg-cream shadow-float">
            <div className="flex items-center justify-between border-b border-forest/10 px-5 py-4">
              <Logo compact />
              <button onClick={() => setMenuOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-card" aria-label="Close menu" autoFocus>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <p className="mb-2 px-2 text-xs font-bold uppercase tracking-widest text-charcoal-muted">Your city</p>
              <CitySelect value={city} onChange={onCityChange} counts={cityCounts} variant="field" />
              <ul className="mt-6 space-y-1">
                {NAV_LINKS.map((l) => (
                  <li key={l.id}>
                    <button
                      onClick={() => go(l.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-left text-[15px] font-semibold transition ${
                        active === l.id ? 'bg-forest text-white' : 'text-charcoal hover:bg-white'
                      }`}
                    >
                      <l.icon className="h-5 w-5" />
                      <span className="flex-1">{l.label}</span>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button onClick={() => { setMenuOpen(false); onOpenFavorites(); }} className="flex flex-col items-start gap-2 rounded-2xl bg-white p-4 text-left shadow-card">
                  <Heart className="h-5 w-5 text-tangerine-dark" />
                  <span className="text-sm font-bold">Favorites</span>
                  <span className="text-xs text-charcoal-muted">{favoritesCount} saved</span>
                </button>
                <button onClick={() => { setMenuOpen(false); onOpenReservations(); }} className="flex flex-col items-start gap-2 rounded-2xl bg-white p-4 text-left shadow-card">
                  <CalendarCheck className="h-5 w-5 text-forest" />
                  <span className="text-sm font-bold">My Reservations</span>
                  <span className="text-xs text-charcoal-muted">{reservationsCount} upcoming</span>
                </button>
              </div>
            </div>
            <p className="border-t border-forest/10 px-5 py-4 text-xs text-charcoal-muted">University prototype · demo data only</p>
          </div>
        </div>
      )}
    </>
  );
}
