import { useCallback, useEffect, useMemo, useState } from 'react';
import { SearchX } from 'lucide-react';
import type { City, CityFilter, Filters, OfferView, Reservation } from './types';
import { offers } from './data/offers';
import { restaurantById } from './data/restaurants';
import { discountPercent } from './utils/calculations';
import { useLocalStorage, STORAGE_PREFIX } from './hooks/useLocalStorage';
import { useFavorites } from './hooks/useFavorites';
import { useReservations } from './hooks/useReservations';
import { goTo, openOffer, useRoute } from './router';
import { useToast } from './components/Toast';
import { Navbar } from './components/Navbar';
import { MobileTabBar } from './components/MobileTabBar';
import { Hero } from './components/Hero';
import { ValueSection } from './components/ValueSection';
import { DealsSection, DEFAULT_FILTERS } from './components/DealsSection';
import { HowItWorks } from './components/HowItWorks';
import { ImpactSection } from './components/ImpactSection';
import { PartnerForm } from './components/PartnerForm';
import { Footer } from './components/Footer';
import { OfferPage } from './components/OfferPage';
import { FavoritesPage } from './components/FavoritesPage';
import { ReservationsPage } from './components/ReservationsPage';
import { ReservationConfirmation } from './components/ReservationConfirmation';
import { ConfirmDialog } from './components/ConfirmDialog';

