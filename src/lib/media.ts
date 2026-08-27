import generated from '../data/media.generated.json';
import type { CategoryId } from '../data/site';

export type MediaItem = {
  slug: string;
  role: string;
  category: CategoryId | null;
  title: string | null;
  place: string | null;
  year: string | null;
  alt: string;
  width: number;
  height: number;
  ratio: number;
  widths: number[];
  jpegWidth: number;
  lqip: string;
  isPlaceholder: boolean;
};

const items = generated.items as MediaItem[];
const bySlug = new Map(items.map((i) => [i.slug, i]));

/** Throws loudly at module load rather than rendering a broken frame later. */
export function image(slug: string): MediaItem {
  const found = bySlug.get(slug);
  if (!found) throw new Error(`Kein Bild für "${slug}" — content/media.mjs prüfen und "npm run images" laufen lassen.`);
  return found;
}

export const portfolio = items.filter((i) => i.category !== null);

export function srcSet(item: MediaItem, ext: 'avif' | 'webp'): string {
  return item.widths.map((w) => `/img/${item.slug}-${w}.${ext} ${w}w`).join(', ');
}

export function fallbackSrc(item: MediaItem): string {
  return `/img/${item.slug}-${item.jpegWidth}.jpg`;
}
