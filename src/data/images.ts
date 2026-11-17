/** Unsplash photo helper — every offer uses a distinct, verified photograph. */
export const photo = (id: string, w = 800, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=75`;

export const heroImages = {
  spread: '1504674900247-0877df9cc836',
  croissant: '1555507036-ab1f4038808a',
  donuts: '1551024601-bec78aea704b',
  sushi: '1553621042-f6e147245754',
  restaurant: '1414235077428-338989a2e8c0',
  interior: '1555396273-367ea4eb4db5',
  dough: '1517686469429-8bdb88b9f907',
  bowl: '1512621776951-a57141f2eefd',
};
