/**
 * Single source of truth for every image on the site.
 *
 * The build script (scripts/generate-images.mjs) renders each entry into a
 * responsive set of AVIF/WebP/JPEG files plus an inline LQIP placeholder and
 * writes src/data/media.generated.json, which the React app consumes.
 *
 * PROTOTYPE NOTE — the visuals are procedurally generated placeholder plates,
 * not photographs. To go live, drop real (licensed) photos into `source/<slug>.jpg`
 * and the same script will process them instead of rendering a plate.
 */

/** Curated, filmic palettes. Colours are sRGB triplets. */
export const palettes = {
  ink:    { base: [22, 23, 26],    blobs: [[46, 48, 55], [88, 78, 68], [12, 13, 16]], leak: [214, 168, 108], mood: 'dark' },
  slate:  { base: [38, 45, 54],    blobs: [[70, 84, 96], [26, 31, 38], [120, 132, 140]], leak: [176, 196, 210], mood: 'dark' },
  sand:   { base: [214, 202, 186], blobs: [[236, 227, 213], [186, 168, 148], [246, 240, 231]], leak: [255, 236, 202], mood: 'light' },
  clay:   { base: [176, 148, 132], blobs: [[206, 180, 162], [138, 110, 96], [232, 214, 200]], leak: [255, 214, 170], mood: 'light' },
  stone:  { base: [166, 168, 168], blobs: [[204, 206, 205], [124, 128, 130], [226, 226, 224]], leak: [236, 240, 244], mood: 'light' },
  olive:  { base: [104, 108, 88],  blobs: [[140, 144, 118], [72, 76, 62], [186, 186, 158]], leak: [226, 220, 168], mood: 'dark' },
  rose:   { base: [196, 172, 168], blobs: [[224, 204, 199], [158, 128, 126], [238, 226, 220]], leak: [255, 222, 210], mood: 'light' },
  amber:  { base: [148, 112, 74],  blobs: [[198, 156, 104], [96, 68, 46], [232, 196, 140]], leak: [255, 210, 140], mood: 'dark' },
};

export const aspects = {
  portrait: 3 / 4,
  tall: 2 / 3,
  square: 1,
  landscape: 4 / 3,
  wide: 3 / 2,
  cinema: 16 / 9,
};

/** Width ladders per role. */
export const ladders = {
  hero:    { master: 2400, widths: [640, 960, 1280, 1600, 2000, 2400] },
  feature: { master: 1800, widths: [560, 840, 1120, 1400, 1800] },
  grid:    { master: 1500, widths: [400, 640, 900, 1200, 1500] },
  portrait:{ master: 1300, widths: [420, 640, 900, 1300] },
  og:      { master: 1200, widths: [1200] },
};

