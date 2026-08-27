import { useState, type FormEvent } from 'react';
import { contact, services, site } from '../data/site';
import { image } from '../lib/media';
import { Figure } from './Figure';
import { SectionHeading } from './Chrome';
import { useReveal } from '../hooks';

type Errors = Partial<Record<'name' | 'email' | 'nachricht', string>>;

/**
 * Kontakt. Bewusst kurz gehalten: fünf Pflichtangaben, der Rest optional.
 * Der Prototyp verschickt nichts — die Absendestrecke zeigt Validierung und
 * Bestätigung, damit die Interaktion bewertbar ist.
 */
export function Contact() {
  const { ref, className } = useReveal<HTMLDivElement>();
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const aside = image('contact-side');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    // Honeypot: von Menschen nie ausgefüllt, von einfachen Bots fast immer.
    if (data.get('website')) return;

    const next: Errors = {};
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const nachricht = String(data.get('nachricht') ?? '').trim();
    if (name.length < 2) next.name = 'Bitte tragen Sie Ihren Namen ein.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = 'Bitte eine gültige E-Mail-Adresse angeben.';
    if (nachricht.length < 10) next.nachricht = 'Ein, zwei Sätze zum Anlass genügen.';

    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  };

  return (
    <section id="kontakt" aria-labelledby="kontakt-title" className="gutter scroll-mt-24 py-24 md:py-36">
      <div ref={ref} className={`${className} md:grid md:grid-cols-12 md:gap-10`}>
        {/* Text und Formular */}
        <div className="md:col-span-7">
          <SectionHeading index={contact.index} label={contact.label} />
          <h2 id="kontakt-title" className="display-lg mt-6 max-w-[14ch]">
            {contact.headline}
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-stone">{contact.lead}</p>

          {sent ? (
            <div role="status" className="mt-12 border border-brass/40 p-8">
              <p className="font-display text-3xl">Danke — angekommen.</p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-stone">
                Im Prototyp wird nichts verschickt: Es gibt bewusst kein Backend und keine
                Datenspeicherung. Auf der fertigen Seite ginge die Anfrage jetzt an{' '}
                <span className="text-paper">{site.email}</span>.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="label mt-8 cursor-pointer border border-paper/25 px-6 py-3 transition-colors hover:border-paper"
              >
                Formular erneut anzeigen
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="mt-12 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              <Field id="name" label="Name" required error={errors.name} autoComplete="name" />
              <Field id="email" label="E-Mail" type="email" required error={errors.email} autoComplete="email" />
              <Field id="telefon" label="Telefon (optional)" type="tel" autoComplete="tel" />

              <div className="flex flex-col gap-2">
                <label htmlFor="leistung" className="label text-stone">
                  Gewünschte Leistung
                </label>
                <select
                  id="leistung"
                  name="leistung"
                  defaultValue=""
                  className="cursor-pointer appearance-none border-b border-paper/25 bg-transparent py-3 text-base text-paper transition-colors focus:border-brass focus:outline-none"
                >
                  <option value="" className="bg-ink">Noch offen</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id} className="bg-ink">
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <Field id="zeitraum" label="Zeitraum / Wunschtermin" type="date" />

              <div className="sm:col-span-2">
                <Field id="nachricht" label="Nachricht" textarea required error={errors.nachricht} />
              </div>

              {/* Honeypot — für Menschen unsichtbar, für Screenreader ausgeblendet. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="website">Website (bitte leer lassen)</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-6 sm:col-span-2">
                <button
                  type="submit"
                  className="label group relative cursor-pointer overflow-hidden border border-paper bg-paper px-9 py-4 text-ink"
                >
                  <span className="relative z-10 transition-colors duration-500 group-hover:text-paper">
                    Anfrage senden
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                  />
                </button>
                <p className="max-w-xs text-xs leading-relaxed text-stone-dark">
                  Prototyp: Es werden keine Daten übertragen oder gespeichert.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Bild und Eckdaten */}
        <div className="mt-16 md:col-span-4 md:col-start-9 md:mt-0">
          <Figure item={aside} sizes="(min-width: 768px) 32vw, 100vw" className="w-full" />
          <dl className="mt-8 space-y-5">
            <div className="border-t border-paper/12 pt-4">
              <dt className="label text-stone-dark">Standort</dt>
              <dd className="mt-2 text-sm leading-relaxed text-paper/85">
                {site.address.zip} {site.address.locality}
                <br />
                <span className="text-stone">{site.address.note}</span>
              </dd>
            </div>
            <div className="border-t border-paper/12 pt-4">
              <dt className="label text-stone-dark">E-Mail</dt>
              <dd className="mt-2 text-sm">
                <a href={`mailto:${site.email}`} className="text-paper/85 transition-colors hover:text-paper">
                  {site.email}
                </a>
              </dd>
            </div>
            <div className="border-t border-paper/12 pt-4">
              <dt className="label text-stone-dark">Telefon</dt>
              <dd className="mt-2 text-sm">
                <a href={`tel:${site.phoneHref}`} className="text-paper/85 transition-colors hover:text-paper">
                  {site.phone}
                </a>
              </dd>
            </div>
            <div className="border-t border-paper/12 pt-4">
              <dt className="label text-stone-dark">Social Media</dt>
              <dd className="mt-2 text-sm leading-relaxed text-stone">
                Im Prototyp nicht hinterlegt — es lagen keine gesicherten Profile vor.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  type = 'text',
  required = false,
  error,
  textarea = false,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  textarea?: boolean;
  autoComplete?: string;
}) {
  const shared =
    'w-full border-b border-paper/25 bg-transparent py-3 text-base text-paper placeholder:text-stone-dark transition-colors focus:border-brass focus:outline-none';
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label text-stone">
        {label}
        {required && <span className="ml-1 text-brass">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={id}
          rows={5}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${shared} resize-y`}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={shared}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-brass">
          {error}
        </p>
      )}
    </div>
  );
}
