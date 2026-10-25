import { readFileSync, readdirSync } from 'node:fs';
import { resolveReading } from '../../src/lib/content/resolve-reading.mjs';

const root = new URL('../../src/lib/content/', import.meta.url);
/** @type {import('../../src/lib/types/content').ReadingRecord[]} */
export const records = readdirSync(new URL('entries/', root))
  .filter((file) => file.endsWith('.json'))
  .map((file) => JSON.parse(readFileSync(new URL(`entries/${file}`, root), 'utf8')));
/** @type {import('../../src/lib/types/content').Category[]} */
export const categories = JSON.parse(readFileSync(new URL('categories.json', root), 'utf8'));
/** @param {string} slug */
export function record(slug) {
  const entry = records.find((entry) => entry.slug === slug || entry.id === slug);
  if (!entry) throw new Error(`Missing entry ${slug}`);
  return entry;
}
/** @param {string} slug @param {string} [variantId] */
export function reading(slug, variantId) {
  const entry = record(slug);
  return resolveReading(
    { entryId: entry.id, variantId: variantId ?? entry.defaultVariantId },
    entry,
  );
}
/** @param {string} id */
export function categoryReadings(id) {
  const category = categories.find((category) => category.id === id);
  if (!category) throw new Error(`Missing category ${id}`);
  return category.items.map((item) => {
    const record = records.find((entry) => entry.id === item.entryId);
    if (!record) throw new Error(`Missing record ${item.entryId}`);
    return resolveReading(item, record);
  });
}
