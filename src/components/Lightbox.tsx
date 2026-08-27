import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { categories } from '../data/site';
import { fallbackSrc, srcSet, type MediaItem } from '../lib/media';
import { useFocusTrap, useScrollLock } from '../hooks';

type Props = {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
};

/**
 * Große Ansicht. Bedienbar per Maus, Tastatur (←/→/Esc) und Wischgeste.
 * Als Dialog ausgezeichnet, mit Fokusfalle und gesperrtem Hintergrund-Scroll;
 * die benachbarten Bilder werden im Hintergrund vorgeladen, damit der Wechsel
 * ohne Warten passiert.
 */
export function Lightbox({ items, index, onClose, onStep }: Props) {
  const item = items[index];
  const trapRef = useFocusTrap(true);
  const [ready, setReady] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  useScrollLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onStep(1);
      else if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onStep]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 20);
    return () => clearTimeout(t);
  }, []);

  // Nachbarn vorladen — der Browser hat sie beim Blättern schon im Cache.
  useEffect(() => {
    [index + 1, index - 1].forEach((i) => {
      const neighbour = items[(i + items.length) % items.length];
      if (!neighbour) return;
      const img = new Image();
      img.src = fallbackSrc(neighbour);
    });
  }, [index, items]);

  const category = categories.find((c) => c.id === item.category);

  return createPortal(
    <div
      ref={trapRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Bildansicht: ${item.title ?? item.alt}`}
      className={`fixed inset-0 z-[70] flex flex-col bg-ink/97 backdrop-blur-md transition-opacity duration-500 ${
        ready ? 'opacity-100' : 'opacity-0'
      }`}
      onTouchStart={(e) => {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        const start = touchStart.current;
        if (!start) return;
        const dx = e.changedTouches[0].clientX - start.x;
        const dy = e.changedTouches[0].clientY - start.y;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) onStep(dx < 0 ? 1 : -1);
        touchStart.current = null;
      }}
    >
      {/* Kopfzeile */}
      <div className="gutter flex items-center justify-between py-5">
        <p className="label text-stone">
          <span className="text-paper">{String(index + 1).padStart(2, '0')}</span>
          <span className="mx-2 text-stone-dark">/</span>
          {String(items.length).padStart(2, '0')}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="label flex cursor-pointer items-center gap-3 px-2 py-2 text-stone transition-colors hover:text-paper"
        >
          Schließen
          <span aria-hidden="true" className="relative block h-3.5 w-3.5">
            <span className="absolute top-1/2 left-0 block h-px w-full rotate-45 bg-current" />
            <span className="absolute top-1/2 left-0 block h-px w-full -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      {/* Bild */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 md:px-20">
        <button
          type="button"
          onClick={() => onStep(-1)}
          aria-label="Vorheriges Bild"
          className="absolute left-1 z-10 hidden h-16 w-12 cursor-pointer items-center justify-center text-stone transition-colors hover:text-paper md:flex"
        >
          <Arrow direction="left" />
        </button>

        <figure key={item.slug} className="flex h-full max-h-full min-h-0 flex-col items-center justify-center">
          <picture>
            <source type="image/avif" srcSet={srcSet(item, 'avif')} sizes="(min-width: 768px) 80vw, 100vw" />
            <source type="image/webp" srcSet={srcSet(item, 'webp')} sizes="(min-width: 768px) 80vw, 100vw" />
            <img
              src={fallbackSrc(item)}
              alt={item.alt}
              width={item.width}
              height={item.height}
              className="max-h-[68svh] w-auto max-w-full animate-[lb-in_0.7s_cubic-bezier(0.16,1,0.3,1)] object-contain md:max-h-[72svh]"
            />
          </picture>
        </figure>

        <button
          type="button"
          onClick={() => onStep(1)}
          aria-label="Nächstes Bild"
          className="absolute right-1 z-10 hidden h-16 w-12 cursor-pointer items-center justify-center text-stone transition-colors hover:text-paper md:flex"
        >
          <Arrow direction="right" />
        </button>
      </div>

      {/* Bildunterschrift */}
      <div className="gutter border-t border-paper/10 py-5">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div>
            <p className="font-display text-2xl leading-none md:text-3xl">{item.title}</p>
            <p className="mt-2 text-sm text-stone">
              {item.place} · {item.year}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {item.isPlaceholder && (
              <span className="label border border-paper/20 px-3 py-2 text-stone-dark">Platzhalter</span>
            )}
            <span className="label text-stone">{category?.label}</span>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-xs leading-relaxed text-stone-dark md:hidden">
          Zum Blättern wischen.
        </p>
      </div>

      <style>{`@keyframes lb-in { from { opacity: 0; transform: scale(0.985); } to { opacity: 1; transform: none; } }`}</style>
    </div>,
    document.body,
  );
}

function Arrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="34" height="12" viewBox="0 0 34 12" fill="none" aria-hidden="true">
      <path
        d={direction === 'right' ? 'M0 6h32m0 0-6-5m6 5-6 5' : 'M34 6H2m0 0 6-5M2 6l6 5'}
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