export default function App() {
  const toast = useToast();
  const route = useRoute();

  const [city, setCity] = useLocalStorage<CityFilter>('city', 'All');
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);

  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { reservations, availableFor, reserve, cancel, markCollected } = useReservations();

  const [confirmation, setConfirmation] = useState<Reservation | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  // Every new screen starts at the top, like a real app.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [route.page, route.offerId]);

  // Simulated fetch whenever the city changes (and on first load).
  useEffect(() => {
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 550);
    return () => window.clearTimeout(t);
  }, [city]);

  const offerViews: OfferView[] = useMemo(
    () =>
      offers.map((o) => ({
        ...o,
        available: availableFor(o.id),
        restaurant: restaurantById[o.restaurantId],
        discount: discountPercent(o.originalPrice, o.price),
      })),
    [availableFor],
  );

  const cityOffers = useMemo(() => (city === 'All' ? offerViews : offerViews.filter((o) => o.city === city)), [offerViews, city]);

  const cityCounts = useMemo(() => {
    const c: Record<string, number> = { All: offerViews.length };
    offerViews.forEach((o) => (c[o.city] = (c[o.city] ?? 0) + 1));
    return c;
  }, [offerViews]);

  const categoryCounts = useMemo(() => {
    const c: Record<string, number> = {};
    cityOffers.forEach((o) => (c[o.category] = (c[o.category] ?? 0) + 1));
    return c;
  }, [cityOffers]);

  const previewOffers = useMemo(
    () => cityOffers.filter((o) => o.available > 0).sort((a, b) => b.discount - a.discount || b.popularity - a.popularity).slice(0, 5),
    [cityOffers],
  );

  const favoriteOffers = useMemo(
    () => favorites.map((id) => offerViews.find((o) => o.id === id)).filter((o): o is OfferView => !!o),
    [favorites, offerViews],
  );

  const currentOffer = route.offerId ? offerViews.find((o) => o.id === route.offerId) ?? null : null;
  const upcomingCount = reservations.filter((r) => r.status === 'Confirmed').length;

  // ——— Handlers ———
  const changeCity = useCallback(
    (c: CityFilter) => {
      if (c === city) return;
      setCity(c);
      toast({ kind: 'info', title: c === 'All' ? 'Showing all of Morocco' : `Showing deals in ${c}`, message: 'Demo locations · fictional listings' });
    },
    [city, setCity, toast],
  );

  const handleToggleFavorite = useCallback(
    (id: string) => {
      const offer = offerViews.find((o) => o.id === id);
      const nowFav = toggleFavorite(id);
      toast(
        nowFav
          ? { kind: 'favorite', title: 'Saved to favorites', message: offer?.title }
          : { kind: 'info', title: 'Removed from favorites', message: offer?.title },
      );
    },
    [offerViews, toggleFavorite, toast],
  );

  const handleReserve = useCallback(
    (offer: OfferView, qty: number) => {
      const res = reserve(offer, qty);
      if (res.ok) setConfirmation(res.reservation);
      else toast({ kind: 'error', title: 'Could not reserve', message: res.error });
      return res;
    },
    [reserve, toast],
  );

  const handleCancel = (id: string) => {
    const r = reservations.find((x) => x.id === id);
    if (cancel(id) && r) {
      toast({ kind: 'info', title: 'Reservation cancelled', message: `${r.quantity} × ${r.offerTitle} released back to ${r.restaurantName}.` });
    }
  };

  const handleCollected = (id: string) => {
    markCollected(id);
    toast({ kind: 'success', title: 'Enjoy your meal!', message: 'Marked as collected — thanks for rescuing good food.' });
  };

  const pickCategory = (category: Filters['category']) => {
    setFilters((f) => ({ ...f, category }));
    goTo('deals');
  };

  const pickCity = (c: City) => {
    changeCity(c);
    goTo('deals');
  };

  const resetDemo = () => {
    try {
      Object.keys(window.localStorage)
        .filter((k) => k.startsWith(STORAGE_PREFIX))
        .forEach((k) => window.localStorage.removeItem(k));
    } catch {
      /* ignore */
    }
    window.location.hash = '#/';
    window.location.reload();
  };

  // ——— Current screen ———
  let screen: JSX.Element;
  if (route.offerId) {
    screen = currentOffer ? (
      <OfferPage
        key={currentOffer.id}
        offer={currentOffer}
        isFavorite={isFavorite(currentOffer.id)}
        onToggleFavorite={handleToggleFavorite}
        onReserve={handleReserve}
      />
    ) : (
      <section className="container-x py-24 text-center">
        <SearchX className="mx-auto h-12 w-12 text-forest" />
        <h1 className="mt-4 font-display text-3xl font-semibold text-forest">This offer is no longer available</h1>
        <button onClick={() => goTo('deals')} className="btn-primary mt-6">See tonight’s deals</button>
      </section>
    );
  } else {
    switch (route.page) {
      case 'deals':
        screen = (
          <DealsSection
            offers={cityOffers}
            filters={filters}
            onFiltersChange={setFilters}
            city={city}
            onCityChange={changeCity}
            cityCounts={cityCounts}
            loading={loading}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onOpenOffer={openOffer}
          />
        );
        break;
      case 'how':
        screen = <HowItWorks />;
        break;
      case 'impact':
        screen = <ImpactSection reservations={reservations} />;
        break;
      case 'partner':
        screen = <PartnerForm />;
        break;
      case 'favorites':
        screen = (
          <FavoritesPage favorites={favoriteOffers} onOpenOffer={openOffer} onRemove={handleToggleFavorite} onExplore={() => goTo('deals')} />
        );
        break;
      case 'reservations':
        screen = (
          <ReservationsPage
            reservations={reservations}
            onCancel={handleCancel}
            onCollected={handleCollected}
            onExplore={() => goTo('deals')}
          />
        );
        break;
      default:
        screen = (
          <>
            <Hero city={city} onCityChange={changeCity} cityCounts={cityCounts} previewOffers={previewOffers} onOpenOffer={openOffer} />
            <ValueSection categoryCounts={categoryCounts} onPickCategory={pickCategory} />
          </>
        );
    }
  }

  return (
    <div className="flex min-h-screen flex-col pb-20 md:pb-0">
      <Navbar
        active={route.page}
        city={city}
        onCityChange={changeCity}
        cityCounts={cityCounts}
        favoritesCount={favorites.length}
        reservationsCount={upcomingCount}
        onOpenFavorites={() => goTo('favorites')}
        onOpenReservations={() => goTo('reservations')}
      />

      <main className="flex-1">
        <div key={`${route.page}/${route.offerId ?? ''}`} className="animate-fade-in">
          {screen}
        </div>
      </main>

      <Footer onPickCity={pickCity} onOpenFavorites={() => goTo('favorites')} onOpenReservations={() => goTo('reservations')} onResetDemo={() => setResetOpen(true)} />

      <MobileTabBar
        active={route.page}
        favoritesCount={favorites.length}
        reservationsCount={upcomingCount}
        onOpenFavorites={() => goTo('favorites')}
        onOpenReservations={() => goTo('reservations')}
      />

      <ReservationConfirmation
        reservation={confirmation}
        onClose={() => setConfirmation(null)}
        onViewReservations={() => {
          setConfirmation(null);
          goTo('reservations');
        }}
      />
      <ConfirmDialog
        open={resetOpen}
        title="Reset all demo data?"
        message="This clears favorites, reservations, partner applications and restores every offer’s original stock. Handy before a live presentation."
        confirmLabel="Reset"
        cancelLabel="Cancel"
        onCancel={() => setResetOpen(false)}
        onConfirm={resetDemo}
      />
    </div>
  );
}
