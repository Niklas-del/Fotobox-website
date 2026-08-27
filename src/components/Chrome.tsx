import { useEffect, useRef, useState } from 'react';
import { nav, site, legal } from '../data/site';
import { useActiveSection, useReducedMotion, useScrollState, useScrollTo } from '../hooks';

/* ── Wortmarke ─────────────────────────────────────────────────────────── */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-[0.45em] ${className}`}>
      <span className="font-display text-[1.35em] leading-none tracking-tight">Confluentes</span>
      <span className="label hidden text-[0.42em] text-stone sm:inline">Foto · Koblenz</span>
    </span>
  );
}

/* ── Hinweisleiste ─────────────────────────────────────────────────────── */
export function PrototypeBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="relative z-50 bg-ink-mute text-paper/80">
      <div className="gutter flex items-center justify-between gap-4 py-2.5">
        <p className="label text-[0.6rem] leading-relaxed tracking-[0.16em] text-stone">
          {legal.prototypeNotice}
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="label shrink-0 cursor-pointer text-[0.6rem] text-stone transition-colors hover:text-paper"
        >
          Schließen
        </button>
      </div>
    </div>
  );
}

/* ── Kopfzeile ─────────────────────────────────────────────────────────── */
export function Header() {
  const { up, past } = useScrollState();
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(nav.map((n) => n.id));
  const scrollTo = useScrollTo();

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollTo(id);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-[transform,background-color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        up || menuOpen ? 'translate-y-0' : '-translate-y-full'
      } ${past || menuOpen ? 'border-b border-paper/10 bg-ink/85 backdrop-blur-xl' : 'border-b border-transparent'}`}
    >
      <div className="gutter flex h-[var(--header-h)] items-center justify-between">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-base text-paper"
          aria-label={`${site.name} — zum Seitenanfang`}
        >
          <Wordmark />
        </a>

        <nav aria-label="Hauptnavigation" className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={(e) => {
                e.preventDefault();
                go(n.id);
              }}
              aria-current={active === n.id ? 'true' : undefined}
              className={`label relative py-2 transition-colors duration-300 ${
                active === n.id ? 'text-paper' : 'text-stone hover:text-paper'
              }`}
            >
              {n.label}
              <span
                aria-hidden="true"
                className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-brass transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  active === n.id ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </a>
          ))}
          <a
            href="#kontakt"
            onClick={(e) => {
              e.preventDefault();
              go('kontakt');
            }}
            className="label border border-paper/25 px-5 py-2.5 text-paper transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-ink"
          >
            Anfragen
          </a>
        </nav>

        <button
          type="button"
          className="label -mr-2 flex items-center gap-2 px-2 py-3 text-paper md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? 'Schließen' : 'Menü'}
          <span aria-hidden="true" className="relative block h-3 w-4">
            <span
              className={`absolute left-0 block h-px w-full bg-paper transition-transform duration-300 ${
                menuOpen ? 'top-1.5 rotate-45' : 'top-0.5'
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-full bg-paper transition-transform duration-300 ${
                menuOpen ? 'top-1.5 -rotate-45' : 'top-2.5'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        id="mobile-nav"
        hidden={!menuOpen}
        className="gutter border-t border-paper/10 bg-ink pb-10 pt-6 md:hidden"
      >
        <ul className="space-y-1">
          {nav.map((n, i) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(n.id);
                }}
                className="flex items-baseline gap-4 py-3 font-display text-4xl text-paper"
              >
                <span className="label text-[0.6rem] text-stone">{String(i + 1).padStart(2, '0')}</span>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-8 space-y-1 border-t border-paper/10 pt-6 text-sm text-stone">
          <a className="block py-1" href={`mailto:${site.email}`}>{site.email}</a>
          <a className="block py-1" href={`tel:${site.phoneHref}`}>{site.phone}</a>
        </div>
      </div>
    </header>
  );
}

/* ── Abschnittskopf ────────────────────────────────────────────────────── */
export function SectionHeading({
  index,
  label,
  className = '',
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="label text-brass">{index}</span>
      <span aria-hidden="true" className="h-px w-10 bg-paper/20" />
      <span className="label text-stone">{label}</span>
    </div>
  );
}

/* ── Zeiger ────────────────────────────────────────────────────────────── *
 * Ein kleiner, invertierender Punkt. Nur bei feinem Zeigegerät, nie bei
 * reduzierter Bewegung — und er ersetzt den Systemcursor nicht, sondern
 * begleitet ihn, damit Klickziele erkennbar bleiben.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (reduced || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = dot.current;
    if (!el) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = e.target as HTMLElement | null;
      setHot(!!target?.closest('a, button, [role="button"], input, select, textarea'));
    };

    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div ref={dot} aria-hidden="true" className="cursor-dot">
      <div
        className="rounded-full bg-paper transition-[width,height,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ width: hot ? 34 : 8, height: hot ? 34 : 8, opacity: hot ? 0.55 : 0.85 }}
      />
    </div>
  );
}

/* ── Fußzeile ──────────────────────────────────────────────────────────── */
export function Footer() {
  const scrollTo = useScrollTo();
  return (
    <footer className="border-t border-paper/10 bg-ink">
      <div className="gutter py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] tracking-tight">
              Studio
              <br />
              Confluentes
            </p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-stone">
              Fotografie aus {site.city}. {site.address.note}
            </p>
          </div>

          <nav aria-label="Fußzeile" className="md:col-span-3 md:col-start-7">
            <p className="label mb-5 text-stone">Seite</p>
            <ul className="space-y-2.5 text-sm">
              {nav.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(n.id);
                    }}
                    className="text-paper/75 transition-colors hover:text-paper"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="label mb-5 text-stone">Kontakt</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href={`mailto:${site.email}`} className="text-paper/75 transition-colors hover:text-paper">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phoneHref}`} className="text-paper/75 transition-colors hover:text-paper">
                  {site.phone}
                </a>
              </li>
              <li className="text-paper/75">
                {site.address.zip} {site.address.locality}
              </li>
            </ul>
            {site.socials.length > 0 && (
              <ul className="mt-5 space-y-2.5 text-sm">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} className="text-paper/75 transition-colors hover:text-paper">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/10 pt-6 text-xs text-stone-dark sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name} — Konzept-Prototyp, nicht veröffentlicht.</p>
          <p className="flex gap-6">
            <span className="cursor-not-allowed" title="Im Prototyp nicht hinterlegt">Impressum</span>
            <span className="cursor-not-allowed" title="Im Prototyp nicht hinterlegt">Datenschutz</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
