import { CalendarCheck, Heart, Home, Search, Store } from 'lucide-react';
import type { Page } from '../types';
import { goTo } from '../router';

interface MobileTabBarProps {
  active: Page;
  favoritesCount: number;
  reservationsCount: number;
  onOpenFavorites: () => void;
  onOpenReservations: () => void;
}

/** App-style bottom navigation for phones. */
export function MobileTabBar({ active, favoritesCount, reservationsCount, onOpenFavorites, onOpenReservations }: MobileTabBarProps) {
  const tab = (label: string, Icon: typeof Home, onClick: () => void, isActive: boolean, badge = 0) => (
    <button
      onClick={onClick}
      className={`relative flex flex-1 flex-col items-center gap-1 py-2 text-[10.5px] font-bold transition ${isActive ? 'text-forest' : 'text-charcoal-muted'}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className={`relative grid h-8 w-12 place-items-center rounded-full transition ${isActive ? 'bg-forest-50' : ''}`}>
        <Icon className="h-5 w-5" />
        {badge > 0 && (
          <span className="absolute right-1 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-tangerine px-1 text-[9px] font-extrabold text-charcoal">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </span>
      {label}
    </button>
  );

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-forest/10 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_-20px_rgba(23,76,60,.5)] backdrop-blur-lg md:hidden"
      aria-label="Quick navigation"
    >
      <div className="flex px-1">
        {tab('Home', Home, () => goTo('home'), active === 'home')}
        {tab('Deals', Search, () => goTo('deals'), active === 'deals')}
        {tab('Saved', Heart, onOpenFavorites, active === 'favorites', favoritesCount)}
        {tab('Bookings', CalendarCheck, onOpenReservations, active === 'reservations', reservationsCount)}
        {tab('Partner', Store, () => goTo('partner'), active === 'partner')}
      </div>
    </nav>
  );
}
