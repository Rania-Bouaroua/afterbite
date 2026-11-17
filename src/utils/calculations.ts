import type { Filters, Offer, OfferView, Reservation } from '../types';
import { LAST_FEW_THRESHOLD } from '../data/offers';

export const discountPercent = (original: number, price: number) =>
  original > 0 ? Math.round(((original - price) / original) * 100) : 0;

export const formatMAD = (value: number) =>
  `${new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 0 }).format(value)} MAD`;

export const formatNumber = (value: number, decimals = 0) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);

export const savingsFor = (offer: Pick<Offer, 'originalPrice' | 'price'>, qty = 1) =>
  (offer.originalPrice - offer.price) * qty;

/** Generates a human-friendly demo reservation id, e.g. AB-K7Q2-91XF. */
export const generateReservationId = (existing: string[] = []) => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const chunk = () =>
    Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  let id = `AB-${chunk()}-${chunk()}`;
  while (existing.includes(id)) id = `AB-${chunk()}-${chunk()}`;
  return id;
};

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

export function filterAndSortOffers(list: OfferView[], f: Filters): OfferView[] {
  const q = normalize(f.search);
  const terms = q.split(/\s+/).filter(Boolean);

  const filtered = list.filter((o) => {
    if (f.category !== 'All' && o.category !== f.category) return false;
    if (o.price > f.maxPrice) return false;
    if (o.discount < f.minDiscount) return false;
    if (f.availability === 'available' && o.available <= 0) return false;
    if (f.availability === 'lastFew' && (o.available <= 0 || o.available > LAST_FEW_THRESHOLD)) return false;
    if (terms.length) {
      const haystack = normalize(
        [o.restaurant.name, o.title, o.description, o.category, o.city, o.neighborhood, o.address, ...o.items].join(' '),
      );
      if (!terms.every((t) => haystack.includes(t))) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (f.sort) {
      case 'discount': return b.discount - a.discount || a.price - b.price;
      case 'priceAsc': return a.price - b.price;
      case 'priceDesc': return b.price - a.price;
      case 'popular': return b.popularity - a.popularity;
    }
  });
  // Sold-out offers always sink to the bottom.
  return sorted.sort((a, b) => Number(a.available <= 0) - Number(b.available <= 0));
}

export function reservationTotals(reservations: Reservation[]) {
  const active = reservations.filter((r) => r.status !== 'Cancelled');
  const meals = active.reduce((n, r) => n + r.quantity, 0);
  const saved = active.reduce((n, r) => n + (r.originalUnitPrice - r.unitPrice) * r.quantity, 0);
  return { meals, saved, count: active.length };
}

/** Returns a readable status for the 8 PM drop, relative to `now`. */
export function eveningStatus(now: Date) {
  const h = now.getHours();
  const target = new Date(now);
  target.setHours(20, 0, 0, 0);
  if (h >= 20 && h < 23) {
    const end = new Date(now);
    end.setHours(23, 0, 0, 0);
    return { live: true, msLeft: end.getTime() - now.getTime() };
  }
  if (h >= 23) target.setDate(target.getDate() + 1);
  return { live: false, msLeft: target.getTime() - now.getTime() };
}

export const formatCountdown = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
};
