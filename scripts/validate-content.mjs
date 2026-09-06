import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';

export function validate(readings, categories) {
  const ids = new Set();
  const slugs = new Set();
  for (const entry of readings) {
    for (const field of ['id', 'slug', 'type', 'title', 'arabic', 'transliteration', 'translation'])
      assert.equal(
        typeof entry[field] === 'string' && entry[field].trim().length > 0,
        true,
        `${entry.id}: missing ${field}`,
      );
    assert(!ids.has(entry.id), `Duplicate id ${entry.id}`);
    ids.add(entry.id);
    assert(!slugs.has(entry.slug), `Duplicate slug ${entry.slug}`);
    slugs.add(entry.slug);
    assert(['dhikr', 'dua', 'prayer_recitation'].includes(entry.type));
    assert(Number.isInteger(entry.order) && entry.order > 0);
    assert(
      entry.repetitions === undefined ||
        (Number.isInteger(entry.repetitions) && entry.repetitions > 0),
    );
    assert(entry.sources.length > 0, 'Source required');
    for (const virtue of entry.virtues)
      assert(
        virtue.text &&
          virtue.sourceIds.length &&
          virtue.sourceIds.every((id) => entry.sources.some((s) => s.id === id)),
        'Virtue requires supporting sources',
      );
  }
  assert.equal(new Set(categories.map((c) => c.slug)).size, categories.length);
  for (const category of categories) {
    assert(category.itemIds.length > 0);
    assert.equal(new Set(category.itemIds).size, category.itemIds.length);
    for (const id of category.itemIds) assert(ids.has(id), `Missing reading ${id}`);
  }
}

const readings = readdirSync('src/lib/content/entries')
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(`src/lib/content/entries/${f}`, 'utf8')));
const categories = JSON.parse(readFileSync('src/lib/content/categories.json', 'utf8'));

validate(readings, categories);

console.log(
  `Content validation passed: ${readings.length} entries, ${categories.length} categories.`,
);
