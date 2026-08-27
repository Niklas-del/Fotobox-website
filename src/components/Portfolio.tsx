import { useCallback, useEffect, useMemo, useState } from 'react';
import { categories, type CategoryId } from '../data/site';
import { portfolio, type MediaItem } from '../lib/media';
import { Figure } from './Figure';
import { SectionHeading } from './Chrome';
import { useReveal } from '../hooks';
import { Lightbox } from './Lightbox';

/**
 * Rhythmus des Rasters. Die Bilder liegen bewusst nicht in gleich großen
 * Kacheln: wechselnde Breiten und vertikale Versätze erzeugen den Blattspiegel
 * einer Zeitschrift statt einer Galerie-Tabelle.
 */
const rhythm = [
  { mobile: 'col-span-2', desktop: 'md:col-span-7', span: 7, offset: '' },
  { mobile: 'col-span-1', desktop: 'md:col-span-4', span: 4, offset: 'md:mt-32' },
  { mobile: 'col-span-1', desktop: 'md:col-span-5', span: 5, offset: 'md:mt-10' },
  { mobile: 'col-span-2', desktop: 'md:col-span-6', span: 6, offset: 'md:mt-24' },
  { mobile: 'col-span-1', desktop: 'md:col-span-5', span: 5, offset: '' },
  { mobile: 'col-span-1', desktop: 'md:col-span-4', span: 4, offset: 'md:mt-20' },
  { mobile: 'col-span-2', desktop: 'md:col-span-8', span: 8, offset: '' },
  { mobile: 'col-span-2', desktop: 'md:col-span-4', span: 4, offset: 'md:mt-40' },
];

function sizesFor(span: number, mobile: string) {
  const desktop = Math.round((span / 12) * 100);
  return `(min-width: 768px) ${desktop}vw, ${mobile === 'col-span-1' ? '50vw' : '100vw'}`;
}

export function Portfolio() {
  const [filter, setFilter] = useState<CategoryId | 'alle'>('alle');
  const [openAt, setOpenAt] = useState<number | null>(null);
  const head = useReveal<HTMLDivElement>();

  const items = useMemo(
    () => (filter === 'alle' ? portfolio : portfolio.filter((i) => i.category === filter)),
    [filter],
  );

  // Der geöffnete Index gehört zur gefilterten Liste — beim Wechsel schließen.
  useEffect(() => setOpenAt(null), [filter]);

  const close = useCallback(() => setOpenAt(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setOpenAt((i) => (i === null ? null : (i + dir + items.length) % items.length)),
    [items.length],
  );

  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="relative scroll-mt-24 py-24 md:py-36">
      <div className="gutter">
        <div ref={head.ref} className={`${head.className} md:grid md:grid-cols-12 md:items-end md:gap-6`}>
          <div className="md:col-span-6">
            <SectionHeading index="02" label="Portfolio" />
            <h2 id="portfolio-title" className="display-lg mt-6 max-w-[12ch]">
              Ausgewählte
              <br />
              Arbeiten
            </h2>
          </div>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-stone md:col-span-4 md:col-start-9 md:mt-0">
            Sechs Bereiche, eine Handschrift. Klicken Sie ein Bild an, um es groß zu sehen.
          </p>
        </div>

        {/* Filter */}
        <div className="no-scrollbar -mx-[var(--spacing-gutter)] mt-12 overflow-x-auto px-[var(--spacing-gutter)] md:mt-16">
          <div role="tablist" aria-label="Portfolio filtern" className="flex min-w-max items-center gap-2">
            {[{ id: 'alle' as const, label: 'Alle' }, ...categories].map((c) => {
              const isActive = filter === c.id;
              const count = c.id === 'alle' ? portfolio.length : portfolio.filter((i) => i.category === c.id).length;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(c.id)}
                  className={`label flex items-center gap-2 border px-4 py-3 transition-colors duration-400 ${
                    isActive
                      ? 'border-paper bg-paper text-ink'
                      : 'border-paper/15 text-stone hover:border-paper/40 hover:text-paper'
                  }`}
                >
                  {c.label}
                  <span className={`text-[0.85em] ${isActive ? 'text-ink/50' : 'text-stone-dark'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Raster */}
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:mt-20 md:grid-cols-12 md:gap-x-6 md:gap-y-6">
          {items.map((item, i) => {
            const r = rhythm[i % rhythm.length];
            return (
              <li key={item.slug} className={`${r.mobile} ${r.desktop} ${r.offset}`}>
                <Tile item={item} index={i} sizes={sizesFor(r.span, r.mobile)} onOpen={() => setOpenAt(i)} />
              </li>
            );
          })}
        </ul>
      </div>

      {openAt !== null && (
        <Lightbox items={items} index={openAt} onClose={close} onStep={step} />
      )}
    </section>
  );
}

function Tile({
  item,
  index,
  sizes,
  onOpen,
}: {
  item: MediaItem;
  index: number;
  sizes: string;
  onOpen: () => void;
}) {
  const { ref, className } = useReveal<HTMLDivElement>({ threshold: 0.08 });
  const category = categories.find((c) => c.id === item.category);

  return (
    <div ref={ref} className={className} style={{ ['--reveal-delay' as string]: `${(index % 3) * 90}ms` }}>
      <button
        type="button"
        onClick={onOpen}
        className="group block w-full cursor-pointer text-left"
        aria-label={`${item.title ?? 'Bild'} — ${category?.label ?? ''} in großer Ansicht öffnen`}
      >
        <div className="relative overflow-hidden">
          <Figure
            item={item}
            sizes={sizes}
            className="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/15"
          />
          <span
            aria-hidden="true"
            className="label pointer-events-none absolute bottom-4 right-4 translate-y-3 border border-paper/40 bg-ink/50 px-3 py-2 text-paper opacity-0 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
          >
            Ansehen
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-paper/10 pt-3">
          <span className="font-display text-lg leading-tight text-paper md:text-xl">{item.title}</span>
          <span className="label shrink-0 text-stone">{category?.label}</span>
        </div>
        <p className="mt-1 text-xs text-stone-dark">
          {item.place} · {item.year}
        </p>
      </button>
    </div>
  );
}
