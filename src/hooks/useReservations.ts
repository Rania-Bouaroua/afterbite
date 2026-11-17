import { useCallback } from 'react';
import type { OfferView, Reservation } from '../types';
import { offers as baseOffers, MAX_PER_ORDER } from '../data/offers';
import { generateReservationId } from '../utils/calculations';
import { useLocalStorage } from './useLocalStorage';

const EMPTY_RES: Reservation[] = [];
const EMPTY_STOCK: Record<string, number> = {};

export type ReserveResult = { ok: true; reservation: Reservation } | { ok: false; error: string };

/** Reservations + live stock levels, both persisted to LocalStorage. */
export function useReservations() {
  const [reservations, setReservations, resetReservations] = useLocalStorage<Reservation[]>('reservations', EMPTY_RES);
  const [stock, setStock, resetStock] = useLocalStorage<Record<string, number>>('stock', EMPTY_STOCK);

  const availableFor = useCallback(
    (offerId: string) => {
      if (offerId in stock) return stock[offerId];
      return baseOffers.find((o) => o.id === offerId)?.quantity ?? 0;
    },
    [stock],
  );

  const reserve = useCallback(
    (offer: OfferView, quantity: number): ReserveResult => {
      if (!Number.isInteger(quantity) || quantity < 1) return { ok: false, error: 'Please choose at least 1 item.' };
      if (quantity > MAX_PER_ORDER) return { ok: false, error: `You can reserve up to ${MAX_PER_ORDER} per order.` };
      const available = availableFor(offer.id);
      if (available <= 0) return { ok: false, error: 'Sorry — this offer just sold out.' };
      if (quantity > available) return { ok: false, error: `Only ${available} left. Please lower the quantity.` };

      const reservation: Reservation = {
        id: generateReservationId(reservations.map((r) => r.id)),
        offerId: offer.id,
        restaurantName: offer.restaurant.name,
        offerTitle: offer.title,
        image: offer.image,
        quantity,
        unitPrice: offer.price,
        originalUnitPrice: offer.originalPrice,
        total: offer.price * quantity,
        pickupStart: offer.pickupStart,
        pickupEnd: offer.pickupEnd,
        city: offer.city,
        address: offer.address,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      };
      setReservations((prev) => [reservation, ...prev]);
      setStock((prev) => ({ ...prev, [offer.id]: available - quantity }));
      return { ok: true, reservation };
    },
    [availableFor, reservations, setReservations, setStock],
  );

  const cancel = useCallback(
    (id: string) => {
      const r = reservations.find((x) => x.id === id);
      if (!r || r.status !== 'Confirmed') return false;
      setReservations((prev) => prev.map((x) => (x.id === id ? { ...x, status: 'Cancelled' } : x)));
      setStock((prev) => ({ ...prev, [r.offerId]: availableFor(r.offerId) + r.quantity }));
      return true;
    },
    [reservations, availableFor, setReservations, setStock],
  );

  const markCollected = useCallback(
    (id: string) =>
      setReservations((prev) =>
        prev.map((x) => (x.id === id && x.status === 'Confirmed' ? { ...x, status: 'Collected' } : x)),
      ),
    [setReservations],
  );

  const reset = useCallback(() => {
    resetReservations();
    resetStock();
  }, [resetReservations, resetStock]);

  return { reservations, availableFor, reserve, cancel, markCollected, reset };
}
