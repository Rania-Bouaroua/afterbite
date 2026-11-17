import type { Restaurant } from '../types';

/**
 * Picks up any logo file dropped into src/assets/logos/ (svg, png, jpg, webp),
 * keyed by file name. Restaurants without a file get a clean monogram badge.
 */
const files = import.meta.glob('../assets/logos/*.{svg,png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const logoByKey: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.split('/').pop()!.replace(/\.[^.]+$/, '').toLowerCase(), url]),
);

const initials = (name: string) =>
  name
    .replace(/[^\p{L}\s]/gu, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

export function RestaurantLogo({ restaurant, size = 28 }: { restaurant: Restaurant; size?: number }) {
  const src = restaurant.logoKey ? logoByKey[restaurant.logoKey.toLowerCase()] : undefined;
  const style = { width: size, height: size };

  if (src) {
    return (
      <span className="grid shrink-0 place-items-center overflow-hidden rounded-full bg-white p-0.5 ring-1 ring-forest/10" style={style}>
        <img src={src} alt={`${restaurant.name} logo`} className="h-full w-full object-contain" />
      </span>
    );
  }
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-forest-50 font-bold text-forest ring-1 ring-forest/10"
      style={{ ...style, fontSize: size * 0.38 }}
      aria-hidden="true"
    >
      {initials(restaurant.name)}
    </span>
  );
}
