export const CATEGORIES = [
  'Donuts',
  'Bakery',
  'Pizza',
  'Burgers',
  'Sushi',
  'Coffee',
  'Desserts',
  'Sandwiches',
  'Drinks',
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CITIES = ['Rabat', 'Casablanca', 'Marrakech', 'Tangier', 'Agadir', 'Fes'] as const;
export type City = (typeof CITIES)[number];
export type CityFilter = City | 'All';

export interface Restaurant {
  id: string;
  name: string;
  category: Category;
  tagline: string;
  rating: number;
  reviews: number;
  /** Logo file name (no extension) in src/assets/logos/, e.g. 'dunkin' → dunkin.svg or dunkin.png. */
  logoKey?: string;
}

export interface Offer {
  id: string;
  restaurantId: string;
  title: string;
  description: string;
  items: string[];
  category: Category;
  image: string;
  originalPrice: number;
  price: number;
  quantity: number;
  pickupStart: string;
  pickupEnd: string;
  city: City;
  neighborhood: string;
  address: string;
  popularity: number;
}

/** An offer enriched with live stock and its restaurant. */
export interface OfferView extends Offer {
  available: number;
  restaurant: Restaurant;
  discount: number;
}

export type ReservationStatus = 'Confirmed' | 'Collected' | 'Cancelled';

export interface Reservation {
  id: string;
  offerId: string;
  restaurantName: string;
  offerTitle: string;
  image: string;
  quantity: number;
  unitPrice: number;
  originalUnitPrice: number;
  total: number;
  pickupStart: string;
  pickupEnd: string;
  city: City;
  address: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface PartnerApplication {
  id: string;
  restaurantName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: Category | '';
  city: City | '';
  message: string;
  submittedAt: string;
}

export type SortOption = 'discount' | 'priceAsc' | 'priceDesc' | 'popular';
export type Availability = 'all' | 'available' | 'lastFew';

export interface Filters {
  search: string;
  category: Category | 'All';
  maxPrice: number;
  minDiscount: number;
  availability: Availability;
  sort: SortOption;
}

export type SectionId = 'home' | 'deals' | 'how' | 'impact' | 'partner';
export type Page = SectionId | 'favorites' | 'reservations';
