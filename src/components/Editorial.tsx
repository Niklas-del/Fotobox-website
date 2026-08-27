import { about, manifest, testimonials } from '../data/site';
import { image } from '../lib/media';
import { Figure } from './Figure';
import { SectionHeading } from './Chrome';
import { useReveal } from '../hooks';

/* ── Haltung ───────────────────────────────────────────────────────────── */
export function Manifest() {
  const { ref, className } = useReveal<HTMLDivElement>();
  return (
    <section aria-labelledby="haltung-title" className="gutter py-24 md:py-36">
      <div ref={ref} className={`${className} md:grid md:grid-cols-12 md:gap-6`}>
        <div className="md:col-span-3">
          <SectionHeading index={manifest.index} label={manifest.label} />
        </div>
        <div className="mt-8 md:col-span-8 md:col-start-5 md:mt-0">
          <h2 id="haltung-title" className="display-md max-w-[20ch] text-balance">
            {manifest.headline}
          </h2>
          <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 md:gap-10">
            {manifest.body.map((p) => (
              <p key={p.slice(0, 24)} className="text-base leading-relaxed text-stone">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Zwischenbild mit Zitat ────────────────────────────────────────────── */
export function Interlude() {
  const item = image('interlude-wide');
  const { ref, className } = useReveal<HTMLDivElement>({ threshold: 0.05 });
  return (
    <section aria-label="Zwischenbild" className="relative isolate">
      <div ref={ref} className={className}>
        <Figure item={item} sizes="100vw" className="h-[60svh] w-full md:h-[78svh]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
        <div className="gutter absolute inset-x-0 bottom-0 pb-12 md:pb-20">
          <blockquote className="max-w-[22ch] font-display text-[clamp(1.75rem,4.2vw,3.5rem)] leading-[1.05] tracking-tight text-paper md:max-w-[18ch]">
            „Das beste Licht ist meistens das, auf das man gewartet hat.“
          </blockquote>
        </div>
      </div>
    </section>
  );
}

/* ── Studio ────────────────────────────────────────────────────────────── */
export function About() {
  const portraitImg = image('about-portrait');
  const detailImg = image('about-detail');
  const { ref, className } = useReveal<HTMLDivElement>();

  return (
    <section id="studio" aria-labelledby="studio-title" className="gutter scroll-mt-24 py-24 md:py-36">
      <div ref={ref} className={`${className} md:grid md:grid-cols-12 md:gap-6`}>
        {/* Bildspalte, im Blattspiegel versetzt */}
        <div className="md:col-span-5">
          <Figure item={portraitImg} sizes="(min-width: 768px) 42vw, 100vw" className="w-full" />
          <div className="mt-6 hidden w-2/3 md:ml-auto md:block">
            <Figure item={detailImg} sizes="28vw" className="w-full" />
          </div>
        </div>

        <div className="mt-12 md:col-span-6 md:col-start-7 md:mt-0 md:pt-12">
          <SectionHeading index={about.index} label={about.label} />
          <h2 id="studio-title" className="display-lg mt-6">
            {about.headline}
          </h2>
          <p className="mt-8 max-w-xl font-display text-2xl leading-snug text-paper/90 md:text-3xl">
            {about.lead}
          </p>
          <div className="mt-8 max-w-xl space-y-5">
            {about.body.map((p) => (
              <p key={p.slice(0, 24)} className="text-base leading-relaxed text-stone">
                {p}
              </p>
            ))}
          </div>

          <dl className="mt-12 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {about.facts.map((f) => (
              <div key={f.k} className="border-t border-paper/12 pt-3">
                <dt className="label text-stone-dark">{f.k}</dt>
                <dd className="mt-1.5 text-sm text-paper/85">{f.v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-12 font-display text-3xl italic text-paper/70">{about.signature}</p>
        </div>
      </div>
    </section>
  );
}

/* ── Stimmen ───────────────────────────────────────────────────────────── */
export function Testimonials() {
  const { ref, className } = useReveal<HTMLDivElement>();
  return (
    <section id="stimmen" aria-labelledby="stimmen-title" className="gutter scroll-mt-24 py-24 md:py-36">
      <div ref={ref} className={className}>
        <div className="md:grid md:grid-cols-12 md:items-end md:gap-6">
          <div className="md:col-span-6">
            <SectionHeading index="05" label="Stimmen" />
            <h2 id="stimmen-title" className="display-lg mt-6 max-w-[14ch]">
              Was danach gesagt wird
            </h2>
          </div>
          {/* Ehrlichkeit vor Wirkung: die Texte sind ausdrücklich keine echten Bewertungen. */}
          <p className="mt-6 max-w-sm border-l border-brass/50 pl-4 text-sm leading-relaxed text-stone-dark md:col-span-4 md:col-start-9 md:mt-0">
            <strong className="font-medium text-stone">Platzhalter.</strong> Für den Prototyp stehen hier
            Beispieltexte — keine echten Kundenstimmen. Sie werden vor einem Livegang durch
            freigegebene Referenzen ersetzt.
          </p>
        </div>

        <ul className="mt-14 grid gap-px overflow-hidden border border-paper/10 bg-paper/10 md:mt-20 md:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.author + t.role} className="flex flex-col justify-between gap-10 bg-ink p-8 md:p-10">
              <blockquote className="font-display text-xl leading-snug text-paper/90 md:text-2xl">
                „{t.quote}“
              </blockquote>
              <footer className="border-t border-paper/10 pt-4">
                <p className="label text-stone">{t.author}</p>
                <p className="mt-1.5 text-sm text-stone-dark">{t.role}</p>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
