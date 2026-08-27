import { useEffect, useRef, useState } from 'react';
import { hero, site } from '../data/site';
import { image } from '../lib/media';
import { Figure } from './Figure';
import { useReducedMotion, useScrollTo } from '../hooks';

/**
 * Vollflächiger Auftakt. Das Bild trägt die Seite, die Typografie kommt
 * zeilenweise aus einer Maske. Der Text liegt auf einem eigenen Verlauf,
 * damit der Kontrast unabhängig vom Bild sicher bleibt.
 */
export function Hero() {
  const item = image('hero-main');
  const scrollTo = useScrollTo();
  const reduced = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 120);
    return () => clearTimeout(t);
  }, []);

  // Leichter Parallaxversatz: das Bild bleibt beim Scrollen etwas zurück.
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(() => {
        const el = layer.current;
        if (el) {
          const y = Math.min(window.scrollY, window.innerHeight);
          el.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden">
      <div ref={layer} className="absolute inset-0 -z-10 will-change-transform">
        <Figure
          item={item}
          priority
          sizes="100vw"
          className="h-[112svh] w-full"
          imgClassName={reduced ? '' : 'hero-drift'}
        />
      </div>

      {/* Lesbarkeit: unten dunkler, oben ein Hauch für die Kopfzeile. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/45 to-ink/35"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/60 to-transparent" />

      <div className="gutter flex min-h-[100svh] flex-col justify-end pb-10 pt-32 md:pb-16">
        <div className={entered ? 'is-revealed' : ''}>
          <p
            className="label mb-8 text-paper/70 transition-opacity duration-1000 md:mb-10"
            style={{ opacity: entered ? 1 : 0, transitionDelay: '900ms' }}
          >
            {hero.eyebrow}
          </p>

          <h1 className="display-xl max-w-[16ch] text-paper">
            {hero.lines.map((line, i) => (
              <span key={line} className="line-mask">
                <span style={{ ['--line-delay' as string]: `${120 + i * 130}ms` }}>{line}</span>
              </span>
            ))}
          </h1>

          <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:items-end">
            <p
              className="max-w-md text-base leading-relaxed text-paper/80 transition-all duration-1000 md:col-span-4 md:text-lg"
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? 'none' : 'translateY(1rem)',
                transitionDelay: '750ms',
              }}
            >
              {hero.standfirst}
            </p>

            <div
              className="flex flex-wrap items-center gap-3 transition-all duration-1000 sm:gap-4 md:col-span-5 md:flex-nowrap"
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? 'none' : 'translateY(1rem)',
                transitionDelay: '900ms',
              }}
            >
              <a
                href="#portfolio"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('portfolio');
                }}
                className="label group relative shrink-0 overflow-hidden border border-paper bg-paper px-7 py-4 text-ink"
              >
                <span className="relative z-10 transition-colors duration-500 group-hover:text-paper">
                  Portfolio ansehen
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                />
              </a>
              <a
                href="#kontakt"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('kontakt');
                }}
                className="label shrink-0 border border-paper/30 px-7 py-4 text-paper transition-colors duration-500 hover:border-paper"
              >
                Kontakt aufnehmen
              </a>
            </div>

            <dl
              className="hidden gap-8 transition-opacity duration-1000 md:col-span-3 md:flex md:flex-col md:gap-3"
              style={{ opacity: entered ? 1 : 0, transitionDelay: '1050ms' }}
            >
              {hero.meta.map((m) => (
                <div key={m.k} className="flex items-baseline justify-between gap-4 border-b border-paper/15 pb-2">
                  <dt className="label text-stone">{m.k}</dt>
                  <dd className="text-right text-sm text-paper/85">{m.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-paper/15 pt-5">
          <span className="label text-stone">{site.city} · {site.region}</span>
          <span aria-hidden="true" className="label flex items-center gap-3 text-stone">
            Scrollen
            <span className="relative block h-8 w-px overflow-hidden bg-paper/20">
              <span className="absolute inset-x-0 top-0 h-3 animate-[slide_2.2s_ease-in-out_infinite] bg-brass" />
            </span>
          </span>
        </div>
      </div>

      <style>{`@keyframes slide { 0% { transform: translateY(-100%); } 60%, 100% { transform: translateY(320%); } }`}</style>
    </section>
  );
}
