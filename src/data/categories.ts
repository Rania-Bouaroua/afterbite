import { Beef, CakeSlice, Coffee, Croissant, CupSoda, Donut, Fish, LayoutGrid, Pizza, Sandwich, type LucideIcon } from 'lucide-react';
import type { Category } from '../types';

export const categoryMeta: Record<Category | 'All', { icon: LucideIcon; photo: string }> = {
  All: { icon: LayoutGrid, photo: '1504674900247-0877df9cc836' },
  Donuts: { icon: Donut, photo: '1551024601-bec78aea704b' },
  Bakery: { icon: Croissant, photo: '1509440159596-0249088772ff' },
  Pizza: { icon: Pizza, photo: '1513104890138-7c749659a591' },
  Burgers: { icon: Beef, photo: '1568901346375-23c9450c58cd' },
  Sushi: { icon: Fish, photo: '1579871494447-9811cf80d66c' },
  Coffee: { icon: Coffee, photo: '1509042239860-f550ce710b93' },
  Desserts: { icon: CakeSlice, photo: '1569864358642-9d1684040f43' },
  Sandwiches: { icon: Sandwich, photo: '1539252554453-80ab65ce3586' },
  Drinks: { icon: CupSoda, photo: '1600271886742-f049cd451bba' },
};
