import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const EMPTY: string[] = [];

export function useFavorites() {
  const [favorites, setFavorites, reset] = useLocalStorage<string[]>('favorites', EMPTY);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  /** Toggles an offer and returns true if it is now a favorite. */
  const toggleFavorite = useCallback(
    (id: string) => {
      const next = !favorites.includes(id);
      setFavorites((prev) => (next ? [id, ...prev.filter((f) => f !== id)] : prev.filter((f) => f !== id)));
      return next;
    },
    [favorites, setFavorites],
  );

  return { favorites, isFavorite, toggleFavorite, reset };
}
