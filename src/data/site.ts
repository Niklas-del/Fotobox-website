/**
 * Alle redaktionellen Inhalte der Seite an einem Ort.
 *
 * ⚠️  PROTOTYP: Studio-Name, Kontaktdaten und Referenzen sind Platzhalter.
 * Die Original-Website (foto-koblenz.com) war aus dieser Umgebung nicht
 * erreichbar, deshalb steht hier bewusst eine erfundene, klar als solche
 * erkennbare Studio-Identität — und keine Nachbildung eines echten Betriebs.
 * Vor einem Livegang wird diese Datei mit den echten Angaben ersetzt.
 */

export const site = {
  name: 'Studio Confluentes',
  shortName: 'Confluentes',
  claim: 'Fotografie · Koblenz',
  city: 'Koblenz',
  region: 'Mittelrhein',

  /* Platzhalter-Kontaktdaten. Die Rufnummer stammt aus dem von der
     Bundesnetzagentur für Beispiele reservierten Block (…9900xx). */
  email: 'hallo@studio-confluentes.example',
  phone: '+49 261 99 000 12',
  phoneHref: '+492619900012',
  address: {
    locality: 'Koblenz',
    zip: '56068',
    note: 'Atelier in der Altstadt · Termine nach Vereinbarung',
  },
  socials: [
    // Bewusst leer: es liegen keine verlässlichen Profile vor.
    // { label: 'Instagram', href: '…' },
  ] as { label: string; href: string }[],
} as const;

export type CategoryId =
  | 'portrait'
  | 'hochzeit'
  | 'business'
  | 'familie'
  | 'event'
  | 'architektur';

export const categories: { id: CategoryId; label: string; blurb: string }[] = [
  { id: 'portrait', label: 'Portrait', blurb: 'Menschen, ruhig und klar gesehen.' },
  { id: 'hochzeit', label: 'Hochzeit', blurb: 'Ein ganzer Tag, dokumentarisch erzählt.' },
  { id: 'business', label: 'Business', blurb: 'Unternehmen, die nach etwas aussehen.' },
  { id: 'familie', label: 'Familie', blurb: 'Nähe, ohne gestellte Posen.' },
  { id: 'event', label: 'Event', blurb: 'Abende, die man später wiedererkennt.' },
  { id: 'architektur', label: 'Architektur', blurb: 'Räume, Licht und Proportion.' },
];

export const nav = [
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'studio', label: 'Studio' },
  { id: 'leistungen', label: 'Leistungen' },
  { id: 'stimmen', label: 'Stimmen' },
  { id: 'kontakt', label: 'Kontakt' },
];

export const hero = {
  eyebrow: 'Fotografie aus Koblenz — seit 2011',
  lines: ['Momente,', 'die bleiben.'],
  standfirst:
    'Portrait, Hochzeit und Business — fotografiert am Zusammenfluss von Rhein und Mosel. Ruhig, dokumentarisch, ohne Effekt.',
  meta: [
    { k: 'Standort', v: 'Koblenz · Mittelrhein' },
    { k: 'Arbeitsweise', v: 'Verfügbares Licht' },
    { k: 'Buchung', v: 'Nach Vereinbarung' },
  ],
};

export const manifest = {
  index: '01',
  label: 'Haltung',
  headline: 'Ein Bild ist dann gut, wenn Sie sich später an den Moment erinnern — nicht an die Kamera.',
  body: [
    'Ich arbeite dokumentarisch. Das heißt: wenig Regie, viel Beobachtung, und Licht, das schon da ist. Was bleibt, sind Bilder, die in zehn Jahren nicht nach dem Jahr aussehen, in dem sie entstanden sind.',
    'Zwischen Deutschem Eck, Weinbergen und Werkhalle ist der Mittelrhein mein Revier. Für alles darüber hinaus reise ich gern.',
  ],
};

export const about = {
  index: '03',
  label: 'Studio',
  headline: 'Hinter der Kamera',
  lead:
    'Seit über einem Jahrzehnt fotografiere ich Menschen, Feste und Unternehmen in Koblenz und am Mittelrhein.',
  body: [
    'Angefangen habe ich mit Schwarzweißfilm und einer geliehenen Kamera — geblieben ist die Neugier auf Menschen und die Geduld, auf den richtigen Moment zu warten, statt ihn zu inszenieren.',
    'Ein Termin beginnt bei mir mit einem Gespräch, nicht mit einem Paketpreis. Erst wenn klar ist, worum es geht, wird fotografiert. Danach bekommen Sie eine sorgfältig ausgewählte Serie — keine 800 Dateien, aus denen Sie selbst suchen müssen.',
  ],
  facts: [
    { k: 'Basis', v: 'Koblenz' },
    { k: 'Radius', v: 'Mittelrhein, Eifel, Westerwald' },
    { k: 'Licht', v: 'Vorhandenes, wo immer möglich' },
    { k: 'Sprachen', v: 'Deutsch, Englisch' },
  ],
  signature: 'Studio Confluentes',
};

