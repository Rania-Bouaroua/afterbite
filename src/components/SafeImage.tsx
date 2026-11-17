import { useState } from 'react';
import { Leaf } from 'lucide-react';
import { photo } from '../data/images';

interface SafeImageProps {
  photoId: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  eager?: boolean;
}

/** Unsplash image with a soft loading shimmer and a branded fallback if the network fails. */
export function SafeImage({ photoId, alt, width = 800, height, className = '', eager = false }: SafeImageProps) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');

  if (state === 'error') {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-forest-100 to-cream-deep ${className}`}
      >
        <div className="flex flex-col items-center gap-1 text-forest/60">
          <Leaf className="h-8 w-8" />
          <span className="px-4 text-center text-xs font-semibold">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-cream-dark ${className}`}>
      {state === 'loading' && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      )}
      <img
        src={photo(photoId, width, height)}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setState('loaded')}
        onError={() => setState('error')}
        className={`h-full w-full object-cover transition-opacity duration-500 ${state === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
