import { useEffect, useState } from 'react';
import type { Page } from './types';

/**
 * Tiny hash router (no dependency): each screen has its own URL, e.g.
 *   #/            → Home
 *   #/deals       → Tonight's deals
 *   #/offer/<id>  → One offer
 *   #/favorites, #/reservations, #/how, #/impact, #/partner
 * The browser Back/Forward buttons work like in a real app.
 */
export interface Route {
  page: Page;
  offerId?: string;
}

const PAGES: Page[] = ['home', 'deals', 'how', 'impact', 'partner', 'favorites', 'reservations'];
const NAV_EVENT = 'afterbite:navigate';

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts[0] === 'offer' && parts[1]) return { page: 'deals', offerId: decodeURIComponent(parts[1]) };
  const page = parts[0] as Page;
  return { page: PAGES.includes(page) ? page : 'home' };
}

const hashFor = (page: Page, offerId?: string) =>
  offerId ? `#/offer/${encodeURIComponent(offerId)}` : page === 'home' ? '#/' : `#/${page}`;

/** Navigate to a screen (pushes a browser history entry). */
export function goTo(page: Page, offerId?: string) {
  const target = hashFor(page, offerId);
  const current = window.location.hash || '#/';
  if (current === target) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  window.history.pushState({ inApp: true }, '', target);
  window.dispatchEvent(new Event(NAV_EVENT));
}

export const openOffer = (id: string) => goTo('deals', id);

/** In-app back button: goes back if we came from another AfterBite screen, else to `fallback`. */
export function goBack(fallback: Page = 'deals') {
  if ((window.history.state as { inApp?: boolean } | null)?.inApp) {
    window.history.back();
  } else {
    window.history.replaceState(null, '', hashFor(fallback));
    window.dispatchEvent(new Event(NAV_EVENT));
  }
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const update = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('popstate', update);
    window.addEventListener('hashchange', update);
    window.addEventListener(NAV_EVENT, update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener('hashchange', update);
      window.removeEventListener(NAV_EVENT, update);
    };
  }, []);
  return route;
}
