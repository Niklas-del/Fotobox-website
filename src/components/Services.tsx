import { services, type Service } from '../data/site';
import { image } from '../lib/media';
import { Figure } from './Figure';
import { SectionHeading } from './Chrome';
import { useReveal, useScrollTo } from '../hooks';

/**
 * Leistungen als abwechselnd gesetzte Doppelseiten: Bild und Text tauschen die
 * Seite, die Ziffer läuft als Anker durch. Jede Leistung endet mit ihrem
 * eigenen Weg ins Kontaktformular — die Auswahl wird dort vorbelegt.
 */
export function Services() {
  const { ref, className } = useReveal<HTMLDivElement>();

  return (
    <section id="leistungen" aria-labelledby="leistungen-title" className="scroll-mt-24 py-24 md:py-36">
      <div className="gutter">
        <div ref={ref} className={`${className} md:grid md:grid-cols-12 md:items-end md:gap-6`}>
          <div className="md:col-span-6">
            <SectionHeading index="04" label="Leistungen" />
            <h2 id="leistungen-title" className="display-lg mt-6 max-w-[12ch]">
              Wofür man mich bucht
            </h2>
          </div>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-stone md:col-span-4 md:col-start-9 md:mt-0">
            Sechs Bereiche — im Zweifel schreiben Sie einfach, worum es geht. Vieles lässt sich
            kombinieren.
          </p>
        </div>
      </div>

      <div className="mt-16 md:mt-28">
        {services.map((service, i) => (
          <ServiceRow key={service.id} service={service} flipped={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function ServiceRow({ service, flipped }: { service: Service; flipped: boolean }) {
  const { ref, className } = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const scrollTo = useScrollTo();
  const item = image(service.slug);

  const goToForm = () => {
    const select = document.getElementById('leistung') as HTMLSelectElement | null;
    if (select) select.value = service.id;
    scrollTo('kontakt');
  };

  return (
    <article ref={ref} className={`${className} gutter border-t border-paper/10 py-12 md:py-20`}>
      <div className="md:grid md:grid-cols-12 md:items-center md:gap-10">
        <div className={`md:col-span-5 ${flipped ? 'md:order-2 md:col-start-8' : ''}`}>
          <Figure
            item={item}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="w-full"
            imgClassName="transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
          />
        </div>

        <div className={`mt-8 md:mt-0 ${flipped ? 'md:order-1 md:col-span-6 md:col-start-1' : 'md:col-span-6 md:col-start-7'}`}>
          <div className="flex items-baseline gap-5">
            <span className="label text-brass">{service.index}</span>
            <h3 className="display-md">{service.title}</h3>
          </div>
          <p className="mt-4 max-w-md font-display text-xl leading-snug text-paper/80 md:text-2xl">
            {service.kicker}
          </p>
          <p className="mt-6 max-w-md text-base leading-relaxed text-stone">{service.body}</p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {service.points.map((p) => (
              <li key={p} className="label flex items-center gap-2 text-stone-dark">
                <span aria-hidden="true" className="block h-1 w-1 rounded-full bg-brass" />
                {p}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={goToForm}
            className="group mt-10 inline-flex cursor-pointer items-center gap-4 text-paper"
          >
            <span className="label relative">
              Anfrage zu {service.title}
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-brass transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            </span>
            <svg width="26" height="8" viewBox="0 0 26 8" fill="none" aria-hidden="true" className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
              <path d="M0 4h24m0 0-4-3.5M24 4l-4 3.5" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
