# Studio Confluentes — Website-Redesign (Konzept-Prototyp)

Ein unveröffentlichter Prototyp für den Webauftritt eines Fotografen in Koblenz.
**Keine offizielle Website, kein Livegang.**

```bash
npm install
npm run images     # Bilder erzeugen (einmalig, ~2 min)
npm run dev
```

## Wichtig: was hier Platzhalter ist

Die Bestandsseite `foto-koblenz.com` war aus der Entwicklungsumgebung **nicht
erreichbar** (die Egress-Policy beantwortet die Verbindung mit 403); eine
Analyse war damit nicht möglich, und der Block wurde nicht umgangen. Ebenso
blockiert waren alle externen Bildhoster (Unsplash, Pexels). Daraus folgt:

| Bereich | Stand | Vor dem Livegang |
| --- | --- | --- |
| Studio-Identität | **frei erfunden** („Studio Confluentes", nach dem römischen Namen von Koblenz) | durch die echten Angaben ersetzen |
| Kontaktdaten | Platzhalter; Rufnummer aus dem für Beispiele reservierten Block `…9900xx` | echte Daten in `src/data/site.ts` |
| Bilder | prozedural erzeugte Platzhalter-Frames | echte, lizenzierte Fotos (siehe unten) |
| Referenzen | ausdrücklich als Beispieltexte gekennzeichnet | nur freigegebene echte Stimmen |
| Kategorien | am üblichen Leistungsspektrum eines Koblenzer Studios orientiert | am tatsächlichen Angebot ausrichten |
| Indexierung | `noindex` + `robots.txt: Disallow` | beide Sicherungen entfernen |
| Formular | validiert, verschickt aber nichts | Backend/Mailversand anbinden |

Alle redaktionellen Inhalte liegen in **`src/data/site.ts`**, alle Bilder in
**`content/media.mjs`** — die beiden Dateien sind der einzige Ort, an dem
Inhalte gepflegt werden.

## Echte Fotos einsetzen

1. Bilder unter `source/<slug>.jpg` ablegen — `<slug>` wie in `content/media.mjs`
   (z. B. `source/hero-main.jpg`).
2. `npm run images`

Die Pipeline erkennt echte Dateien automatisch und wendet dieselbe Verarbeitung
an: Zuschnitt aufs Seitenverhältnis, AVIF/WebP/JPEG in fünf bis sechs Breiten,
LQIP-Vorschau, Manifest. Am Code ändert sich nichts.

Solange keine Datei vorliegt, rendert `scripts/scene.mjs` ein deterministisches
Platzhalter-Bild: Lichtführung, Tiefenebenen, Bokeh und Korn statt einer leeren
Farbfläche — bewusst abstrakt, damit es nie als echtes Foto missverstanden wird.

## Aufbau

```
content/media.mjs          Bildverzeichnis (Slug, Kategorie, Alt-Text, Palette, Szene)
scripts/scene.mjs          prozeduraler Szenen-Renderer
scripts/generate-images.mjs Bildpipeline → public/img + src/data/media.generated.json
src/data/site.ts           sämtliche Texte, Kontaktdaten, Leistungen
src/components/            Hero, Portfolio, Lightbox, Editorial, Services, Contact, Chrome
src/hooks/                 Reveal, Scroll, Fokusfalle, Scroll-Lock
```

## Technisches

- **Stack** React 19 · Vite · Tailwind CSS 4 · TypeScript
- **Performance** AVIF vor WebP vor JPEG, `srcset`/`sizes` überall, Lazy Loading
  außer beim Hero (preload + `fetchpriority=high`), feste Seitenverhältnisse
  gegen Layout-Shift, LQIP-Blur-up. Schriften sind selbst gehostet — keine
  Anfrage an Dritte.
- **Accessibility** Skip-Link, sichtbarer Tastaturfokus, Lightbox als Dialog mit
  Fokusfalle und Escape/Pfeiltasten, ausgezeichnete Formularfehler, Alt-Texte,
  `prefers-reduced-motion` schaltet Bewegung und Zeiger ab.
- **SEO** Meta, Open Graph, Twitter Card, JSON-LD (`LocalBusiness` +
  `ProfessionalService` mit Leistungskatalog, Einzugsgebiet, Geo), Sitemap,
  semantische Überschriftenhierarchie. Aktuell durch `noindex` abgesichert.

## Skripte

| Befehl | Wirkung |
| --- | --- |
| `npm run dev` | Entwicklungsserver |
| `npm run images` | Bilder neu erzeugen (`-- --clean` löscht vorher) |
| `npm run build` | Bilder + Typecheck + Produktionsbuild |
| `npm run build:only` | Build ohne Bilderzeugung |
| `npm run preview` | Produktionsbuild lokal ansehen |