export const media = [
  // ── Hero ────────────────────────────────────────────────────────────────
  { slug: 'hero-main', scene: 'landscape', role: 'hero', aspect: 'cinema', palette: 'ink', seed: 1041,
    alt: 'Platzhalter-Motiv: warmes Gegenlicht über der Mosel, Stimmungsbild für den Auftakt der Seite.' },

  // ── Portfolio ───────────────────────────────────────────────────────────
  { slug: 'p-portrait-01', scene: 'portrait', role: 'grid', aspect: 'tall', palette: 'ink', seed: 2101, category: 'portrait',
    title: 'Studio Nr. 4', place: 'Koblenz Altstadt', year: '2025',
    alt: 'Platzhalter für ein Portrait im Studio, weiches Seitenlicht auf dunklem Hintergrund.' },
  { slug: 'p-portrait-02', scene: 'portrait', role: 'grid', aspect: 'portrait', palette: 'rose', seed: 2102, category: 'portrait',
    title: 'Gegenlicht', place: 'Rheinufer', year: '2025',
    alt: 'Platzhalter für ein Aussenportrait im Gegenlicht am Rheinufer.' },
  { slug: 'p-portrait-03', scene: 'still', role: 'grid', aspect: 'square', palette: 'sand', seed: 2103, category: 'portrait',
    title: 'Nahaufnahme', place: 'Atelier', year: '2024',
    alt: 'Platzhalter für eine Portrait-Nahaufnahme in hellen, warmen Tönen.' },

  { slug: 'p-hochzeit-01', scene: 'couple', role: 'grid', aspect: 'wide', palette: 'sand', seed: 2201, category: 'hochzeit',
    title: 'Erster Blick', place: 'Schloss Stolzenfels', year: '2025',
    alt: 'Platzhalter für eine Hochzeitsreportage, heller Moment vor der Trauung.' },
  { slug: 'p-hochzeit-02', scene: 'couple', role: 'grid', aspect: 'tall', palette: 'clay', seed: 2202, category: 'hochzeit',
    title: 'Trauung', place: 'Deutsches Eck', year: '2024',
    alt: 'Platzhalter für einen Trauungsmoment in warmen Erdtönen.' },
  { slug: 'p-hochzeit-03', scene: 'couple', role: 'grid', aspect: 'portrait', palette: 'amber', seed: 2203, category: 'hochzeit',
    title: 'Blaue Stunde', place: 'Weinberge Winningen', year: '2025',
    alt: 'Platzhalter für ein Hochzeitspaar zur blauen Stunde in den Weinbergen.' },

  { slug: 'p-business-01', scene: 'business', role: 'grid', aspect: 'portrait', palette: 'slate', seed: 2301, category: 'business',
    title: 'Vorstandsportrait', place: 'Koblenz', year: '2025',
    alt: 'Platzhalter für ein Business-Portrait vor kühlem, grafischem Hintergrund.' },
  { slug: 'p-business-02', scene: 'business', role: 'grid', aspect: 'wide', palette: 'stone', seed: 2302, category: 'business',
    title: 'Team am Werk', place: 'Industriehafen', year: '2024',
    alt: 'Platzhalter für eine Team-Reportage in einer Werkhalle.' },
  { slug: 'p-business-03', scene: 'still', role: 'grid', aspect: 'square', palette: 'ink', seed: 2303, category: 'business',
    title: 'Handwerk', place: 'Mittelrhein', year: '2025',
    alt: 'Platzhalter für eine Detailaufnahme aus einer Business-Reportage.' },

  { slug: 'p-familie-01', scene: 'family', role: 'grid', aspect: 'landscape', palette: 'olive', seed: 2401, category: 'familie',
    title: 'Nachmittag', place: 'Stadtwald', year: '2025',
    alt: 'Platzhalter für ein Familienbild im Grünen am späten Nachmittag.' },
  { slug: 'p-familie-02', scene: 'still', role: 'grid', aspect: 'tall', palette: 'sand', seed: 2402, category: 'familie',
    title: 'Zuhause', place: 'Koblenz Süd', year: '2024',
    alt: 'Platzhalter für eine ruhige Familienszene zuhause in hellen Tönen.' },
  { slug: 'p-familie-03', scene: 'portrait', role: 'grid', aspect: 'portrait', palette: 'clay', seed: 2403, category: 'familie',
    title: 'Die ersten Tage', place: 'Atelier', year: '2025',
    alt: 'Platzhalter für eine Neugeborenen-Aufnahme in warmen, weichen Tönen.' },

  { slug: 'p-event-01', scene: 'event', role: 'grid', aspect: 'wide', palette: 'ink', seed: 2501, category: 'event',
    title: 'Bühne', place: 'Rhein-Mosel-Halle', year: '2025',
    alt: 'Platzhalter für eine Event-Aufnahme mit Bühnenlicht.' },
  { slug: 'p-event-02', scene: 'event', role: 'grid', aspect: 'square', palette: 'amber', seed: 2502, category: 'event',
    title: 'Abendempfang', place: 'Kurfürstliches Schloss', year: '2024',
    alt: 'Platzhalter für einen Abendempfang in warmem Kunstlicht.' },
  { slug: 'p-event-03', scene: 'event', role: 'grid', aspect: 'tall', palette: 'slate', seed: 2503, category: 'event',
    title: 'Backstage', place: 'Koblenz', year: '2025',
    alt: 'Platzhalter für einen Backstage-Moment in kühlem Licht.' },

  { slug: 'p-architektur-01', scene: 'arch', role: 'grid', aspect: 'tall', palette: 'stone', seed: 2601, category: 'architektur',
    title: 'Vertikale', place: 'Forum Confluentes', year: '2025',
    alt: 'Platzhalter für eine Architekturaufnahme mit starker Vertikalen.' },
  { slug: 'p-architektur-02', scene: 'arch', role: 'grid', aspect: 'landscape', palette: 'slate', seed: 2602, category: 'architektur',
    title: 'Beton & Licht', place: 'Koblenz', year: '2024',
    alt: 'Platzhalter für eine Architekturaufnahme aus Beton und Licht.' },
  { slug: 'p-architektur-03', scene: 'arch', role: 'grid', aspect: 'wide', palette: 'sand', seed: 2603, category: 'architektur',
    title: 'Interior', place: 'Privathaus Mittelrhein', year: '2025',
    alt: 'Platzhalter für eine Interior-Aufnahme in hellen, ruhigen Tönen.' },

  // ── Über / Leistungen ───────────────────────────────────────────────────
  { slug: 'about-portrait', scene: 'portrait', role: 'portrait', aspect: 'portrait', palette: 'ink', seed: 3101,
    alt: 'Platzhalter für das Portrait des Fotografen im Atelier.' },
  { slug: 'about-detail', scene: 'still', role: 'portrait', aspect: 'square', palette: 'clay', seed: 3102,
    alt: 'Platzhalter für eine Detailaufnahme aus dem Atelier.' },

  { slug: 's-portrait', scene: 'portrait', role: 'feature', aspect: 'portrait', palette: 'rose', seed: 4101,
    alt: 'Platzhalter für die Leistung Portraitfotografie.' },
  { slug: 's-hochzeit', scene: 'couple', role: 'feature', aspect: 'portrait', palette: 'sand', seed: 4102,
    alt: 'Platzhalter für die Leistung Hochzeitsreportage.' },
  { slug: 's-business', scene: 'business', role: 'feature', aspect: 'portrait', palette: 'slate', seed: 4103,
    alt: 'Platzhalter für die Leistung Business- und Brandingfotografie.' },
  { slug: 's-familie', scene: 'family', role: 'feature', aspect: 'portrait', palette: 'olive', seed: 4104,
    alt: 'Platzhalter für die Leistung Familienfotografie.' },
  { slug: 's-event', scene: 'event', role: 'feature', aspect: 'portrait', palette: 'amber', seed: 4105,
    alt: 'Platzhalter für die Leistung Event- und Reportagefotografie.' },
  { slug: 's-architektur', scene: 'arch', role: 'feature', aspect: 'portrait', palette: 'stone', seed: 4106,
    alt: 'Platzhalter für die Leistung Architektur- und Interiorfotografie.' },

  // ── Zwischenbilder ──────────────────────────────────────────────────────
  { slug: 'interlude-wide', scene: 'landscape', role: 'hero', aspect: 'cinema', palette: 'amber', seed: 5101,
    alt: 'Platzhalter für ein grossformatiges Zwischenbild in warmem Licht.' },
  { slug: 'contact-side', scene: 'landscape', role: 'feature', aspect: 'tall', palette: 'ink', seed: 5201,
    alt: 'Platzhalter für ein Stimmungsbild neben dem Kontaktformular.' },
];