export type Service = {
  index: string;
  id: string;
  slug: string;         // Bild-Slug aus content/media.mjs
  title: string;
  kicker: string;
  body: string;
  points: string[];
  category: CategoryId;
};

export const services: Service[] = [
  {
    index: '01',
    id: 'portraitfotografie',
    slug: 's-portrait',
    title: 'Portrait',
    kicker: 'Für Menschen, die sich selbst wiedererkennen wollen',
    body: 'Eine Stunde, ein Gespräch, verfügbares Licht — im Atelier oder draußen in der Stadt. Ergebnis ist eine kleine, sorgfältig ausgewählte Serie statt eines Katalogs.',
    points: ['Atelier oder Location', 'Bildauswahl gemeinsam', 'Retusche zurückhaltend'],
    category: 'portrait',
  },
  {
    index: '02',
    id: 'hochzeitsreportage',
    slug: 's-hochzeit',
    title: 'Hochzeit',
    kicker: 'Ein Tag, durchgehend erzählt',
    body: 'Von den ersten leisen Stunden bis spät am Abend. Ich begleite, statt zu dirigieren — Gruppenbilder gibt es trotzdem, kurz und schmerzlos.',
    points: ['Begleitung ganztags oder stundenweise', 'Zweite Kamera auf Wunsch', 'Online-Galerie zum Teilen'],
    category: 'hochzeit',
  },
  {
    index: '03',
    id: 'business-branding',
    slug: 's-business',
    title: 'Business & Branding',
    kicker: 'Bilder, die zur Firma passen — nicht zur Bilddatenbank',
    body: 'Team- und Vorstandsportraits, Reportagen aus Werkhalle und Büro, Bildstrecken für Website und Presse. Konsistent genug, um über Jahre zusammenzupassen.',
    points: ['Portraits am Standort', 'Reportage & Detail', 'Nutzungsrechte klar geregelt'],
    category: 'business',
  },
  {
    index: '04',
    id: 'familie',
    slug: 's-familie',
    title: 'Familie',
    kicker: 'Nähe statt Aufstellung',
    body: 'Draußen, zuhause oder im Atelier. Kinder dürfen Kinder sein; die besten Bilder entstehen meist in den Minuten, in denen niemand mehr an die Kamera denkt.',
    points: ['Zuhause oder im Freien', 'Auch Neugeborene', 'Ruhiges Tempo'],
    category: 'familie',
  },
  {
    index: '05',
    id: 'event-reportage',
    slug: 's-event',
    title: 'Event & Reportage',
    kicker: 'Der Abend, wie er wirklich war',
    body: 'Firmenfeiern, Konzerte, Empfänge, Jubiläen. Diskret unterwegs, mit vorhandenem Licht — und am nächsten Tag eine erste Auswahl für Presse und Social Media.',
    points: ['Diskrete Begleitung', 'Schnelle Vorauswahl', 'Bühne, Gäste, Details'],
    category: 'event',
  },
  {
    index: '06',
    id: 'architektur-interior',
    slug: 's-architektur',
    title: 'Architektur & Interior',
    kicker: 'Räume, gesehen wie geplant',
    body: 'Für Architekturbüros, Handwerk und Immobilien: gerade Linien, ehrliche Proportionen und der Tageszeitpunkt, an dem der Raum am besten aussieht.',
    points: ['Perspektivisch korrigiert', 'Tages- und Kunstlicht', 'Innen und außen'],
    category: 'architektur',
  },
];

/**
 * ⚠️ Beispieltexte. Keine echten Kundenstimmen — sie sind im Interface
 * ausdrücklich als Platzhalter gekennzeichnet und dürfen so nicht live gehen.
 */
export const testimonials = [
  {
    quote:
      'Wir haben den halben Tag kaum gemerkt, dass fotografiert wurde — und hatten am Ende Bilder, auf denen alle so aussehen, wie sie wirklich sind.',
    author: 'Beispielreferenz',
    role: 'Hochzeit, Mittelrhein',
  },
  {
    quote:
      'Die Teamportraits passen nach zwei Jahren immer noch zu den neuen. Genau das war der Auftrag.',
    author: 'Beispielreferenz',
    role: 'Mittelständisches Unternehmen, Koblenz',
  },
  {
    quote:
      'Ruhig, pünktlich, vorbereitet. Und Bilder, die wir seitdem überall einsetzen.',
    author: 'Beispielreferenz',
    role: 'Kulturveranstalter',
  },
];

export const contact = {
  index: '06',
  label: 'Kontakt',
  headline: 'Erzählen Sie, worum es geht.',
  lead: 'Ein paar Zeilen genügen. Ich melde mich in der Regel innerhalb von zwei Werktagen mit Terminvorschlägen und einer Einschätzung.',
};

export const legal = {
  prototypeNotice:
    'Konzept-Prototyp — nicht die offizielle Website. Alle Bilder, Namen und Kontaktdaten sind Platzhalter.',
};
