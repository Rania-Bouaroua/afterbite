import type { Restaurant } from '../types';

/**
 * Fictional demonstration restaurants.
 * Real brand names are used for illustration only. Offers, prices and ratings are fictional;
 * no partnership with or endorsement by these brands is implied.
 */
export const restaurants: Restaurant[] = [
  { id: 'donut-republic', name: "Dunkin' Donuts", category: 'Donuts', tagline: 'Hand-glazed donuts, baked every morning', rating: 4.7, reviews: 418, logoKey: 'dunkin' },
  { id: 'coffee-corner', name: 'Coffee Corner', category: 'Coffee', tagline: 'Specialty coffee & homemade desserts', rating: 4.8, reviews: 362 },
  { id: 'maison-ble', name: 'PAUL', category: 'Bakery', tagline: 'French boulangerie & pâtisserie', rating: 4.9, reviews: 521, logoKey: 'paul' },
  { id: 'pizza-house', name: 'Pizza House', category: 'Pizza', tagline: 'Wood-fired Neapolitan pizza', rating: 4.6, reviews: 289 },
  { id: 'sushi-time', name: 'Sushi Time', category: 'Sushi', tagline: 'Fresh rolls, prepared to order', rating: 4.7, reviews: 344 },
  { id: 'burger-lab', name: 'Burger Lab', category: 'Burgers', tagline: 'Smash burgers & crispy fries', rating: 4.5, reviews: 403 },
  { id: 'sweet-moments', name: 'Sweet Moments', category: 'Desserts', tagline: 'Cakes, macarons & little luxuries', rating: 4.8, reviews: 276 },
  { id: 'fresh-juice-bar', name: 'Fresh Juice Bar', category: 'Drinks', tagline: 'Cold-pressed juices & smoothies', rating: 4.6, reviews: 198 },
  { id: 'patisserie-du-coin', name: 'Local Pastry Shop', category: 'Bakery', tagline: 'Your neighbourhood pastry shop', rating: 4.7, reviews: 231 },
  { id: 'sandwich-corner', name: 'Sandwich Corner', category: 'Sandwiches', tagline: 'Generous sandwiches & wraps', rating: 4.5, reviews: 257 },
];

export const restaurantById = Object.fromEntries(restaurants.map((r) => [r.id, r])) as Record<string, Restaurant>;
