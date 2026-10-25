import { resolveReading } from './resolve-reading.mjs';

/** @param {string} value */
export function normalizeSearch(value) {
  return value
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/\u0640/g, '')
    .replace(/[‘’']/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .toLocaleLowerCase('id')
    .trim();
}

/**
 * Index category selections so each result opens the correct reading context.
 * @param {import('../types/content').Category[]} categories
 * @param {import('../types/content').ReadingRecord[]} records
 */
export function createSearchIndex(categories, records) {
  const byId = new Map(records.map((record) => [record.id, record]));
  return categories.flatMap((category) =>
    category.items.map((item) => {
      const record = byId.get(item.entryId);
      if (!record) throw new Error(`Missing reading ${item.entryId}`);
      const entry = resolveReading(item, record);
      return {
        id: `${category.id}:${entry.id}`,
        title: entry.title,
        categoryTitle: category.title,
        href:
          category.readingMode === 'sequence'
            ? `/read/${category.slug}/?mode=sequence&start=${encodeURIComponent(entry.slug)}`
            : `/read/${category.slug}/${entry.slug}/`,
        titleText: normalizeSearch(entry.title),
        searchText: normalizeSearch(
          [
            category.title,
            entry.title,
            entry.arabic,
            entry.transliteration,
            entry.translation,
            ...entry.variants.flatMap((variant) => [
              variant.label,
              variant.arabic,
              variant.transliteration,
              variant.translation,
            ]),
          ].join(' '),
        ),
      };
    }),
  );
}

/** @param {ReturnType<typeof createSearchIndex>} index @param {string} query */
export function searchReadings(index, query) {
  const normalized = normalizeSearch(query);
  if (!normalized) return [];
  const words = normalized.split(/\s+/);
  return index
    .filter((entry) => words.every((word) => entry.searchText.includes(word)))
    .sort(
      (a, b) => Number(b.titleText.includes(normalized)) - Number(a.titleText.includes(normalized)),
    );
}
