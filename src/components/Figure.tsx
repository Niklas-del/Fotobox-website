import { useRef, useState } from 'react';
import { fallbackSrc, srcSet, type MediaItem } from '../lib/media';

type Props = {
  item: MediaItem;
  /** `sizes`-Angabe — entscheidet, welche Breite der Browser lädt. Immer setzen. */
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Optionaler abweichender Alt-Text (z. B. wenn die Bildunterschrift ihn schon trägt). */
  alt?: string;
};

/**
 * Ein Bild mit vollständigem Performance-Verhalten:
 * AVIF vor WebP vor JPEG, echtes `srcset`/`sizes`, feste Seitenverhältnisse
 * gegen Layout-Shift, Lazy Loading und ein unscharfer LQIP-Vorschau-Hintergrund,
 * der beim Dekodieren weich überblendet wird.
 */
export function Figure({ item, sizes, priority = false, className = '', imgClassName = '', alt }: Props) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  return (
    <div
      className={`relative overflow-hidden bg-ink-soft ${className}`}
      style={{ aspectRatio: `${item.width} / ${item.height}` }}
    >
      {/* Vorschau in Miniaturgröße, direkt eingebettet — kein zusätzlicher Request. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-110 bg-cover bg-center blur-xl transition-opacity duration-700"
        style={{ backgroundImage: `url("${item.lqip}")`, opacity: loaded ? 0 : 1 }}
      />
      <picture>
        <source type="image/avif" srcSet={srcSet(item, 'avif')} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet(item, 'webp')} sizes={sizes} />
        <img
          ref={ref}
          src={fallbackSrc(item)}
          alt={alt ?? item.alt}
          width={item.width}
          height={item.height}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      </picture>
    </div>
  );
}
